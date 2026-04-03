<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-03 | Updated: 2026-04-03 -->

# components

## Purpose

Componentes React organizados por domínio. Componentes Sofia são específicos do chatbot; ícones são SVGs inline.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `sofia/` | Componentes de domínio do chat (see `sofia/AGENTS.md`) |
| `icons/` | Ícones SVG inline (see `icons/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- Todos os componentes sofia são `'use client'`
- Estilização via Tailwind + CSS custom properties (não usa styled-components)
- `cn()` de `@/lib/utils` para classNames condicionais

### Common Patterns

- Props interfaces definidas acima do componente
- `data-testid` em elementos-chave para E2E
- `memo()` para otimizar re-renders (ex: ChatMessage)
- `useCallback` para handlers passados como props

## Dependencies

### Internal

- `lib/utils.ts` — Utilitário `cn()` (clsx + twMerge)

### External

- `ai` — Tipo `UIMessage` usado em componentes de mensagem

<!-- MANUAL: -->
