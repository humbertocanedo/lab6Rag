import { useEffect, useState } from 'react'
import { getMode } from '../constants/modes.js'

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

// Renderizador muy ligero: soporta bloques de código ``` y respeta saltos de línea.
function renderContent(content) {
  const parts = content.split(/```([\s\S]*?)```/g)
  return parts.map((part, idx) => {
    if (idx % 2 === 1) {
      const firstNewline = part.indexOf('\n')
      const code = firstNewline >= 0 ? part.slice(firstNewline + 1) : part
      return (
        <pre key={idx} className="code-block">
          <code>{code}</code>
        </pre>
      )
    }
    return (
      <p key={idx} className="message__paragraph">
        {part.split('\n').map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))}
      </p>
    )
  })
}

export default function Message({ message }) {
  const isUser = message.role === 'user'
  const mode = message.mode ? getMode(message.mode) : null
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(t)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <article
      className={`message message--${isUser ? 'user' : 'assistant'}`}
      style={mode ? { '--accent': mode.accent } : undefined}
    >
      <div className="message__avatar" aria-hidden>
        {isUser ? '🧑' : mode?.emoji ?? '🤖'}
      </div>
      <div className="message__bubble">
        <header className="message__meta">
          <span className="message__author">
            {isUser ? 'Tú' : `InsightMate · ${mode?.label ?? 'Asistente'}`}
          </span>
          <span className="message__time">{formatTime(message.createdAt)}</span>
        </header>
        <div className="message__content">{renderContent(message.content)}</div>
        {!isUser && (
          <footer className="message__actions">
            <button
              type="button"
              className="ghost-btn ghost-btn--sm"
              onClick={handleCopy}
            >
              {copied ? '✓ Copiado' : '⧉ Copiar'}
            </button>
            {message.model && (
              <span className="message__model" title="Modelo que generó esta respuesta">
                {message.model}
              </span>
            )}
          </footer>
        )}
      </div>
    </article>
  )
}
