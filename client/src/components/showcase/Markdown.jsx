import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Thin wrapper that applies the app's prose styles to rendered markdown.
// remark-gfm enables tables/strikethrough/task-lists. It does NOT enable raw HTML, so the
// no-raw-HTML security posture (see SECURITY.md) is unchanged.
export default function Markdown({ children }) {
  return (
    <div className="prose-app">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  )
}
