import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'

// Mock dependencias externas
vi.mock('ai', () => ({
  streamText: vi.fn(),
  convertToModelMessages: vi.fn(() => []),
}))

vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: vi.fn(() => {
    const provider = (model: string) => ({ modelId: model })
    provider.textEmbeddingModel = (model: string) => ({ modelId: model })
    return provider
  }),
}))

vi.mock('@/lib/rag', () => ({
  searchDocuments: vi.fn(() => []),
  formatContext: vi.fn(() => ''),
  saveMessage: vi.fn(),
}))

vi.mock('@/lib/chat/constants', () => ({
  CHAT_CONFIG: {
    MODEL: 'test-model',
    EMBEDDING_MODEL: 'test-embedding',
    SIMILARITY_THRESHOLD: 0.7,
    MAX_RESULTS: 5,
  },
}))

vi.mock('@/lib/chat/system-prompt', () => ({
  formatSystemPrompt: vi.fn(() => 'system prompt'),
}))

vi.mock('@/lib/schemas', () => {
  const { z } = require('zod') as typeof import('zod')
  return {
    chatRequestSchema: z.object({
      message: z.union([
        z.object({ parts: z.array(z.any()), content: z.string().optional(), role: z.string().optional() }),
        z.object({ content: z.string(), role: z.string().optional() }),
      ]),
      sessionId: z.string().min(1),
      id: z.string().optional(),
    }),
  }
})

vi.mock('@/lib/rate-limit', () => ({
  chatLimiter: {
    check: vi.fn(() => ({ allowed: true, remaining: 19, resetAt: Date.now() + 60000 })),
  },
}))

function createRequest(body: unknown, headers?: Record<string, string>): Request {
  return new Request('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
}

describe('POST /api/chat', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env.OPENAI_API_KEY = 'test-key'
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('retorna 429 quando rate limit excedido', async () => {
    const { chatLimiter } = await import('@/lib/rate-limit')
    vi.mocked(chatLimiter.check).mockReturnValue({
      allowed: false,
      remaining: 0,
      resetAt: Date.now() + 30000,
    })

    const { POST } = await import('@/app/api/chat/route')
    const req = createRequest({
      message: { content: 'teste' },
      sessionId: 'sess-1',
    })
    const response = await POST(req)
    const body = await response.json()

    expect(response.status).toBe(429)
    expect(body.error).toContain('Limite')

    // Reset mock para outros testes
    vi.mocked(chatLimiter.check).mockReturnValue({
      allowed: true,
      remaining: 19,
      resetAt: Date.now() + 60000,
    })
  })

  it('retorna 400 para JSON invalido', async () => {
    const { POST } = await import('@/app/api/chat/route')
    const req = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    })
    const response = await POST(req)

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.details).toContain('JSON')
  })

  it('retorna 400 para payload invalido (sem message)', async () => {
    const { POST } = await import('@/app/api/chat/route')
    const req = createRequest({ sessionId: 'x' })
    const response = await POST(req)

    expect(response.status).toBe(400)
  })

  it('retorna 400 para mensagem vazia', async () => {
    const { POST } = await import('@/app/api/chat/route')
    const req = createRequest({
      message: { content: '   ' },
      sessionId: 'sess-1',
    })
    const response = await POST(req)

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error).toContain('texto')
  })

  it('extrai texto de parts corretamente', async () => {
    const { streamText } = await import('ai')
    const mockStreamText = vi.mocked(streamText)
    mockStreamText.mockReturnValue({
      toUIMessageStreamResponse: () => NextResponse.json({ ok: true }),
    } as never)

    const { searchDocuments } = await import('@/lib/rag')

    const { POST } = await import('@/app/api/chat/route')
    const req = createRequest({
      message: {
        parts: [
          { type: 'text', text: 'Primeira ' },
          { type: 'text', text: 'parte' },
          { type: 'image', url: 'img.png' },
        ],
        role: 'user',
      },
      sessionId: 'sess-parts',
    })
    const response = await POST(req)

    // Verifica que searchDocuments foi chamado com o texto concatenado
    expect(searchDocuments).toHaveBeenCalledWith('Primeira parte')
  })

  it('chama searchDocuments e streamText para request valida', async () => {
    const { streamText } = await import('ai')
    const { searchDocuments, formatContext } = await import('@/lib/rag')
    const { formatSystemPrompt } = await import('@/lib/chat/system-prompt')

    vi.mocked(searchDocuments).mockResolvedValue([
      {
        id: 'doc-1',
        content: 'conteudo',
        source_title: 'Lei',
        source_type: 'lei',
        article_number: 'Art. 1',
        similarity: 0.9,
      },
    ])
    vi.mocked(formatContext).mockReturnValue('contexto formatado')
    vi.mocked(streamText).mockReturnValue({
      toUIMessageStreamResponse: () => NextResponse.json({ ok: true }),
    } as never)

    const { POST } = await import('@/app/api/chat/route')
    const req = createRequest({
      message: { content: 'Qual o prazo?' },
      sessionId: 'sess-full',
    })
    await POST(req)

    expect(searchDocuments).toHaveBeenCalledWith('Qual o prazo?')
    expect(formatContext).toHaveBeenCalled()
    expect(formatSystemPrompt).toHaveBeenCalledWith('contexto formatado')
    expect(streamText).toHaveBeenCalled()
  })

  it('extrai IP de x-forwarded-for', async () => {
    const { chatLimiter } = await import('@/lib/rate-limit')
    const { streamText } = await import('ai')
    vi.mocked(streamText).mockReturnValue({
      toUIMessageStreamResponse: () => NextResponse.json({ ok: true }),
    } as never)

    const { POST } = await import('@/app/api/chat/route')
    const req = createRequest(
      { message: { content: 'teste' }, sessionId: 's1' },
      { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    )
    await POST(req)

    expect(chatLimiter.check).toHaveBeenCalledWith('1.2.3.4')
  })
})
