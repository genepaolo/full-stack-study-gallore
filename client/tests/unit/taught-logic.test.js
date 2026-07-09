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

describe('throttle (fe-throttle)', () => {
  it('fires immediately then blocks until the window elapses (leading edge)', () => {
    const { throttle } = extract('fe-throttle', ['throttle'])
    vi.useFakeTimers()
    try {
      const spy = vi.fn()
      const t = throttle(spy, 100)
      t('a') // leading — fires now
      t('b') // within window — suppressed
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('a')
      vi.advanceTimersByTime(100)
      t('c') // window elapsed — fires again
      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenLastCalledWith('c')
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('curry (fe-curry)', () => {
  it('collects args across calls until arity is met', () => {
    const { curry } = extract('fe-curry', ['curry'])
    const add = (a, b, c) => a + b + c
    const c = curry(add)
    expect(c(1)(2)(3)).toBe(6)
    expect(c(1, 2)(3)).toBe(6)
    expect(c(1)(2, 3)).toBe(6)
    expect(c(1, 2, 3)).toBe(6)
  })
})

describe('deepClone (fe-deep-clone)', () => {
  it('produces an independent deep copy', () => {
    const { deepClone } = extract('fe-deep-clone', ['deepClone'])
    const orig = { a: 1, nested: { b: 2 }, list: [1, { c: 3 }] }
    const clone = deepClone(orig)
    clone.nested.b = 99
    clone.list[1].c = 99
    expect(orig.nested.b).toBe(2)
    expect(orig.list[1].c).toBe(3)
    expect(clone).not.toBe(orig)
    expect(clone.nested).not.toBe(orig.nested)
  })

  it('handles circular references without infinite recursion', () => {
    const { deepClone } = extract('fe-deep-clone', ['deepClone'])
    const a = { name: 'a' }
    a.self = a
    const clone = deepClone(a)
    expect(clone.self).toBe(clone) // cycle preserved, points to the clone
    expect(clone).not.toBe(a)
  })
})

describe('flatten (fe-flatten)', () => {
  it('flattens arbitrary depth', () => {
    const { flatten } = extract('fe-flatten', ['flatten'])
    expect(flatten([1, [2, [3, [4]], 5]])).toEqual([1, 2, 3, 4, 5])
    expect(flatten([])).toEqual([])
  })
})

describe('memoize (fe-memoize)', () => {
  it('caches by arguments and only computes once per distinct input', () => {
    const { memoize } = extract('fe-memoize', ['memoize'])
    const fn = vi.fn((n) => n * n)
    const m = memoize(fn)
    expect(m(5)).toBe(25)
    expect(m(5)).toBe(25)
    expect(m(6)).toBe(36)
    expect(fn).toHaveBeenCalledTimes(2) // 5 computed once, 6 once
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

describe('two pointers (adv-two-pointers)', () => {
  it('twoSumSorted finds the index pair in a sorted array', () => {
    const { twoSumSorted } = extract('adv-two-pointers', ['twoSumSorted'])
    expect(twoSumSorted([1, 3, 4, 5, 7, 11], 9)).toEqual([2, 3])
    expect(twoSumSorted([2, 7, 11, 15], 9)).toEqual([0, 1])
    expect(twoSumSorted([1, 2, 3], 100)).toBeNull()
  })

  it('isPalindrome ignores case and punctuation', () => {
    const { isPalindrome } = extract('adv-two-pointers', ['isPalindrome'])
    expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true)
    expect(isPalindrome('racecar')).toBe(true)
    expect(isPalindrome('hello')).toBe(false)
  })
})

describe('recursion (adv-recursion)', () => {
  it('permutations returns every ordering', () => {
    const { permutations } = extract('adv-recursion', ['permutations'])
    const out = permutations([1, 2, 3])
    expect(out).toHaveLength(6)
    expect(out).toContainEqual([1, 2, 3])
    expect(out).toContainEqual([3, 2, 1])
    expect(new Set(out.map((p) => p.join(''))).size).toBe(6) // all distinct
  })

  it('handles the base cases', () => {
    const { permutations } = extract('adv-recursion', ['permutations'])
    expect(permutations([])).toEqual([[]])
    expect(permutations([7])).toEqual([[7]])
  })
})

describe('trees & DOM traversal (adv-trees-dom)', () => {
  it('dfs visits depth-first (pre-order)', () => {
    const { dfs, tree } = extract('adv-trees-dom', ['dfs', 'tree'])
    expect(dfs(tree)).toEqual(['html', 'head', 'title', 'body', 'nav', 'main', 'h1', 'p'])
  })

  it('bfs visits level by level', () => {
    const { bfs, tree } = extract('adv-trees-dom', ['bfs', 'tree'])
    expect(bfs(tree)).toEqual(['html', 'head', 'body', 'title', 'nav', 'main', 'h1', 'p'])
  })
})

describe('hash maps & sets (adv-hashmaps)', () => {
  it('twoSum finds the pair in one pass (unsorted)', () => {
    const { twoSum } = extract('adv-hashmaps', ['twoSum'])
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1])
    expect(twoSum([3, 2, 4], 6)).toEqual([1, 2])
    expect(twoSum([1, 2, 3], 100)).toBeNull()
  })

  it('frequency counts occurrences', () => {
    const { frequency } = extract('adv-hashmaps', ['frequency'])
    const counts = frequency(['tap', 'swipe', 'tap'])
    expect(counts.get('tap')).toBe(2)
    expect(counts.get('swipe')).toBe(1)
    expect(counts.size).toBe(2)
  })
})
