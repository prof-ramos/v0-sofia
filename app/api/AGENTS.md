<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-05 | Updated: 2026-04-05 -->

# api

## Purpose

API routes da aplicação: endpoint de chat (streaming com RAG) e feedback.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `chat/` | Endpoint principal de chat com RAG e streaming (see `chat/AGENTS.md`) |
| `feedback/` | Endpoint de feedback positivo/negativo (see `feedback/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- Cada subdiretório e um endpoint POST independente
- Rate limiting via `lib/rate-limit.ts` (sliding window in-memory)
- Validação de input via Zod schemas em `lib/schemas.ts`
- Erros tratados via `lib/errors/handler.ts`

### Common Patterns

- Route handlers exportam `async function POST(request: Request)`
- Response de erro padrao: `{ error: string, code?: string }`
- Streaming via `toUIMessageStreamResponse()` do AI SDK

## Dependencies

### Internal

- `lib/rag.ts` — Busca vetorial e formatação de contexto
- `lib/schemas.ts` — Validação Zod
- `lib/rate-limit.ts` — Rate limiting
- `lib/errors/handler.ts` — Tratamento de erros

<!-- MANUAL: -->
