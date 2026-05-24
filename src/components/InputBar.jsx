import { useEffect, useRef, useState } from 'react'
import { getMode } from '../constants/modes.js'

export default function InputBar({ onSend, onStop, isLoading, modeId }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)
  const mode = getMode(modeId)

  // Auto-resize del textarea hasta cierto máximo.
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 180) + 'px'
  }, [value])

  const submit = (e) => {
    e?.preventDefault?.()
    const text = value.trim()
    if (!text || isLoading) return
    onSend(text)
    setValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <form className="composer" onSubmit={submit} style={{ '--accent': mode.accent }}>
      <textarea
        ref={textareaRef}
        className="composer__input"
        placeholder={`Pregunta algo en modo ${mode.label.toLowerCase()}…  (Enter para enviar, Shift+Enter salto de línea)`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={isLoading}
        aria-label="Mensaje para InsightMate"
      />
      {isLoading ? (
        <button
          type="button"
          className="composer__btn composer__btn--stop"
          onClick={onStop}
          aria-label="Detener generación"
        >
          ■ Detener
        </button>
      ) : (
        <button
          type="submit"
          className="composer__btn"
          disabled={!value.trim()}
          aria-label="Enviar mensaje"
        >
          Enviar ➤
        </button>
      )}
    </form>
  )
}
