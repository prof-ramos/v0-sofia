<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-05 | Updated: 2026-04-05 -->

# chat

## Purpose

Testes unitários dos modulos lib/chat: dados institucionais e prompt do sistema.

## Key Files

| File | Description |
|------|-------------|
| `asof-data.test.ts` | Testes dos dados ASOF: estrutura, formatação markdown, escape (8 testes) |
| `system-prompt.test.ts` | Testes do prompt: substituicao de placeholders, restrições (10 testes) |

## For AI Agents

### Working In This Directory

- `asof-data.test.ts`: testar `ASOF_DATA` (array não vazio, campos obrigatórios) e `formatAsofData()`
- `system-prompt.test.ts`: testar `formatSystemPrompt()` com contexto vazio e preenchido
- Verificar que placeholders `{context}` e `{asofData}` são substituídos corretamente

### Common Patterns

- `expect().toContain()` para verificar substituicao de placeholders
- `expect().not.toContain()` para garantir que templates foram processados

## Dependencies

### Internal

- Testa: `lib/chat/asof-data.ts`, `lib/chat/system-prompt.ts`

<!-- MANUAL: -->
