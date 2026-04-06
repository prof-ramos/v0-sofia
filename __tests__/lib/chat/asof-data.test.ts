import { describe, it, expect } from 'vitest'
import { ASOF_DATA, formatAsofData, type AsofInstitutionalData } from '@/lib/chat/asof-data'

describe('ASOF_DATA', () => {
  it('contem dados institucionais com campos obrigatorios', () => {
    expect(ASOF_DATA.length).toBeGreaterThan(0)
    for (const item of ASOF_DATA) {
      expect(item.field).toBeTruthy()
      expect(item.data).toBeTruthy()
    }
  })

  it('contem email de contato', () => {
    const email = ASOF_DATA.find((d) => d.field === 'E-mail')
    expect(email).toBeDefined()
    expect(email!.data).toContain('@asof.org.br')
  })

  it('contem presidente', () => {
    const presidente = ASOF_DATA.find((d) => d.field === 'Presidente')
    expect(presidente).toBeDefined()
  })
})

describe('formatAsofData', () => {
  it('formata dados como tabela Markdown', () => {
    const data: AsofInstitutionalData[] = [
      { field: 'Nome', data: 'Valor' },
    ]
    const result = formatAsofData(data)

    expect(result).toContain('| Campo | Dado |')
    expect(result).toContain('|---|---|')
    expect(result).toContain('| Nome | Valor |')
  })

  it('escapa pipe em valores', () => {
    const data: AsofInstitutionalData[] = [
      { field: 'Campo|Especial', data: 'Valor|Teste' },
    ]
    const result = formatAsofData(data)

    expect(result).toContain('Campo\\|Especial')
    expect(result).toContain('Valor\\|Teste')
    expect(result).not.toMatch(/\| Campo\|Especial \|/)
  })

  it('substitui newlines por espacos', () => {
    const data: AsofInstitutionalData[] = [
      { field: 'Campo', data: 'Linha1\nLinha2' },
    ]
    const result = formatAsofData(data)

    expect(result).toContain('Linha1 Linha2')
    expect(result).not.toContain('Linha1\nLinha2')
  })

  it('retorna apenas header para lista vazia', () => {
    const result = formatAsofData([])
    expect(result).toContain('| Campo | Dado |')
    expect(result).toContain('|---|---|')
    // Nenhuma linha de dados
    const lines = result.trim().split('\n')
    expect(lines.length).toBe(2)
  })

  it('formata multiplas linhas corretamente', () => {
    const data: AsofInstitutionalData[] = [
      { field: 'A', data: '1' },
      { field: 'B', data: '2' },
      { field: 'C', data: '3' },
    ]
    const result = formatAsofData(data)
    const lines = result.trim().split('\n')

    // Header (2 linhas) + 3 linhas de dados
    expect(lines.length).toBe(5)
  })
})
