<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-03 | Updated: 2026-04-03 -->

# feedback

## Purpose

Endpoint de feedback. Salva avaliação positiva/negativa vinculada à última mensagem do assistente na sessão.

## Key Files

| File | Description |
|------|-------------|
| `route.ts` | Handler POST: validação → busca mensagem → inserir feedback |

## For AI Agents

### Working In This Directory

- Validação via `feedbackRequestSchema` (messageId, sessionId, rating)
- Busca a última mensagem do assistente na sessão antes de inserir
- Se não encontrar mensagem, retorna 404
- Mensagens de erro em pt-BR (com acentos)

### Common Patterns

- Verificar existência de dados antes de inserir (evita inserts órfãos)
- `try/catch` no parse do body JSON

## Dependencies

### Internal

- `lib/schemas.ts` — `feedbackRequestSchema`
- `lib/supabase/server.ts` — Cliente Supabase server-side

<!-- MANUAL: -->
