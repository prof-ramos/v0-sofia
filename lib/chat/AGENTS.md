<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-03 | Updated: 2026-04-03 -->

# chat

## Purpose

Configurações do chat: modelo, prompt do sistema e dados institucionais da ASOF.

## Key Files

| File | Description |
|------|-------------|
| `constants.ts` | Config do modelo (MODEL, EMBEDDING_MODEL, SIMILARITY_THRESHOLD, MAX_RESULTS) |
| `system-prompt.ts` | Prompt do sistema com placeholder `{context}` para RAG |
| `asof-data.ts` | Dados institucionais da ASOF (diretoria, sede, contato) |

## For AI Agents

### Working In This Directory

- `constants.ts`: `as const` para valores imutáveis; modelo usa prefixo `openai/`
- `system-prompt.ts`: `formatSystemPrompt(context)` substitui `{context}` no template
- `asof-data.ts`: `formatAsofData()` gera tabela markdown para o prompt
- `escapeMarkdown()` previne quebra de tabelas markdown nos dados

### Common Patterns

- Dados institucionais em array tipado (`AsofInstitutionalData[]`)
- Threshold de similaridade: 0.7 (equilibra precisão e recall)
- Máximo de trechos contextuais: 5

## Dependencies

### External

- Nenhuma dependência externa

<!-- MANUAL: -->
