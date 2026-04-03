'use client'

import { Scale, FileText, Calendar, HelpCircle } from 'lucide-react'

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void
}

const suggestions = [
  {
    icon: FileText,
    text: 'Quais sao os requisitos para promocao na carreira de Oficial de Chancelaria?',
  },
  {
    icon: Calendar,
    text: 'Como funciona o processo de remocao para postos no exterior?',
  },
  {
    icon: Scale,
    text: 'Quais sao os direitos previstos no Plano de Carreira?',
  },
  {
    icon: HelpCircle,
    text: 'Como solicitar licenca para capacitacao?',
  },
]

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-start px-4 py-6 overflow-y-auto md:justify-center md:py-8">
      <div className="flex items-center justify-center w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-[var(--navy)] text-[var(--gold)] mb-4 md:w-16 md:h-16 md:mb-6">
        <Scale className="w-7 h-7 md:w-8 md:h-8" />
      </div>
      
      <h2 className="text-xl font-semibold text-[var(--navy-dark)] mb-2 text-center text-balance md:text-2xl">
        Bem-vindo à SOFIA
      </h2>
      
      <p className="text-[var(--gray-medium)] text-center max-w-md mb-6 font-serif text-sm leading-relaxed md:text-base md:mb-8">
        Sou a assistente virtual da ASOF, preparada para orientar sobre a carreira
        de Oficial de Chancelaria do Ministerio das Relacoes Exteriores.
      </p>
      
      <div className="w-full max-w-lg">
        <p className="text-xs text-[var(--gray-medium)] text-center mb-3 md:text-sm md:mb-4">
          Sugestoes de perguntas:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="group flex items-start gap-3 min-h-[88px] rounded-lg border border-[var(--gray)] bg-white p-3.5 text-left transition-all hover:border-[var(--gold)] hover:shadow-md hover:shadow-[var(--gold)]/10 active:scale-[0.98] touch-manipulation cursor-pointer"
            >
              <div className="flex items-center justify-center w-9 h-9 min-w-[36px] min-h-[36px] rounded-md bg-[var(--navy)]/5 text-[var(--gold)] transition-colors group-hover:bg-[var(--navy)] group-hover:text-white shrink-0">
                <suggestion.icon className="w-4.5 h-4.5" />
              </div>
              <span className="text-[13px] text-[var(--navy-dark)] leading-snug pt-1">
                {suggestion.text}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      <p className="text-[10px] text-[var(--gray-medium)] mt-6 text-center max-w-sm px-4 md:text-xs md:mt-8">
        As respostas sao baseadas na legislacao vigente e documentos oficiais. 
        Para questoes especificas, consulte a ASOF diretamente.
      </p>
    </div>
  )
}
