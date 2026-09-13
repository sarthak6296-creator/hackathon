export default function XPBar({ currentXP, xpToNextLevel, color = '#7ee081' }) {
  const pct = Math.min(100, Math.round((currentXP / xpToNextLevel) * 100))
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Experience progress to next level"
      className="bar-track"
    >
      <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}
