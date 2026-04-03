<!-- Parent: ../../AGENTS.md -->
<!-- Generated: 2026-04-03 | Updated: 2026-04-03 -->

# api

## Purpose

API routes do Next.js. Endpoints de chat (streaming com RAG) e feedback.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `chat/` | Endpoint principal de chat com RAG (see `chat/AGENTS.md`) |
| `feedback/` | Endpoint de feedback positivo/negativo (see `feedback/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- Todas as routes são `export async function POST(req: Request)`
- Validação via Zod (`lib/schemas.ts`)
- Retorno de erro: `NextResponse.json({ error: '...' }, { status: ... })`
- Mensagens de erro em pt-BR

### Common Patterns

- `try/catch` no nível da route handler
- Fire-and-forget para operações não-bloqueantes (`.catch(console.error)`)
- Resposta de chat: `result.toUIMessageStreamResponse()` (AI SDK streaming)

## Dependencies

### Internal

- `lib/rag.ts` — Busca vetorial + salvamento de mensagens
- `lib/chat/constants.ts` — Config do modelo
- `lib/chat/system-prompt.ts` — Formatação do prompt
- `lib/schemas.ts` — Validação de requests
- `lib/supabase/server.ts` — Cliente Supabase server-side

<!-- MANUAL: -->
