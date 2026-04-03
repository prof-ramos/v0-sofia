import { z } from 'zod'

export const chatRequestSchema = z.object({
  message: z.unknown(),
  sessionId: z.string().trim().min(1, 'sessionId e obrigatorio'),
  id: z.string().optional(),
})

export const feedbackRequestSchema = z.object({
  messageId: z.string().trim().min(1, 'messageId e obrigatorio'),
  sessionId: z.string().trim().min(1, 'sessionId e obrigatorio'),
  rating: z.enum(['positive', 'negative'], {
    errorMap: () => ({ message: 'rating deve ser "positive" ou "negative"' }),
  }),
})
