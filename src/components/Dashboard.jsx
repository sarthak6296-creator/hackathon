import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCharacter } from '../context/useCharacter'
import Navbar from './Navbar'
import CharacterPanel from './CharacterPanel'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import Shop from './Shop'
import LevelUpModal from './LevelUpModal'
import Skeleton from './Skeleton'

export default function Dashboard() {
  const { user } = useAuth()
  const { character, tasks, loading, error, offline, addTask, removeTask, completeTask, buyItem, equipItem } =
    useCharacter(user.uid)
  const [levelUpResult, setLevelUpResult] = useState(null)
  const [tab, setTab] = useState('quests') // 'quests' | 'shop'

  async function handleComplete(task) {
    const result = await completeTask(task)
    if (result.leveledUp) {
      setLevelUpResult(result)
    }
  }

  if (loading || !character) {
    return (
      <div className="min-h-screen">
        <Navbar offline={offline} />
        <Skeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar offline={offline} />
      <main className="max-w-3xl mx-auto p-4 flex flex-col gap-4">
        {error && (
          <p role="alert" className="pixel-border p-3 text-dungeon-hp text-sm bg-dungeon-panel">{error}</p>
        )}

        <CharacterPanel character={character} />

        <div className="flex gap-2" role="tablist" aria-label="Dashboard sections">
          <button
            role="tab"
            aria-selected={tab === 'quests'}
            onClick={() => setTab('quests')}
            className={`flex-1 font-pixel text-[10px] py-2 border-2 border-dungeon-border ${
              tab === 'quests' ? 'bg-dungeon-accent text-dungeon-bg' : 'text-dungeon-accent'
            }`}
          >
            QUESTS
          </button>
          <button
            role="tab"
            aria-selected={tab === 'shop'}
            onClick={() => setTab('shop')}
            className={`flex-1 font-pixel text-[10px] py-2 border-2 border-dungeon-border ${
              tab === 'shop' ? 'bg-dungeon-accent text-dungeon-bg' : 'text-dungeon-accent'
            }`}
          >
            SHOP
          </button>
        </div>

        {tab === 'quests' ? (
          <>
            <TaskForm onAdd={addTask} />
            <TaskList tasks={tasks} onComplete={handleComplete} onRemove={removeTask} />
          </>
        ) : (
          <Shop character={character} onBuy={buyItem} onEquip={equipItem} />
        )}
      </main>

      <LevelUpModal result={levelUpResult} onClose={() => setLevelUpResult(null)} />
    </div>
  )
}
