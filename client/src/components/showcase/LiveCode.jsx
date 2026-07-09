import { useState, useMemo, lazy, Suspense } from 'react'
import { useTheme } from '../../context/ThemeContext.jsx'
import { Button } from '../ui/primitives.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

// Code-split Sandpack (~1MB) so it only downloads when a lesson with an editor is opened,
// keeping the home/module pages fast.
const Sandpack = lazy(() =>
  import('@codesandbox/sandpack-react').then((m) => ({ default: m.Sandpack })),
)

/**
 * Editable, live-preview code block backed by Sandpack.
 *
 * Safety: user code runs inside Sandpack's sandboxed, cross-origin iframe — it can't touch the host
 * app, its state, or saved progress. Reset restores the starter (bumping `nonce` remounts the tree).
 * See SECURITY.md.
 *
 * @param files        Sandpack files map, e.g. { '/App.js': '...' }. Restored on Reset.
 * @param template     'react' | 'vanilla' | 'static'
 * @param showConsole  show the Sandpack console (useful for JS-utility demos)
 * @param dependencies extra npm dependencies for the sandbox
 * @param readOnly     make the WHOLE editor view-only (no edits)
 * @param lockedFiles  array of file paths that can't be edited (e.g. lock scaffolding, edit the CSS)
 */
export default function LiveCode({
  files,
  template = 'react',
  showConsole = false,
  dependencies,
  readOnly = false,
  lockedFiles = [],
}) {
  const { theme } = useTheme()
  const [nonce, setNonce] = useState(0)

  // Apply per-file read-only locks so learners can only edit the intended part.
  const preparedFiles = useMemo(() => {
    if (!lockedFiles?.length) return files
    const out = {}
    for (const [path, val] of Object.entries(files)) {
      const code = typeof val === 'string' ? val : val.code
      out[path] = lockedFiles.includes(path) ? { code, readOnly: true } : val
    }
    return out
  }, [files, lockedFiles])

  const hasLocks = readOnly || lockedFiles?.length > 0

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border bg-surface-2 px-3 py-2">
        <span className="text-xs font-medium text-muted">
          {readOnly
            ? '🔒 View-only — read the code'
            : hasLocks
              ? '✎ Edit the unlocked files — 🔒 marks locked scaffolding'
              : '✎ Live editor — change the code, the preview updates instantly'}
        </span>
        {!readOnly && (
          <Button variant="outline" onClick={() => setNonce((n) => n + 1)} title="Restore starter code">
            ↺ Reset
          </Button>
        )}
      </div>
      {/* Defense-in-depth: LiveCode carries its OWN ErrorBoundary so a Sandpack/chunk-load failure is
          contained even if a caller forgets to wrap it. Keyed by nonce so Reset also clears a caught error. */}
      <ErrorBoundary key={nonce}>
      <Suspense
        fallback={<div className="grid h-[420px] place-items-center text-sm text-muted">Loading editor…</div>}
      >
        <Sandpack
          key={nonce}
          template={template}
          theme={theme === 'dark' ? 'dark' : 'light'}
          files={preparedFiles}
          customSetup={dependencies ? { dependencies } : undefined}
          options={{
            readOnly,
            showReadOnly: true,
            showConsole,
            showConsoleButton: showConsole,
            showTabs: true,
            showLineNumbers: true,
            editorHeight: 420,
            editorWidthPercentage: 55,
          }}
        />
      </Suspense>
      </ErrorBoundary>
    </div>
  )
}
