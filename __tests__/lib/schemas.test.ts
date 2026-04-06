import { describe, it, expect } from 'vitest'
import { chatRequestSchema, feedbackRequestSchema } from '@/lib/schemas'

describe('chatRequestSchema', () => {
  describe('mensagem com parts (formato UIMessage)', () => {
    it('aceita mensagem valida com parts', () => {
      const result = chatRequestSchema.safeParse({
        message: {
          parts: [{ type: 'text', text: 'Ola' }],
          role: 'user',
        },
        sessionId: 'abc-123',
      })
      expect(result.success).toBe(true)
    })

    it('aceita parts vazio', () => {
      const result = chatRequestSchema.safeParse({
        message: { parts: [] },
        sessionId: 'abc',
      })
      expect(result.success).toBe(true)
    })

    it('aceita content opcional junto com parts', () => {
      const result = chatRequestSchema.safeParse({
        message: {
          parts: [{ type: 'text', text: 'texto' }],
          content: 'fallback',
          role: 'user',
        },
        sessionId: 'x',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('mensagem com content (formato string)', () => {
    it('aceita mensagem valida com content string', () => {
      const result = chatRequestSchema.safeParse({
        message: { content: 'Qual o prazo?' },
        sessionId: 'sess-1',
      })
      expect(result.success).toBe(true)
    })

    it('aceita role opcional', () => {
      const result = chatRequestSchema.safeParse({
        message: { content: 'teste', role: 'assistant' },
        sessionId: 'sess-2',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('validacao de sessionId', () => {
    it('rejeita sessionId vazio', () => {
      const result = chatRequestSchema.safeParse({
        message: { content: 'teste' },
        sessionId: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejeita sessionId apenas com espacos', () => {
      const result = chatRequestSchema.safeParse({
        message: { content: 'teste' },
        sessionId: '   ',
      })
      expect(result.success).toBe(false)
    })

    it('rejeita sem sessionId', () => {
      const result = chatRequestSchema.safeParse({
        message: { content: 'teste' },
      })
      expect(result.success).toBe(false)
    })
  })

  describe('validacao de campos opcionais', () => {
    it('aceita id opcional', () => {
      const result = chatRequestSchema.safeParse({
        message: { content: 'teste' },
        sessionId: 's1',
        id: 'msg-1',
      })
      expect(result.success).toBe(true)
    })

    it('aceita roles validas', () => {
      for (const role of ['user', 'assistant', 'system']) {
        const result = chatRequestSchema.safeParse({
          message: { content: 'teste', role },
          sessionId: 'x',
        })
        expect(result.success).toBe(true)
      }
    })

    it('rejeita role invalida', () => {
      const result = chatRequestSchema.safeParse({
        message: { content: 'teste', role: 'admin' },
        sessionId: 'x',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('rejeita payloads invalidos', () => {
    it('rejeita mensagem sem content nem parts', () => {
      const result = chatRequestSchema.safeParse({
        message: {},
        sessionId: 'x',
      })
      expect(result.success).toBe(false)
    })

    it('rejeita body completamente vazio', () => {
      const result = chatRequestSchema.safeParse({})
      expect(result.success).toBe(false)
    })

    it('rejeita message como string', () => {
      const result = chatRequestSchema.safeParse({
        message: 'texto direto',
        sessionId: 'x',
      })
      expect(result.success).toBe(false)
    })
  })
})

describe('feedbackRequestSchema', () => {
  it('aceita feedback positivo valido', () => {
    const result = feedbackRequestSchema.safeParse({
      messageId: 'msg-1',
      sessionId: 'sess-1',
      rating: 'positive',
    })
    expect(result.success).toBe(true)
  })

  it('aceita feedback negativo valido', () => {
    const result = feedbackRequestSchema.safeParse({
      messageId: 'msg-2',
      sessionId: 'sess-2',
      rating: 'negative',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita rating invalido', () => {
    const result = feedbackRequestSchema.safeParse({
      messageId: 'msg-1',
      sessionId: 'sess-1',
      rating: 'neutral',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita messageId vazio', () => {
    const result = feedbackRequestSchema.safeParse({
      messageId: '',
      sessionId: 'sess-1',
      rating: 'positive',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita sessionId vazio', () => {
    const result = feedbackRequestSchema.safeParse({
      messageId: 'msg-1',
      sessionId: '',
      rating: 'positive',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita sem rating', () => {
    const result = feedbackRequestSchema.safeParse({
      messageId: 'msg-1',
      sessionId: 'sess-1',
    })
    expect(result.success).toBe(false)
  })

  it('faz trim de messageId e sessionId', () => {
    const result = feedbackRequestSchema.safeParse({
      messageId: '  msg-1  ',
      sessionId: '  sess-1  ',
      rating: 'positive',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.messageId).toBe('msg-1')
      expect(result.data.sessionId).toBe('sess-1')
    }
  })
})
