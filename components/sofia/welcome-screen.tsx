'use client'

import { Scale, FileText, Calendar, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
      
      <div className="w-full max-w-lg space-y-2 md:space-y-3">
        <p className="text-xs text-[var(--gray-medium)] text-center mb-3 md:text-sm md:mb-4">
          Sugestoes de perguntas:
        </p>
        
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start gap-3 min-h-[48px] h-auto py-3 px-4 text-left hover:bg-[var(--gray-light)] hover:border-[var(--gold)] transition-colors active:scale-[0.98] touch-manipulation"
            onClick={() => onSuggestionClick(suggestion.text)}
          >
            <suggestion.icon className="w-5 h-5 text-[var(--gold)] shrink-0" />
            <span className="text-sm text-[var(--navy-dark)] leading-tight">
              {suggestion.text}
            </span>
          </Button>
        ))}
      </div>
      
      <p className="text-[10px] text-[var(--gray-medium)] mt-6 text-center max-w-sm px-4 md:text-xs md:mt-8">
        As respostas sao baseadas na legislacao vigente e documentos oficiais. 
        Para questoes especificas, consulte a ASOF diretamente.
      </p>
    </div>
  )
}
