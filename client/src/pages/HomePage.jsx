import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { TRACKS, MODULES, modulesForTrack, lessonsForModule } from '../data/curriculum.js'
import { Card, ProgressBar } from '../components/ui/primitives.jsx'
import { useProgress } from '../context/ProgressContext.jsx'
import Reveal from '../components/anim/Reveal.jsx'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/anim.js'

export default function HomePage() {
  const { modulesLearned, isModuleLearned } = useProgress()
  const totalModules = MODULES.length
  const pct = totalModules ? Math.round((modulesLearned / totalModules) * 100) : 0
  const hero = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('[data-hero] > *', { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out', stagger: 0.12 })
    },
    { scope: hero },
  )

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section ref={hero} className="hero-mesh rounded-2xl border border-border bg-surface/60 p-8 sm:p-10">
        <div data-hero className="space-y-3">
          <p className="text-sm font-medium text-brand">Full-Stack Interview Study Guide</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl">Learn full-stack by editing real code 🖼️</h1>
          <p className="max-w-2xl text-muted">
            A guided path from HTML to system design. Every lesson pairs a clear explanation and the{' '}
            <strong className="text-content">lingo you need</strong> with a{' '}
            <strong className="text-content">live, editable code block</strong>. Check off each module
            as you learn it — your progress lives right here on this device.
          </p>
          <div className="max-w-md pt-2">
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="font-medium">Modules learned</span>
              <span className="text-muted">{modulesLearned}/{totalModules} · {pct}%</span>
            </div>
            <ProgressBar value={pct} />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link to={`/track/${TRACKS[0].slug}`} className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-fg transition-transform hover:scale-[1.03]">
              Start learning →
            </Link>
            <Link to="/progress" className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-2">
              Progress &amp; reset
            </Link>
          </div>
        </div>
      </section>

      {/* Learning roadmap */}
      <section className="space-y-10">
        <div>
          <h2 className="text-xl">The learning path</h2>
          <p className="text-sm text-muted">Work top to bottom — each track builds on the last. Mark a module learned from its page or the Progress tab.</p>
        </div>

        {TRACKS.map((track, ti) => {
          const modules = modulesForTrack(track.slug)
          const learned = modules.filter((m) => isModuleLearned(m.slug)).length
          const tPct = modules.length ? Math.round((learned / modules.length) * 100) : 0
          return (
            <div key={track.slug}>
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-xl">{track.icon}</span>
                <div className="flex-1">
                  <Link to={`/track/${track.slug}`} className="text-lg font-semibold hover:text-brand">
                    {ti + 1}. {track.title}
                  </Link>
                  <p className="text-sm text-muted">{track.blurb}</p>
                </div>
                <span className="hidden shrink-0 text-xs text-muted sm:block">{learned}/{modules.length} learned</span>
              </div>
              <div className="mb-3 max-w-xs sm:hidden"><ProgressBar value={tPct} /></div>
              <Reveal stagger scroll className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((m) => {
                  const done = isModuleLearned(m.slug)
                  const count = lessonsForModule(m.slug).length
                  return (
                    <Link key={m.slug} to={`/module/${m.slug}`} className="group">
                      <Card
                        className={`card-glow h-full p-4 hover:-translate-y-0.5 hover:border-brand/40 ${
                          done ? 'border-emerald-500/40 bg-emerald-500/[0.04]' : ''
                        }`}
                      >
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <h3 className="font-semibold group-hover:text-brand">{m.title}</h3>
                          {done && (
                            <span className="shrink-0 rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-xs font-medium text-emerald-500">
                              ✓ Learned
                            </span>
                          )}
                        </div>
                        <p className="line-clamp-2 text-sm text-muted">{m.blurb}</p>
                        <p className="mt-3 text-xs text-muted">{count} lesson{count === 1 ? '' : 's'}</p>
                      </Card>
                    </Link>
                  )
                })}
              </Reveal>
            </div>
          )
        })}
      </section>
    </div>
  )
}
