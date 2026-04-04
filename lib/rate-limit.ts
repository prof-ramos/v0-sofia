/**
 * Rate limiter in-memory com sliding window.
 * Sem dependencias externas — adequado para deploy single-instance (Vercel serverless).
 * O estado e perdido em cold starts, o que e aceitavel para este caso.
 */

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

function createRateLimiter(config: RateLimitConfig) {
  const { maxRequests, windowMs } = config
  const requests = new Map<string, number[]>()
  let lastCleanup = Date.now()

  function cleanup() {
    const now = Date.now()
    if (now - lastCleanup < 60_000) return
    lastCleanup = now
    const cutoff = now - windowMs
    for (const [key, timestamps] of requests) {
      const valid = timestamps.filter((t) => t > cutoff)
      if (valid.length === 0) {
        requests.delete(key)
      } else {
        requests.set(key, valid)
      }
    }
  }

  function check(ip: string): RateLimitResult {
    cleanup()
    const now = Date.now()
    const cutoff = now - windowMs
    const timestamps = (requests.get(ip) || []).filter((t) => t > cutoff)
    const allowed = timestamps.length < maxRequests
    if (allowed) {
      timestamps.push(now)
      requests.set(ip, timestamps)
    }
    const oldest = timestamps[0] || now
    return {
      allowed,
      remaining: Math.max(0, maxRequests - timestamps.length),
      resetAt: oldest + windowMs,
    }
  }

  return { check }
}

// Chat: 20 requisicoes por minuto (cada uma gera custo de embedding + LLM)
export const chatLimiter = createRateLimiter({ maxRequests: 20, windowMs: 60_000 })

// Feedback: 30 requisicoes por minuto (operacao mais leve)
export const feedbackLimiter = createRateLimiter({ maxRequests: 30, windowMs: 60_000 })
