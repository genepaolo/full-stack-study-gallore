// @vitest-environment node
// (esbuild's load-time invariant checks `instanceof Uint8Array`, which fails under jsdom's realm —
// so this file runs in the node environment.)
//
// Every editable snippet shown to the learner must be syntactically valid — a broken starter or
// solution would teach broken code. We transform each JS/JSX/CSS file with esbuild and assert it
// compiles. (HTML files from the `static` template are skipped — not JS.)
import { describe, it, expect } from 'vitest'
import { transformSync } from 'esbuild'
import { allLessons } from '../../src/data/lessons/index.js'

function loaderFor(path) {
  if (path.endsWith('.css')) return 'css'
  if (path.endsWith('.js') || path.endsWith('.jsx')) return 'jsx'
  return null // .html etc. — skip
}

// Build a flat list of every code file across starter + solution.
const files = []
for (const lesson of allLessons) {
  for (const bucket of ['starterCode', 'solutionCode']) {
    const set = lesson[bucket]
    if (!set) continue
    for (const [path, code] of Object.entries(set)) {
      files.push({ lesson: lesson.id, bucket, path, code })
    }
  }
}

describe('lesson code compiles', () => {
  it('has code files to check', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it.each(files)('$lesson $bucket $path parses', ({ code, path }) => {
    const loader = loaderFor(path)
    if (!loader) return // skipped file type
    expect(() => transformSync(code, { loader })).not.toThrow()
  })
})
