// Executes the ACTUAL code taught in the vanilla lessons and asserts it behaves correctly.
// This is the study-material correctness guarantee: if a reference implementation regresses,
// these fail. We evaluate each lesson's `/index.js` string and pull out the functions it defines.
import { describe, it, expect, vi } from 'vitest'
import { allLessons } from '../../src/data/lessons/index.js'

const byId = Object.fromEntries(allLessons.map((l) => [l.id, l]))
const codeOf = (id) => byId[id].starterCode['/index.js']

// Evaluate a lesson's code (its inline demo runs harmlessly with a silenced console) and return
// the requested top-level names.
function extract(id, names) {
  const code = codeOf(id)
  const body = `${code}\nreturn { ${names.map((n) => `${n}: typeof ${n} !== 'undefined' ? ${n} : undefined`).join(', ')} };`
  const silentConsole = { log: () => {}, warn: () => {}, error: () => {} }
  return new Function('console', body)(silentConsole)
}

describe('debounce (fe-debounce)', () => {
  it('collapses rapid calls into one trailing call with the latest args', () => {
    const { debounce } = extract('fe-debounce', ['debounce'])
    expect(typeof debounce).toBe('function')
    vi.useFakeTimers()
    try {
      const spy = vi.fn()
      const d = debounce(spy, 100)
      d('a'); d('b'); d('c')
      expect(spy).not.toHaveBeenCalled()
      vi.advanceTimersByTime(100)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('c')
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('promiseAll (fe-promise-all)', () => {
  it('resolves in original order', async () => {
    const { promiseAll } = extract('fe-promise-all', ['promiseAll'])
    const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms))
    await expect(promiseAll([wait(30, 'a'), wait(5, 'b'), wait(15, 'c')])).resolves.toEqual(['a', 'b', 'c'])
  })

  it('resolves empty input to empty array', async () => {
    const { promiseAll } = extract('fe-promise-all', ['promiseAll'])
    await expect(promiseAll([])).resolves.toEqual([])
  })

  it('rejects if any promise rejects', async () => {
    const { promiseAll } = extract('fe-promise-all', ['promiseAll'])
    await expect(promiseAll([Promise.resolve(1), Promise.reject(new Error('boom'))])).rejects.toThrow('boom')
  })
})

describe('decodeJwt (be-jwt)', () => {
  it('decodes the header and payload claims', () => {
    const { decodeJwt, token } = extract('be-jwt', ['decodeJwt', 'token'])
    const out = decodeJwt(token)
    expect(out.header.alg).toBe('HS256')
    expect(out.payload).toMatchObject({ sub: 'u_123', name: 'paolo', role: 'admin' })
  })
})

describe('password hashing (be-hashing)', () => {
  it('verifies the correct password and rejects a wrong one', () => {
    const { register, verify } = extract('be-hashing', ['register', 'verify'])
    const record = register('hunter2')
    expect(record.hash).toBeTruthy()
    expect(record.hash).not.toBe('hunter2') // never stores the raw password
    expect(verify('hunter2', record)).toBe(true)
    expect(verify('wrong', record)).toBe(false)
  })
})

describe('middleware chain (be-middleware)', () => {
  it('runs middlewares in order and lets one short-circuit the chain', () => {
    const { runChain } = extract('be-middleware', ['runChain'])

    const passed = {}
    runChain(
      [(q, s, n) => { s.a = 1; n() }, (q, s, n) => { s.b = 2; n() }, (q, s) => { s.c = 3 }],
      {},
      passed,
    )
    expect(passed).toEqual({ a: 1, b: 2, c: 3 })

    const stopped = {}
    runChain(
      [(q, s) => { s.stoppedHere = true /* no next() */ }, (q, s) => { s.reached = true }],
      {},
      stopped,
    )
    expect(stopped.stoppedHere).toBe(true)
    expect(stopped.reached).toBeUndefined()
  })
})

describe('CRUD handlers (be-crud)', () => {
  it('creates (201), reads (200), 404s missing, deletes (204)', () => {
    const { api } = extract('be-crud', ['api'])
    const created = api.create({ name: 'Testy' })
    expect(created.status).toBe(201)
    expect(created.body.id).toBeGreaterThan(0)

    expect(api.get(created.body.id).status).toBe(200)
    expect(api.get(999999).status).toBe(404)
    expect(api.remove(created.body.id).status).toBe(204)
    expect(api.get(created.body.id).status).toBe(404)
  })
})
