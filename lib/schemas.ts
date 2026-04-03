import { z } from 'zod'

export const chatRequestSchema = z.object({
  message: z.union([
    z.object({
      parts: z.array(z.any()),
      content: z.string().optional(),
      role: z.string().optional(),
    }),
    z.object({
      content: z.string(),
      role: z.string().optional(),
    }),
  ]),
  sessionId: z.string().trim().min(1, 'sessionId e obrigatorio'),
  id: z.string().optional(),
})

export const feedbackRequestSchema = z.object({
  messageId: z.string().trim().min(1, 'messageId e obrigatorio'),
  sessionId: z.string().trim().min(1, 'sessionId e obrigatorio'),
  rating: z.enum(['positive', 'negative'], {
    errorMap: (issue) => issue.code === 'invalid_enum_value'
      ? { message: 'rating deve ser "positive" ou "negative"' }
      : { message: issue.message || 'Valor invalido para rating' },
  }),
})
