import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { messageId, sessionId, rating } = await req.json()

    if (!messageId || !sessionId || !rating) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    if (rating !== 'positive' && rating !== 'negative') {
      return NextResponse.json(
        { error: 'Rating invalido' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Buscar a última mensagem do assistente na sessão
    const { data: lastMessage } = await supabase
      .from('chat_messages')
      .select('id')
      .eq('session_id', sessionId)
      .eq('role', 'assistant')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!lastMessage) {
      return NextResponse.json(
        { error: 'Mensagem nao encontrada' },
        { status: 404 }
      )
    }

    // Salvar feedback
    const { error } = await supabase.from('feedback').insert({
      message_id: lastMessage.id,
      rating,
    })

    if (error) {
      console.error('Erro ao salvar feedback:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar feedback' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro no endpoint de feedback:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
