import { useState } from 'react'
import { Button } from '../ui/primitives.jsx'
import Markdown from './Markdown.jsx'

// A staged, think-first walkthrough for system-design lessons. Each step shows the sub-question the
// interviewer would ask (the "your turn" prompt) and hides a strong answer behind a per-step reveal,
// so the reader can reason it through before peeking. A small progress bar makes the progression of
// thought visible; "Reveal all / Hide all" is an escape hatch for review passes.
export default function DesignWalkthrough({ steps = [] }) {
  const [open, setOpen] = useState(() => steps.map(() => false))
  const revealed = open.filter(Boolean).length
  const allOpen = revealed === steps.length && steps.length > 0

  const toggle = (i) => setOpen((prev) => prev.map((v, j) => (j === i ? !v : v)))
  const setAll = (value) => setOpen(steps.map(() => value))

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Work it through — one step at a time
        </h2>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2" aria-hidden="true">
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-brand transition-all duration-300"
                style={{ width: `${steps.length ? (revealed / steps.length) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-muted">{revealed}/{steps.length}</span>
          </div>
          <Button variant="ghost" onClick={() => setAll(!allOpen)}>
            {allOpen ? 'Hide all' : 'Reveal all'}
          </Button>
        </div>
      </div>

      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li
            key={i}
            className="rounded-xl border border-border bg-surface p-4"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand/15 text-xs font-semibold text-brand">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                    {step.phase}
                  </p>
                  <div className="mt-1 text-content">
                    <Markdown>{step.question}</Markdown>
                  </div>
                  {step.hint && (
                    <p className="mt-1 text-sm italic text-muted">Hint: {step.hint}</p>
                  )}
                </div>

                {!open[i] ? (
                  <Button variant="outline" onClick={() => toggle(i)}>
                    Think first, then reveal →
                  </Button>
                ) : (
                  <div className="space-y-3 animate-fade-in">
                    <div className="rounded-lg border border-brand/30 bg-brand/5 p-3">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand">
                        A strong answer
                      </p>
                      <Markdown>{step.answer}</Markdown>
                    </div>
                    <Button variant="ghost" onClick={() => toggle(i)}>
                      Hide
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
