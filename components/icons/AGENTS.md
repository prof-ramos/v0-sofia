<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-03 | Updated: 2026-04-03 -->

# icons

## Purpose

Ícones SVG inline do projeto. Componentes leves sem dependências externas.

## Key Files

| File | Description |
|------|-------------|
| `SendIcon.tsx` | Ícone de envio de mensagem (usado no ChatInput) |

## For AI Agents

### Working In This Directory

- Ícones são componentes funcionais com props `className` e `color`
- Cor default: `var(--gold-light)` (institucional)
- SVGs incluem `role="img"` e `aria-label` para acessibilidade
- Dimensões fixas no viewBox (24x24 para SendIcon)

### Common Patterns

- Props interface com `className?: string` e `color?: string`
- `stroke={color}` nos elementos internos do SVG
- Sem dependência de bibliotecas de ícones (Lucide, etc.)

<!-- MANUAL: -->
