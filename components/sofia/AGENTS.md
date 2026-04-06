<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-05 | Updated: 2026-04-05 -->

# sofia

## Purpose

Componentes de domínio da aplicação SOFIA: chat, mensagens, input, header e welcome screen.

## Key Files

| File | Description |
|------|-------------|
| `chat-container.tsx` | Container principal: useChat, sessão (localStorage), feedback |
| `chat-message.tsx` | Renderização de mensagens (markdown via react-markdown, citações, feedback) |
| `message-list.tsx` | Lista de mensagens com auto-scroll e typing indicator |
| `chat-input.tsx` | Input de texto com envio via Enter/Send |
| `header.tsx` | Header com logo ASOF e tema dark/light |
| `welcome-screen.tsx` | Tela inicial com sugestoes de perguntas |

## For AI Agents

### Working In This Directory

- `chat-container.tsx`: orquestra useChat com DefaultChatTransport, gera sessionId via localStorage
- `chat-message.tsx`: extrai texto de `message.parts` (type: 'text'), usa react-markdown para renderização
- `chat-message.tsx`: citações no formato `[[texto]]` viram `<blockquote>` com classe `citation-block`
- `message-list.tsx`: auto-scroll via `scrollIntoView` no useEffect
- `chat-input.tsx`: textarea auto-resize, envio via Enter (Shift+Enter para nova linha)
- Todos os componentes usam `data-testid` para testes

### Common Patterns

- Props interfaces definidas acima do componente
- `memo()` para componentes que recebem props complexas (ChatMessage)
- `useCallback()` para handlers passados como props
- Estilo institucional: bubble-sofia (branco com borda gold), bubble-user (navy escuro)

## Dependencies

### Internal

- `lib/utils.ts` — `cn()` para classes Tailwind

### External

- `ai` + `@ai-sdk/react` — `useChat`, `DefaultChatTransport`, `UIMessage`
- `react-markdown` — Renderização markdown
- `next-themes` — Toggle dark/light

<!-- MANUAL: -->
