import { useCallback, useEffect, useRef, useState } from 'react'
import { chatCompletion, DEFAULT_MODEL, OpenRouterError } from '../services/openrouter.js'
import { DEFAULT_MODE_ID, getMode } from '../constants/modes.js'
import { loadJSON, removeKey, saveJSON } from '../utils/storage.js'

const STORAGE_KEY = 'insightmate.history.v1'
const MODE_KEY = 'insightmate.mode.v1'
const THEME_KEY = 'insightmate.theme.v1'

// `crypto.randomUUID` no existe en navegadores antiguos ni fuera de un
// secure context. Probamos los caminos en orden de preferencia y caemos a un
// generador propio basado en Math.random como último recurso.
function generateId() {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(16)
      crypto.getRandomValues(bytes)
      return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
    }
  } catch {
    // sigue al fallback
  }
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  )
}

const createMessage = (role, content, extra = {}) => ({
  id: generateId(),
  role,
  content,
  createdAt: Date.now(),
  ...extra,
})

export function useChat() {
  const [messages, setMessages] = useState(() =>
    loadJSON(STORAGE_KEY, []),
  )
  const [modeId, setModeId] = useState(() =>
    loadJSON(MODE_KEY, DEFAULT_MODE_ID),
  )
  const [theme, setTheme] = useState(() =>
    loadJSON(THEME_KEY, 'dark'),
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastModelUsed, setLastModelUsed] = useState(DEFAULT_MODEL)
  const abortRef = useRef(null)

  // Persistir cambios
  useEffect(() => {
    saveJSON(STORAGE_KEY, messages)
  }, [messages])

  useEffect(() => {
    saveJSON(MODE_KEY, modeId)
  }, [modeId])

  useEffect(() => {
    saveJSON(THEME_KEY, theme)
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme
    }
  }, [theme])

  const sendMessage = useCallback(
    async (rawText) => {
      const text = rawText?.trim()
      if (!text || isLoading) return

      const mode = getMode(modeId)
      const userMessage = createMessage('user', text, { mode: mode.id })

      // Construimos el contexto enviado al modelo: system del modo + historial.
      const conversation = [
        { role: 'system', content: mode.systemPrompt },
        ...messages.map(({ role, content }) => ({ role, content })),
        { role: 'user', content: text },
      ]

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const { content, model } = await chatCompletion({
          messages: conversation,
          signal: controller.signal,
        })
        setLastModelUsed(model)
        setMessages((prev) => [
          ...prev,
          createMessage('assistant', content, { mode: mode.id, model }),
        ])
      } catch (err) {
        if (err.name === 'AbortError') return
        const friendly =
          err instanceof OpenRouterError
            ? err.message
            : 'No pudimos contactar a OpenRouter. Revisa tu conexión y vuelve a intentar.'
        setError(friendly)
      } finally {
        setIsLoading(false)
        abortRef.current = null
      }
    },
    [isLoading, messages, modeId],
  )

  const stop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  // Reintenta el último mensaje del usuario: lo quita del historial visible
  // (para no duplicarlo) y lo vuelve a enviar.
  const retryLast = useCallback(() => {
    if (isLoading) return
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    if (!lastUser) return
    setMessages((prev) => {
      const idx = prev.map((m) => m.id).lastIndexOf(lastUser.id)
      return idx === -1 ? prev : prev.slice(0, idx)
    })
    setError(null)
    // pequeño defer para que el setMessages se aplique antes de re-enviar
    setTimeout(() => sendMessage(lastUser.content), 0)
  }, [isLoading, messages, sendMessage])

  const clearConversation = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setError(null)
    removeKey(STORAGE_KEY)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return {
    messages,
    isLoading,
    error,
    modeId,
    setModeId,
    sendMessage,
    stop,
    retryLast,
    clearConversation,
    theme,
    toggleTheme,
    lastModelUsed,
    messageCount: messages.length,
  }
}
