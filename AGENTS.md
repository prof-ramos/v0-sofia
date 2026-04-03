<!-- Generated: 2026-04-03 | Updated: 2026-04-03 -->

# v0-sofia

## Purpose

SOFIA (Sistema de Orientação Funcional e Informação Administrativa) — assistente virtual da ASOF para orientação sobre a carreira de Oficial de Chancelaria do MRE. Aplicação de chat com RAG sobre documentos normativos.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | Dependências e scripts (dev, build, lint, test:e2e) |
| `tsconfig.json` | Configuração TypeScript (strict, path alias @/) |
| `vercel.json` | Configuração Vercel (rewrite de API routes) |
| `playwright.config.ts` | Configuração Playwright E2E (chromium, serial) |
| `.env.local` | Variáveis de ambiente (Supabase + OpenAI) |
| `CLAUDE.md` | Instruções para Claude Code |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `app/` | Rotas Next.js App Router (see `app/AGENTS.md`) |
| `components/` | Componentes React (see `components/AGENTS.md`) |
| `lib/` | Lógica de negócio, RAG, schemas (see `lib/AGENTS.md`) |
| `e2e/` | Testes E2E Playwright (see `e2e/AGENTS.md`) |
| `scripts/` | Scripts SQL de criação e seed do banco (see `scripts/AGENTS.md`) |
| `docs/` | Documentação do projeto (see `docs/AGENTS.md`) |
| `public/` | Assets estáticos (favicons, logos) (see public/AGENTS.md) |

## For AI Agents

### Working In This Directory

- Stack: Next.js 16.2 + AI SDK 6 + Supabase + Tailwind CSS 4.2
- `npm run build` para verificar TypeScript; `npm run lint` para ESLint
- `npm run test:e2e` roda 11 testes Playwright contra API real
- Idioma da interface: pt-BR; mensagens de commit em pt-BR
- Path alias: `@/*` mapeia para raiz do projeto

### Testing Requirements

- Sem suite de testes unitários configurada
- E2E via Playwright: `npx playwright test` (chromium only, serial)
- Page Object em `e2e/chat_page_object.ts`

### Common Patterns

- Client components marcados com `'use client'`
- CSS custom properties em `app/globals.css` (brandkit ASOF: navy + gold)
- Supabase clients separados: browser (`lib/supabase/client.ts`) e server (`lib/supabase/server.ts`)

## Dependencies

### External

- `next` 16.2 — Framework
- `ai` + `@ai-sdk/react` 6.x — Chat via useChat + streaming
- `@ai-sdk/openai` — Provider OpenAI direto
- `@supabase/supabase-js` — Banco de dados + pgvector
- `zod` — Validação de schemas
- `@playwright/test` — Testes E2E
- `tailwindcss` 4.2 — Estilização

<!-- MANUAL: -->
