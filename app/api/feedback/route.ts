import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { feedbackRequestSchema } from '@/lib/schemas'

export async function POST(req: Request) {
  try {
    const rawBody = await req.json()
    const validation = feedbackRequestSchema.safeParse(rawBody)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados invalidos', details: validation.error.flatten() },
        { status: 400 },
      )
    }

    const { messageId, sessionId, rating } = validation.data

    const supabase = await createClient()

    // Salvar feedback
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
