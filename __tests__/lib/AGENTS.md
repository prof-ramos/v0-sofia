<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-05 | Updated: 2026-04-05 -->

# lib

## Purpose

Testes unitários dos modulos lib: RAG, schemas e rate limiting.

## Key Files

| File | Description |
|------|-------------|
| `rag.test.ts` | Testes do RAG: embedding, busca vetorial, fallback textual, formatação (8 testes) |
| `schemas.test.ts` | Testes dos schemas Zod: validação, edge cases, tipos inválidos (21 testes) |
| `rate-limit.test.ts` | Testes do rate limiter: sliding window, cleanup, limites (8 testes) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `chat/` | Testes dos modulos lib/chat (see `chat/AGENTS.md`) |
| `errors/` | Testes do handler de erros (see `errors/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- Mockar Supabase e OpenAI para testes de RAG
- `rate-limit.test.ts`: testar com timestamps controlados (mockar `Date.now()`)
- `schemas.test.ts`: cobrir validação positiva e negativa para cada schema

### Common Patterns

- `vi.mock('@/lib/supabase/server')` para Supabase
- `vi.mock('ai')` e `vi.mock('@ai-sdk/openai')` para AI SDK
- Testes de edge cases: string vazia, null, tipos errados

## Dependencies

### Internal

- Testa: `lib/rag.ts`, `lib/schemas.ts`, `lib/rate-limit.ts`

<!-- MANUAL: -->
