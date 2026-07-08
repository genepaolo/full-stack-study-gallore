import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'

export default function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur">
      <Link to="/" className="flex items-center gap-2 font-semibold">
        <span className="text-xl">🖼️</span>
        <span className="hidden sm:inline">full-stack-gallore</span>
      </Link>
      <span className="ml-1 hidden text-xs text-muted lg:inline">
        Full-Stack Interview Study Guide · live &amp; editable
      </span>
      <div className="ml-auto flex items-center gap-2">
        <span
          className="hidden items-center gap-1.5 text-xs text-muted sm:flex"
          title="Progress is saved locally in this browser (no account, works offline)"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Saved on device
        </span>
        <ThemeToggle />
      </div>
    </header>
  )
}
