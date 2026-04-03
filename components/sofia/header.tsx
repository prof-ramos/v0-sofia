'use client'

import type { ReactElement } from 'react'
import { Scale } from 'lucide-react'

export function SofiaHeader(): ReactElement {
  return (
    <header className="bg-[var(--navy)] text-white px-4 py-3 shadow-md safe-area-top">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[var(--gold)] text-[var(--navy-dark)]">
          <Scale className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-semibold tracking-tight md:text-lg">SOFIA</h1>
          <p className="text-[11px] text-white/80 truncate md:text-xs">
            Sistema de Orientacao Funcional e Informacao Administrativa
          </p>
        </div>
      </div>
    </header>
  )
}
