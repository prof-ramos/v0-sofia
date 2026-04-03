'use client'

import Image from 'next/image'

export function SofiaHeader() {
  return (
    <header data-testid="header" className="bg-[var(--navy-dark)] flex items-center justify-between px-4 h-[52px] shrink-0 border-b-2 border-[var(--gold)] safe-area-top sm:px-[22px] sm:h-[60px]">
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 min-w-[36px] min-h-[36px] shrink-0 sm:w-10 sm:h-10">
          <Image
            src="/logo.svg"
            alt="Logo ASOF"
            width={40}
            height={40}
            priority
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <h1 data-testid="header-title" className="font-serif text-lg font-bold text-white tracking-[6px] leading-none sm:text-xl">
            SOFIA
          </h1>
          <p className="font-sans text-[9px] text-[var(--gold-light)] tracking-[1.2px] uppercase max-sm:hidden">
            Sistema de Orientação Funcional e Informação Administrativa
          </p>
        </div>
      </div>
      <div className="font-sans text-[10px] font-bold text-[var(--gold)] border border-[var(--gold)] px-3 py-1 tracking-[2px]">
        ASOF
      </div>
    </header>
  )
}
