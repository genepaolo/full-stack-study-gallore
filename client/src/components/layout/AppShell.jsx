import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar, { NavContent } from './Sidebar.jsx'
import TopBar from './TopBar.jsx'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/anim.js'

export default function AppShell({ children }) {
  const { pathname } = useLocation()
  const main = useRef(null)
  const [navOpen, setNavOpen] = useState(false)

  // Close the mobile drawer on route change.
  useEffect(() => setNavOpen(false), [pathname])

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [navOpen])

  // Gentle fade+rise on every route change (skipped under reduced-motion).
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        main.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      )
    },
    { dependencies: [pathname] },
  )

  return (
    <div className="min-h-screen">
      <TopBar onMenuClick={() => setNavOpen(true)} />

      {/* Mobile nav drawer (md:hidden). Backdrop + slide-in panel. */}
      {navOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="animate-fade absolute inset-0 bg-black/50" onClick={() => setNavOpen(false)} />
          <div className="animate-drawer absolute inset-y-0 left-0 flex w-72 max-w-[82%] flex-col overflow-y-auto border-r border-border bg-surface p-4 shadow-2xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2 font-semibold">
                <span className="text-lg">🖼️</span> Menu
              </span>
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-content"
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>
            <NavContent onNavigate={() => setNavOpen(false)} />
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-[1400px]">
        <Sidebar />
        <main ref={main} className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
