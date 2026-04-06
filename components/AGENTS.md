<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-05 | Updated: 2026-04-05 -->

# components

## Purpose

Componentes React organizados por domínio (sofia) e UI (shadcn/ui).

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `sofia/` | Componentes de domínio do chat SOFIA (see `sofia/AGENTS.md`) |
| `ui/` | Componentes shadcn/ui (não editar manualmente) (see `ui/AGENTS.md`) |
| `icons/` | Ícones SVG inline (see `icons/AGENTS.md`) |

## Key Files

| File | Description |
|------|-------------|
| `theme-provider.tsx` | Provider de tema (next-themes, dark/light) |

## For AI Agents

### Working In This Directory

- `ui/`: gerenciado pelo CLI `npx shadcn@latest add`, não editar manualmente
- `sofia/`: todos os componentes são `'use client'`
- `icons/`: componentes funcionais SVG com props `className` e `color`

### Common Patterns

- `cn()` de `@/lib/utils` para merge de classes Tailwind
- Path alias `@/` para imports absolutos

<!-- MANUAL: -->
