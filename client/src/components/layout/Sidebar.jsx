import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { TRACKS, MODULES, moduleBySlug, modulesForTrack, countLessons } from '../../data/curriculum.js'
import { useProgress } from '../../context/ProgressContext.jsx'

const linkBase = 'flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors'
const linkCls = ({ isActive }) =>
  `${linkBase} ${isActive ? 'bg-brand text-brand-fg font-medium' : 'text-muted hover:bg-surface-2 hover:text-content'}`

// A thin progress meter used for the overall + per-track bars.
function Bar({ value, total, className = '' }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-surface-2 ${className}`}>
      <div
        className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function Chevron({ open }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-3.5 w-3.5 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 5l6 5-6 5" />
    </svg>
  )
}

// Which track owns the current route (for auto-expanding its dropdown).
function activeTrackFromPath(pathname) {
  const mod = pathname.match(/^\/module\/([^/]+)/)
  if (mod && moduleBySlug[mod[1]]) return moduleBySlug[mod[1]].track
  const trk = pathname.match(/^\/track\/([^/]+)/)
  if (trk) return trk[1]
  return null
}

// The shared navigation body — used by the desktop sidebar AND the mobile drawer.
// `onNavigate` lets the drawer close itself when a link is tapped.
export function NavContent({ onNavigate }) {
  const { modulesLearned, isModuleLearned } = useProgress()
  const { pathname } = useLocation()
  const totalModules = MODULES.length
  const overallPct = totalModules ? Math.round((modulesLearned / totalModules) * 100) : 0

  const activeTrack = activeTrackFromPath(pathname)
  // Start with the active track's dropdown open (or Frontend on neutral pages).
  const [open, setOpen] = useState(() => ({ [activeTrack || TRACKS[0].slug]: true }))

  // Auto-open the track you navigate into, without collapsing ones you opened yourself.
  useEffect(() => {
    if (activeTrack) setOpen((o) => ({ ...o, [activeTrack]: true }))
  }, [activeTrack])

  return (
    <nav className="flex flex-col gap-1">
      <NavLink to="/" end className={linkCls} onClick={onNavigate}>
        <span>🏠</span> Home
      </NavLink>
      <NavLink to="/glossary" className={linkCls} onClick={onNavigate}>
        <span>📚</span> Glossary
      </NavLink>

      {/* Overall progress — the "how much have I done" reflection. */}
      <NavLink
        to="/progress"
        onClick={onNavigate}
        className={({ isActive }) =>
          `mt-2 block rounded-xl border p-3 transition-colors ${
            isActive ? 'border-brand/40 bg-brand/5' : 'border-border bg-surface-2/40 hover:border-brand/30'
          }`
        }
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-content">📈 Your progress</span>
          <span className="text-xs tabular-nums text-muted">
            {modulesLearned}/{totalModules}
          </span>
        </div>
        <Bar value={modulesLearned} total={totalModules} className="mt-2" />
        <p className="mt-1.5 text-[11px] text-muted">{overallPct}% of modules marked learned</p>
      </NavLink>

      {/* Collapsible dropdown per track, each with its own learned/total + mini bar. */}
      {TRACKS.map((track) => {
        const mods = modulesForTrack(track.slug)
        const learned = mods.filter((m) => isModuleLearned(m.slug)).length
        const isOpen = !!open[track.slug]
        return (
          <div key={track.slug} className="mt-2">
            <button
              type="button"
              onClick={() => setOpen((o) => ({ ...o, [track.slug]: !o[track.slug] }))}
              aria-expanded={isOpen}
              className="group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-surface-2"
            >
              <span className="text-sm">{track.icon}</span>
              <span className="flex-1 text-xs font-semibold uppercase tracking-wide text-muted group-hover:text-content">
                {track.title}
              </span>
              <span className="text-[10px] tabular-nums text-muted">
                {learned}/{mods.length}
              </span>
              <Chevron open={isOpen} />
            </button>
            <div className="px-2 pb-1 pt-0.5">
              <Bar value={learned} total={mods.length} />
            </div>
            {isOpen && (
              <div className="mt-0.5 space-y-0.5">
                {mods.map((m) => (
                  <NavLink key={m.slug} to={`/module/${m.slug}`} className={linkCls} onClick={onNavigate}>
                    <span className="flex-1 truncate">{m.title}</span>
                    {isModuleLearned(m.slug) ? (
                      <span className="text-xs text-emerald-500" title="Marked learned">
                        ✓
                      </span>
                    ) : (
                      <span className="text-xs opacity-70" title="lessons">
                        {countLessons(m.slug)}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

// Desktop sidebar: sticky, scrolls independently. Hidden below md (the mobile drawer takes over).
export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-border bg-surface p-4 md:sticky md:top-[57px] md:block md:h-[calc(100vh-57px)]">
      <NavContent />
    </aside>
  )
}
