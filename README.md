# lab6Rag · InsightMate AI

> Asistente inteligente con modos especializados, construido en **React + Vite** y conectado a la API de **OpenRouter**.

InsightMate AI no es un chat genérico: el usuario elige un **modo** (Explicación simple, Resumen, Ideas de proyecto, Plan de acción o Solución técnica) y el asistente cambia su personalidad, estructura de respuesta y enfoque mediante prompts del sistema dedicados. La interfaz es tipo *dashboard*, con tema oscuro/claro, historial persistente en `localStorage`, tarjetas de sugerencias rápidas y botón para copiar respuestas.

---

## ✨ Funcionalidades

### Núcleo
- 💬 Chat en tiempo real con historial visible y diferenciación visual de mensajes (usuario vs. asistente).
- ⏳ Indicador de carga (“Pensando…”) animado mientras el modelo responde.
- 🚨 Manejo amigable de errores (clave faltante, fallos de red, modelo sin respuesta).
- 🧹 Botón para limpiar la conversación.
- ⏹️ Botón para detener la generación en curso (cancela la petición con `AbortController`).
- 🔒 La API key se lee desde variables de entorno; nunca queda en el código fuente.

### Creativas (incluidas)
- 🎛️ **Selector de modos**: 5 personalidades con prompts especializados.
- 🃏 **Tarjetas de sugerencias** para iniciar conversación con un clic.
- 🌗 **Tema oscuro / claro** con persistencia.
- 💾 **Historial guardado en `localStorage`** (sobrevive a recargas).
- 📋 **Copiar respuesta** con feedback visual.
- 📊 **Contador de mensajes** y **indicador del modelo activo** en la barra superior.
- 🧭 **Panel lateral** con acciones rápidas y estado de la sesión.
- 🎨 Diseño dashboard con gradientes “aurora”, microanimaciones y layout responsive.

---

## 🧰 Tecnologías

- [React 18](https://react.dev/) (JSX, hooks)
- [Vite 5](https://vitejs.dev/) como bundler y dev server
- CSS moderno con **variables CSS**, `color-mix()` y grid/flex (sin frameworks pesados)
- API REST de [OpenRouter](https://openrouter.ai/docs/api-reference/chat-completion) consumida con `fetch` nativo

> No se utiliza ningún SDK adicional para mantener el bundle pequeño y la lógica fácil de auditar.

---

## 🚀 Instalación

Requisitos: **Node.js ≥ 18** y **npm**.

```bash
git clone https://github.com/<tu-usuario>/lab6Rag.git
cd lab6Rag
npm install
```

## 🔑 Configuración del `.env`

1. Genera una API key en [openrouter.ai/keys](https://openrouter.ai/keys).
2. Copia el archivo de ejemplo y completa la clave:

   ```bash
   # macOS / Linux
   cp .env.example .env

   # Windows (PowerShell)
   Copy-Item .env.example .env
   ```

3. Edita `.env` y reemplaza el placeholder:

   ```env
   VITE_OPENROUTER_API_KEY=sk-or-tu-clave-real
   VITE_OPENROUTER_MODEL=openai/gpt-4o-mini
   ```

> El archivo `.env` está incluido en `.gitignore`. **Nunca** lo subas al repositorio.

## ▶️ Cómo ejecutar

```bash
npm run dev          # arranca el servidor de desarrollo en http://localhost:5173
npm run build        # genera el bundle de producción en dist/
npm run preview      # sirve el build de producción para probarlo localmente
```

---

## 🧭 Cómo usar la app

1. Abre la app en el navegador (`npm run dev` la abre automáticamente).
2. Elige un **modo** en las píldoras de la parte superior (o usa el por defecto: *Explicación simple*).
3. Haz clic en una **tarjeta de sugerencia** para arrancar rápido, o escribe tu propio mensaje en la caja inferior.
4. Pulsa **Enter** para enviar (Shift+Enter para salto de línea).
5. Usa el botón **⧉ Copiar** debajo de cada respuesta para llevártela.
6. Limpia la conversación desde el panel lateral cuando quieras empezar de cero.
7. Cambia entre **tema oscuro y claro** con el botón ☀️/🌙 en la barra superior.

---

## 📁 Estructura del proyecto

```
lab6Rag/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/        # UI reutilizable
│   │   ├── ChatWindow.jsx
│   │   ├── Header.jsx
│   │   ├── InputBar.jsx
│   │   ├── Message.jsx
│   │   ├── ModeSelector.jsx
│   │   ├── Sidebar.jsx
│   │   └── SuggestionCards.jsx
│   ├── constants/         # Datos estáticos (modos, sugerencias)
│   │   ├── modes.js
│   │   └── suggestions.js
│   ├── hooks/
│   │   └── useChat.js     # Estado y lógica del chat
│   ├── services/
│   │   └── openrouter.js  # Cliente fetch hacia OpenRouter
│   ├── styles/
│   │   └── index.css      # Tema, layout y animaciones
│   ├── utils/
│   │   └── storage.js     # Helpers seguros para localStorage
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

---

## 🛡️ Nota de seguridad

- La API key **nunca** debe subirse al repositorio. Solo se publica `.env.example` con el placeholder `your_api_key_here`.
- Las variables que empiezan con `VITE_` se exponen al bundle del navegador. Esto es estándar en Vite, pero implica que **cualquiera con acceso al sitio publicado puede leer la clave**. Para producción real, ponte un backend que firme las peticiones y nunca expongas claves de OpenRouter al cliente.
- Para este laboratorio académico la clave se usa solo en local, por lo que el riesgo está acotado a tu entorno.

---

## 🤖 Sobre la conexión con OpenRouter

Endpoint usado:

```
POST https://openrouter.ai/api/v1/chat/completions
```

Cabeceras enviadas:

```
Authorization: Bearer <VITE_OPENROUTER_API_KEY>
Content-Type: application/json
HTTP-Referer: <origen del sitio>
X-Title: InsightMate AI
```

El cuerpo contiene `model`, `temperature` y un arreglo `messages` en formato OpenAI-compatible. El modo activo se inyecta como mensaje `system` al inicio de la conversación, lo que cambia por completo el comportamiento del asistente sin tener que cambiar de modelo.

---

## 📦 Scripts disponibles

| Script           | Descripción                                            |
|------------------|--------------------------------------------------------|
| `npm run dev`     | Servidor de desarrollo con HMR                         |
| `npm run build`   | Build de producción optimizado en `dist/`              |
| `npm run preview` | Sirve el build de producción para verificación        |
