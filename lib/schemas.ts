import { z } from 'zod'

const messageRoles = ['user', 'assistant', 'system'] as const

export const chatRequestSchema = z.object({
  message: z.union([
    z.object({
      parts: z.array(z.any()),
      content: z.string().optional(),
      role: z.enum(messageRoles).optional(),
    }),
    z.object({
      content: z.string(),
      role: z.enum(messageRoles).optional(),
    }),
  ]),
  sessionId: z.string().trim().min(1, 'sessionId é obrigatório'),
  id: z.string().optional(),
})

export const feedbackRequestSchema = z.object({
  messageId: z.string().trim().min(1, 'messageId é obrigatório'),
  sessionId: z.string().trim().min(1, 'sessionId é obrigatório'),
  rating: z.enum(['positive', 'negative'], {
    errorMap: (issue) => issue.code === 'invalid_enum_value'
      ? { message: 'rating deve ser "positive" ou "negative"' }
      : { message: issue.message || 'Valor inválido para rating' },
  }),
})
