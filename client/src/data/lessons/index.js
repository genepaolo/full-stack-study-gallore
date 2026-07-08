// Aggregate all lessons. Add a lesson by appending to a track file above — it flows automatically
// into the curriculum (sidebar, module pages, progression, glossary).
import { frontendLessons } from './frontend.js'
import { backendLessons } from './backend.js'
import { fullstackLessons } from './fullstack.js'
import { advancedLessons } from './advanced.js'

export const allLessons = [
  ...frontendLessons,
  ...backendLessons,
  ...fullstackLessons,
  ...advancedLessons,
]
