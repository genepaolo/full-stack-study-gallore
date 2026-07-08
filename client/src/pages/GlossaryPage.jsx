import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { glossary } from '../data/glossary.js'
import { Card } from '../components/ui/primitives.jsx'

export default function GlossaryPage() {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return glossary
    return glossary.filter((t) => t.term.toLowerCase().includes(s) || t.def.toLowerCase().includes(s))
  }, [q])

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl">Glossary 📚</h1>
        <p className="mt-1 text-muted">
          Every key term across the guide — the vocabulary that makes you sound like an engineer.
          {' '}Click a term to jump to the lesson that teaches it.
        </p>
      </header>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search terms…"
        className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/40"
      />
      <p className="text-xs text-muted">{filtered.length} of {glossary.length} terms</p>

      <div className="space-y-3">
        {filtered.map((t) => (
          <Card key={t.term} className="p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-semibold">{t.term}</h3>
              <Link to={`/lesson/${t.lessonId}`} className="shrink-0 text-xs text-brand hover:underline">
                {t.lessonTitle} →
              </Link>
            </div>
            <p className="mt-1 text-sm text-muted">{t.def}</p>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-muted">No terms match “{q}”.</p>}
      </div>
    </div>
  )
}
