<!-- Generated: 2026-04-05 | Updated: 2026-04-05 -->

# v0-sofia

## Purpose

SOFIA (Sistema de Orientação Funcional e Informação Administrativa) — assistente virtual da ASOF para orientação sobre a carreira de Oficial de Chancelaria do MRE. Aplicação de chat com RAG sobre documentos normativos.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | Dependências e scripts (dev, build, start, lint, test) |
| `tsconfig.json` | Configuração TypeScript (path alias @/*) |
| `vitest.config.ts` | Configuração Vitest (jsdom, alias @/) |
| `next.config.ts` | Configuração Next.js 16 |
| `CLAUDE.md` | Instruções para Claude Code |
| `tailwind.config.ts` | Configuração Tailwind CSS |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `app/` | Rotas Next.js App Router (see `app/AGENTS.md`) |
| `components/` | Componentes React (see `components/AGENTS.md`) |
| `lib/` | Lógica de negócio, RAG, schemas (see `lib/AGENTS.md`) |
| `__tests__/` | Testes unitários Vitest (80 testes) (see `__tests__/AGENTS.md`) |
| `e2e/` | Testes E2E Playwright (see `e2e/AGENTS.md`) |
| `docs/` | Documentação para desenvolvedores (see `docs/AGENTS.md`) |
| `scripts/` | Scripts SQL para Supabase (see `scripts/AGENTS.md`) |
| `public/` | Assets estáticos (favicons, logos) (see `public/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- Stack: Next.js 16.2 + AI SDK 6.0 + Supabase + Tailwind CSS 4.2 + shadcn/ui
- Modelo LLM: `openai/gpt-4o-mini` via AI Gateway (ou `gpt-5.4-nano` em dev via provider direto)
- Embedding: `text-embedding-3-small` (OpenAI)
- Path alias: `@/*` aponta para raiz do projeto
- Todos os componentes sofia são `'use client'`

### Testing Requirements

- `npm run test` — Vitest (80 testes em 8 arquivos)
- `npx playwright test` — E2E (11 testes)
- Sempre rodar `npm run test` apos alteracoes em `lib/` ou `app/api/`

### Common Patterns

- Mensagens de erro em pt-BR
- Tema institucional ASOF (navy + gold) em CSS variables
- Supabase clients separados: browser (`lib/supabase/client.ts`) e server (`lib/supabase/server.ts`)

## Dependencies

### External

- `next` 16.2 — Framework
- `ai` + `@ai-sdk/react` 6.0 — Chat SDK (useChat, streamText)
- `@ai-sdk/openai` — Provider OpenAI
- `@supabase/supabase-js` — Cliente Supabase
- `react-markdown` — Renderizacao markdown
- `tailwindcss` 4.2 — Estilizacao
- `zod` — Validação de schemas
- `@vercel/analytics` — Analytics
- `next-themes` — Tema dark/light

<!-- MANUAL: -->
