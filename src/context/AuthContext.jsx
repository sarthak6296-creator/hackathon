import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

const DEFAULT_CHARACTER = {
  totalXP: 0,
  currency: 0,
  streak: { count: 0, lastCompletedDate: null },
  attributes: {
    intellect: 0,
    strength: 0,
    wisdom: 0,
    discipline: 0,
    charisma: 0,
  },
  inventory: [],
  equipped: { frame: null, theme: 'dungeon', badge: null },
  createdAt: serverTimestamp(),
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthLoading(false)
    })
    return unsub
  }, [])

  async function signup(email, password, displayName) {
    setAuthError(null)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) {
        await updateProfile(cred.user, { displayName })
      }
      const charRef = doc(db, 'characters', cred.user.uid)
      await setDoc(charRef, { ...DEFAULT_CHARACTER, displayName: displayName || email })
      return cred.user
    } catch (err) {
      setAuthError(friendlyAuthError(err))
      throw err
    }
  }

  async function login(email, password) {
    setAuthError(null)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      return cred.user
    } catch (err) {
      setAuthError(friendlyAuthError(err))
      throw err
    }
  }

  async function logout() {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, authLoading, authError, setAuthError, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

function friendlyAuthError(err) {
  const code = err?.code || ''
  if (code.includes('email-already-in-use')) return 'That email is already registered. Try logging in instead.'
  if (code.includes('invalid-email')) return 'That email address looks invalid.'
  if (code.includes('weak-password')) return 'Password should be at least 6 characters.'
  if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential'))
    return 'Incorrect email or password.'
  if (code.includes('network-request-failed')) return 'Network error. Check your connection and try again.'
  return 'Something went wrong. Please try again.'
}

export { DEFAULT_CHARACTER }
