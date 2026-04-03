# Guia do Desenvolvedor - SOFIA

Sistema de Orientacao Funcional e Informacao Administrativa para a ASOF.

---

## 1. Instrucoes de Configuracao

### Pre-requisitos

- Node.js 18.17 ou superior
- pnpm (gerenciador de pacotes)
- Conta no Supabase com projeto configurado
- Chave de API do OpenAI (via Vercel AI Gateway)

### Variaveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role

# Vercel AI Gateway (configurado automaticamente em producao)
# Para desenvolvimento local, configure se necessario
```

### Instalacao

```bash
# Clonar o repositorio
git clone <url-do-repositorio>
cd sofia

# Instalar dependencias
pnpm install

# Executar migracoes do banco de dados
# Execute os scripts SQL na ordem em scripts/

# Iniciar servidor de desenvolvimento
pnpm dev
```

### Configuracao do Banco de Dados

Execute os scripts SQL em ordem no Supabase SQL Editor:

1. `scripts/001_create_sofia_tables.sql` - Cria tabelas e funcoes
2. `scripts/002_seed_sample_documents.sql` - Popula dados de exemplo

---

## 2. Visao Geral da Estrutura do Projeto

```
sofia/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── chat/route.ts         # API do chat com RAG
│   │   └── feedback/route.ts     # API de feedback
│   ├── globals.css               # Estilos globais + design tokens
│   ├── layout.tsx                # Layout raiz com metadados
│   └── page.tsx                  # Pagina principal
│
├── components/
│   ├── sofia/                    # Componentes especificos do SOFIA
│   │   ├── chat-container.tsx    # Container principal do chat
│   │   ├── chat-input.tsx        # Campo de entrada de mensagens
│   │   ├── chat-message.tsx      # Renderizacao de mensagens
│   │   ├── header.tsx            # Cabecalho da aplicacao
│   │   ├── message-list.tsx      # Lista de mensagens
│   │   └── welcome-screen.tsx    # Tela inicial com sugestoes
│   └── ui/                       # Componentes shadcn/ui
│
├── lib/
│   ├── rag.ts                    # Logica de RAG e embeddings
│   ├── supabase/
│   │   ├── client.ts             # Cliente Supabase (browser)
│   │   └── server.ts             # Cliente Supabase (server)
│   └── utils.ts                  # Utilitarios gerais
│
├── scripts/                      # Scripts SQL de migracao
│   ├── 001_create_sofia_tables.sql
│   └── 002_seed_sample_documents.sql
│
└── docs/                         # Documentacao
    └── DEVELOPER_GUIDE.md
```

### Principais Tecnologias

| Tecnologia | Versao | Uso |
|------------|--------|-----|
| Next.js | 16.2.0 | Framework React com App Router |
| AI SDK | 6.0.0 | Integracao com LLMs via Vercel AI Gateway |
| Supabase | 2.49.0 | Banco de dados PostgreSQL + pgvector |
| Tailwind CSS | 4.2.0 | Estilizacao utilitaria |
| shadcn/ui | - | Componentes de interface |

### Esquema do Banco de Dados

```
documents              # Chunks de documentos normativos
├── id (uuid)
├── content (text)
├── embedding (vector 1536)
├── metadata (jsonb)
├── source_title (text)
├── source_type (enum)
└── article_number (text)

chat_sessions          # Sessoes de conversa
├── id (uuid)
├── session_id (text)
└── timestamps

chat_messages          # Mensagens do chat
├── id (uuid)
├── session_id (fk)
├── role (user/assistant)
├── content (text)
└── sources (jsonb)

feedback               # Avaliacoes das respostas
├── id (uuid)
├── message_id (fk)
├── rating (positive/negative)
└── comment (text)
```

---

## 3. Fluxo de Trabalho de Desenvolvimento

### Fluxo de uma Requisicao de Chat

```
1. Usuario envia mensagem
   └─> ChatInput.tsx (componente cliente)

2. useChat hook processa e envia para API
   └─> POST /api/chat

3. API executa RAG
   ├─> searchDocuments() busca documentos relevantes
   ├─> formatContext() prepara contexto
   └─> streamText() gera resposta com AI SDK

4. Resposta em streaming
   └─> ChatMessage.tsx renderiza progressivamente

5. Feedback opcional
   └─> POST /api/feedback
```

### Adicionando Novos Documentos

Para adicionar documentos a base de conhecimento:

```sql
-- Sem embedding (busca textual)
INSERT INTO documents (content, source_title, source_type, article_number)
VALUES (
  'Texto do documento...',
  'Lei 11.440/2006',
  'lei',
  'Art. 5'
);

-- Com embedding (busca semantica)
-- Use o script de ingestao ou a funcao generateEmbedding()
```

### Modificando o System Prompt

O prompt do sistema esta em `app/api/chat/route.ts`. Ao modificar:

1. Mantenha o tom formal e institucional
2. Preserve o placeholder `{context}` para RAG
3. Nao remova as diretrizes de limitacoes
4. Teste com diferentes tipos de perguntas

### Adicionando Novas Funcionalidades

1. **Novo endpoint de API**: Crie em `app/api/[nome]/route.ts`
2. **Novo componente**: Adicione em `components/sofia/`
3. **Nova tabela**: Crie script em `scripts/XXX_nome.sql`

---

## 4. Abordagem de Teste

### Testes Manuais Recomendados

#### Chat e RAG

```
[ ] Enviar pergunta sobre tema coberto pela base
[ ] Enviar pergunta fora do escopo (deve redirecionar)
[ ] Verificar citacoes normativas nas respostas
[ ] Testar com base vazia (fallback textual)
[ ] Testar streaming de resposta longa
```

#### Interface

```
[ ] Tela de boas-vindas com sugestoes
[ ] Botoes de sugestao funcionando
[ ] Scroll automatico para nova mensagem
[ ] Botoes de feedback funcionando
[ ] Responsividade mobile (iPhone Safari)
[ ] Touch targets >= 44px
```

#### Banco de Dados

```sql
-- Verificar documentos
SELECT COUNT(*) FROM documents;

-- Verificar sessoes ativas
SELECT * FROM chat_sessions ORDER BY created_at DESC LIMIT 10;

-- Verificar feedback
SELECT rating, COUNT(*) FROM feedback GROUP BY rating;
```

### Debugging

Use `console.log("[v0] ...")` para depuracao:

```typescript
// No servidor
console.log("[v0] Documentos encontrados:", relevantDocs.length)

// No cliente
console.log("[v0] Status do chat:", status)
```

---

## 5. Etapas Comuns de Solucao de Problemas

### Erro: "Module not found: ai"

**Causa**: Dependencias nao instaladas corretamente.

**Solucao**:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Erro: "embedding column does not exist"

**Causa**: Extensao pgvector nao habilitada ou migracao nao executada.

**Solucao**:
```sql
-- No Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
-- Depois execute scripts/001_create_sofia_tables.sql
```

### Erro: "match_documents function not found"

**Causa**: Funcao RPC nao criada no banco.

**Solucao**: Re-execute `scripts/001_create_sofia_tables.sql`

### Respostas sem citacoes normativas

**Causa**: Documentos sem embedding ou threshold muito alto.

**Solucao**:
1. Verifique se ha documentos: `SELECT COUNT(*) FROM documents WHERE embedding IS NOT NULL`
2. Reduza `SIMILARITY_THRESHOLD` em `lib/rag.ts` (padrao: 0.7)
3. Adicione mais documentos relevantes

### Chat nao salva historico

**Causa**: Sessao nao criada ou erro de foreign key.

**Solucao**:
```sql
-- Verificar se sessao existe
SELECT * FROM chat_sessions WHERE session_id = 'seu-session-id';

-- Criar manualmente se necessario
INSERT INTO chat_sessions (session_id) VALUES ('seu-session-id');
```

### Feedback nao funciona

**Causa**: message_id invalido ou constraint violada.

**Solucao**:
1. Verifique se a mensagem existe: `SELECT id FROM chat_messages WHERE id = 'uuid'`
2. Verifique os logs do endpoint `/api/feedback`

### Interface nao carrega no mobile

**Causa**: Erro de JavaScript ou CSS incompativel.

**Solucao**:
1. Teste no Safari DevTools (modo iPhone)
2. Verifique `viewport` em `layout.tsx`
3. Confirme que todas as classes Tailwind sao validas

### Timeout na geracao de embeddings

**Causa**: Muitos documentos ou API lenta.

**Solucao**:
1. Processe documentos em lotes menores
2. Use `Promise.allSettled` para resiliencia
3. Considere gerar embeddings offline

---

## Contato e Suporte

Para questoes tecnicas sobre o SOFIA, consulte:
- Documentacao do [AI SDK](https://sdk.vercel.ai)
- Documentacao do [Supabase](https://supabase.com/docs)
- Documentacao do [Next.js](https://nextjs.org/docs)

Para questoes sobre a carreira de Oficial de Chancelaria, entre em contato com a ASOF.
