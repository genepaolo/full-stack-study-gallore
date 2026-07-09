import Reveal from '../anim/Reveal.jsx'

// "Code to reach for" — the concrete language idioms/lines a lesson leans on (regex, map/forEach,
// 2D arrays, shallow/deep copies, classes…). Rendered as read-only snippets; never executed.
export default function CodeNotes({ notes }) {
  if (!notes?.length) return null
  return (
    <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-500">
        🧩 Code to reach for
      </h2>
      <Reveal as="ul" stagger className="space-y-3">
        {notes.map(({ label, code, note }) => (
          <li key={label} className="space-y-1">
            <p className="text-sm font-semibold text-content">{label}</p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-surface-2 p-3 text-xs leading-relaxed">
              <code>{code}</code>
            </pre>
            {note && <p className="text-xs text-muted">{note}</p>}
          </li>
        ))}
      </Reveal>
    </section>
  )
}
