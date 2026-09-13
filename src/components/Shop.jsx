import { useState } from 'react'
import { SHOP_ITEMS } from '../utils/leveling'

export default function Shop({ character, onBuy, onEquip }) {
  const [message, setMessage] = useState(null)
  const owned = new Set((character.inventory || []).map((i) => i.id))

  async function handleBuy(item) {
    if ((character.currency || 0) < item.cost) {
      setMessage(`Not enough gold for ${item.name}.`)
      return
    }
    const res = await onBuy(item)
    setMessage(res.success ? `Bought ${item.name}!` : 'Could not complete purchase.')
  }

  return (
    <section aria-label="Shop" className="pixel-border bg-dungeon-panel p-4 flex flex-col gap-3">
      <h2 className="font-pixel text-xs text-dungeon-accent">SHOP · 🪙 {character.currency || 0}</h2>
      {message && <p role="status" className="text-sm" style={{ color: '#9b96b8' }}>{message}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SHOP_ITEMS.map((item) => {
          const isOwned = owned.has(item.id)
          const equipped = character.equipped?.[item.type] === item.id
          return (
            <div key={item.id} className="pixel-border p-3 text-center flex flex-col gap-2" style={{ background: '#0f0e17' }}>
              <span className="text-2xl" aria-hidden>{item.preview}</span>
              <span className="text-xs">{item.name}</span>
              {isOwned ? (
                <button
                  onClick={() => onEquip(item)}
                  className="pixel-btn text-[9px]"
                  style={equipped ? { background: '#7ee081' } : undefined}
                >
                  {equipped ? 'EQUIPPED' : 'EQUIP'}
                </button>
              ) : (
                <button onClick={() => handleBuy(item)} className="pixel-btn text-[9px]">
                  🪙{item.cost}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
