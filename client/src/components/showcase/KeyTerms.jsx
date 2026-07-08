import Reveal from '../anim/Reveal.jsx'

// The "lingo" callout — the vocabulary each lesson teaches. Learn the words, speak the domain.
export default function KeyTerms({ terms }) {
  if (!terms?.length) return null
  return (
    <section className="rounded-xl border border-brand/30 bg-brand/5 p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand">
        🗝️ Key terms — learn the lingo
      </h2>
      <Reveal as="dl" stagger className="space-y-2">
        {terms.map(({ term, def }) => (
          <div key={term} className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-3">
            <dt className="font-semibold text-content">{term}</dt>
            <dd className="text-sm text-muted">{def}</dd>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
