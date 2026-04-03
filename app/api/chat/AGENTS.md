<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-03 | Updated: 2026-04-03 -->

# chat

## Purpose

Endpoint principal de chat. Recebe mensagem do usuário, executa RAG, envia para o LLM e retorna resposta em streaming.

## Key Files

| File       | Description                                           |
| ---------- | ----------------------------------------------------- |
| `route.ts` | Handler POST: validação → RAG → streamText → resposta |

## For AI Agents

### Working In This Directory

- Provider OpenAI direto via `createOpenAI()` (bypass AI Gateway para dev)
- Modelo: `openai/gpt-4o-mini` → `.replace('openai/', '')` para provider direto
- OPENAI_API_KEY validada no entry point
- `convertToModelMessages()` com cast `as any` (Zod union type incompatível com UIMessage)
- `saveMessage()` em background (fire-and-forget) com retry (3 tentativas)
- Texto do usuário extraído de `message.parts` (AI SDK) com type guard `'parts' in message`

### Common Patterns

- Extração de texto: verificar `'parts' in message` (Zod union) → filtrar `type === 'text'`
- Trim do texto antes de validar/enviar
- `onFinish` callback para salvar resposta do assistente após stream

## Dependencies

### Internal

- `lib/rag.ts` — `searchDocuments()`, `formatContext()`, `saveMessage()`
- `lib/chat/constants.ts` — `CHAT_CONFIG.MODEL`, `CHAT_CONFIG.EMBEDDING_MODEL`
- `lib/chat/system-prompt.ts` — `formatSystemPrompt(context)`

### External

- `ai` — `streamText`, `convertToModelMessages`, `toUIMessageStreamResponse()`
- `@ai-sdk/openai` — `createOpenAI()`

<!-- MANUAL: -->
