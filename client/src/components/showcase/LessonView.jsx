import { Link } from 'react-router-dom'
import { DifficultyBadge, KindBadge, Badge, Button } from '../ui/primitives.jsx'
import { useProgress } from '../../context/ProgressContext.jsx'
import { moduleBySlug, trackBySlug, siblingLessons } from '../../data/curriculum.js'
import LiveCode from './LiveCode.jsx'
import QuizCard from './QuizCard.jsx'
import Collapsible from './Collapsible.jsx'
import Markdown from './Markdown.jsx'
import KeyTerms from './KeyTerms.jsx'
import CodeNotes from './CodeNotes.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

// One path every lesson flows through, adapting to its `kind`. Interactive areas are wrapped in an
// ErrorBoundary so a broken lesson only affects its own section.
export default function LessonView({ lesson }) {
  const { isLessonComplete, toggleLesson } = useProgress()
  const done = isLessonComplete(lesson.id)
  const mod = moduleBySlug[lesson.module]
  const track = mod && trackBySlug[mod.track]
  const { prev, next, index, total } = siblingLessons(lesson)

  const showsEditor = ['component', 'utility', 'project'].includes(lesson.kind)

  return (
    <article className="mx-auto max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {track && <Link to={`/track/${track.slug}`} className="hover:text-content">{track.icon} {track.title}</Link>}
        <span>/</span>
        {mod && <Link to={`/module/${mod.slug}`} className="hover:text-content">{mod.title}</Link>}
        <span className="ml-auto text-xs">Lesson {index + 1} of {total}</span>
      </nav>

      {/* Header */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl">{lesson.title}</h1>
          <DifficultyBadge level={lesson.difficulty} />
          <KindBadge kind={lesson.kind} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {lesson.tags?.map((t) => <Badge key={t}>{t}</Badge>)}
          <Button
            variant={done ? 'primary' : 'outline'}
            className="ml-auto"
            onClick={() => toggleLesson(lesson.id)}
          >
            {done ? '✓ Lesson done' : 'Mark lesson done'}
          </Button>
        </div>
      </header>

      {/* Intro / prompt */}
      <section className="rounded-xl border border-border bg-surface p-4">
        <Markdown>{lesson.prompt}</Markdown>
      </section>

      {/* Key terms (lingo) */}
      <KeyTerms terms={lesson.keyTerms} />

      {/* Code to reach for — concrete idioms/lines this lesson leans on */}
      <CodeNotes notes={lesson.codeNotes} />

      {/* Interactive area — isolated */}
      {lesson.kind === 'quiz' ? (
        <ErrorBoundary>
          <QuizCard challenge={lesson} />
        </ErrorBoundary>
      ) : (
        <>
          {showsEditor && (
            <ErrorBoundary>
              <LiveCode
                files={lesson.starterCode}
                template={lesson.template}
                showConsole={lesson.template === 'vanilla'}
                dependencies={lesson.dependencies}
                readOnly={lesson.readOnly}
                lockedFiles={lesson.lockedFiles}
              />
            </ErrorBoundary>
          )}

          {/* Concept lessons show a small live example only if one is provided */}
          {lesson.kind === 'concept' && lesson.starterCode && (
            <ErrorBoundary>
              <LiveCode
                files={lesson.starterCode}
                template={lesson.template || 'static'}
                readOnly={lesson.readOnly}
                lockedFiles={lesson.lockedFiles}
              />
            </ErrorBoundary>
          )}

          {lesson.solutionCode && (
            <Collapsible title="💡 Reveal a reference solution">
              <ErrorBoundary>
                <LiveCode
                  files={lesson.solutionCode}
                  template={lesson.template}
                  showConsole={lesson.template === 'vanilla'}
                />
              </ErrorBoundary>
            </Collapsible>
          )}

          {lesson.explanation &&
            (lesson.kind === 'concept' ? (
              <section className="rounded-xl border border-border bg-surface p-4">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Deep dive</h2>
                <Markdown>{lesson.explanation}</Markdown>
              </section>
            ) : (
              <Collapsible title="📖 Explanation — what interviewers probe">
                <Markdown>{lesson.explanation}</Markdown>
              </Collapsible>
            ))}
        </>
      )}

      {/* Prev / next progression */}
      <nav className="flex items-center justify-between gap-3 border-t border-border pt-4">
        {prev ? (
          <Link to={`/lesson/${prev.id}`} className="group flex-1">
            <span className="text-xs text-muted">← Previous</span>
            <p className="font-medium group-hover:text-brand">{prev.title}</p>
          </Link>
        ) : <span className="flex-1" />}
        {next ? (
          <Link to={`/lesson/${next.id}`} className="group flex-1 text-right">
            <span className="text-xs text-muted">Next →</span>
            <p className="font-medium group-hover:text-brand">{next.title}</p>
          </Link>
        ) : (
          <Link to={mod ? `/module/${mod.slug}` : '/'} className="group flex-1 text-right">
            <span className="text-xs text-muted">Finish →</span>
            <p className="font-medium group-hover:text-brand">Back to module</p>
          </Link>
        )}
      </nav>
    </article>
  )
}
