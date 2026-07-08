import { useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { TRACKS, modulesForTrack, countLessons } from '../../data/curriculum.js'
import { useProgress } from '../../context/ProgressContext.jsx'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/anim.js'

const item = 'flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors'
const cls = ({ isActive }) =>
  `${item} ${isActive ? 'bg-brand text-brand-fg font-medium' : 'text-muted hover:bg-surface-2 hover:text-content'}`

export default function Sidebar() {
  const { modulesLearned, isModuleLearned } = useProgress()
  const nav = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from(nav.current.children, { opacity: 0, x: -12, duration: 0.5, ease: 'power2.out', stagger: 0.05 })
    },
    { scope: nav },
  )

  return (
    <aside
      ref={nav}
      className="hidden w-72 shrink-0 flex-col gap-1 overflow-y-auto border-r border-border bg-surface p-4 md:flex md:h-[calc(100vh-57px)] md:sticky md:top-[57px]"
    >
      <NavLink to="/" end className={cls}>
        <span>🏠</span> Home
      </NavLink>
      <NavLink to="/glossary" className={cls}>
        <span>📚</span> Glossary
      </NavLink>
      <NavLink to="/progress" className={cls}>
        <span>📈</span> <span className="flex-1">Progress</span>
        <span className="text-xs opacity-70">{modulesLearned}</span>
      </NavLink>

      {TRACKS.map((track) => (
        <div key={track.slug} className="mt-4">
          <NavLink
            to={`/track/${track.slug}`}
            className="flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted hover:text-content"
          >
            <span>{track.icon}</span> {track.title}
          </NavLink>
          <div className="mt-1 space-y-0.5">
            {modulesForTrack(track.slug).map((m) => (
              <NavLink key={m.slug} to={`/module/${m.slug}`} className={cls}>
                <span className="flex-1 truncate">{m.title}</span>
                {isModuleLearned(m.slug) ? (
                  <span className="text-xs text-emerald-500">✓</span>
                ) : (
                  <span className="text-xs opacity-70">{countLessons(m.slug)}</span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </aside>
  )
}
