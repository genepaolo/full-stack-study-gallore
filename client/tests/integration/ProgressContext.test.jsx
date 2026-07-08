// The offline, localStorage-backed progress state — the app's core stateful correctness.
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ProgressProvider, useProgress } from '../../src/context/ProgressContext.jsx'

const KEY = 'gallore:progress:v2'
const wrapper = ({ children }) => <ProgressProvider>{children}</ProgressProvider>
const render = () => renderHook(() => useProgress(), { wrapper })
const stored = () => JSON.parse(localStorage.getItem(KEY) || '{}')

describe('module progress', () => {
  it('toggles a module learned and persists it', () => {
    const { result } = render()
    expect(result.current.isModuleLearned('be-node')).toBe(false)

    act(() => result.current.toggleModule('be-node'))
    expect(result.current.isModuleLearned('be-node')).toBe(true)
    expect(result.current.modulesLearned).toBe(1)
    expect(stored().modules['be-node']).toBe(true)

    act(() => result.current.toggleModule('be-node'))
    expect(result.current.isModuleLearned('be-node')).toBe(false)
    expect(result.current.modulesLearned).toBe(0)
    expect(stored().modules['be-node']).toBeUndefined()
  })
})

describe('lesson progress', () => {
  it('toggles a lesson independently of modules', () => {
    const { result } = render()
    act(() => result.current.toggleLesson('fe-debounce'))
    expect(result.current.isLessonComplete('fe-debounce')).toBe(true)
    expect(result.current.lessonsCompleted).toBe(1)
    expect(result.current.modulesLearned).toBe(0) // lessons don't affect modules
    expect(stored().lessons['fe-debounce']).toBe(true)
  })
})

describe('reset', () => {
  it('clears every module and lesson', () => {
    const { result } = render()
    act(() => {
      result.current.toggleModule('fe-react')
      result.current.toggleLesson('fe-accordion')
    })
    expect(result.current.modulesLearned + result.current.lessonsCompleted).toBe(2)

    act(() => result.current.resetAll())
    expect(result.current.modulesLearned).toBe(0)
    expect(result.current.lessonsCompleted).toBe(0)
    expect(stored()).toEqual({ modules: {}, lessons: {} })
  })
})

describe('hydration from storage', () => {
  it('reads existing progress from localStorage on mount', () => {
    localStorage.setItem(KEY, JSON.stringify({ modules: { 'adv-projects': true }, lessons: {} }))
    const { result } = render()
    expect(result.current.isModuleLearned('adv-projects')).toBe(true)
    expect(result.current.modulesLearned).toBe(1)
  })

  it('survives corrupt storage without throwing', () => {
    localStorage.setItem(KEY, '{not valid json')
    const { result } = render()
    expect(result.current.modulesLearned).toBe(0)
  })
})
