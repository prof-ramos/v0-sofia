<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-05 | Updated: 2026-04-05 -->

# errors

## Purpose

Testes unitários do handler de erros: classes de erro e formatação de respostas HTTP.

## Key Files

| File | Description |
|------|-------------|
| `handler.test.ts` | Testes: SofIAError, ValidationError, DatabaseError, handleError (10 testes) |

## For AI Agents

### Working In This Directory

- Testar hierarquia de erros: `ValidationError` e `DatabaseError` estendem `SofIAError`
- `handleError()`: testar resposta para erros conhecidos vs desconhecidos
- Verificar que `details` não é exposto em produção
- Mockar `process.env.NODE_ENV` para alternar dev/prod

### Common Patterns

- `expect(error).toBeInstanceOf(SofIAError)` para hierarquia
- `expect(response.status).toBe(400)` para ValidationError
- `expect(response.json())` para verificar corpo da resposta

## Dependencies

### Internal

- Testa: `lib/errors/handler.ts`

<!-- MANUAL: -->
