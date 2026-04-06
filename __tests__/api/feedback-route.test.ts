import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock do Supabase
const mockInsert = vi.fn()
const mockFrom = vi.fn(() => ({ insert: mockInsert }))
const mockSupabase = { from: mockFrom }

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => mockSupabase),
}))

vi.mock('@/lib/rate-limit', () => ({
  feedbackLimiter: {
    check: vi.fn(() => ({ allowed: true, remaining: 29, resetAt: Date.now() + 60000 })),
  },
}))

import { POST } from '@/app/api/feedback/route'
import { feedbackLimiter } from '@/lib/rate-limit'

function createRequest(body: unknown): Request {
  return new Request('http://localhost:3000/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/feedback', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    mockInsert.mockResolvedValue({ error: null })
    vi.mocked(feedbackLimiter.check).mockReturnValue({
      allowed: true,
      remaining: 29,
      resetAt: Date.now() + 60000,
    })
  })

  it('retorna 429 quando rate limit excedido', async () => {
    vi.mocked(feedbackLimiter.check).mockReturnValue({
      allowed: false,
      remaining: 0,
      resetAt: Date.now() + 30000,
    })

    const req = createRequest({
      messageId: 'msg-1',
      sessionId: 'sess-1',
      rating: 'positive',
    })
    const response = await POST(req)

    expect(response.status).toBe(429)
  })

  it('retorna 400 para JSON invalido', async () => {
    const req = new Request('http://localhost:3000/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid',
    })
    const response = await POST(req)

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.details).toContain('JSON')
  })

  it('retorna 400 para payload invalido', async () => {
    const req = createRequest({ sessionId: 'sess-1' })
    const response = await POST(req)

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error).toContain('invalidos')
  })

  it('retorna 400 para rating invalido', async () => {
    const req = createRequest({
      messageId: 'msg-1',
      sessionId: 'sess-1',
      rating: 'neutral',
    })
    const response = await POST(req)

    expect(response.status).toBe(400)
  })

  it('salva feedback positivo com sucesso', async () => {
    const req = createRequest({
      messageId: 'msg-1',
      sessionId: 'sess-1',
      rating: 'positive',
    })
    const response = await POST(req)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(mockFrom).toHaveBeenCalledWith('feedback')
    expect(mockInsert).toHaveBeenCalledWith({
      message_id: 'msg-1',
      session_id: 'sess-1',
      rating: 'positive',
    })
  })

  it('salva feedback negativo com sucesso', async () => {
    const req = createRequest({
      messageId: 'msg-2',
      sessionId: 'sess-2',
      rating: 'negative',
    })
    const response = await POST(req)

    expect(response.status).toBe(200)
    expect(mockInsert).toHaveBeenCalledWith({
      message_id: 'msg-2',
      session_id: 'sess-2',
      rating: 'negative',
    })
  })

  it('retorna 500 quando Supabase falha no insert', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'db error' } })

    const req = createRequest({
      messageId: 'msg-1',
      sessionId: 'sess-1',
      rating: 'positive',
    })
    const response = await POST(req)

    expect(response.status).toBe(500)
    const body = await response.json()
    expect(body.error).toContain('salvar feedback')
  })

  it('faz trim de messageId e sessionId', async () => {
    const req = createRequest({
      messageId: '  msg-trim  ',
      sessionId: '  sess-trim  ',
      rating: 'positive',
    })
    await POST(req)

    expect(mockInsert).toHaveBeenCalledWith({
      message_id: 'msg-trim',
      session_id: 'sess-trim',
      rating: 'positive',
    })
  })
})
