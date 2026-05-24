import { MODES } from '../constants/modes.js'

export default function ModeSelector({ activeId, onChange }) {
  return (
    <nav className="mode-selector" aria-label="Seleccionar modo del asistente">
      {MODES.map((mode) => {
        const isActive = mode.id === activeId
        return (
          <button
            key={mode.id}
            type="button"
            className={`mode-pill ${isActive ? 'mode-pill--active' : ''}`}
            style={{ '--accent': mode.accent }}
            onClick={() => onChange(mode.id)}
            aria-pressed={isActive}
            title={mode.description}
          >
            <span aria-hidden>{mode.emoji}</span>
            <span>{mode.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
