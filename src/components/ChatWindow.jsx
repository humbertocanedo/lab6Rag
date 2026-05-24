import { useEffect, useRef } from 'react'
import Message from './Message.jsx'
import SuggestionCards from './SuggestionCards.jsx'
import { getMode } from '../constants/modes.js'

export default function ChatWindow({
  messages,
  isLoading,
  error,
  modeId,
  onPickSuggestion,
  onPickMode,
}) {
  const scrollerRef = useRef(null)
  const mode = getMode(modeId)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading, error])

  const isEmpty = messages.length === 0

  return (
    <section className="chat" ref={scrollerRef}>
      {isEmpty ? (
        <div className="chat__empty">
          <div className="empty-hero" style={{ '--accent': mode.accent }}>
            <span className="empty-hero__emoji" aria-hidden>{mode.emoji}</span>
            <h3>Hola, soy InsightMate AI</h3>
            <p>
              Estoy en modo <strong>{mode.label}</strong>. Elige una sugerencia
              o escríbeme directamente lo que tengas en mente.
            </p>
          </div>
          <SuggestionCards onPick={onPickSuggestion} onPickMode={onPickMode} />
        </div>
      ) : (
        <div className="chat__thread">
          {messages.map((m) => (
            <Message key={m.id} message={m} />
          ))}

          {isLoading && (
            <div className="message message--assistant message--thinking">
              <div className="message__avatar" aria-hidden>{mode.emoji}</div>
              <div className="message__bubble">
                <header className="message__meta">
                  <span className="message__author">
                    InsightMate · {mode.label}
                  </span>
                </header>
                <div className="thinking">
                  <span className="thinking__dot" />
                  <span className="thinking__dot" />
                  <span className="thinking__dot" />
                  <span className="thinking__label">Pensando…</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="error-banner" role="alert">
              <strong>Algo salió mal:</strong> {error}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
