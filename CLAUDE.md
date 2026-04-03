# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

SOFIA (Sistema de Orientação Funcional e Informação Administrativa) — assistente virtual da ASOF para orientação sobre a carreira de Oficial de Chancelaria do MRE. Aplicação de chat com RAG sobre documentos normativos.

## Comandos

```bash
npm run dev        # Servidor de desenvolvimento (localhost:3000)
npm run build      # Build de produção
npm run start      # Servidor de produção
npm run lint       # ESLint
```

Não há suite de testes configurada. O guia de desenvolvimento em `docs/DEVELOPER_GUIDE.md` descreve testes manuais recomendados.

## Stack

- **Next.js 16.2** (App Router, React 19)
- **AI SDK 6.0** (`ai` + `@ai-sdk/react`) — chat via `useChat` + `DefaultChatTransport`, streaming com `toUIMessageStreamResponse()`
- **Supabase** (PostgreSQL + pgvector) — banco de dados e embeddings
- **Tailwind CSS 4.2** + **shadcn/ui** (new-york style, oklch tokens, Lucide icons)
- **Vercel Analytics** habilitado

## Variáveis de ambiente

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

O modelo LLM usa `openai/gpt-4o-mini` via AI Gateway (roteamento automático em produção, sem chave de API direta).

## Arquitetura

### Fluxo de chat

```
ChatContainer (useChat) → POST /api/chat → RAG (embed + busca vetorial) → streamText → resposta em streaming
                         → POST /api/feedback (avaliação positiva/negativa)
```

- `app/api/chat/route.ts` — endpoint principal. Recebe `UIMessage`, executa RAG via `lib/rag.ts`, injeta contexto no system prompt, retorna stream com `toUIMessageStreamResponse()`
- `app/api/feedback/route.ts` — salva feedback (positive/negative) vinculado à última mensagem do assistente na sessão

### RAG (`lib/rag.ts`)

1. Gera embedding da query com `openai/text-embedding-3-small`
2. Se existem embeddings no banco → busca vetorial via `match_documents()` RPC (cosine similarity, threshold 0.7, top 5)
3. Se não há embeddings → fallback para busca textual (`textSearch`) no Supabase
4. `formatContext()` formata documentos como contexto para o LLM
5. `saveMessage()` persiste mensagens e cria sessões automaticamente

### Banco de dados (Supabase)

Tabelas: `documents` (chunks com embedding vector(1536)), `chat_sessions`, `chat_messages`, `feedback`. Schema completo em `scripts/001_create_sofia_tables.sql`. Dados de exemplo em `scripts/002_seed_sample_documents.sql`.

### Componentes

- `components/sofia/` — componentes de domínio: `ChatContainer`, `ChatInput`, `ChatMessage`, `MessageList`, `SofiaHeader`, `WelcomeScreen`
- `components/ui/` — componentes shadcn/ui (não editar manualmente, usar `npx shadcn@latest add`)
- `components/theme-provider.tsx` — provider de tema (next-themes)

### Estilização

Design tokens customizados em `styles/globals.css` (CSS variables `--navy`, `--gold`, `--gray`, etc.). Tema institucional ASOF (azul marinho + dourado). Respostas do assistente usam fonte serif, usuário usa sans-serif.

## Convenções

- Path alias: `@/*` → raiz do projeto
- Client components marcados com `'use client'` (todos os componentes sofia são client-side)
- Supabase clients separados: `lib/supabase/client.ts` (browser) e `lib/supabase/server.ts` (server, com cookies SSR)
- System prompt em `app/api/chat/route.ts` — manter tom formal/institucional e placeholder `{context}` para RAG
- Tipo de documento (`source_type`): enum `lei | decreto | portaria | instrucao_normativa | parecer | outros`
- Idioma da interface: pt-BR (sem acentos no código-fonte para evitar encoding issues)
