<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-03 | Updated: 2026-04-03 -->

# lib

## Purpose

Lógica de negócio, integrações externas e utilitários. RAG, schemas de validação, clientes Supabase, prompts e tratamento de erros.

## Key Files

| File | Description |
|------|-------------|
| `utils.ts` | Utilitário `cn()` (clsx + twMerge) |
| `schemas.ts` | Schemas Zod para validação de requests |
| `rag.ts` | Busca vetorial + textual no Supabase, formatação de contexto |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `chat/` | Configurações, system prompt e dados institucionais (see `chat/AGENTS.md`) |
| `errors/` | Tratamento centralizado de erros (see `errors/AGENTS.md`) |
| `supabase/` | Clientes Supabase (browser e server) (see `supabase/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- `schemas.ts`: usar Zod para validação; tipos inferidos via `z.infer`
- `rag.ts`: cache de embeddings com `revalidate: 60`; fallback para busca textual
- `utils.ts`: `cn()` é o padrão para classNames condicionais

### Common Patterns

- Supabase RPC via `supabase.rpc('function_name', { params })`
- Embeddings via `openai.embed()` do AI SDK
- Validação com `schema.safeParse()` + retorno de erro estruturado

## Dependencies

### Internal

- `lib/chat/constants.ts` — Config do modelo e threshold de similaridade
- `lib/chat/system-prompt.ts` — Formatação do prompt com contexto RAG

### External

- `@supabase/supabase-js` — Cliente de banco
- `@ai-sdk/openai` — Provider OpenAI para embeddings
- `zod` — Validação

<!-- MANUAL: -->
