'use client'

import { useState } from 'react'
import type { UIMessage } from 'ai'
import { ThumbsUp, ThumbsDown, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
      <p key={`${index}-${pIndex}`} className="mb-3 last:mb-0 leading-relaxed">
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

export function ChatMessage({ message, onFeedback }: ChatMessageProps) {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null)
  const isUser = message.role === 'user'
  const text = getMessageText(message)

  const handleFeedback = (rating: 'positive' | 'negative') => {
    setFeedback(rating)
    onFeedback(message.id, rating)
  }

  return (
    <div className={cn('flex gap-2 message-enter md:gap-3', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'flex items-center justify-center w-8 h-8 min-w-[32px] min-h-[32px] rounded-full shrink-0 md:w-9 md:h-9',
          isUser
            ? 'bg-[var(--gray)] text-[var(--navy-dark)]'
            : 'bg-[var(--navy)] text-[var(--gold)]'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <span className="text-xs font-semibold">S</span>
        )}
      </div>

      <div
        className={cn(
          'flex-1 max-w-[calc(100%-48px)] rounded-lg p-3 md:max-w-[85%] md:p-4',
          isUser
            ? 'bg-[var(--navy)] text-white'
            : 'bg-[var(--gray-light)] text-[var(--navy-dark)]'
        )}
      >
        <div className={cn('font-serif text-sm leading-relaxed', isUser && 'font-sans')}>
          {isUser ? text : formatMessageContent(text)}
        </div>

        {!isUser && (
          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-[var(--gray)] md:gap-2 md:mt-4">
            <span className="text-[10px] text-[var(--gray-medium)] mr-1 md:text-xs md:mr-2">
              Esta resposta foi util?
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-11 w-11 min-w-[44px] min-h-[44px] p-0 touch-manipulation active:scale-95',
                feedback === 'positive' && 'bg-green-100 text-green-700'
              )}
              onClick={() => handleFeedback('positive')}
              disabled={feedback !== null}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="sr-only">Resposta util</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-11 w-11 min-w-[44px] min-h-[44px] p-0 touch-manipulation active:scale-95',
                feedback === 'negative' && 'bg-red-100 text-red-700'
              )}
              onClick={() => handleFeedback('negative')}
              disabled={feedback !== null}
            >
              <ThumbsDown className="w-4 h-4" />
              <span className="sr-only">Resposta nao util</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
