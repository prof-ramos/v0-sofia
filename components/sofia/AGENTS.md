<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-03 | Updated: 2026-04-03 -->

# sofia

## Purpose

Componentes de domínio do chatbot SOFIA. Orquestração do chat, mensagens, input e tela de boas-vindas.

## Key Files

| File | Description |
|------|-------------|
| `chat-container.tsx` | Orquestrador principal: useChat, estado de sessão, feedback |
| `chat-input.tsx` | Textarea + botão enviar com auto-resize |
| `chat-message.tsx` | Bubble de mensagem (user/assistant) + feedback buttons |
| `message-list.tsx` | Lista scrollável + typing indicator |
| `header.tsx` | Header com logo e branding ASOF |
| `welcome-screen.tsx` | Tela inicial com sugestões de tópicos |

## For AI Agents

### Working In This Directory

- Todos os componentes são `'use client'`
- `ChatContainer` usa `useChat` do AI SDK com `DefaultChatTransport`
- Sessão: `sessionId` persistido em `localStorage` com lazy initializer
- Feedback: POST para `/api/feedback` (fire-and-forget)
- `data-testid` em todos os elementos-chave para E2E

### Testing Requirements

- E2E via `e2e/chat.spec.ts` (11 testes cobrindo todos os componentes aqui)
- Page Object em `e2e/chat_page_object.ts`

### Common Patterns

- `memo()` para componentes que recebem props complexas (ChatMessage)
- `useCallback` para handlers passados como props
- Typing indicator: `role="status"` + `aria-live="polite"` + `sr-only`
- Feedback buttons: `type="button"` + `disabled` após clique

## Dependencies

### Internal

- `components/icons/SendIcon.tsx` — Ícone do botão enviar
- `lib/utils.ts` — `cn()` para classNames

### External

- `ai` / `@ai-sdk/react` — `useChat`, `DefaultChatTransport`, `UIMessage`

<!-- MANUAL: -->
