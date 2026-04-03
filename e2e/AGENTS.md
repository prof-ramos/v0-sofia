<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-03 | Updated: 2026-04-03 -->

# e2e

## Purpose

Testes E2E com Playwright cobrindo o fluxo principal de chat. Usam API real (Supabase + OpenAI), sem mocks.

## Key Files

| File | Description |
|------|-------------|
| `chat.spec.ts` | 11 testes: welcome screen, envio de mensagens, streaming, sugestões, feedback |
| `chat_page_object.ts` | Page Object com seletores e ações encapsuladas |

## For AI Agents

### Working In This Directory

- Executar: `npx playwright test` (ou `npm run test:e2e`)
- Modo UI: `npx playwright test --ui`
- Debug: `npx playwright test --debug`
- Config: `playwright.config.ts` na raiz (chromium only, serial, timeout 60s)
- `PLAYWRIGHT_BASE_URL` override: `PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test`

### Testing Requirements

- Antes de cada teste: `localStorage.clear()` + reload para estado limpo
- `waitForLoadState('load')` após navegação
- Touch targets e feedback buttons são testados
- Mensagens de assistente usam `waitForAssistantResponse()` (espera typing indicator)

### Common Patterns

- Seletores via `data-testid` (padrão: `kebab-case`)
- Page Object: `ChatPage` com métodos `sendMessage()`, `sendViaEnter()`, `waitForAssistantResponse()`, `clickSuggestion()`
- Assertions com `expect().toBeVisible()`, `toHaveText()`, `toBeDisabled()`

## Dependencies

### External

- `@playwright/test` — Framework E2E

<!-- MANUAL: -->
