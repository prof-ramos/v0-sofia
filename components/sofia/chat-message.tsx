'use client'

import { useState, useMemo, memo } from 'react'
import type { UIMessage } from 'ai'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: UIMessage
  onFeedback: (messageId: string, rating: 'positive' | 'negative') => void
}

function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ''
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

function formatMessageContent(text: string) {
  const parts = text.split(/(\[\[[\s\S]*?\]\])/g)

  return parts.map((part, index) => {
    if (part.startsWith('[[') && part.endsWith(']]')) {
      const citation = part.slice(2, -2).trim()
      return (
        <blockquote key={index} className="citation-block">
          {citation}
        </blockquote>
      )
    }

    return part.split('\n\n').map((paragraph, pIndex) => (
      <p key={`${index}-${pIndex}`} className="mb-3 last:mb-0">
        {paragraph.split('\n').map((line, lIndex, arr) => (
          <span key={lIndex}>
            {line}
            {lIndex < arr.length - 1 && <br />}
          </span>
        ))}
      </p>
    ))
  })
}

const ChatMessageInner = memo(function ChatMessageInner({ message, onFeedback }: ChatMessageProps) {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null)
  const isUser = message.role === 'user'
  const text = useMemo(() => getMessageText(message), [message.id, JSON.stringify(message.parts)])
  const formattedContent = useMemo(() => formatMessageContent(text), [text])

  const handleFeedback = (rating: 'positive' | 'negative') => {
    setFeedback(rating)
    onFeedback(message.id, rating)
  }

  return (
    <div data-testid={isUser ? 'message-user' : 'message-assistant'} className={cn('flex flex-col mb-4 message-enter', isUser ? 'items-end' : 'items-start')}>
      <div className={cn(
        'font-sans text-[9px] font-bold tracking-[2px] uppercase mb-1 px-0.5',
        isUser ? 'text-[var(--text-muted)]' : 'text-[var(--gold)]'
      )}>
        {isUser ? 'VOCE' : 'SOFIA — ASOF'}
      </div>

      <div className={cn(
        'max-w-[80%] p-3.5 font-serif text-[14px] leading-7 sm:text-[15px]',
        isUser ? 'bubble-user italic' : 'bubble-sofia'
      )}>
        {isUser ? text : formattedContent}
      </div>

      {!isUser && (
        <div className="flex gap-1.5 mt-2.5">
          <button
            data-testid="feedback-positive"
            type="button"
            onClick={() => handleFeedback('positive')}
            disabled={feedback !== null}
            className={cn(
              'font-sans text-[10px] px-3 py-1 rounded-full border transition-all duration-150',
              feedback === 'positive'
                ? 'bg-[var(--gold-pale)] border-[var(--gold)] text-[var(--navy-dark)]'
                : feedback !== null
                  ? 'bg-[var(--cream)] border-[var(--border-color)] text-[var(--text-muted)] opacity-70 cursor-not-allowed'
                  : 'bg-[var(--cream)] border-[var(--border-color)] text-[var(--text-muted)] cursor-pointer hover:border-[var(--gold)] hover:text-[var(--navy-dark)] hover:bg-[var(--gold-pale)]'
            )}
          >
            útil
          </button>
          <button
            data-testid="feedback-negative"
            type="button"
            onClick={() => handleFeedback('negative')}
            disabled={feedback !== null}
            className={cn(
              'font-sans text-[10px] px-3 py-1 rounded-full border transition-all duration-150',
              feedback === 'negative'
                ? 'bg-[var(--gold-pale)] border-[var(--gold)] text-[var(--navy-dark)]'
                : feedback !== null
                  ? 'bg-[var(--cream)] border-[var(--border-color)] text-[var(--text-muted)] opacity-70 cursor-not-allowed'
                  : 'bg-[var(--cream)] border-[var(--border-color)] text-[var(--text-muted)] cursor-pointer hover:border-[var(--gold)] hover:text-[var(--navy-dark)] hover:bg-[var(--gold-pale)]'
            )}
          >
            impreciso
          </button>
        </div>
      )}
    </div>
  )
})

export { ChatMessageInner as ChatMessage }
