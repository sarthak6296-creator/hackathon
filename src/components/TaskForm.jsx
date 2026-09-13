import { useState } from 'react'
import { CATEGORIES } from '../utils/leveling'

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0].id)
  const [difficulty, setDifficulty] = useState('medium')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) {
      setFormError('Quest needs a name.')
      return
    }
    setFormError(null)
    setSubmitting(true)
    try {
      await onAdd({ title, category, difficulty })
      setTitle('')
    } catch {
      setFormError('Could not add quest. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pixel-border bg-dungeon-panel p-4 flex flex-col gap-3">
      <h2 className="font-pixel text-xs text-dungeon-accent">NEW QUEST</h2>
      <label className="flex flex-col gap-1">
        <span className="text-sm" style={{ color: '#9b96b8' }}>What needs doing?</span>
        <input
          className="pixel-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Finish chapter 4"
          maxLength={80}
        />
      </label>

      <div className="flex gap-3 flex-wrap">
        <label className="flex flex-col gap-1 flex-1 min-w-[140px]">
          <span className="text-sm" style={{ color: '#9b96b8' }}>Category</span>
          <select className="pixel-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 flex-1 min-w-[140px]">
          <span className="text-sm" style={{ color: '#9b96b8' }}>Difficulty</span>
          <select className="pixel-input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy (15 XP)</option>
            <option value="medium">Medium (30 XP)</option>
            <option value="hard">Hard (50 XP)</option>
          </select>
        </label>
      </div>

      {formError && <p role="alert" className="text-dungeon-hp text-sm">{formError}</p>}

      <button type="submit" disabled={submitting} className="pixel-btn self-start">
        {submitting ? '...' : '+ ADD QUEST'}
      </button>
    </form>
  )
}
