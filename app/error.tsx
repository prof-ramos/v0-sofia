'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[SofIA Crash Error]:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-[var(--navy,#0F2240)] text-[var(--gold,#C8A84E)] flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-[var(--navy-dark,#0C1A2E)] mb-2">
        Algo deu errado
      </h2>
      <p className="text-sm text-[var(--text-muted,#6B7280)] text-center max-w-md mb-6">
        Ocorreu um erro inesperado. Tente novamente ou entre em contato com a ASOF.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-md bg-[var(--navy,#0F2240)] text-white text-sm font-medium hover:bg-[var(--navy-dark,#0C1A2E)] transition-colors min-w-[44px] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--navy,#0F2240)]"
      >
        Tentar novamente
      </button>
    </div>
  )
}
