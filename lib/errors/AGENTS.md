<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-03 | Updated: 2026-04-03 -->

# errors

## Purpose

Tratamento centralizado de erros para uso nas API routes.

## Key Files

| File | Description |
|------|-------------|
| `handler.ts` | Funções utilitárias para formatação e logging de erros |

## For AI Agents

### Working In This Directory

- Em produção: log de `error.stack` para debugging
- Em desenvolvimento: log completo com detalhes
- Funções retornam objetos estruturados para respostas HTTP

### Common Patterns

- Verificar `process.env.NODE_ENV` para decidir nível de detalhe do log
- Preservar stack trace em produção para correlação

<!-- MANUAL: -->
