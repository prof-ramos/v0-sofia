-- Migracao: corrige tabela feedback para aceitar IDs do cliente e session_id
-- Aplicar em bancos que ja possuem o schema original (001_create_sofia_tables.sql)

BEGIN;

-- Remover FK que referencia chat_messages (IDs do cliente nao sao UUIDs do banco)
ALTER TABLE public.feedback DROP CONSTRAINT IF EXISTS feedback_message_id_fkey;

-- Alterar tipo de message_id para text (aceita IDs gerados pelo useChat)
ALTER TABLE public.feedback ALTER COLUMN message_id TYPE text;

-- Adicionar coluna session_id (enviada pelo frontend mas ausente no schema original)
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS session_id text;

COMMIT;
