import { useState } from 'react'
import { Button } from '../ui/primitives.jsx'
import Markdown from './Markdown.jsx'

// Quiz lessons reveal an answer on demand. The prompt itself is rendered by LessonView, so this
// component only owns the reveal interaction.
export default function QuizCard({ challenge }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="space-y-4">
      {!revealed ? (
        <Button onClick={() => setRevealed(true)}>Reveal answer</Button>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="rounded-xl border border-brand/30 bg-brand/5 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">Answer</p>
            <Markdown>{challenge.explanation}</Markdown>
          </div>
          <Button variant="outline" onClick={() => setRevealed(false)}>
            Hide answer
          </Button>
        </div>
      )}
    </div>
  )
}
