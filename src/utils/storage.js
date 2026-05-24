// Pequeños helpers seguros para localStorage.
// Si el storage no está disponible (SSR, modo privado, políticas de privacidad),
// degradan silenciosamente. Incluso el acceso a `window.localStorage` puede
// lanzar SecurityError, por eso el chequeo va dentro de try/catch.

function getStorage() {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage ?? null
  } catch {
    return null
  }
}

export function loadJSON(key, fallback) {
  const storage = getStorage()
  if (!storage) return fallback
  try {
    const raw = storage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveJSON(key, value) {
  const storage = getStorage()
  if (!storage) return
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    // quota lleno o storage bloqueado: ignorar
  }
}

export function removeKey(key) {
  const storage = getStorage()
  if (!storage) return
  try {
    storage.removeItem(key)
  } catch {
    // ignore
  }
}
