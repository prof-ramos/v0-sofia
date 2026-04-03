'use client'

import { useState, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { SofiaHeader } from './header'
import { WelcomeScreen } from './welcome-screen'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'

export function ChatContainer() {
  const [sessionId] = useState(() => crypto.randomUUID())
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          message: messages[messages.length - 1],
          id,
          sessionId,
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
    <div className="flex flex-col h-screen bg-white">
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
    </div>
  )
}
