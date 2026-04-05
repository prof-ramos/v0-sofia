import { describe, it, expect } from 'vitest'
import { SYSTEM_PROMPT, formatSystemPrompt } from '@/lib/chat/system-prompt'

describe('SYSTEM_PROMPT', () => {
  it('contem placeholder para dados da ASOF', () => {
    expect(SYSTEM_PROMPT).toContain('{asofData}')
  })

  it('contem placeholder para contexto', () => {
    expect(SYSTEM_PROMPT).toContain('{context}')
  })

  it('define identidade como SOFIA da ASOF', () => {
    expect(SYSTEM_PROMPT).toContain('SOFIA')
    expect(SYSTEM_PROMPT).toContain('ASOF')
  })

  it('inclui restricoes de linguagem', () => {
    expect(SYSTEM_PROMPT).toContain('Serviço Exterior Brasileiro')
    expect(SYSTEM_PROMPT).toContain('Oficial de Chancelaria')
  })

  it('inclui base de conhecimento com leis', () => {
    expect(SYSTEM_PROMPT).toContain('Lei n.º 11.440/2006')
    expect(SYSTEM_PROMPT).toContain('Lei n.º 8.112/1990')
  })
})

describe('formatSystemPrompt', () => {
  it('substitui {asofData} por tabela formatada', () => {
    const result = formatSystemPrompt('contexto de teste')
    expect(result).not.toContain('{asofData}')
    expect(result).toContain('| Campo | Dado |')
    expect(result).toContain('Presidente')
  })

  it('substitui {context} pelo contexto fornecido', () => {
    const contexto = 'Lei 11.440 - Art. 10 - Promocao por merecimento'
    const result = formatSystemPrompt(contexto)

    expect(result).not.toContain('{context}')
    expect(result).toContain(contexto)
  })

  it('usa mensagem padrao quando contexto e vazio', () => {
    const result = formatSystemPrompt('')
    expect(result).toContain('Nenhum documento relevante encontrado na base de conhecimento.')
    expect(result).not.toContain('{context}')
  })

  it('preserva estrutura do prompt original', () => {
    const result = formatSystemPrompt('ctx')
    expect(result).toContain('## Restrições absolutas de linguagem')
    expect(result).toContain('## Tom e registro')
    expect(result).toContain('## Comportamento')
    expect(result).toContain('## Limites')
    expect(result).toContain('CONTEXTO DOS DOCUMENTOS:')
  })

  it('inclui email de contato da ASOF nos dados', () => {
    const result = formatSystemPrompt('ctx')
    expect(result).toContain('contato@asof.org.br')
  })
})
