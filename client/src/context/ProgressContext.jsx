import { createContext, useContext, useState, useCallback, useEffect } from 'react'

// Offline-first progress. localStorage is the SINGLE source of truth — no server round-trip — so
// progress is instant, survives the backend being off, and can never be clobbered by an empty
// server on startup. Two independent kinds of completion:
//   - modules: the primary unit you manually "mark as learned"
//   - lessons: an optional finer-grained self-check within a module
const KEY = 'gallore:progress:v2'
const EMPTY = { modules: {}, lessons: {} }

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY))
    return parsed ? { modules: {}, lessons: {}, ...parsed } : { ...EMPTY }
  } catch {
    return { ...EMPTY }
  }
}

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [state, setState] = useState(read)

  // Persist on every change.
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  // Keep multiple open tabs/windows in sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) setState(read())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggleModule = useCallback((slug) => {
    setState((s) => {
      const modules = { ...s.modules }
      if (modules[slug]) delete modules[slug]
      else modules[slug] = true
      return { ...s, modules }
    })
  }, [])

  const toggleLesson = useCallback((id) => {
    setState((s) => {
      const lessons = { ...s.lessons }
      if (lessons[id]) delete lessons[id]
      else lessons[id] = true
      return { ...s, lessons }
    })
  }, [])

  const resetAll = useCallback(() => setState({ modules: {}, lessons: {} }), [])

  const isModuleLearned = useCallback((slug) => !!state.modules[slug], [state])
  const isLessonComplete = useCallback((id) => !!state.lessons[id], [state])

  const value = {
    isModuleLearned,
    toggleModule,
    isLessonComplete,
    toggleLesson,
    resetAll,
    modulesLearned: Object.keys(state.modules).length,
    lessonsCompleted: Object.keys(state.lessons).length,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
