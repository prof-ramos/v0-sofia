# Code Review — SOFIA

**Data:** 2026-04-03
**Escopo:** Revisao completa do codebase (backend, frontend, banco de dados, configuracao)

---

## Resumo Executivo

O projeto SOFIA esta bem estruturado para uma aplicacao de chat com RAG. A arquitetura segue boas praticas do Next.js App Router com separacao clara de responsabilidades. Foram identificados **5 problemas criticos**, **8 problemas moderados** e **12 sugestoes de melhoria**.

---

## 1. Qualidade do Codigo

### 1.1 CRITICO — Variavel de fonte carregada mas nao utilizada
**Arquivo:** `app/layout.tsx:6`
```ts
const _geistMono = Geist_Mono({ subsets: ["latin"] });
```
A fonte `Geist_Mono` e importada e instanciada (gerando download de assets) mas nunca aplicada ao layout. O prefixo `_` indica que o autor sabe que nao esta em uso. Isso gera carga desnecessaria no bundle e no carregamento da pagina.

**Recomendacao:** Remover a importacao e instanciacao da fonte, ou aplica-la ao `<body>` se for intencional.

---

### 1.2 MODERADO — `eslint-disable` para `any` no endpoint de chat
**Arquivo:** `app/api/chat/route.ts:107-108`
```ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messages = await convertToModelMessages([message as any])
```
O uso de `as any` quebra a seguranca de tipos e pode ocultar erros de integracao com o AI SDK. A causa raiz e que o schema Zod do `chatRequestSchema` usa `z.array(z.any())` para `parts`.

**Recomendacao:** Tipar `parts` adequadamente no schema Zod usando os tipos exportados pelo AI SDK (`UIMessagePart` ou equivalente), eliminando a necessidade do cast.

---

### 1.3 MODERADO — Schema Zod com `z.any()` para parts
**Arquivo:** `lib/schemas.ts:9`
```ts
parts: z.array(z.any()),
```
Ao usar `z.any()`, a validacao aceita qualquer estrutura dentro de `parts`, anulando o proposito da validacao com Zod. Um payload malformado passaria pela validacao e so falharia em runtime.

**Recomendacao:** Definir um schema discriminado para os tipos de part suportados:
```ts
const messagePart = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), text: z.string() }),
  // outros tipos conforme necessario
])
parts: z.array(messagePart),
```

---

### 1.4 MENOR — Codigo morto: hierarquia de erros customizados nao utilizada
**Arquivo:** `lib/errors/handler.ts`
As classes `SofIAError`, `ValidationError`, `DatabaseError` e a funcao `handleError` sao definidas mas **nao sao usadas em nenhum endpoint**. Os endpoints (`chat/route.ts`, `feedback/route.ts`) tratam erros diretamente com `NextResponse.json()`.

**Recomendacao:** Integrar o error handler nos endpoints ou remover o codigo nao utilizado para evitar confusao.

---

### 1.5 MENOR — Interface `MessagePart` duplica tipo existente
**Arquivo:** `app/api/chat/route.ts:13-16`
```ts
interface MessagePart {
  type?: string
  text?: string
}
```
Essa interface local duplica o conceito de `UIMessagePart` do AI SDK. Alem disso, `type` e `text` sao opcionais, o que enfraquece a tipagem.

**Recomendacao:** Importar o tipo do AI SDK diretamente.

---

## 2. Deteccao de Bugs

### 2.1 CRITICO — `EMBEDDING_MODEL` definido como string, mas usado onde se espera um provider
**Arquivo:** `lib/chat/constants.ts:13`
```ts
EMBEDDING_MODEL: 'openai/text-embedding-3-small',
```
**Arquivo:** `lib/rag.ts:38-41`
```ts
const { embedding } = await embed({
  model: EMBEDDING_MODEL,
  value: text,
})
```
A funcao `embed()` do AI SDK espera um objeto de modelo (retornado por `createOpenAI()`), nao uma string. Este codigo ira falhar em runtime com erro de tipo. O `MODEL` em `constants.ts` e usado corretamente via `openai(CHAT_CONFIG.MODEL)`, mas `EMBEDDING_MODEL` nao passa pelo mesmo tratamento.

**Recomendacao:** Criar o modelo de embedding via provider:
```ts
import { createOpenAI } from '@ai-sdk/openai'
const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const embeddingModel = openai.textEmbeddingModel('text-embedding-3-small')
```

---

### 2.2 CRITICO — Modelo LLM `gpt-5.4-nano` potencialmente inexistente
**Arquivo:** `lib/chat/constants.ts:11`
```ts
MODEL: 'gpt-5.4-nano',
```
O modelo `gpt-5.4-nano` nao e um identificador padrao da OpenAI. Se o AI Gateway nao fizer roteamento para um modelo valido, todas as chamadas de chat falharao silenciosamente ou retornarao erro 404/invalid_model.

**Recomendacao:** Verificar com a equipe de infraestrutura se este modelo esta registrado no AI Gateway. Considerar adicionar validacao no startup da aplicacao.

---

### 2.3 MODERADO — `saveWithRetry` falha silenciosamente
**Arquivo:** `app/api/chat/route.ts:37-42`
```ts
if (attempt === MAX_SAVE_ATTEMPTS) {
  console.error(...)
  return  // <-- retorna sem sinalizar a falha
}
```
Apos esgotar as tentativas, a funcao retorna `undefined` sem lançar erro. O chamador em `route.ts:102` dispara `saveWithRetry` sem `await` (fire-and-forget), entao mesmo que lancasse erro, seria uma Promise rejeitada nao tratada.

**Recomendacao:** Para o fire-and-forget na linha 102, adicionar `.catch()`:
```ts
saveWithRetry(sessionId, 'user', trimmedText).catch(() => {})
```
Para o `onFinish` (linha 119), o `await` ja esta presente, mas a falha silenciosa pode ocultar problemas persistentes de banco de dados. Considerar emitir metricas ou alertas.

---

### 2.4 MODERADO — Feedback permite duplicatas
**Arquivo:** `app/api/feedback/route.ts:44-48`
O endpoint de feedback nao verifica se ja existe feedback para a mesma mensagem. O usuario pode enviar multiplos feedbacks (positivo e negativo) para a mesma mensagem, poluindo os dados.

**Recomendacao:** Adicionar constraint `UNIQUE(message_id)` na tabela `feedback` ou usar `upsert` no lugar de `insert`.

---

### 2.5 MODERADO — Busca textual com formatacao fragil
**Arquivo:** `lib/rag.ts:59`
```ts
.textSearch('content', query.split(' ').join(' | '), { type: 'websearch' })
```
O `type: 'websearch'` ja faz tokenizacao automatica da query. Fazer `split(' ').join(' | ')` manualmente pode gerar conflito com o parser `websearch` do Supabase, resultando em queries malformadas (ex: caracteres especiais nao escapados).

**Recomendacao:** Usar `{ type: 'websearch' }` sem manipulacao manual da query, passando `query` diretamente. Alternativamente, usar `{ type: 'plain' }` com a manipulacao manual.

---

### 2.6 MENOR — Feedback envia `message.id` do cliente como `messageId`
**Arquivo:** `components/sofia/chat-container.tsx:54-67`
O `message.id` usado no feedback e o ID gerado pelo `useChat` no cliente (ex: `msg-abc123`), mas o endpoint de feedback busca `chat_messages.id` que e um UUID do banco. Esses IDs **nunca serao iguais**, fazendo com que o feedback sempre retorne 404 ("Mensagem nao encontrada").

**Recomendacao:** Alinhar os IDs — ou salvar o `message.id` do cliente no banco, ou retornar o UUID do banco para o cliente apos salvar a mensagem.

---

## 3. Analise de Seguranca

### 3.1 CRITICO — Endpoint de chat sem rate limiting
**Arquivo:** `app/api/chat/route.ts`
O endpoint `POST /api/chat` nao implementa nenhuma forma de rate limiting. Como cada chamada gera:
1. Um embedding (custo $)
2. Uma busca vetorial (carga no banco)
3. Uma chamada ao LLM (custo $$)

Um atacante pode facilmente gerar custos significativos via automacao.

**Recomendacao:** Implementar rate limiting por IP ou session. Opcoes:
- Middleware com `next-rate-limit` ou `upstash/ratelimit`
- Rate limiting no nivel do Vercel (se disponivel no plano)
- Rate limiting via Supabase RLS

---

### 3.2 CRITICO — Chave `SUPABASE_ANON_KEY` usada no servidor sem RLS
**Arquivo:** `lib/supabase/server.ts:9`
```ts
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
```
O client server-side usa `NEXT_PUBLIC_SUPABASE_ANON_KEY` em vez de `SUPABASE_SERVICE_ROLE_KEY`. Isso significa que o servidor esta sujeito as mesmas restricoes RLS que o cliente. Se RLS nao esta configurado adequadamente, o servidor pode nao conseguir acessar dados necessarios. Se RLS esta desabilitado, a `ANON_KEY` exposta no frontend da acesso irrestrito ao banco.

**Recomendacao:** Usar `SUPABASE_SERVICE_ROLE_KEY` no server-side para operacoes que exigem acesso privilegiado, mantendo `ANON_KEY` apenas para o client-side com RLS habilitado.

---

### 3.3 MODERADO — Non-null assertions (`!`) em variaveis de ambiente
**Arquivos:** `lib/supabase/client.ts:5`, `lib/supabase/server.ts:8-9`, `lib/rag.ts:12-13`
```ts
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
```
Se as variaveis de ambiente nao estiverem configuradas, o app crasha com erro criptico em runtime em vez de uma mensagem clara.

**Recomendacao:** Validar variaveis de ambiente no startup com Zod:
```ts
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
})
const env = envSchema.parse(process.env)
```

---

### 3.4 MODERADO — `sessionId` sem validacao de formato
**Arquivo:** `lib/schemas.ts:17`
```ts
sessionId: z.string().trim().min(1, 'sessionId é obrigatório'),
```
O `sessionId` aceita qualquer string nao-vazia. No cliente (`chat-container.tsx:20`), e validado como UUID, mas o servidor nao faz essa validacao. Um atacante pode enviar `sessionId` arbitrarios (ex: SQL injection via `sessionId` em futuras queries).

**Recomendacao:** Validar como UUID no schema:
```ts
sessionId: z.string().uuid('sessionId deve ser UUID válido'),
```

---

### 3.5 MENOR — Tabela `feedback` sem `session_id` no schema SQL
**Arquivo:** `scripts/001_create_sofia_tables.sql:49-55`
A tabela `feedback` no SQL nao tem coluna `session_id`, mas o endpoint de feedback insere `session_id`:
```ts
await supabase.from('feedback').insert({
  message_id: messageId,
  session_id: sessionId,  // <-- coluna nao existe no schema
  rating,
})
```
Isso resultara em erro do Supabase ou a coluna sera ignorada silenciosamente.

**Recomendacao:** Adicionar `session_id text` na tabela `feedback` no SQL, ou remover do insert.

---

## 4. Performance

### 4.1 MODERADO — `checkHasEmbeddings` cria novo client Supabase a cada chamada
**Arquivo:** `lib/rag.ts:11-14`
```ts
const checkHasEmbeddings = unstable_cache(
  async () => {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
```
Embora o resultado da query seja cacheado por 60s, o client Supabase e recriado a cada invocacao do cache (quando expira). Alem disso, usa `createSupabaseClient` diretamente (sem cookies) enquanto o resto do codigo usa `createClient` do server.

**Recomendacao:** Extrair o client Supabase para variavel de modulo ou usar o `createClient` do server consistentemente.

---

### 4.2 MODERADO — Auto-scroll em `MessageList` dispara em toda mudanca de `messages`
**Arquivo:** `components/sofia/message-list.tsx:16-18`
```ts
useEffect(() => {
  endRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages])
```
O array `messages` e recriado a cada update de streaming (dezenas de vezes por segundo durante streaming). Isso causa chamadas excessivas de `scrollIntoView`.

**Recomendacao:** Usar `messages.length` como dependencia ou debounce o scroll:
```ts
useEffect(() => {
  endRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages.length])
```

---

### 4.3 MENOR — `formatMessageContent` recalcula parsing em todo render
**Arquivo:** `components/sofia/chat-message.tsx:63`
```ts
const formattedContent = useMemo(() => formatMessageContent(text), [text])
```
O `useMemo` depende de `text`, que muda a cada chunk de streaming. Durante streaming, `formatMessageContent` (que faz split por regex, cria elementos React) e recalculada para cada chunk recebido. Para mensagens longas, isso pode causar jank.

**Recomendacao:** Considerar formatar apenas o conteudo novo (delta) durante streaming, ou aplicar formatacao completa apenas apos `isLoading` ser `false`.

---

### 4.4 MENOR — Index `ivfflat` com `lists = 100` para tabela potencialmente pequena
**Arquivo:** `scripts/001_create_sofia_tables.sql:21-22`
```sql
using ivfflat (embedding vector_cosine_ops) with (lists = 100);
```
O numero de `lists` do IVFFlat deve ser proporcional ao numero de registros (regra geral: `lists = sqrt(n)`). Com 100 lists e poucos documentos, a qualidade da busca pode ser subotima. Para tabelas pequenas (<10.000 registros), considerar HNSW.

**Recomendacao:** Usar `lists = 10` para inicio e ajustar conforme o volume de dados cresce. Considerar migrar para `hnsw` que nao requer tuning manual de `lists`.

---

## 5. Boas Praticas

### 5.1 MODERADO — Ausencia de middleware de autenticacao/autorizacao
Nao existe `middleware.ts` nem nenhuma camada de autenticacao. Os endpoints de chat e feedback sao totalmente publicos. Qualquer pessoa pode:
- Enviar mensagens ilimitadas
- Submeter feedback para qualquer sessao
- Criar sessoes arbitrarias

**Recomendacao:** Se o acesso deve ser restrito, implementar autenticacao via Supabase Auth ou outro provider. Se deve ser publico, implementar pelo menos rate limiting e CAPTCHA.

---

### 5.2 MODERADO — Ausencia de testes unitarios
O projeto nao possui testes unitarios. Apenas testes E2E com Playwright foram configurados. Funcoes criticas como `searchDocuments`, `formatContext`, `saveMessage`, `formatSystemPrompt` nao tem cobertura de testes.

**Recomendacao:** Adicionar testes unitarios com Vitest para:
- `lib/rag.ts` — logica de busca e formatacao
- `lib/chat/system-prompt.ts` — formatacao do prompt
- `lib/schemas.ts` — validacao de schemas
- `app/api/chat/route.ts` — endpoint (com mocks)

---

### 5.3 MODERADO — Nome do pacote generico
**Arquivo:** `package.json:2`
```json
"name": "my-project",
```
O nome `my-project` e generico e nao reflete o projeto SOFIA.

**Recomendacao:** Renomear para `sofia` ou `@asof/sofia`.

---

### 5.4 MENOR — Falta de tratamento para `req.json()` no endpoint de feedback
**Arquivo:** `app/api/feedback/route.ts:7`
```ts
const rawBody = await req.json()
```
Diferente do endpoint de chat (que tem try/catch para JSON parsing), o endpoint de feedback nao trata erro de JSON malformado. Um body invalido causara um erro 500 generico.

**Recomendacao:** Adicionar try/catch para `req.json()` como no endpoint de chat.

---

### 5.5 MENOR — `saveMessage` faz query + insert para sessao (race condition)
**Arquivo:** `lib/rag.ts:129-136`
```ts
const { data: session } = await supabase
  .from('chat_sessions')
  .select('session_id')
  .eq('session_id', sessionId)
  .single()

if (!session) {
  await supabase.from('chat_sessions').insert({ session_id: sessionId })
}
```
Duas requests simultaneas com o mesmo `sessionId` novo podem ambas nao encontrar a sessao e tentar inserir, causando erro de constraint `UNIQUE`. Alem disso, o erro do insert nao e tratado.

**Recomendacao:** Usar `upsert` ou `INSERT ... ON CONFLICT DO NOTHING`:
```ts
await supabase.from('chat_sessions').upsert(
  { session_id: sessionId },
  { onConflict: 'session_id', ignoreDuplicates: true }
)
```

---

### 5.6 MENOR — Hardcoded `'temp-id'` como fallback de sessionId
**Arquivo:** `components/sofia/chat-container.tsx:41`
```ts
sessionId: sessionId || 'temp-id',
```
Se `sessionId` for null (ex: SSR ou localStorage indisponivel), todas as mensagens vao para a mesma sessao `temp-id`, misturando conversas de diferentes usuarios.

**Recomendacao:** Gerar UUID em memoria como fallback, sem depender de localStorage:
```ts
const [sessionId] = useState(() => getOrCreateSessionId() ?? crypto.randomUUID())
```

---

## 6. Resumo de Prioridades

| Prioridade | Item | Tipo |
|---|---|---|
| P0 — Critico | 2.1 EMBEDDING_MODEL como string em vez de provider | Bug |
| P0 — Critico | 2.6 IDs de feedback incompativeis (client vs banco) | Bug |
| P0 — Critico | 3.1 Sem rate limiting no endpoint de chat | Seguranca |
| P0 — Critico | 3.2 ANON_KEY usada no server-side | Seguranca |
| P0 — Critico | 3.5 Coluna session_id inexistente na tabela feedback | Bug |
| P1 — Moderado | 1.2 / 1.3 Schema Zod com z.any() | Qualidade |
| P1 — Moderado | 2.2 Modelo gpt-5.4-nano possivelmente inexistente | Bug |
| P1 — Moderado | 2.4 Feedback permite duplicatas | Bug |
| P1 — Moderado | 2.5 Busca textual com formatacao fragil | Bug |
| P1 — Moderado | 3.3 Non-null assertions em env vars | Seguranca |
| P1 — Moderado | 3.4 sessionId sem validacao UUID | Seguranca |
| P1 — Moderado | 4.2 Auto-scroll excessivo durante streaming | Performance |
| P1 — Moderado | 5.1 Sem autenticacao/autorizacao | Seguranca |
| P2 — Menor | 1.1 Fonte carregada mas nao utilizada | Qualidade |
| P2 — Menor | 1.4 Error handler nao utilizado | Qualidade |
| P2 — Menor | 5.5 Race condition na criacao de sessao | Bug |
| P2 — Menor | 5.6 Fallback 'temp-id' compartilhado | Bug |

---

## 7. Pontos Positivos

- **Arquitetura bem organizada**: separacao clara entre componentes de dominio (`sofia/`), UI generica (`ui/`), e logica de negocio (`lib/`)
- **Validacao de entrada com Zod**: os endpoints validam payloads antes de processar
- **Retry com backoff exponencial**: `saveWithRetry` implementa retry com jitter
- **Acessibilidade**: uso adequado de `aria-label`, `role="status"`, `aria-live`, `sr-only`
- **System prompt bem estruturado**: instrucoes claras, limites bem definidos, dados institucionais separados
- **UX de streaming**: indicador de digitacao, auto-scroll, feedback inline
- **Memoizacao de componentes**: `ChatMessage` usa `memo` para evitar re-renders desnecessarios
- **Validacao de sessionId no cliente**: regex UUID antes de usar localStorage
