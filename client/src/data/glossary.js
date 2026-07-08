// The glossary is derived from every lesson's keyTerms — one place to review all the "lingo".
// Each term links back to the lesson that introduces it.
import { allLessons } from './lessons/index.js'

export function buildGlossary() {
  const map = new Map() // term -> { term, def, lessonId, lessonTitle }
  for (const lesson of allLessons) {
    for (const { term, def } of lesson.keyTerms || []) {
      // First lesson to define a term wins (lessons are in curriculum order).
      if (!map.has(term.toLowerCase())) {
        map.set(term.toLowerCase(), { term, def, lessonId: lesson.id, lessonTitle: lesson.title })
      }
    }
  }
  return [...map.values()].sort((a, b) => a.term.localeCompare(b.term))
}

export const glossary = buildGlossary()
