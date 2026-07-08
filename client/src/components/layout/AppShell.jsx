import { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/anim.js'

export default function AppShell({ children }) {
  const { pathname } = useLocation()
  const main = useRef(null)

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
      <TopBar />
      <div className="mx-auto flex max-w-[1400px]">
        <Sidebar />
        <main ref={main} className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
