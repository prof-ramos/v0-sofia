<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-03 | Updated: 2026-04-05 -->

# scripts

## Purpose

Scripts SQL para criação e população do banco de dados Supabase.

## Key Files

| File                            | Description                                                            |
|---------------------------------|------------------------------------------------------------------------|
| `001_create_sofia_tables.sql`   | Criação das tabelas: documents, chat_sessions, chat_messages, feedback |
| `002_seed_sample_documents.sql` | Dados de exemplo: documentos normativos com embeddings                 |
| `003_fix_feedback_table.sql`     | Correcao da tabela feedback (ajuste de colunas/constraints)             |

## For AI Agents

### Working In This Directory

- Executar no Supabase SQL Editor ou via `psql`
- Ordem importa: 001 antes de 002
- Tabela `documents` usa `vector(1536)` para embeddings (pgvector)
- `source_type` enum:
  `lei | decreto | portaria | instrucao_normativa | parecer | outros`

### Common Patterns

- UUIDs como PKs (`gen_random_uuid()`)
- `created_at` com `timezone('utc'::text, now())`
- RLS (Row Level Security) habilitado nas tabelas

<!-- MANUAL: -->
