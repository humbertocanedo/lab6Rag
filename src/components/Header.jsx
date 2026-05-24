export default function Header({
  theme,
  onToggleTheme,
  onOpenSidebar,
  messageCount,
  model,
}) {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <button
          type="button"
          className="icon-btn topbar__menu"
          onClick={onOpenSidebar}
          aria-label="Abrir menú lateral"
        >
          ☰
        </button>
        <div>
          <p className="topbar__eyebrow">Asistente inteligente</p>
          <h2 className="topbar__title">¿Qué quieres descubrir hoy?</h2>
        </div>
      </div>
      <div className="topbar__right">
        <span className="chip chip--muted" title="Modelo activo en OpenRouter">
          <span className="chip__dot" /> {model}
        </span>
        <span className="chip" title="Mensajes en la conversación actual">
          💬 {messageCount}
        </span>
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
