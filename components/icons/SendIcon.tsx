export function SendIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
      <line x1="22" y1="2" x2="11" y2="13" stroke="var(--gold-light)" strokeWidth="2" strokeLinecap="round" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="var(--gold-light)" strokeWidth="2" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
