import { useParams, Link } from 'react-router-dom'
import { moduleBySlug, trackBySlug, lessonsForModule } from '../data/curriculum.js'
import { ProgressBar, Button } from '../components/ui/primitives.jsx'
import { useProgress } from '../context/ProgressContext.jsx'
import LessonCard from '../components/showcase/LessonCard.jsx'
import Reveal from '../components/anim/Reveal.jsx'

export default function ModulePage() {
  const { slug } = useParams()
  const mod = moduleBySlug[slug]
  const { isModuleLearned, toggleModule, isLessonComplete } = useProgress()

  if (!mod) return <NotFound />
  const track = trackBySlug[mod.track]
  const lessons = lessonsForModule(slug)
  const learned = isModuleLearned(slug)
  const self = lessons.filter((l) => isLessonComplete(l.id)).length
  const selfPct = lessons.length ? Math.round((self / lessons.length) * 100) : 0

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted">
        <Link to="/" className="hover:text-content">Home</Link>
        <span>/</span>
        {track && <Link to={`/track/${track.slug}`} className="hover:text-content">{track.icon} {track.title}</Link>}
      </nav>

      <header>
        <h1 className="text-2xl">{mod.title}</h1>
        <p className="mt-1 text-muted">{mod.blurb}</p>
      </header>

      {/* Primary progress control: mark the whole module learned. */}
      <div
        className={`flex items-center gap-4 rounded-xl border p-4 transition-colors ${
          learned ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border bg-surface'
        }`}
      >
        <span className="text-2xl">{learned ? '✅' : '📘'}</span>
        <div className="flex-1">
          <p className="font-semibold">{learned ? 'Module marked as learned' : 'Ready when you are'}</p>
          <p className="text-sm text-muted">
            Check this off once you’re comfortable with the material — it drives your overall progress.
          </p>
        </div>
        <Button variant={learned ? 'primary' : 'outline'} onClick={() => toggleModule(slug)}>
          {learned ? '✓ Learned' : 'Mark as learned'}
        </Button>
      </div>

      {/* Optional finer detail: per-lesson self-checks */}
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-muted">Lessons {self > 0 && `· ${self}/${lessons.length} self-checked`}</span>
        </div>
        {lessons.length > 0 && self > 0 && <ProgressBar value={selfPct} className="mb-3" />}
        {lessons.length === 0 ? (
          <p className="text-muted">No lessons yet — add one in <code>data/lessons/</code>.</p>
        ) : (
          <Reveal as="ol" stagger className="space-y-3">
            {lessons.map((lesson, i) => (
              <li key={lesson.id}>
                <LessonCard lesson={lesson} index={i} />
              </li>
            ))}
          </Reveal>
        )}
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="text-center text-muted">
      <p>Module not found.</p>
      <Link to="/" className="text-brand">Back home</Link>
    </div>
  )
}
