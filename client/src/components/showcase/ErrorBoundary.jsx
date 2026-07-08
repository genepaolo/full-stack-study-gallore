import { Component } from 'react'

// Contains any render error to THIS section so a broken lesson can never crash the whole app.
// (Sandpack already sandboxes editor runtime errors in an iframe; this covers host-side render.)
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  reset = () => this.setState({ error: null })

  render() {
    if (this.state.error) {
      return (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/5 p-4 text-sm">
          <p className="font-medium text-rose-500">This section hit an error.</p>
          <p className="mt-1 text-muted">{String(this.state.error.message || this.state.error)}</p>
          <button onClick={this.reset} className="mt-3 rounded-lg border border-border px-3 py-1.5 font-medium hover:bg-surface-2">
            ↺ Retry this section
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
