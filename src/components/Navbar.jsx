import { useAuth } from '../context/AuthContext'

export default function Navbar({ offline }) {
  const { logout } = useAuth()
  return (
    <nav className="flex items-center justify-between p-4 border-b-2 border-dungeon-border" aria-label="Main navigation">
      <span className="font-pixel text-dungeon-accent text-xs">LIFE RPG</span>
      <div className="flex items-center gap-3">
        {offline && (
          <span role="status" className="text-xs text-dungeon-hp font-pixel">OFFLINE</span>
        )}
        <button onClick={logout} className="pixel-btn text-[9px]">LOG OUT</button>
      </div>
    </nav>
  )
}
