import { useEffect, useState, useCallback, useRef } from 'react'
import {
  doc,
  onSnapshot,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  increment,
} from 'firebase/firestore'
import { db } from '../firebase'
import { deriveLevelState, baseXPForDifficulty, currencyForDifficulty } from '../utils/leveling'
import { computeStreak, todayKey } from '../utils/dates'

export function useCharacter(uid) {
  const [character, setCharacter] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    function goOnline() { setOffline(false) }
    function goOffline() { setOffline(true) }
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  useEffect(() => {
    if (!uid) return
    setLoading(true)
    const charRef = doc(db, 'characters', uid)
    const unsubChar = onSnapshot(
      charRef,
      (snap) => {
        setCharacter(snap.exists() ? { id: snap.id, ...snap.data() } : null)
        setLoading(false)
      },
      (err) => {
        setError('Could not load your character. Check your connection.')
        setLoading(false)
        console.error(err)
      }
    )

    const tasksQuery = query(collection(db, 'characters', uid, 'tasks'), orderBy('createdAt', 'desc'))
    const unsubTasks = onSnapshot(
      tasksQuery,
      (snap) => {
        setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      },
      (err) => {
        setError('Could not load your quests.')
        console.error(err)
      }
    )

    return () => {
      unsubChar()
      unsubTasks()
    }
  }, [uid])

  const addTask = useCallback(
    async ({ title, category, difficulty }) => {
      if (!title?.trim()) throw new Error('empty-title')
      await addDoc(collection(db, 'characters', uid, 'tasks'), {
        title: title.trim(),
        category,
        difficulty,
        completed: false,
        createdAt: serverTimestamp(),
      })
    },
    [uid]
  )

  const removeTask = useCallback(
    async (taskId) => {
      await deleteDoc(doc(db, 'characters', uid, 'tasks', taskId))
    },
    [uid]
  )

  // Completing a task: optimistic local update to task + character, then
  // sync to Firestore. Returns { leveledUp, newLevel } for celebration UI.
  const completeTask = useCallback(
    async (task) => {
      if (task.completed || !character) return { leveledUp: false }

      const xpGain = baseXPForDifficulty(task.difficulty)
      const goldGain = currencyForDifficulty(task.difficulty)
      const before = deriveLevelState(character.totalXP || 0)
      const after = deriveLevelState((character.totalXP || 0) + xpGain)
      const leveledUp = after.level > before.level

      const newStreak = computeStreak(character.streak?.lastCompletedDate, character.streak?.count)
      const attrKey = attributeForCategory(task.category)

      // Optimistic local update
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: true } : t)))
      setCharacter((prev) =>
        prev
          ? {
              ...prev,
              totalXP: (prev.totalXP || 0) + xpGain,
              currency: (prev.currency || 0) + goldGain,
              streak: { count: newStreak, lastCompletedDate: todayKey() },
              attributes: {
                ...prev.attributes,
                [attrKey]: (prev.attributes?.[attrKey] || 0) + Math.round(xpGain / 5),
              },
            }
          : prev
      )

      try {
        await updateDoc(doc(db, 'characters', uid, 'tasks', task.id), { completed: true })
        await updateDoc(doc(db, 'characters', uid), {
          totalXP: increment(xpGain),
          currency: increment(goldGain),
          streak: { count: newStreak, lastCompletedDate: todayKey() },
          [`attributes.${attrKey}`]: increment(Math.round(xpGain / 5)),
        })
      } catch (err) {
        setError('Sync failed — your progress will retry when back online.')
        console.error(err)
      }

      return { leveledUp, newLevel: after.level, xpGain, goldGain }
    },
    [uid, character]
  )

  const buyItem = useCallback(
    async (item) => {
      if (!character || (character.currency || 0) < item.cost) return { success: false }
      if (character.inventory?.some((i) => i.id === item.id)) return { success: false, reason: 'owned' }

      setCharacter((prev) =>
        prev
          ? {
              ...prev,
              currency: prev.currency - item.cost,
              inventory: [...(prev.inventory || []), item],
            }
          : prev
      )
      try {
        await updateDoc(doc(db, 'characters', uid), {
          currency: increment(-item.cost),
          inventory: [...(character.inventory || []), item],
        })
      } catch (err) {
        setError('Purchase failed to sync — try again when online.')
        console.error(err)
      }
      return { success: true }
    },
    [uid, character]
  )

  const equipItem = useCallback(
    async (item) => {
      setCharacter((prev) =>
        prev ? { ...prev, equipped: { ...prev.equipped, [item.type]: item.id } } : prev
      )
      await updateDoc(doc(db, 'characters', uid), {
        [`equipped.${item.type}`]: item.id,
      })
    },
    [uid]
  )

  return { character, tasks, loading, error, offline, addTask, removeTask, completeTask, buyItem, equipItem }
}

function attributeForCategory(categoryId) {
  const map = {
    coding: 'intellect',
    gym: 'strength',
    reading: 'wisdom',
    chores: 'discipline',
    social: 'charisma',
  }
  return map[categoryId] || 'discipline'
}
