import { useState, lazy, Suspense } from 'react'
import { useTheme } from '../../context/ThemeContext.jsx'
import { Button } from '../ui/primitives.jsx'

// Code-split Sandpack (~1MB) so it only downloads when a lesson with an editor is opened,
// keeping the home/module pages fast.
const Sandpack = lazy(() =>
  import('@codesandbox/sandpack-react').then((m) => ({ default: m.Sandpack })),
)

/**
 * Editable, live-preview code block backed by Sandpack.
 *
 * Reset strategy: bumping `nonce` remounts the <Sandpack> tree, which reloads the original
 * `files` prop and discards any edits — the simplest reliable full reset.
 *
 * @param files        Sandpack files map, e.g. { '/App.js': '...' }. Restored on Reset.
 * @param template     'react' | 'vanilla' | 'static'
 * @param showConsole  show the Sandpack console (useful for JS-utility demos)
 * @param dependencies extra npm dependencies for the sandbox
 */
export default function LiveCode({ files, template = 'react', showConsole = false, dependencies }) {
  const { theme } = useTheme()
  const [nonce, setNonce] = useState(0)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border bg-surface-2 px-3 py-2">
        <span className="text-xs font-medium text-muted">
          ✎ Live editor — change the code, the preview updates instantly
        </span>
        <Button variant="outline" onClick={() => setNonce((n) => n + 1)} title="Restore starter code">
          ↺ Reset
        </Button>
      </div>
      <Suspense
        fallback={<div className="grid h-[420px] place-items-center text-sm text-muted">Loading editor…</div>}
      >
        <Sandpack
          key={nonce}
          template={template}
          theme={theme === 'dark' ? 'dark' : 'light'}
          files={files}
          customSetup={dependencies ? { dependencies } : undefined}
          options={{
            showConsole,
            showConsoleButton: showConsole,
            showTabs: true,
            showLineNumbers: true,
            editorHeight: 420,
            editorWidthPercentage: 55,
          }}
        />
      </Suspense>
    </div>
  )
}
