<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-05 | Updated: 2026-04-05 -->

# api

## Purpose

Testes unitários das API routes: chat e feedback.

## Key Files

| File | Description |
|------|-------------|
| `chat-route.test.ts` | Testes do endpoint POST /api/chat: validação, RAG mockado, streaming (7 testes) |
| `feedback-route.test.ts` | Testes do endpoint POST /api/feedback: validação, inserção, 404 (8 testes) |

## For AI Agents

### Working In This Directory

- Mockar `@/lib/supabase/server` e `@/lib/rag` com `vi.mock()`
- Criar `Request` objects com `new Request(url, { method: 'POST', body: JSON.stringify(data) })`
- Testar respostas HTTP: status code, JSON body
- Usar `vi.clearAllMocks()` no beforeEach

### Common Patterns

- `vi.mock('@/lib/supabase/server')` para Supabase
- `vi.mock('@/lib/rag')` para funções RAG
- `vi.mock('ai')` para AI SDK
- Assertivas: `expect(response.status).toBe(200)`

## Dependencies

### Internal

- Testa: `app/api/chat/route.ts`, `app/api/feedback/route.ts`

<!-- MANUAL: -->
