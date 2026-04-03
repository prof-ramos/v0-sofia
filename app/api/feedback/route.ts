import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { feedbackRequestSchema } from '@/lib/schemas'

export async function POST(req: Request) {
  try {
    const rawBody = await req.json()
    const validation = feedbackRequestSchema.safeParse(rawBody)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.error.flatten() },
        { status: 400 },
      )
    }

    const { messageId, sessionId, rating } = validation.data

    const supabase = await createClient()

    // Verificar se a mensagem existe e pertence à sessão
    const { data: messageData, error: queryError } = await supabase
      .from('chat_messages')
      .select('id')
      .eq('id', messageId)
      .eq('session_id', sessionId)
      .maybeSingle()

    if (queryError) {
      console.error('Erro ao buscar mensagem:', queryError)
      return NextResponse.json(
        { error: 'Erro ao buscar mensagem' },
        { status: 500 },
      )
    }

    if (!messageData) {
      return NextResponse.json(
        { error: 'Mensagem não encontrada' },
        { status: 404 },
      )
    }

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
