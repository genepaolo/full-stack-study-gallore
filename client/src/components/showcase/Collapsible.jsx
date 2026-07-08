import { useState } from 'react'

// Simple disclosure used for "Reveal solution" / "Explanation" sections.
export default function Collapsible({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl border border-border bg-surface">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-content"
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className={`text-muted transition-transform ${open ? 'rotate-90' : ''}`}>▶</span>
      </button>
      {open && <div className="border-t border-border p-4 animate-fade-in">{children}</div>}
    </div>
  )
}
