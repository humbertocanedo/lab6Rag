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

// Render mínimo de inline markdown:
//   **negrita**, *itálica* / _itálica_, `código en línea`
// Procesado por orden para evitar conflictos (negrita antes que itálica).
const INLINE_RULES = [
  { regex: /\*\*([^*]+?)\*\*/g, render: (m, key) => <strong key={key}>{m}</strong> },
  { regex: /`([^`]+?)`/g,       render: (m, key) => <code key={key} className="inline-code">{m}</code> },
  { regex: /\*([^*\n]+?)\*/g,   render: (m, key) => <em key={key}>{m}</em> },
  { regex: /_([^_\n]+?)_/g,     render: (m, key) => <em key={key}>{m}</em> },
]

function applyInline(text, baseKey) {
  let nodes = [text]
  INLINE_RULES.forEach(({ regex, render }, ruleIdx) => {
    nodes = nodes.flatMap((node, nodeIdx) => {
      if (typeof node !== 'string') return [node]
      const result = []
      let lastIndex = 0
      let match
      regex.lastIndex = 0
      while ((match = regex.exec(node)) !== null) {
        if (match.index > lastIndex) result.push(node.slice(lastIndex, match.index))
        result.push(render(match[1], `${baseKey}-${ruleIdx}-${nodeIdx}-${match.index}`))
        lastIndex = match.index + match[0].length
      }
      if (lastIndex < node.length) result.push(node.slice(lastIndex))
      return result
    })
  })
  return nodes
}

// Soporta bloques de código ``` y respeta saltos de línea.
function renderContent(content) {
  const parts = content.split(/```([\s\S]*?)```/g)
  return parts
    .map((part, idx) => {
      const isCodeBlock = idx % 2 === 1
      // Fix Copilot: si el contenido empieza/termina con ```, el split deja
      // strings vacíos que no deben renderizarse como párrafos con margen.
      if (!isCodeBlock && part === '') return null

      if (isCodeBlock) {
        const firstNewline = part.indexOf('\n')
        const code = firstNewline >= 0 ? part.slice(firstNewline + 1) : part
        return (
          <pre key={idx} className="code-block">
            <code>{code}</code>
          </pre>
        )
      }

      const lines = part.split('\n')
      return (
        <p key={idx} className="message__paragraph">
          {lines.map((line, i) => (
            <span key={i}>
              {applyInline(line, `${idx}-${i}`)}
              {i < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      )
    })
    .filter(Boolean)
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
