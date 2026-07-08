import { useParams, Link } from 'react-router-dom'
import { trackBySlug, modulesForTrack, countLessons } from '../data/curriculum.js'
import { Card, ProgressBar } from '../components/ui/primitives.jsx'
import { useProgress } from '../context/ProgressContext.jsx'
import CheckToggle from '../components/ui/CheckToggle.jsx'
import Reveal from '../components/anim/Reveal.jsx'

export default function TrackPage() {
  const { slug } = useParams()
  const track = trackBySlug[slug]
  const { isModuleLearned, toggleModule } = useProgress()

  if (!track) return <NotFound />
  const modules = modulesForTrack(slug)
  const learned = modules.filter((m) => isModuleLearned(m.slug)).length
  const pct = modules.length ? Math.round((learned / modules.length) * 100) : 0

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/" className="text-sm text-muted hover:text-content">← Home</Link>
      <header className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-2 text-3xl">{track.icon}</span>
        <div className="flex-1">
          <h1 className="text-2xl">{track.title}</h1>
          <p className="text-muted">{track.blurb}</p>
        </div>
      </header>

      <div className="max-w-md">
        <div className="mb-1 flex justify-between text-sm">
          <span className="font-medium">Modules learned</span>
          <span className="text-muted">{learned}/{modules.length} · {pct}%</span>
        </div>
        <ProgressBar value={pct} />
      </div>

      <Reveal as="ol" stagger className="space-y-3">
        {modules.map((m, i) => {
          const done = isModuleLearned(m.slug)
          return (
            <li key={m.slug}>
              <Card className={`card-glow flex items-center gap-4 p-4 ${done ? 'border-emerald-500/40 bg-emerald-500/[0.04]' : ''}`}>
                <CheckToggle checked={done} onClick={() => toggleModule(m.slug)} />
                <Link to={`/module/${m.slug}`} className="group min-w-0 flex-1">
                  <h3 className="font-semibold group-hover:text-brand">{i + 1}. {m.title}</h3>
                  <p className="truncate text-sm text-muted">{m.blurb}</p>
                </Link>
                <span className="shrink-0 text-xs text-muted">{countLessons(m.slug)} lessons</span>
              </Card>
            </li>
          )
        })}
      </Reveal>
    </div>
  )
}

function NotFound() {
  return (
    <div className="text-center text-muted">
      <p>Track not found.</p>
      <Link to="/" className="text-brand">Back home</Link>
    </div>
  )
}
