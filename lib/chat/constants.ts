/**
 * Configurações padrão do modelo e RAG para o chatbot SofIA.
 * 
 * @property MODEL - Identificador do modelo de linguagem. Se utilizar OpenRouter ou outro provedor compativel com AI SDK, utilize o prefixo correto ex: 'openai/gpt-4o-mini'
 * @property EMBEDDING_MODEL - Identificador do modelo gerador de embeddings. Formato compativel ao MODEL.
 * @property SIMILARITY_THRESHOLD - Limiar de similaridade (0.0 - 1.0) para retorno da busca vetorial no Supabase.
 * @property MAX_RESULTS - Número máximo de trechos contextuais que serão enviados ao LLM para formatação do prompt RAG.
 */
export const CHAT_CONFIG = {
  // Modelo LLM via OpenAI (prefixo 'openai/' removido no provider direto)
  MODEL: 'gpt-4o-mini',
  // Modelo de embeddings para busca vetorial
  EMBEDDING_MODEL: 'openai/text-embedding-3-small',
  // Limiar de similaridade para busca vetorial (0.0-1.0). 0.7 equilibra precisão e recall.
  SIMILARITY_THRESHOLD: 0.7,
  // Maximo de trechos contextuais enviados ao LLM por query.
  MAX_RESULTS: 5,
} as const
