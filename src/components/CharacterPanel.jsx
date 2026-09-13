import { deriveLevelState } from '../utils/leveling'
import XPBar from './XPBar'

const ATTR_LABELS = {
  intellect: { label: 'INT', color: '#5aa9ff' },
  strength: { label: 'STR', color: '#ff4d6d' },
  wisdom: { label: 'WIS', color: '#7ee081' },
  discipline: { label: 'DIS', color: '#f8b400' },
  charisma: { label: 'CHA', color: '#c77dff' },
}

export default function CharacterPanel({ character }) {
  const { level, currentXP, xpToNextLevel } = deriveLevelState(character.totalXP || 0)
  const streak = character.streak?.count || 0

  return (
    <section aria-label="Character stats" className="pixel-border bg-dungeon-panel p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-pixel text-sm text-dungeon-accent">{character.displayName || 'Hero'}</h2>
          <p style={{ color: '#9b96b8' }} className="text-sm">Level {level} Adventurer</p>
        </div>
        <div className="text-right">
          <p className="font-pixel text-xs text-dungeon-gold" aria-label={`${character.currency || 0} gold`}>
            🪙 {character.currency || 0}
          </p>
          <p className="text-sm" style={{ color: '#9b96b8' }} aria-label={`${streak} day streak`}>
            🔥 {streak}d streak
          </p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1" style={{ color: '#9b96b8' }}>
          <span>XP</span>
          <span>{currentXP} / {xpToNextLevel}</span>
        </div>
        <XPBar currentXP={currentXP} xpToNextLevel={xpToNextLevel} />
      </div>

      <div className="grid grid-cols-5 gap-2" role="group" aria-label="Attributes">
        {Object.entries(ATTR_LABELS).map(([key, meta]) => (
          <div key={key} className="text-center">
            <div
              className="pixel-border py-2 text-xs font-pixel"
              style={{ color: meta.color }}
              aria-label={`${meta.label}: ${character.attributes?.[key] || 0}`}
            >
              {character.attributes?.[key] || 0}
            </div>
            <span className="text-xs" style={{ color: '#9b96b8' }}>{meta.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
