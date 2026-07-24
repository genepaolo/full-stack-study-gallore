// A lightweight, dependency-free architecture diagram for system-design lessons. Renders one or
// more left-to-right "flows" (request paths) as labeled node cards joined by arrows. Data-driven so
// any lesson can supply a `workflow` object; theme-aware via design tokens; horizontally scrollable
// so wide flows never break the page layout on mobile.
//
// Shape: { title?, flows: [{ caption, tone?, nodes: [ "Label · sublabel", ... ] }] }
//   - a node string splits on " · " into a bold label + a muted sublabel.
//   - tone: 'read' | 'write' | 'async' tints the lane accent (falls back to brand).
const TONE = {
  read: 'text-emerald-500',
  write: 'text-sky-500',
  async: 'text-amber-500',
}

function Node({ text }) {
  const [label, ...rest] = text.split(' · ')
  const sub = rest.join(' · ')
  return (
    <div className="flex min-w-[7.5rem] max-w-[10rem] flex-none flex-col rounded-lg border border-border bg-surface-2 px-3 py-2">
      <span className="text-sm font-semibold text-content">{label}</span>
      {sub && <span className="mt-0.5 text-xs leading-snug text-muted">{sub}</span>}
    </div>
  )
}

export default function WorkflowDiagram({ workflow }) {
  if (!workflow?.flows?.length) return null
  return (
    <section className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
        {workflow.title || 'Architecture workflow'}
      </h2>
      <div className="space-y-4">
        {workflow.flows.map((flow, i) => (
          <div key={i} className="space-y-2">
            {flow.caption && (
              <p className={`text-xs font-semibold ${TONE[flow.tone] || 'text-brand'}`}>
                {flow.caption}
              </p>
            )}
            <div className="flex items-stretch gap-1 overflow-x-auto pb-1">
              {flow.nodes.map((n, j) => (
                <div key={j} className="flex items-center gap-1">
                  {j > 0 && <span className="flex-none text-muted" aria-hidden="true">→</span>}
                  <Node text={n} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
