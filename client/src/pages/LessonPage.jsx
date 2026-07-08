import { useParams, Link } from 'react-router-dom'
import { lessonById } from '../data/curriculum.js'
import LessonView from '../components/showcase/LessonView.jsx'

export default function LessonPage() {
  const { id } = useParams()
  const lesson = lessonById[id]

  if (!lesson) {
    return (
      <div className="text-center text-muted">
        <p>Lesson not found.</p>
        <Link to="/" className="text-brand">Back home</Link>
      </div>
    )
  }
  // key={id} remounts on navigation so per-lesson state (editors, quiz) resets cleanly.
  return <LessonView key={id} lesson={lesson} />
}
