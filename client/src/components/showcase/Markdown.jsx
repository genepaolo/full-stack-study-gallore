import ReactMarkdown from 'react-markdown'

// Thin wrapper that applies the app's prose styles to rendered markdown.
export default function Markdown({ children }) {
  return (
    <div className="prose-app">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  )
}
