'use client'

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void
}

const suggestions = [
  'Promoção na carreira',
  'Remoção para o exterior',
  'Direitos e benefícios',
  'Licença para capacitação',
  'Concurso OC 2023',
]

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <>
      <div data-testid="welcome-screen" className="flex-1 flex flex-col items-center justify-center px-5 py-7 fade-up">
        <div className="w-14 h-14 border-2 border-[var(--gold)] rotate-45 flex items-center justify-center mb-2 sm:w-16 sm:h-16">
          <span className="-rotate-45 font-serif text-lg font-bold text-[var(--gold)] tracking-wider sm:text-xl">
            SF
          </span>
        </div>
        <h1 data-testid="welcome-title" className="font-serif text-[26px] font-bold text-[var(--navy-dark)] tracking-[6px] sm:text-[32px] sm:tracking-[10px]">
          SOFIA
        </h1>
        <div className="w-[100px] h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent my-1" />
        <p data-testid="welcome-subtitle" className="font-sans text-[11px] text-[var(--text-secondary)] tracking-[1px] uppercase text-center leading-8 max-w-[300px]">
          Orientação sobre a carreira de Oficial de Chancelaria do Serviço Exterior Brasileiro
        </p>
      </div>
      <div className="px-4 pb-3.5 flex flex-wrap gap-2 justify-center shrink-0 sm:px-6">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            data-testid="suggestion-button"
            onClick={() => onSuggestionClick(suggestion)}
            aria-label={`Enviar sugestão: ${suggestion}`}
            className="font-sans text-[11px] font-bold text-[var(--navy)] bg-[var(--surface)] border border-[var(--navy)] px-3.5 py-[7px] rounded-3xl cursor-pointer transition-all duration-[180ms] hover:bg-[var(--navy-dark)] hover:text-[var(--gold-light)] hover:border-[var(--navy-dark)] hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(12,26,46,.18)] active:scale-[0.97] touch-manipulation"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </>
  )
}
