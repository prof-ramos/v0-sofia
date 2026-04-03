<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-03 | Updated: 2026-04-03 -->

# supabase

## Purpose

Clientes Supabase separados para browser (client-side) e server (SSR com cookies).

## Key Files

| File | Description |
|------|-------------|
| `client.ts` | Cliente browser (anon key, sem cookies) |
| `server.ts` | Cliente server-side (service role, cookies SSR) |

## For AI Agents

### Working In This Directory

- `client.ts`: usado em componentes client-side e hooks
- `server.ts`: usado em API routes e server components
- Service role key tem acesso total — nunca expor ao client
- Anon key permite RLS policies

### Common Patterns

- `createClient()` com `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Server client com cookies para autenticação SSR

### Security

- **NUNCA** usar `SUPABASE_SERVICE_ROLE_KEY` no client-side
- Server client apenas em API routes ou server components

## Dependencies

### External

- `@supabase/supabase-js` — Cliente Supabase

<!-- MANUAL: -->
