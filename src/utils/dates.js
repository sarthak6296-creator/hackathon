export function todayKey() {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD, local-ish
}

export function daysBetween(dateKeyA, dateKeyB) {
  const a = new Date(dateKeyA + 'T00:00:00')
  const b = new Date(dateKeyB + 'T00:00:00')
  return Math.round((b - a) / 86400000)
}

// Given the last date a task was completed and today's date key,
// returns the updated streak count.
export function computeStreak(lastCompletedDate, currentStreak) {
  const today = todayKey()
  if (!lastCompletedDate) return 1
  const diff = daysBetween(lastCompletedDate, today)
  if (diff === 0) return currentStreak || 1 // already logged today
  if (diff === 1) return (currentStreak || 0) + 1 // consecutive day
  return 1 // streak broken, restart
}
