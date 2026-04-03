/**
 * Configurações padrão do modelo e RAG para o chatbot SofIA.
 * 
 * @property MODEL - Identificador do modelo de linguagem. Se utilizar OpenRouter ou outro provedor compativel com AI SDK, utilize o prefixo correto ex: 'openai/gpt-4o-mini'
 * @property EMBEDDING_MODEL - Identificador do modelo gerador de embeddings. Formato compativel ao MODEL.
 * @property SIMILARITY_THRESHOLD - Limiar de similaridade (0.0 - 1.0) para retorno da busca vetorial no Supabase.
 * @property MAX_RESULTS - Número máximo de trechos contextuais que serão enviados ao LLM para formatação do prompt RAG.
 */
export const CHAT_CONFIG = {
  MODEL: 'openai/gpt-4o-mini',
  EMBEDDING_MODEL: 'openai/text-embedding-3-small',
  SIMILARITY_THRESHOLD: 0.7,
  MAX_RESULTS: 5,
} as const
