// Pequeños helpers seguros para localStorage.
// Si el storage no está disponible (SSR, modo privado), degradan silenciosamente.

const isBrowser = typeof window !== 'undefined' && !!window.localStorage

export function loadJSON(key, fallback) {
  if (!isBrowser) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveJSON(key, value) {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // quota lleno o storage bloqueado: ignorar
  }
}

export function removeKey(key) {
  if (!isBrowser) return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignore
  }
}
