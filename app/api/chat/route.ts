import { streamText, convertToModelMessages } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { NextResponse } from 'next/server'
import { searchDocuments, formatContext, saveMessage } from '@/lib/rag'
import { CHAT_CONFIG } from '@/lib/chat/constants'
import { formatSystemPrompt } from '@/lib/chat/system-prompt'
import { chatRequestSchema } from '@/lib/schemas'
import { chatLimiter } from '@/lib/rate-limit'

const openai = process.env.OPENAI_API_KEY
  ? createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

interface MessagePart {
  type?: string
  text?: string
}

const MAX_SAVE_ATTEMPTS = 3
const BASE_RETRY_DELAY_MS = 500

async function saveWithRetry(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  sourceDocuments?: string[],
) {
  for (let attempt = 1; attempt <= MAX_SAVE_ATTEMPTS; attempt++) {
    try {
      await saveMessage(sessionId, role, content, sourceDocuments)
      return
    } catch (err) {
      const label = role === 'user' ? 'usuário' : 'assistente'
      console.error(
        `[Save] Erro ao salvar mensagem do ${label} (tentativa ${attempt}/${MAX_SAVE_ATTEMPTS}):`,
        err,
      )
      if (attempt === MAX_SAVE_ATTEMPTS) {
        console.error(
          `[Save] Falha definitiva ao salvar mensagem do ${label} após ${MAX_SAVE_ATTEMPTS} tentativas.`,
        )
        return
      }
      const jitter = Math.random() * 200
      const delay = BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1) + jitter
      await new Promise((r) => setTimeout(r, delay))
    }
  }
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip')?.trim() ||
      'unknown'
    const limit = chatLimiter.check(ip)
    if (!limit.allowed) {
      const retryAfter = Math.ceil((limit.resetAt - Date.now()) / 1000)
      return NextResponse.json(
        { error: 'Limite de requisicoes excedido. Tente novamente em instantes.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      )
    }

    if (!openai) {
      return NextResponse.json(
        { error: 'Chave de API da OpenAI não configurada' },
        { status: 500 },
      )
    }

    let rawBody;
    try {
      rawBody = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'Requisição inválida', details: 'Corpo JSON inválido' },
        { status: 400 },
      )
    }
    const validation = chatRequestSchema.safeParse(rawBody)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Requisição inválida', details: validation.error.flatten() },
        { status: 400 },
      )
    }

    const { message, sessionId } = validation.data
    let userText = ''

    if ('parts' in message && Array.isArray(message.parts)) {
      userText = (message.parts as MessagePart[])
        .filter((p: MessagePart) => p.type === 'text')
        .map((p: MessagePart) => p.text || '')
        .join('')
    } else if (typeof message.content === 'string') {
      userText = message.content
    }

    if (!userText.trim()) {
      return NextResponse.json(
        { error: 'Mensagem não contém texto' },
        { status: 400 },
      )
    }

    const trimmedText = userText.trim()

    // Buscar documentos relevantes via RAG
    const relevantDocs = await searchDocuments(trimmedText)

    // Salvar mensagem do usuário em background (não bloqueia a resposta)
    saveWithRetry(sessionId, 'user', trimmedText)

    const context = formatContext(relevantDocs)

    // Criar mensagens para o modelo
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages = await convertToModelMessages([message as any])

    const result = streamText({
      model: openai(CHAT_CONFIG.MODEL),
      system: formatSystemPrompt(context),
      messages,
      abortSignal: req.signal,
      onError: (error) => {
        console.error('[AI Stream] Erro durante streaming:', error)
      },
      onFinish: async ({ text }) => {
        await saveWithRetry(
          sessionId,
          'assistant',
          text,
          relevantDocs.map((d) => d.id),
        )
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Erro no endpoint de chat:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}
