// Cliente delgado para la API de OpenRouter.
// Usa fetch nativo, sin SDKs adicionales.
//
// Documentación: https://openrouter.ai/docs/api-reference/chat-completion

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'

// Modelo por defecto. Se puede sobreescribir desde VITE_OPENROUTER_MODEL
// para probar otros modelos sin tocar código.
export const DEFAULT_MODEL =
  import.meta.env.VITE_OPENROUTER_MODEL || 'openai/gpt-4o-mini'

export class OpenRouterError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message)
    this.name = 'OpenRouterError'
    this.status = status
    this.payload = payload
  }
}

/**
 * Envía una conversación a OpenRouter y devuelve el texto de la respuesta.
 *
 * @param {object} params
 * @param {Array<{role:'system'|'user'|'assistant', content:string}>} params.messages
 * @param {string} [params.model]
 * @param {number} [params.temperature]
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{content: string, model: string, usage?: object}>}
 */
export async function chatCompletion({
  messages,
  model = DEFAULT_MODEL,
  temperature = 0.7,
  signal,
}) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  if (!apiKey) {
    throw new OpenRouterError(
      'Falta la variable VITE_OPENROUTER_API_KEY. Copia .env.example a .env y agrega tu API key.',
      { status: 0 },
    )
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    signal,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      // Cabeceras opcionales recomendadas por OpenRouter para ranking.
      'HTTP-Referer':
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
      'X-Title': 'InsightMate AI',
    },
    body: JSON.stringify({
      model,
      temperature,
      messages,
    }),
  })

  if (!response.ok) {
    let payload = null
    try {
      payload = await response.json()
    } catch {
      // ignore JSON parse errors
    }
    const apiMessage = payload?.error?.message || payload?.error || response.statusText
    throw new OpenRouterError(
      `OpenRouter respondió ${response.status}: ${apiMessage}`,
      { status: response.status, payload },
    )
  }

  const data = await response.json()
  const choice = data?.choices?.[0]
  const content = choice?.message?.content?.trim()

  if (!content) {
    throw new OpenRouterError('Respuesta vacía del modelo.', {
      status: response.status,
      payload: data,
    })
  }

  return {
    content,
    model: data?.model || model,
    usage: data?.usage,
  }
}
