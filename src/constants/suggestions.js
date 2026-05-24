// Tarjetas de sugerencias rápidas para arrancar la conversación.
// Cada sugerencia opcionalmente sugiere un modo recomendado.

export const SUGGESTIONS = [
  {
    title: 'Explícame qué es RAG',
    subtitle: 'Retrieval Augmented Generation, sin jerga.',
    prompt: 'Explícame qué es RAG (Retrieval Augmented Generation) como si fuera estudiante de primer semestre.',
    mode: 'simple',
  },
  {
    title: 'Resume este artículo',
    subtitle: 'Pega un texto y obtén el TL;DR.',
    prompt: 'Voy a pegarte un texto y quiero un resumen con bullets y un TL;DR de 2 frases. Avísame cuando estés listo.',
    mode: 'summary',
  },
  {
    title: 'Ideas para mi tesis',
    subtitle: 'Proyectos disruptivos con IA.',
    prompt: 'Dame 5 ideas de proyecto de tesis que combinen IA generativa con un problema real en Latinoamérica.',
    mode: 'ideas',
  },
  {
    title: 'Plan para lanzar un MVP',
    subtitle: 'Pasos, tiempos y entregables.',
    prompt: 'Quiero lanzar un MVP de una app móvil en 4 semanas trabajando 10h por semana. Dame el plan de acción.',
    mode: 'plan',
  },
  {
    title: 'Stack para una app de chat',
    subtitle: 'Compara enfoques técnicos.',
    prompt: 'Necesito una app de chat con IA, multiusuario y persistencia. ¿Qué stack me recomiendas y por qué?',
    mode: 'tech',
  },
  {
    title: 'Estructura mi semana',
    subtitle: 'Convierte mis pendientes en un plan.',
    prompt: 'Tengo estos pendientes esta semana: estudiar parcial de algoritmos, terminar laboratorio de IA, gym 3 veces, leer 50 páginas. Estructúrame la semana en bloques.',
    mode: 'plan',
  },
]
