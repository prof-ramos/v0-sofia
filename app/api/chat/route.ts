import { streamText, convertToModelMessages } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { NextResponse } from 'next/server'
import { searchDocuments, formatContext, saveMessage } from '@/lib/rag'
import { CHAT_CONFIG } from '@/lib/chat/constants'
import { formatSystemPrompt } from '@/lib/chat/system-prompt'
import { chatRequestSchema } from '@/lib/schemas'

const openai = process.env.OPENAI_API_KEY
  ? createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

export async function POST(req: Request) {
  try {
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
      userText = message.parts
        .filter((p: { type?: string; text?: string }) => p.type === 'text')
        .map((p: { type?: string; text?: string }) => p.text || '')
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
    saveMessage(sessionId, 'user', trimmedText).catch((err) =>
      console.error('Erro ao salvar mensagem do usuário:', err),
    )
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
        let attempts = 0;
        const maxRetries = 2;
        while (attempts <= maxRetries) {
          try {
            await saveMessage(
              sessionId,
              'assistant',
              text,
              relevantDocs.map(d => d.id),
            )
            break;
          } catch (err) {
            attempts++;
            console.error(`[AI Stream] Erro ao salvar mensagem assistente (tentativa ${attempts}):`, err);
            if (attempts > maxRetries) {
              console.error('[AI Stream] Falha definitiva após retentativas. A mensagem não foi salva no banco.');
            } else {
              await new Promise(r => setTimeout(r, 500 * attempts));
            }
          }
        }
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
