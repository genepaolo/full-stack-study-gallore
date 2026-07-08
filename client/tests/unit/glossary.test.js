// The glossary is derived from lesson keyTerms — verify dedupe, sort, and back-links.
import { describe, it, expect } from 'vitest'
import { buildGlossary } from '../../src/data/glossary.js'
import { lessonById } from '../../src/data/curriculum.js'

describe('buildGlossary', () => {
  const glossary = buildGlossary()

  it('is non-empty', () => {
    expect(glossary.length).toBeGreaterThan(0)
  })

  it('is sorted alphabetically by term', () => {
    const terms = glossary.map((t) => t.term)
    expect(terms).toEqual([...terms].sort((a, b) => a.localeCompare(b)))
  })

  it('has no case-insensitive duplicate terms', () => {
    const lower = glossary.map((t) => t.term.toLowerCase())
    expect(new Set(lower).size).toBe(lower.length)
  })

  it('every entry links back to an existing lesson with a matching title', () => {
    for (const entry of glossary) {
      const lesson = lessonById[entry.lessonId]
      expect(lesson, `glossary term "${entry.term}" -> lesson ${entry.lessonId}`).toBeTruthy()
      expect(entry.lessonTitle).toBe(lesson.title)
    }
  })

  it('every entry has a definition', () => {
    for (const entry of glossary) {
      expect(entry.def, `term "${entry.term}"`).toBeTruthy()
    }
  })
})
