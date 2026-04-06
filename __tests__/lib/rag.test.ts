import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock das dependencias externas antes de importar o modulo
vi.mock('ai', () => ({
  embed: vi.fn(),
}))

vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: vi.fn(() => ({
    textEmbeddingModel: vi.fn((model: string) => ({ modelId: model })),
  })),
}))

vi.mock('next/cache', () => ({
  unstable_cache: vi.fn((fn) => fn),
}))

vi.mock('@/lib/supabase/server', () => ({
  createServiceClient: vi.fn(),
}))

// Importar apos os mocks
import { formatContext, type DocumentChunk } from '@/lib/rag'

describe('formatContext', () => {
  it('retorna string vazia para lista vazia', () => {
    expect(formatContext([])).toBe('')
  })

  it('formata documento unico com todos os campos', () => {
    const docs: DocumentChunk[] = [
      {
        id: '1',
        content: 'Conteudo do artigo',
        source_title: 'Lei 11.440/2006',
        source_type: 'lei',
        article_number: 'Art. 10',
        similarity: 0.85,
      },
    ]
    const result = formatContext(docs)

    expect(result).toContain('[Fonte 1]')
    expect(result).toContain('Lei 11.440/2006')
    expect(result).toContain('Art. 10')
    expect(result).toContain('(lei)')
    expect(result).toContain('Conteudo do artigo')
  })

  it('usa titulo padrao quando source_title e null', () => {
    const docs: DocumentChunk[] = [
      {
        id: '1',
        content: 'texto',
        source_title: null,
        source_type: null,
        article_number: null,
        similarity: 0.7,
      },
    ]
    const result = formatContext(docs)
    expect(result).toContain('Documento sem título')
  })

  it('omite article_number quando null', () => {
    const docs: DocumentChunk[] = [
      {
        id: '1',
        content: 'texto',
        source_title: 'Decreto',
        source_type: 'decreto',
        article_number: null,
        similarity: 0.7,
      },
    ]
    const result = formatContext(docs)
    expect(result).not.toContain(', ')
    expect(result).toContain('Decreto')
  })

  it('omite source_type quando null', () => {
    const docs: DocumentChunk[] = [
      {
        id: '1',
        content: 'texto',
        source_title: 'Titulo',
        source_type: null,
        article_number: null,
        similarity: 0.7,
      },
    ]
    const result = formatContext(docs)
    expect(result).not.toContain('(')
  })

  it('separa multiplos documentos com ---', () => {
    const docs: DocumentChunk[] = [
      {
        id: '1',
        content: 'doc1',
        source_title: 'T1',
        source_type: 'lei',
        article_number: null,
        similarity: 0.9,
      },
      {
        id: '2',
        content: 'doc2',
        source_title: 'T2',
        source_type: 'decreto',
        article_number: 'Art. 5',
        similarity: 0.8,
      },
    ]
    const result = formatContext(docs)

    expect(result).toContain('[Fonte 1]')
    expect(result).toContain('[Fonte 2]')
    expect(result).toContain('---')
    expect(result).toContain('doc1')
    expect(result).toContain('doc2')
  })

  it('numera fontes sequencialmente', () => {
    const docs: DocumentChunk[] = Array.from({ length: 5 }, (_, i) => ({
      id: String(i),
      content: `conteudo ${i}`,
      source_title: `Fonte ${i}`,
      source_type: 'lei' as const,
      article_number: null,
      similarity: 0.9 - i * 0.05,
    }))
    const result = formatContext(docs)

    for (let i = 1; i <= 5; i++) {
      expect(result).toContain(`[Fonte ${i}]`)
    }
  })
})

describe('generateEmbedding', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env.OPENAI_API_KEY = 'test-key'
  })

  it('gera embedding via provider OpenAI mockado', async () => {

    const { embed } = await import('ai')
    const mockEmbed = vi.mocked(embed)
    mockEmbed.mockResolvedValue({
      embedding: [0.1, 0.2, 0.3],
      usage: { tokens: 10 },
    } as never)

    const { generateEmbedding } = await import('@/lib/rag')
    const result = await generateEmbedding('texto de teste')

    expect(result).toEqual([0.1, 0.2, 0.3])
    expect(mockEmbed).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'texto de teste' }),
    )
  })
})
