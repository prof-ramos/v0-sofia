<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-05 | Updated: 2026-04-05 -->

# __tests__

## Purpose

Testes unitários com Vitest. 80 testes em 8 arquivos cobrindo lib e API routes.

## Key Files

| File | Description |
|------|-------------|
| `lib/rag.test.ts` | Testes do RAG: embedding, busca, formatação de contexto (8 testes) |
| `lib/schemas.test.ts` | Testes dos schemas Zod (21 testes) |
| `lib/rate-limit.test.ts` | Testes do rate limiter sliding window (8 testes) |
| `api/chat-route.test.ts` | Testes do endpoint de chat (7 testes) |
| `api/feedback-route.test.ts` | Testes do endpoint de feedback (8 testes) |
| `lib/chat/asof-data.test.ts` | Testes dos dados institucionais ASOF (8 testes) |
| `lib/chat/system-prompt.test.ts` | Testes do prompt do sistema (10 testes) |
| `lib/errors/handler.test.ts` | Testes do handler de erros (10 testes) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `api/` | Testes das API routes (see `api/AGENTS.md`) |
| `lib/` | Testes dos modulos lib (see `lib/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- Executar: `npm run test` (vitest run)
- Watch mode: `npm run test:watch` (vitest)
- Config: `vitest.config.ts` na raiz (jsdom environment, alias @/)
- Mocks: Supabase clients e AI SDK mockados com `vi.mock()`

### Testing Requirements

- Testar funções puras sem dependências externas primeiro
- API routes: mockar `Request` e `lib/supabase/server`
- Sempre mockar `ai` e `@ai-sdk/openai` para evitar chamadas reais
- Usar `vi.clearAllMocks()` no beforeEach

### Common Patterns

- `describe/it` para organizacao
- `expect().toThrow()` para validação de schemas
- `vi.fn()` para funções mockadas
- Testes de edge cases: input vazio, tipos inválidos, limites

## Dependencies

### External

- `vitest` — Framework de testes
- `@ai-sdk/react` — Tipos UIMessage para testes do chat

<!-- MANUAL: -->
