'use client'

import { useState, useRef, useEffect } from 'react'
import { SendIcon } from '@/components/icons/SendIcon'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = '44px'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
      textarea.style.overflowY = textarea.scrollHeight > 120 ? 'auto' : 'hidden'
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="bg-[var(--surface)] border-t border-[var(--border-color)] px-4 py-3 safe-area-bottom sm:px-5">
      <form onSubmit={handleSubmit} className="flex gap-2.5 items-end">
        <textarea
          data-testid="chat-input-textarea"
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Qual é a sua dúvida sobre a carreira?"
          aria-label="Campo de mensagem"
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-3xl border border-[var(--border-color)] bg-[var(--cream)] px-[18px] py-2.5 font-serif leading-6 text-[var(--ink)] placeholder:text-[var(--text-muted)] placeholder:italic focus:border-[var(--navy)] focus:bg-[var(--surface)] focus:outline-none disabled:opacity-50 transition-colors duration-200"
          style={{ height: '44px', maxHeight: '120px', fontSize: '16px' }}
        />
        <button
          data-testid="chat-send-button"
          type="submit"
          disabled={!input.trim() || disabled}
          className="send-btn w-11 h-11 shrink-0 bg-[var(--navy-dark)] rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-[var(--gold)] hover:scale-105 disabled:opacity-50 active:scale-95 touch-manipulation"
          aria-label="Enviar mensagem"
        >
          <SendIcon className="send-icon" />
        </button>
      </form>
      <p className="font-sans text-[10px] text-[var(--text-muted)] text-center mt-1.5 hidden sm:block">
        Enter para enviar · Shift+Enter para nova linha
      </p>
    </div>
  )
}
