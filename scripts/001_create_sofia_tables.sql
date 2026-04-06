-- SOFIA - Sistema de Orientação e Facilitação de Informações Administrativas
-- Migração inicial: tabelas para RAG com pgvector

-- Habilitar extensão pgvector
create extension if not exists vector with schema extensions;

-- Tabela de documentos normativos (chunks)
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  embedding vector(1536),
  metadata jsonb default '{}',
  source_title text,
  source_type text check (source_type in ('lei', 'decreto', 'portaria', 'instrucao_normativa', 'parecer', 'outros')),
  article_number text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índice para busca por similaridade
create index if not exists documents_embedding_idx on public.documents 
using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Índice para busca por tipo de documento
create index if not exists documents_source_type_idx on public.documents (source_type);

-- Tabela de sessões de chat
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id text unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabela de mensagens do chat
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references public.chat_sessions(session_id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  sources jsonb default '[]',
  created_at timestamptz default now()
);

-- Índice para buscar mensagens por sessão
create index if not exists chat_messages_session_idx on public.chat_messages (session_id);

-- Tabela de feedback das respostas
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  message_id text not null,
  session_id text,
  rating text not null check (rating in ('positive', 'negative')),
  comment text,
  created_at timestamptz default now()
);

-- Função para busca por similaridade
create or replace function match_documents(
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  source_title text,
  source_type text,
  article_number text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    d.id,
    d.content,
    d.metadata,
    d.source_title,
    d.source_type,
    d.article_number,
    1 - (d.embedding <=> query_embedding) as similarity
  from public.documents d
  where 1 - (d.embedding <=> query_embedding) > match_threshold
  order by d.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Trigger para atualizar updated_at
create or replace function update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger documents_updated_at
  before update on public.documents
  for each row
  execute function update_updated_at();

create trigger chat_sessions_updated_at
  before update on public.chat_sessions
  for each row
  execute function update_updated_at();
