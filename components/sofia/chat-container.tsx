'use client'

import { useState, useCallback, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { SofiaHeader } from './header'
import { WelcomeScreen } from './welcome-screen'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'

const LOCAL_STORAGE_KEY = 'sofia-session-id'

function getOrCreateSessionId(): string | null {
  if (typeof window === 'undefined') return null

  const existing = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (existing) {
    const isValid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(existing)
    if (isValid) return existing
  }

  const newId = crypto.randomUUID()
  localStorage.setItem(LOCAL_STORAGE_KEY, newId)
  return newId
}

export function ChatContainer() {
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    setSessionId(getOrCreateSessionId())
  }, [])

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          message: messages[messages.length - 1],
          id,
          sessionId: sessionId || 'temp-id',
        },
      }),
    }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  const handleSend = useCallback((text: string) => {
    sendMessage({ text })
  }, [sendMessage])

  const handleFeedback = useCallback(async (messageId: string, rating: 'positive' | 'negative') => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          sessionId,
          rating,
        }),
      })
    } catch (error) {
      console.error('Erro ao enviar feedback:', error)
    }
  }, [sessionId])

  return (
    <div className="flex flex-col h-screen bg-[var(--cream)]">
      <SofiaHeader />

      {messages.length === 0 ? (
        <WelcomeScreen onSuggestionClick={handleSend} />
      ) : (
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onFeedback={handleFeedback}
        />
      )}

      <ChatInput onSend={handleSend} disabled={isLoading} />

      <footer data-testid="footer" className="bg-[var(--navy-dark)] px-5 py-[7px] font-sans text-xs font-bold text-[var(--gold-light)] text-center tracking-[1.5px] uppercase shrink-0">
        Respostas com base em normas e documentos oficiais · ASOF — CNPJ 26.989.392/0001-57
      </footer>
    </div>
  )
}
