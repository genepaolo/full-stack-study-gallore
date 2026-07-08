// The curriculum helper functions that drive navigation and progression.
import { describe, it, expect } from 'vitest'
import {
  MODULES,
  modulesForTrack,
  lessonsForModule,
  siblingLessons,
  lessonById,
  moduleBySlug,
  trackBySlug,
  countLessons,
} from '../../src/data/curriculum.js'

describe('modulesForTrack', () => {
  it('returns only that track, sorted by level ascending', () => {
    const mods = modulesForTrack('frontend')
    expect(mods.length).toBeGreaterThan(0)
    expect(mods.every((m) => m.track === 'frontend')).toBe(true)
    const levels = mods.map((m) => m.level)
    expect(levels).toEqual([...levels].sort((a, b) => a - b))
  })

  it('unknown track yields empty array', () => {
    expect(modulesForTrack('nope')).toEqual([])
  })
})

describe('lessonsForModule', () => {
  it('returns lessons for the module sorted by order', () => {
    const lessons = lessonsForModule('fe-ui')
    expect(lessons.length).toBeGreaterThan(0)
    expect(lessons.every((l) => l.module === 'fe-ui')).toBe(true)
    const orders = lessons.map((l) => l.order)
    expect(orders).toEqual([...orders].sort((a, b) => a - b))
  })
})

describe('siblingLessons (prev/next progression)', () => {
  it('first lesson has no prev, last has no next, indices are correct', () => {
    const lessons = lessonsForModule('fe-ui')
    const first = siblingLessons(lessons[0])
    expect(first.prev).toBeNull()
    expect(first.index).toBe(0)
    expect(first.total).toBe(lessons.length)
    expect(first.next?.id).toBe(lessons[1].id)

    const last = siblingLessons(lessons[lessons.length - 1])
    expect(last.next).toBeNull()
    expect(last.index).toBe(lessons.length - 1)
  })

  it('a middle lesson links both directions consistently', () => {
    const lessons = lessonsForModule('fe-js-core')
    if (lessons.length >= 3) {
      const mid = siblingLessons(lessons[1])
      expect(mid.prev.id).toBe(lessons[0].id)
      expect(mid.next.id).toBe(lessons[2].id)
    }
  })
})

describe('lookups', () => {
  it('lessonById / moduleBySlug / trackBySlug resolve real entries', () => {
    const anyModule = MODULES[0]
    expect(moduleBySlug[anyModule.slug]).toBe(anyModule)
    expect(trackBySlug[anyModule.track].slug).toBe(anyModule.track)
    const someLesson = lessonsForModule(anyModule.slug)[0]
    expect(lessonById[someLesson.id]).toBe(someLesson)
  })

  it('countLessons matches lessonsForModule length', () => {
    for (const m of MODULES) {
      expect(countLessons(m.slug)).toBe(lessonsForModule(m.slug).length)
    }
  })
})
