<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-03 | Updated: 2026-04-03 -->

# app

## Purpose

Rotas Next.js App Router. Contém páginas, layouts, API routes e estilos globais.

## Key Files

| File | Description |
|------|-------------|
| `layout.tsx` | Layout raiz (metadata, fontes, lang pt-BR) |
| `globals.css` | Design tokens ASOF, animações, bubble styles, scrollbar |
| `page.tsx` | Página principal (renderiza ChatContainer) |
| `error.tsx` | Error boundary com botão de retry |
| `not-found.tsx` | Página 404 com link para home |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `api/` | API routes (see `api/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- `globals.css` contém todos os design tokens (CSS custom properties em `:root`)
- Tailwind 4: tokens mapeados via `@theme inline`, não há tailwind.config
- `@media (prefers-reduced-motion: reduce)` já implementado
- Classes de bubble: `.bubble-sofia`, `.bubble-user`, `.bubble-typing`

### Common Patterns

- CSS custom properties para cores: `--navy-dark`, `--navy`, `--gold`, `--cream`, `--ink`, etc.
- Fontes: `--font-sans` (Trebuchet MS), `--font-serif` (Georgia), `--font-mono` (Geist Mono)
- Safe area iOS: `.safe-area-top`, `.safe-area-bottom`

## Dependencies

### Internal

- `components/sofia/` — Componentes renderizados nas páginas
- `lib/` — Lógica usada pelas API routes

<!-- MANUAL: -->
