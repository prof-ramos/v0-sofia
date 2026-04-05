import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  SofIAError,
  ValidationError,
  DatabaseError,
  handleError,
} from '@/lib/errors/handler'

describe('SofIAError', () => {
  it('cria erro com valores padrao', () => {
    const err = new SofIAError('algo deu errado')
    expect(err.message).toBe('algo deu errado')
    expect(err.statusCode).toBe(500)
    expect(err.isOperational).toBe(true)
    expect(err.name).toBe('SofIAError')
    expect(err instanceof Error).toBe(true)
    expect(err instanceof SofIAError).toBe(true)
  })

  it('aceita statusCode e isOperational customizados', () => {
    const err = new SofIAError('not found', 404, false)
    expect(err.statusCode).toBe(404)
    expect(err.isOperational).toBe(false)
  })
})

describe('ValidationError', () => {
  it('cria erro com statusCode 400', () => {
    const err = new ValidationError('campo invalido')
    expect(err.statusCode).toBe(400)
    expect(err.isOperational).toBe(true)
    expect(err.name).toBe('ValidationError')
    expect(err instanceof SofIAError).toBe(true)
    expect(err instanceof ValidationError).toBe(true)
  })
})

describe('DatabaseError', () => {
  it('cria erro com statusCode 500 e isOperational false', () => {
    const err = new DatabaseError('falha no banco')
    expect(err.statusCode).toBe(500)
    expect(err.isOperational).toBe(false)
    expect(err.name).toBe('DatabaseError')
    expect(err instanceof SofIAError).toBe(true)
    expect(err instanceof DatabaseError).toBe(true)
  })
})

describe('handleError', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('em desenvolvimento (NODE_ENV != production)', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development'
    })

    it('retorna mensagem do SofIAError operacional', async () => {
      const err = new SofIAError('erro de validacao', 400)
      const response = handleError(err)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toBe('erro de validacao')
      expect(body.code).toBe('SofIAError')
      expect(body.details).toBe('erro de validacao')
    })

    it('oculta mensagem de SofIAError nao-operacional', async () => {
      const err = new DatabaseError('conexao recusada')
      const response = handleError(err)
      const body = await response.json()

      expect(response.status).toBe(500)
      expect(body.error).toBe('Erro interno do servidor')
      expect(body.code).toBe('DatabaseError')
      // Em dev, details e incluso
      expect(body.details).toBe('conexao recusada')
    })

    it('retorna 500 para erros genericos', async () => {
      const err = new Error('algo inesperado')
      const response = handleError(err)
      const body = await response.json()

      expect(response.status).toBe(500)
      expect(body.error).toBe('Erro interno do servidor')
      expect(body.code).toBe('INTERNAL_ERROR')
      expect(body.details).toBe('algo inesperado')
    })

    it('converte erros nao-Error para string', async () => {
      const response = handleError('string de erro')
      const body = await response.json()

      expect(body.details).toBe('string de erro')
    })
  })

  describe('em producao (NODE_ENV = production)', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production'
    })

    it('nao inclui details em producao', async () => {
      const err = new SofIAError('algo', 400)
      const response = handleError(err)
      const body = await response.json()

      expect(body.details).toBeUndefined()
    })

    it('oculta detalhes de erros genericos em producao', async () => {
      const err = new Error('info sensivel do stack')
      const response = handleError(err)
      const body = await response.json()

      expect(body.error).toBe('Erro interno do servidor')
      expect(body.details).toBeUndefined()
    })
  })
})
