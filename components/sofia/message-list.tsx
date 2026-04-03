'use client'

import { useRef, useEffect } from 'react'
import type { UIMessage } from 'ai'
import { ChatMessage } from './chat-message'

interface MessageListProps {
  messages: UIMessage[]
  isLoading: boolean
  onFeedback: (messageId: string, rating: 'positive' | 'negative') => void
}

export function MessageList({ messages, isLoading, onFeedback }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div data-testid="message-list" className="flex-1 overflow-y-auto px-4 py-7 chat-scroll scroll-smooth sm:px-6">
      <div className="max-w-3xl mx-auto">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onFeedback={onFeedback}
          />
        ))}

        {isLoading && (
          <div data-testid="typing-indicator" className="flex flex-col items-start mb-4 message-enter" role="status" aria-live="polite" aria-busy="true">
            <span className="sr-only">Carregando resposta</span>
            <div className="font-sans text-[9px] font-bold tracking-[2px] uppercase text-[var(--gold)] mb-1 px-0.5">
              SOFIA — ASOF
            </div>
            <div className="bubble-typing">
              <div className="border-l-[3px] border-l-solid border-l-[var(--gold)] p-3.5">
                <div className="flex items-center gap-1.5 py-1.5 px-0.5">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  )
}
