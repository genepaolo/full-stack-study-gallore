// Central fetch wrapper. Uses a relative /api base (Vite proxies to the Express server in dev).
// A per-browser user id identifies this personal user; no auth.

const USER_KEY = 'gallore:userId'

export function getUserId() {
  let id = localStorage.getItem(USER_KEY)
  if (!id) {
    id = 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem(USER_KEY, id)
  }
  return id
}

async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getUserId(),
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${body || res.statusText}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  getProgress: () => request('/progress'),
  setProgress: (challengeId, status) =>
    request('/progress', { method: 'POST', body: JSON.stringify({ challengeId, status }) }),
  getNote: (challengeId) => request(`/notes/${encodeURIComponent(challengeId)}`),
  saveNote: (challengeId, body) =>
    request(`/notes/${encodeURIComponent(challengeId)}`, {
      method: 'PUT',
      body: JSON.stringify({ body }),
    }),
}
