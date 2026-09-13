// Non-linear XP curve: each level needs more XP than the last.
// Level 1 -> 2 needs 100 XP, and it scales up by a 1.5 power curve.
export function xpForLevel(level) {
  return Math.round(100 * Math.pow(level, 1.5))
}

// Given a total lifetime XP pool, derive current level, XP into the
// current level, and XP required for the next level.
export function deriveLevelState(totalXP) {
  let level = 1
  let remaining = totalXP

  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level)
    level += 1
  }

  return {
    level,
    currentXP: remaining,
    xpToNextLevel: xpForLevel(level),
  }
}

// Task categories map to character attributes. Extend freely.
export const CATEGORIES = [
  { id: 'coding', label: 'Coding', attribute: 'intellect', color: '#5aa9ff', icon: '💻' },
  { id: 'gym', label: 'Gym', attribute: 'strength', color: '#ff4d6d', icon: '🏋️' },
  { id: 'reading', label: 'Reading', attribute: 'wisdom', color: '#7ee081', icon: '📖' },
  { id: 'chores', label: 'Chores', attribute: 'discipline', color: '#f8b400', icon: '🧹' },
  { id: 'social', label: 'Social', attribute: 'charisma', color: '#c77dff', icon: '🗣️' },
]

export function baseXPForDifficulty(difficulty) {
  // easy / medium / hard
  return { easy: 15, medium: 30, hard: 50 }[difficulty] ?? 20
}

export function currencyForDifficulty(difficulty) {
  return { easy: 5, medium: 10, hard: 20 }[difficulty] ?? 8
}

export const SHOP_ITEMS = [
  { id: 'frame_gold', name: 'Golden Frame', cost: 60, type: 'frame', preview: '🟡' },
  { id: 'frame_neon', name: 'Neon Frame', cost: 60, type: 'frame', preview: '🟣' },
  { id: 'theme_forest', name: 'Forest Theme', cost: 100, type: 'theme', preview: '🌲' },
  { id: 'theme_lava', name: 'Lava Theme', cost: 100, type: 'theme', preview: '🌋' },
  { id: 'badge_star', name: 'Star Badge', cost: 40, type: 'badge', preview: '⭐' },
  { id: 'badge_skull', name: 'Skull Badge', cost: 40, type: 'badge', preview: '💀' },
]
