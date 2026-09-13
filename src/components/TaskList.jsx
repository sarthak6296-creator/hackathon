import { AnimatePresence, motion } from 'framer-motion'
import { CATEGORIES, baseXPForDifficulty, currencyForDifficulty } from '../utils/leveling'

function categoryMeta(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0]
}

export default function TaskList({ tasks, onComplete, onRemove }) {
  const active = tasks.filter((t) => !t.completed)
  const done = tasks.filter((t) => t.completed)

  if (tasks.length === 0) {
    return (
      <div className="pixel-border bg-dungeon-panel p-6 text-center" style={{ color: '#9b96b8' }}>
        <p className="font-pixel text-xs mb-2">NO QUESTS YET</p>
        <p className="text-sm">Add your first quest above to start earning XP.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence>
        {active.map((task) => (
          <TaskRow key={task.id} task={task} onComplete={onComplete} onRemove={onRemove} />
        ))}
      </AnimatePresence>

      {done.length > 0 && (
        <details className="pixel-border bg-dungeon-panel p-3">
          <summary className="font-pixel text-xs text-dungeon-accent cursor-pointer">
            COMPLETED ({done.length})
          </summary>
          <ul className="mt-3 flex flex-col gap-2">
            {done.map((task) => (
              <li key={task.id} className="flex items-center justify-between text-sm" style={{ color: '#6f6a8a' }}>
                <span className="line-through">{categoryMeta(task.category).icon} {task.title}</span>
                <button
                  onClick={() => onRemove(task.id)}
                  aria-label={`Delete quest ${task.title}`}
                  className="text-dungeon-hp text-xs"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}

function TaskRow({ task, onComplete, onRemove }) {
  const meta = categoryMeta(task.category)
  const xp = baseXPForDifficulty(task.difficulty)
  const gold = currencyForDifficulty(task.difficulty)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="pixel-border bg-dungeon-panel p-3 flex items-center gap-3"
    >
      <button
        onClick={() => onComplete(task)}
        aria-label={`Mark "${task.title}" complete, earns ${xp} XP`}
        className="w-8 h-8 flex-shrink-0 border-2 border-dungeon-border rounded-sm flex items-center justify-center hover:bg-dungeon-xp/20"
      >
        <span aria-hidden>✓</span>
      </button>
      <div className="flex-1 min-w-0">
        <p className="truncate">{meta.icon} {task.title}</p>
        <p className="text-xs" style={{ color: meta.color }}>
          {meta.label} · +{xp} XP · +{gold}🪙
        </p>
      </div>
      <button
        onClick={() => onRemove(task.id)}
        aria-label={`Delete quest ${task.title}`}
        className="text-dungeon-hp px-2"
      >
        ✕
      </button>
    </motion.div>
  )
}
