import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRateLimiter } from '@/lib/rate-limit'

describe('createRateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('permite requisicoes dentro do limite', () => {
    const limiter = createRateLimiter({ maxRequests: 3, windowMs: 60_000 })

    const r1 = limiter.check('192.168.1.1')
    const r2 = limiter.check('192.168.1.1')
    const r3 = limiter.check('192.168.1.1')

    expect(r1.allowed).toBe(true)
    expect(r2.allowed).toBe(true)
    expect(r3.allowed).toBe(true)
    expect(r3.remaining).toBe(0)
  })

  it('bloqueia requisicoes acima do limite', () => {
    const limiter = createRateLimiter({ maxRequests: 2, windowMs: 60_000 })

    limiter.check('10.0.0.1')
    limiter.check('10.0.0.1')
    const r3 = limiter.check('10.0.0.1')

    expect(r3.allowed).toBe(false)
    expect(r3.remaining).toBe(0)
  })

  it('IPs diferentes tem limites independentes', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 60_000 })

    const r1 = limiter.check('ip-a')
    const r2 = limiter.check('ip-b')

    expect(r1.allowed).toBe(true)
    expect(r2.allowed).toBe(true)

    const r3 = limiter.check('ip-a')
    expect(r3.allowed).toBe(false)
  })

  it('libera requisicoes apos a janela expirar', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 10_000 })

    const r1 = limiter.check('ip-x')
    expect(r1.allowed).toBe(true)

    const r2 = limiter.check('ip-x')
    expect(r2.allowed).toBe(false)

    // Avanca 10s para expirar a janela
    vi.advanceTimersByTime(10_001)

    const r3 = limiter.check('ip-x')
    expect(r3.allowed).toBe(true)
  })

  it('retorna remaining correto durante o consumo', () => {
    const limiter = createRateLimiter({ maxRequests: 5, windowMs: 60_000 })

    expect(limiter.check('ip').remaining).toBe(4)
    expect(limiter.check('ip').remaining).toBe(3)
    expect(limiter.check('ip').remaining).toBe(2)
    expect(limiter.check('ip').remaining).toBe(1)
    expect(limiter.check('ip').remaining).toBe(0)
    // Apos o limite, remaining continua 0
    expect(limiter.check('ip').remaining).toBe(0)
  })

  it('retorna resetAt baseado no timestamp mais antigo + windowMs', () => {
    const now = Date.now()
    vi.setSystemTime(now)
    const limiter = createRateLimiter({ maxRequests: 3, windowMs: 60_000 })

    const r1 = limiter.check('ip')
    expect(r1.resetAt).toBe(now + 60_000)
  })

  it('cleanup remove IPs expirados apos 60s', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 5_000 })

    limiter.check('ip-old')

    // Avanca 61s para acionar o cleanup (intervalo de 60s) + expirar a janela (5s)
    vi.advanceTimersByTime(61_000)

    // Proximo check aciona cleanup e o IP antigo e removido
    const result = limiter.check('ip-old')
    expect(result.allowed).toBe(true)
  })

  it('nao incrementa contador quando bloqueado', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 60_000 })

    limiter.check('ip') // 1 req - allowed
    limiter.check('ip') // blocked
    limiter.check('ip') // blocked
    limiter.check('ip') // blocked

    // Apos a janela expirar, deve ter apenas 1 registro (nao 4)
    vi.advanceTimersByTime(60_001)
    const result = limiter.check('ip')
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(0) // 1 req usada de 1 permitida
  })
})
