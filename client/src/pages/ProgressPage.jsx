import { Link } from 'react-router-dom'
import { TRACKS, MODULES, modulesForTrack, countLessons } from '../data/curriculum.js'
import { useProgress } from '../context/ProgressContext.jsx'
import { Card, ProgressBar, Button } from '../components/ui/primitives.jsx'
import CheckToggle from '../components/ui/CheckToggle.jsx'

export default function ProgressPage() {
  const { isModuleLearned, toggleModule, modulesLearned, lessonsCompleted, resetAll } = useProgress()
  const total = MODULES.length
  const pct = total ? Math.round((modulesLearned / total) * 100) : 0

  const onReset = () => {
    if (window.confirm('Reset all progress? This clears every learned module and lesson check on this device.')) {
      resetAll()
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl">Progress 📈</h1>
          <p className="mt-1 text-sm text-muted">
            {modulesLearned} of {total} modules learned
            {lessonsCompleted > 0 && ` · ${lessonsCompleted} lessons self-checked`} · saved on this device
          </p>
        </div>
        <Button variant="outline" onClick={onReset} className="border-rose-500/40 text-rose-500 hover:bg-rose-500/10">
          ↺ Reset progress
        </Button>
      </header>

      <Card className="p-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium">Overall</span>
          <span className="text-muted">{pct}%</span>
        </div>
        <ProgressBar value={pct} className="h-3" />
        <p className="mt-2 text-xs text-muted">Tick a module below when you’ve learned it.</p>
      </Card>

      <div className="space-y-6">
        {TRACKS.map((track) => {
          const modules = modulesForTrack(track.slug)
          const learned = modules.filter((m) => isModuleLearned(m.slug)).length
          const tPct = modules.length ? Math.round((learned / modules.length) * 100) : 0
          return (
            <div key={track.slug}>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  <span>{track.icon}</span>
                  <Link to={`/track/${track.slug}`} className="hover:text-brand">{track.title}</Link>
                </h2>
                <span className="text-xs text-muted">{learned}/{modules.length}</span>
              </div>
              <div className="mb-3"><ProgressBar value={tPct} /></div>
              <ul className="space-y-2">
                {modules.map((m) => {
                  const done = isModuleLearned(m.slug)
                  return (
                    <li key={m.slug}>
                      <Card className={`flex items-center gap-3 p-3 ${done ? 'border-emerald-500/40 bg-emerald-500/[0.04]' : ''}`}>
                        <CheckToggle checked={done} size="sm" onClick={() => toggleModule(m.slug)} />
                        <Link to={`/module/${m.slug}`} className="min-w-0 flex-1 text-sm font-medium hover:text-brand">
                          {m.title}
                        </Link>
                        <span className="shrink-0 text-xs text-muted">{countLessons(m.slug)} lessons</span>
                      </Card>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
