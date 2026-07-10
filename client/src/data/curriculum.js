// The curriculum: ordered Tracks -> Modules -> Lessons.
// This is the study-guide backbone. Lessons live in ./lessons and reference a module by slug.
import { allLessons } from './lessons/index.js'

export const TRACKS = [
  {
    slug: 'frontend',
    title: 'Frontend',
    icon: '🎨',
    blurb: 'The browser: semantic HTML, CSS layout, JavaScript, React, and building UI.',
  },
  {
    slug: 'backend',
    title: 'Backend',
    icon: '🛠️',
    blurb: 'Servers, REST APIs, databases, and authentication with Node & Express.',
  },
  {
    slug: 'fullstack',
    title: 'Full-Stack',
    icon: '🔗',
    blurb: 'Wire frontend and backend together — fetch data, manage state, deploy, ship.',
  },
  {
    slug: 'advanced',
    title: 'Advanced',
    icon: '🚀',
    blurb: 'Build a game, learn system design, and use AI effectively in your workflow.',
  },
]

// level: where it sits on the beginner -> pro ramp (drives ordering & the "smooth progression").
export const MODULES = [
  // Frontend
  { slug: 'fe-foundations', track: 'frontend', title: 'HTML & CSS Foundations', level: 1, blurb: 'The building blocks: semantic markup and the box model.' },
  { slug: 'fe-css-layout', track: 'frontend', title: 'CSS Layout & Responsive', level: 2, blurb: 'Flexbox, grid, centering, and responsive patterns.' },
  { slug: 'fe-js-core', track: 'frontend', title: 'JavaScript Core', level: 2, blurb: 'Closures, `this`, async, and the utility functions interviewers love.' },
  { slug: 'fe-react', track: 'frontend', title: 'React Essentials', level: 3, blurb: 'State, effects, and thinking in components.' },
  { slug: 'fe-ui', track: 'frontend', title: 'UI Component Challenges', level: 3, blurb: 'Build the classics: accordion, tabs, modal.' },
  { slug: 'fe-performance', track: 'frontend', title: 'Front-End Performance', level: 4, blurb: 'The pixel pipeline, reflow/repaint, virtualization, code-splitting, and Core Web Vitals.' },
  // Backend
  { slug: 'be-node', track: 'backend', title: 'Node & Express', level: 3, blurb: 'The runtime, the HTTP server, and middleware.' },
  { slug: 'be-rest', track: 'backend', title: 'REST API Design', level: 4, blurb: 'Resources, verbs, status codes, and CRUD handlers.' },
  { slug: 'be-data', track: 'backend', title: 'Data & MongoDB', level: 4, blurb: 'Documents, schemas, and Mongoose models.' },
  { slug: 'be-auth', track: 'backend', title: 'Auth & Security', level: 5, blurb: 'Password hashing, JWTs, sessions, and common pitfalls.' },
  // Full-stack
  { slug: 'fs-connect', track: 'fullstack', title: 'Connecting Frontend & Backend', level: 4, blurb: 'CORS, the request lifecycle, and the end-to-end flow.' },
  { slug: 'fs-data', track: 'fullstack', title: 'Data Fetching & State', level: 4, blurb: 'Loading/error states, caching, and optimistic UI.' },
  { slug: 'fs-deploy', track: 'fullstack', title: 'Deployment & DevOps', level: 5, blurb: 'Environments, secrets, and shipping a MERN app.' },
  // Advanced
  { slug: 'adv-algorithms', track: 'advanced', title: 'Algorithms & Data Structures', level: 4, blurb: 'Big-O, the DOM as a tree, and the coding-round patterns — tuned for front-end performance.' },
  { slug: 'adv-projects', track: 'advanced', title: 'Projects: Snake Game', level: 5, blurb: 'A full interactive game with the game loop and canvas.' },
  { slug: 'adv-sysdesign', track: 'advanced', title: 'System Design', level: 6, blurb: 'Frameworks for designing frontends and scaling backends.' },
  { slug: 'adv-ai', track: 'advanced', title: 'AI in the Dev Workflow', level: 6, blurb: 'Use AI to code, review, and learn faster — and its limits.' },
]

// ---- Derived lookups ----
export const trackBySlug = Object.fromEntries(TRACKS.map((t) => [t.slug, t]))
export const moduleBySlug = Object.fromEntries(MODULES.map((m) => [m.slug, m]))

export function modulesForTrack(trackSlug) {
  return MODULES.filter((m) => m.track === trackSlug).sort((a, b) => a.level - b.level)
}

// Lessons belonging to a module, in authored order.
export function lessonsForModule(moduleSlug) {
  return allLessons.filter((l) => l.module === moduleSlug).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export const lessonById = Object.fromEntries(allLessons.map((l) => [l.id, l]))

// Prev/next within a module for smooth progression.
export function siblingLessons(lesson) {
  const sibs = lessonsForModule(lesson.module)
  const i = sibs.findIndex((l) => l.id === lesson.id)
  return { prev: sibs[i - 1] || null, next: sibs[i + 1] || null, index: i, total: sibs.length }
}

export function countLessons(moduleSlug) {
  return allLessons.filter((l) => l.module === moduleSlug).length
}
