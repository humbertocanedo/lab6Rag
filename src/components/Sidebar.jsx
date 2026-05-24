import { getMode, MODES } from '../constants/modes.js'

export default function Sidebar({
  modeId,
  onClear,
  messageCount,
  lastModel,
  open,
  onClose,
}) {
  const mode = getMode(modeId)

  return (
    <>
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <div className="brand-mark" aria-hidden>
            <span>IM</span>
          </div>
          <div>
            <h1 className="brand-name">InsightMate</h1>
            <p className="brand-sub">Smart Assistant Lab</p>
          </div>
        </div>

        <section className="sidebar__section">
          <h2 className="sidebar__title">Modo activo</h2>
          <div className="active-mode" style={{ '--accent': mode.accent }}>
            <span className="active-mode__emoji" aria-hidden>{mode.emoji}</span>
            <div>
              <p className="active-mode__label">{mode.label}</p>
              <p className="active-mode__desc">{mode.description}</p>
            </div>
          </div>
        </section>

        <section className="sidebar__section">
          <h2 className="sidebar__title">Acciones rápidas</h2>
          <button className="ghost-btn" type="button" onClick={onClear}>
            🧹 Limpiar conversación
          </button>
        </section>

        <section className="sidebar__section">
          <h2 className="sidebar__title">Estadísticas</h2>
          <ul className="stats">
            <li>
              <span>Mensajes</span>
              <strong>{messageCount}</strong>
            </li>
            <li>
              <span>Modos</span>
              <strong>{MODES.length}</strong>
            </li>
            <li>
              <span>Modelo</span>
              <strong title={lastModel} className="stats__model">{lastModel}</strong>
            </li>
          </ul>
        </section>

        <footer className="sidebar__footer">
          <p>
            Hecho con React + Vite · OpenRouter API
          </p>
        </footer>
      </aside>
      {open && (
        <button
          type="button"
          className="sidebar__backdrop"
          aria-label="Cerrar menú"
          onClick={onClose}
        />
      )}
    </>
  )
}
