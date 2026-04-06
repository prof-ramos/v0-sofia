<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-05 | Updated: 2026-04-05 -->

# lib

## Purpose

Lógica de negócio: RAG, schemas de validação, rate limiting, tratamento de erros e clientes Supabase.

## Key Files

| File | Description |
|------|-------------|
| `rag.ts` | RAG: embedding, busca vetorial/textual, formatação de contexto, salvamento de mensagens |
| `schemas.ts` | Schemas Zod para validação de request (chatRequestSchema, feedbackRequestSchema) |
| `rate-limit.ts` | Rate limiter in-memory com sliding window (chatLimiter, feedbackLimiter) |
| `utils.ts` | Utilitario `cn()` (clsx + tailwind-merge) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `chat/` | Config do chat: modelo, prompt do sistema, dados ASOF (see `chat/AGENTS.md`) |
| `errors/` | Tratamento centralizado de erros (see `errors/AGENTS.md`) |
| `supabase/` | Clientes Supabase browser e server (see `supabase/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- `rag.ts`: funções principais são `searchDocuments(query)`, `formatContext(docs)`, `saveMessage()`
- `rag.ts`: `checkHasEmbeddings()` usa `unstable_cache` (60s revalidate) para evitar query repetida
- `rag.ts`: fallback para busca textual quando não há embeddings no banco
- `schemas.ts`: `chatRequestSchema` aceita tanto formato `parts` quanto `content` (union Zod)
- `rate-limit.ts`: estado in-memory, perdido em cold starts (aceitavel para Vercel serverless)
- `utils.ts`: `cn()` usado em todos os componentes para merge de classes Tailwind

### Common Patterns

- `as const` para objetos de configuração imutáveis
- Zod schemas com mensagens de erro em pt-BR
- Interfaces TypeScript para tipos de retorno

## Dependencies

### External

- `ai` — `embed()` para geração de embeddings
- `@ai-sdk/openai` — `createOpenAI()` provider
- `next/cache` — `unstable_cache`
- `@supabase/supabase-js` — Cliente Supabase
- `zod` — Validacao
- `clsx` + `tailwind-merge` — Merge de classes

<!-- MANUAL: -->
