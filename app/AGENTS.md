<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-05 | Updated: 2026-04-05 -->

# app

## Purpose

Rotas da aplicação Next.js App Router. Layout raiz, página principal e API routes.

## Key Files

| File | Description |
|------|-------------|
| `layout.tsx` | Layout raiz: metadata, Geist Mono font, Analytics, lang="pt-BR" |
| `page.tsx` | Página principal: renderiza `ChatContainer` |
| `globals.css` | CSS global: tokens ASOF (navy/gold), animações, bubbles, scrollbar |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `api/` | API routes (see `api/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- `layout.tsx`: Server Component, define metadata e viewport
- `page.tsx`: Server Component que monta a UI via `ChatContainer` (client component)
- `globals.css`: Design tokens em CSS custom properties (--navy, --gold, --cream, etc.)
- Tema: Trebuchet MS (sans), Georgia (serif), Geist Mono (mono)
- Suporte a `prefers-reduced-motion` para acessibilidade

### Common Patterns

- Imports de fontes via `next/font/google`
- Analytics via `@vercel/analytics/next`

## Dependencies

### Internal

- `components/sofia/chat-container.tsx` — Componente principal renderizado na página

### External

- `@vercel/analytics/next` — Analytics
- `next/font/google` — Geist Mono

<!-- MANUAL: -->
