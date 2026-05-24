import { SUGGESTIONS } from '../constants/suggestions.js'
import { getMode } from '../constants/modes.js'

export default function SuggestionCards({ onPick, onPickMode }) {
  return (
    <div className="suggestions">
      {SUGGESTIONS.map((s) => {
        const mode = getMode(s.mode)
        return (
          <button
            key={s.title}
            type="button"
            className="suggestion-card"
            style={{ '--accent': mode.accent }}
            onClick={() => {
              if (s.mode) onPickMode?.(s.mode)
              onPick(s.prompt)
            }}
          >
            <span className="suggestion-card__badge">
              {mode.emoji} {mode.label}
            </span>
            <h4 className="suggestion-card__title">{s.title}</h4>
            <p className="suggestion-card__sub">{s.subtitle}</p>
          </button>
        )
      })}
    </div>
  )
}
