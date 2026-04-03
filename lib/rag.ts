import { embed } from 'ai'
import { createClient } from '@/lib/supabase/server'

const EMBEDDING_MODEL = 'openai/text-embedding-3-small'
const SIMILARITY_THRESHOLD = 0.7
const MAX_RESULTS = 5

export interface DocumentChunk {
  id: string
  content: string
  source_title: string | null
  source_type: string | null
  article_number: string | null
  similarity: number
}

/**
 * Gera embedding para uma query usando o AI Gateway
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: EMBEDDING_MODEL,
    value: text,
  })
  return embedding
}

/**
 * Busca documentos relevantes no banco de dados usando similaridade de vetores
 */
export async function searchDocuments(query: string): Promise<DocumentChunk[]> {
  const supabase = await createClient()
  
  // Verificar se existem documentos com embeddings
  const { count } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .not('embedding', 'is', null)

  // Se não houver embeddings, fazer busca textual simples
  if (!count || count === 0) {
    const { data, error } = await supabase
      .from('documents')
      .select('id, content, source_title, source_type, article_number')
      .textSearch('content', query.split(' ').join(' | '), { type: 'websearch' })
      .limit(MAX_RESULTS)

    if (error || !data) {
      // Fallback: buscar todos os documentos
      const { data: allDocs } = await supabase
        .from('documents')
        .select('id, content, source_title, source_type, article_number')
        .limit(MAX_RESULTS)
      
      return (allDocs || []).map(doc => ({
        ...doc,
        similarity: 0.5
      }))
    }

    return data.map(doc => ({
      ...doc,
      similarity: 0.8
    }))
  }

  // Busca por similaridade de vetores
  const queryEmbedding = await generateEmbedding(query)

  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: SIMILARITY_THRESHOLD,
    match_count: MAX_RESULTS,
  })

  if (error) {
    console.error('Erro ao buscar documentos:', error)
    return []
  }

  return data || []
}

/**
 * Formata os documentos encontrados como contexto para o LLM
 */
export function formatContext(documents: DocumentChunk[]): string {
  if (documents.length === 0) {
    return ''
  }

  const contextParts = documents.map((doc, index) => {
    const title = doc.source_title || 'Documento sem título'
    const article = doc.article_number ? `, ${doc.article_number}` : ''
    const type = doc.source_type ? `(${doc.source_type})` : ''
    
    return `[Fonte ${index + 1}] ${title}${article} ${type}\n\n${doc.content}`
  })

  return contextParts.join('\n\n---\n\n')
}

/**
 * Salva uma mensagem no histórico da sessão
 */
export async function saveMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  sourceDocuments?: string[]
) {
  const supabase = await createClient()

  // Verificar ou criar sessão
  const { data: session } = await supabase
    .from('chat_sessions')
    .select('session_id')
    .eq('session_id', sessionId)
    .single()

  if (!session) {
    await supabase.from('chat_sessions').insert({ session_id: sessionId })
  }

  // Salvar mensagem
  const { error } = await supabase.from('chat_messages').insert({
    session_id: sessionId,
    role,
    content,
    sources: sourceDocuments || [],
  })

  if (error) {
    console.error('Erro ao salvar mensagem:', error)
  }
}
