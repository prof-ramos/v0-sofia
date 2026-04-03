'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
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
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth >= 768) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="border-t border-[var(--gray)] bg-white px-3 py-3 safe-area-bottom md:px-4 md:py-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="flex gap-2 items-end md:gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua pergunta..."
              aria-label="Campo de mensagem"
              disabled={disabled}
              rows={1}
              className="w-full resize-none rounded-xl border border-[var(--gray)] bg-white px-4 py-3 text-base text-[var(--navy-dark)] placeholder:text-[var(--gray-medium)] focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 disabled:opacity-50 md:text-sm md:rounded-lg"
              style={{ fontSize: '16px' }}
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || disabled}
            className="h-12 w-12 min-w-[48px] min-h-[48px] shrink-0 rounded-xl bg-[var(--navy)] hover:bg-[var(--navy-dark)] text-white disabled:opacity-50 touch-manipulation active:scale-95 md:h-11 md:w-11 md:rounded-lg"
          >
            <Send className="w-5 h-5" />
            <span className="sr-only">Enviar mensagem</span>
          </Button>
        </div>
        <p className="hidden text-xs text-[var(--gray-medium)] mt-2 text-center md:block">
          Pressione Enter para enviar ou Shift+Enter para nova linha
        </p>
      </form>
    </div>
  )
}
