import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function AuthScreen() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login, signup, authError, setAuthError } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setAuthError(null)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await signup(email, password, displayName)
      }
    } catch {
      // authError already set by context
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm pixel-border bg-dungeon-panel p-6"
      >
        <h1 className="font-pixel text-dungeon-accent text-lg text-center mb-1">LIFE RPG</h1>
        <p className="text-center text-dungeon-border mb-6" style={{ color: '#9b96b8' }}>
          Turn your day into a dungeon crawl
        </p>

        <div className="flex mb-5 gap-2" role="tablist" aria-label="Auth mode">
          <button
            role="tab"
            aria-selected={mode === 'login'}
            onClick={() => setMode('login')}
            className={`flex-1 font-pixel text-[10px] py-2 border-2 border-dungeon-border ${
              mode === 'login' ? 'bg-dungeon-accent text-dungeon-bg' : 'bg-transparent text-dungeon-accent'
            }`}
          >
            LOGIN
          </button>
          <button
            role="tab"
            aria-selected={mode === 'signup'}
            onClick={() => setMode('signup')}
            className={`flex-1 font-pixel text-[10px] py-2 border-2 border-dungeon-border ${
              mode === 'signup' ? 'bg-dungeon-accent text-dungeon-bg' : 'bg-transparent text-dungeon-accent'
            }`}
          >
            SIGN UP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'signup' && (
            <label className="flex flex-col gap-1">
              <span className="text-sm" style={{ color: '#9b96b8' }}>Hero name</span>
              <input
                className="pixel-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Sir Codes-a-Lot"
                autoComplete="nickname"
              />
            </label>
          )}
          <label className="flex flex-col gap-1">
            <span className="text-sm" style={{ color: '#9b96b8' }}>Email</span>
            <input
              type="email"
              required
              className="pixel-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm" style={{ color: '#9b96b8' }}>Password</span>
            <input
              type="password"
              required
              minLength={6}
              className="pixel-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </label>

          {authError && (
            <p role="alert" className="text-dungeon-hp text-sm">{authError}</p>
          )}

          <button type="submit" disabled={submitting} className="pixel-btn mt-2">
            {submitting ? '...' : mode === 'login' ? 'ENTER DUNGEON' : 'CREATE HERO'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
