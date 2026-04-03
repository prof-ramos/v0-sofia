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
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            onFeedback={onFeedback}
          />
        ))}
        
        {isLoading && (
          <div className="flex gap-3 message-enter">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--navy)] text-[var(--gold)] shrink-0">
              <span className="text-xs font-semibold">S</span>
            </div>
            <div className="flex-1 bg-[var(--gray-light)] rounded-lg p-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[var(--gray-medium)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-[var(--gray-medium)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-[var(--gray-medium)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={endRef} />
      </div>
    </div>
  )
}
