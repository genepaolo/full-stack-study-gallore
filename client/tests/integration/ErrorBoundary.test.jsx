// Proves the isolation guarantee: a throwing/broken interactive block renders a contained fallback
// and never crashes the surrounding app.
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../../src/components/showcase/ErrorBoundary.jsx'

function Boom() {
  throw new Error('kaboom from a lesson block')
}

describe('ErrorBoundary', () => {
  it('renders its fallback (not a crash) when a child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {}) // silence expected React log
    render(
      <div>
        <span>sibling stays alive</span>
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      </div>,
    )
    expect(screen.getByText(/hit an error/i)).toBeInTheDocument()
    expect(screen.getByText('sibling stays alive')).toBeInTheDocument() // rest of the page survives
    spy.mockRestore()
  })

  it('renders children normally when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>safe content</div>
      </ErrorBoundary>,
    )
    expect(screen.getByText('safe content')).toBeInTheDocument()
  })
})
