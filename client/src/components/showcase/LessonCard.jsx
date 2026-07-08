import { Link } from 'react-router-dom'
import { Card, DifficultyBadge, KindBadge } from '../ui/primitives.jsx'
import { useProgress } from '../../context/ProgressContext.jsx'

// A single lesson row/card inside a module, showing order, kind, difficulty and completion.
export default function LessonCard({ lesson, index }) {
  const { isLessonComplete } = useProgress()
  const done = isLessonComplete(lesson.id)

  return (
    <Link to={`/lesson/${lesson.id}`} className="group block">
      <Card className="card-glow flex items-center gap-4 p-4 hover:border-brand/40">
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${
            done ? 'bg-emerald-500/15 text-emerald-500' : 'bg-surface-2 text-muted'
          }`}
        >
          {done ? '✓' : index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold group-hover:text-brand">{lesson.title}</h3>
          <p className="truncate text-sm text-muted">{lesson.summary}</p>
        </div>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <KindBadge kind={lesson.kind} />
          <DifficultyBadge level={lesson.difficulty} />
        </div>
      </Card>
    </Link>
  )
}
