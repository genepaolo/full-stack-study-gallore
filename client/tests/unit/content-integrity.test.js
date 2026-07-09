// Structural integrity of the curriculum. These catch broken study content the moment it's added:
// dangling module/track refs, duplicate ids, missing required fields, bad enums, etc.
import { describe, it, expect } from 'vitest'
import { TRACKS, MODULES } from '../../src/data/curriculum.js'
import { allLessons } from '../../src/data/lessons/index.js'

const TRACK_SLUGS = new Set(TRACKS.map((t) => t.slug))
const MODULE_SLUGS = new Set(MODULES.map((m) => m.slug))
const KINDS = new Set(['component', 'utility', 'quiz', 'concept', 'project'])
const DIFFICULTIES = new Set(['easy', 'medium', 'hard'])
const TEMPLATES = new Set(['react', 'vanilla', 'static'])
const EDITOR_KINDS = new Set(['component', 'utility', 'project'])

describe('tracks & modules', () => {
  it('track slugs are unique and non-empty', () => {
    const slugs = TRACKS.map((t) => t.slug)
    expect(slugs.every(Boolean)).toBe(true)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('every module points at a real track and has a numeric level', () => {
    for (const m of MODULES) {
      expect(TRACK_SLUGS, `module ${m.slug} -> track ${m.track}`).toContain(m.track)
      expect(typeof m.level, `module ${m.slug} level`).toBe('number')
    }
  })

  it('module slugs are unique', () => {
    const slugs = MODULES.map((m) => m.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('every module has at least one lesson', () => {
    for (const m of MODULES) {
      const count = allLessons.filter((l) => l.module === m.slug).length
      expect(count, `module ${m.slug} lesson count`).toBeGreaterThan(0)
    }
  })
})

describe('lessons', () => {
  it('lesson ids are unique', () => {
    const ids = allLessons.map((l) => l.id)
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
    expect(dupes, `duplicate ids: ${dupes.join(', ')}`).toHaveLength(0)
  })

  it('every lesson references an existing module', () => {
    for (const l of allLessons) {
      expect(MODULE_SLUGS, `lesson ${l.id} -> module ${l.module}`).toContain(l.module)
    }
  })

  it('required fields are present and well-typed', () => {
    for (const l of allLessons) {
      expect(l.id, 'id').toBeTruthy()
      expect(l.id).toMatch(/^[a-z0-9-]+$/) // kebab-case
      expect(typeof l.order, `${l.id} order`).toBe('number')
      expect(l.title, `${l.id} title`).toBeTruthy()
      expect(l.summary, `${l.id} summary`).toBeTruthy()
      expect(l.prompt, `${l.id} prompt`).toBeTruthy()
      expect(Array.isArray(l.tags), `${l.id} tags`).toBe(true)
    }
  })

  it('kind and difficulty use valid enums', () => {
    for (const l of allLessons) {
      expect(KINDS, `${l.id} kind=${l.kind}`).toContain(l.kind)
      expect(DIFFICULTIES, `${l.id} difficulty=${l.difficulty}`).toContain(l.difficulty)
    }
  })

  it('editor lessons ship starterCode + a valid Sandpack template', () => {
    for (const l of allLessons.filter((l) => EDITOR_KINDS.has(l.kind))) {
      expect(l.starterCode, `${l.id} starterCode`).toBeTruthy()
      expect(Object.keys(l.starterCode).length, `${l.id} starterCode files`).toBeGreaterThan(0)
      expect(TEMPLATES, `${l.id} template=${l.template}`).toContain(l.template)
    }
  })

  it('quiz & concept lessons ship an explanation', () => {
    for (const l of allLessons.filter((l) => l.kind === 'quiz' || l.kind === 'concept')) {
      expect(l.explanation, `${l.id} explanation`).toBeTruthy()
    }
  })

  it('keyTerms entries are { term, def } with content', () => {
    for (const l of allLessons) {
      for (const kt of l.keyTerms || []) {
        expect(kt.term, `${l.id} keyTerm term`).toBeTruthy()
        expect(kt.def, `${l.id} keyTerm "${kt.term}" def`).toBeTruthy()
      }
    }
  })

  it('codeNotes entries are { label, code } with content', () => {
    for (const l of allLessons) {
      for (const cn of l.codeNotes || []) {
        expect(cn.label, `${l.id} codeNote label`).toBeTruthy()
        expect(typeof cn.code, `${l.id} codeNote "${cn.label}" code`).toBe('string')
        expect(cn.code.length, `${l.id} codeNote "${cn.label}" code non-empty`).toBeGreaterThan(0)
      }
    }
  })

  it('editor restrictions are well-formed (readOnly boolean; lockedFiles reference real files)', () => {
    for (const l of allLessons) {
      if (l.readOnly !== undefined) expect(typeof l.readOnly, `${l.id} readOnly`).toBe('boolean')
      for (const path of l.lockedFiles || []) {
        expect(l.starterCode, `${l.id} lockedFiles needs starterCode`).toBeTruthy()
        expect(Object.keys(l.starterCode), `${l.id} lockedFile ${path} missing`).toContain(path)
      }
    }
  })

  it('lesson order is unique within each module', () => {
    for (const m of MODULES) {
      const orders = allLessons.filter((l) => l.module === m.slug).map((l) => l.order)
      expect(new Set(orders).size, `module ${m.slug} has duplicate orders`).toBe(orders.length)
    }
  })
})
