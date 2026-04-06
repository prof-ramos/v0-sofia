import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Página não encontrada — SOFIA',
  description: 'A página que você procura não existe ou foi removida.',
}

export default function NotFound(): React.JSX.Element {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-[var(--navy)] text-[var(--gold)] flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h1 className="text-xl font-semibold text-[var(--navy-dark)] mb-2">
        Página não encontrada
      </h1>
      <p className="text-sm text-[var(--text-muted)] text-center max-w-md mb-6">
        A página que você procura não existe ou foi removida.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-md bg-[var(--navy)] text-white text-sm font-medium hover:bg-[var(--navy-dark)] transition-colors min-w-[44px] min-h-[44px]"
      >
        Voltar ao início
      </Link>
    </main>
  )
}
