import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { feedbackRequestSchema } from '@/lib/schemas'
import { feedbackLimiter } from '@/lib/rate-limit'

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const limit = feedbackLimiter.check(ip)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Limite de requisicoes excedido. Tente novamente em instantes.' },
        { status: 429 },
      )
    }

    let rawBody
    try {
      rawBody = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'Requisicao invalida', details: 'Corpo JSON invalido' },
        { status: 400 },
      )
    }

    const validation = feedbackRequestSchema.safeParse(rawBody)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados invalidos', details: validation.error.flatten() },
        { status: 400 },
      )
    }

    const { messageId, sessionId, rating } = validation.data

    const supabase = await createClient()

    const { error } = await supabase.from('feedback').insert({
      message_id: messageId,
      session_id: sessionId,
      rating,
    })

    if (error) {
      console.error('Erro ao salvar feedback:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar feedback' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro no endpoint de feedback:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}
