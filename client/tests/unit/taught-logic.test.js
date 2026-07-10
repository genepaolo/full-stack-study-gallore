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

describe('sliding window (adv-sliding-window)', () => {
  it('finds the longest substring without repeating characters', () => {
    const { lengthOfLongestSubstring } = extract('adv-sliding-window', ['lengthOfLongestSubstring'])
    expect(lengthOfLongestSubstring('abcabcbb')).toBe(3)
    expect(lengthOfLongestSubstring('bbbbb')).toBe(1)
    expect(lengthOfLongestSubstring('pwwkew')).toBe(3)
    expect(lengthOfLongestSubstring('')).toBe(0)
    expect(lengthOfLongestSubstring('abba')).toBe(2) // left must not jump backward
  })

  it('brute force agrees with the optimized window (the journey is real)', () => {
    const { lengthOfLongestSubstring, lengthOfLongestSubstringBrute } =
      extract('adv-sliding-window', ['lengthOfLongestSubstring', 'lengthOfLongestSubstringBrute'])
    for (const s of ['abcabcbb', 'bbbbb', 'pwwkew', 'abba', '', 'dvdf']) {
      expect(lengthOfLongestSubstringBrute(s)).toBe(lengthOfLongestSubstring(s))
    }
  })
})

describe('stack (adv-stack)', () => {
  it('validates bracket nesting order', () => {
    const { isValid } = extract('adv-stack', ['isValid'])
    expect(isValid('()[]{}')).toBe(true)
    expect(isValid('([])')).toBe(true)
    expect(isValid('[(])')).toBe(false)
    expect(isValid('(')).toBe(false)
    expect(isValid('')).toBe(true)
  })

  it('naive strip-pairs agrees with the stack solution', () => {
    const { isValid, isValidNaive } = extract('adv-stack', ['isValid', 'isValidNaive'])
    for (const s of ['()[]{}', '([])', '[(])', '(', '', '{[]}', '(]']) {
      expect(isValidNaive(s)).toBe(isValid(s))
    }
  })
})

describe('binary search (adv-binary-search)', () => {
  it('finds targets and reports -1 when absent', () => {
    const { binarySearch } = extract('adv-binary-search', ['binarySearch'])
    const arr = [-5, -2, 0, 3, 7, 11, 18, 42]
    expect(binarySearch(arr, 11)).toBe(5)
    expect(binarySearch(arr, -5)).toBe(0)
    expect(binarySearch(arr, 42)).toBe(7)
    expect(binarySearch(arr, 6)).toBe(-1)
    expect(binarySearch([], 1)).toBe(-1)
  })

  it('binary search agrees with linear search on every element', () => {
    const { binarySearch, linearSearch } = extract('adv-binary-search', ['binarySearch', 'linearSearch'])
    const arr = [-5, -2, 0, 3, 7, 11, 18, 42]
    for (const t of [...arr, 6, 100, -100]) {
      expect(binarySearch(arr, t)).toBe(linearSearch(arr, t))
    }
  })
})

describe('linked list (adv-linked-list)', () => {
  it('reverses a singly linked list in place', () => {
    const { reverseList, toList, toArray } = extract('adv-linked-list', ['reverseList', 'toList', 'toArray'])
    expect(toArray(reverseList(toList([1, 2, 3, 4, 5])))).toEqual([5, 4, 3, 2, 1])
    expect(toArray(reverseList(toList([7])))).toEqual([7])
    expect(reverseList(toList([]))).toBeNull()
  })

  it('in-place reversal agrees with the O(n)-space naive version', () => {
    const { reverseList, reverseListNaive, toList, toArray } =
      extract('adv-linked-list', ['reverseList', 'reverseListNaive', 'toList', 'toArray'])
    for (const a of [[1, 2, 3, 4, 5], [7], [], [9, 8]]) {
      expect(toArray(reverseList(toList(a)))).toEqual(toArray(reverseListNaive(toList(a))))
    }
  })
})

describe('heap / priority queue (adv-heap)', () => {
  it('findKthLargest returns the kth largest, agreeing with the sort', () => {
    const { findKthLargest, findKthLargestBrute } = extract('adv-heap', ['findKthLargest', 'findKthLargestBrute'])
    expect(findKthLargest([3, 2, 1, 5, 6, 4], 2)).toBe(5)
    expect(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)).toBe(4)
    for (const [nums, k] of [[[3, 2, 1, 5, 6, 4], 2], [[7, 7, 7], 1], [[1, 2], 2]]) {
      expect(findKthLargest(nums, k)).toBe(findKthLargestBrute(nums, k))
    }
  })
})

describe('intervals (adv-intervals)', () => {
  it('merge combines overlapping intervals (touching counts)', () => {
    const { merge } = extract('adv-intervals', ['merge'])
    expect(merge([[1, 3], [2, 6], [8, 10], [15, 18]])).toEqual([[1, 6], [8, 10], [15, 18]])
    expect(merge([[1, 4], [4, 5]])).toEqual([[1, 5]])
    expect(merge([[1, 4], [2, 3]])).toEqual([[1, 4]]) // fully contained
  })

  it('does not mutate the input', () => {
    const { merge } = extract('adv-intervals', ['merge'])
    const input = [[1, 3], [2, 6]]
    merge(input)
    expect(input).toEqual([[1, 3], [2, 6]])
  })
})

describe('greedy — Kadane (adv-greedy)', () => {
  it('maxSubArray finds the max subarray sum, agreeing with brute force', () => {
    const { maxSubArray, maxSubArrayBrute } = extract('adv-greedy', ['maxSubArray', 'maxSubArrayBrute'])
    expect(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])).toBe(6)
    expect(maxSubArray([1])).toBe(1)
    expect(maxSubArray([5, 4, -1, 7, 8])).toBe(23)
    for (const a of [[-2, 1, -3, 4, -1, 2, 1, -5, 4], [-1, -2, -3], [5, 4, -1, 7, 8]]) {
      expect(maxSubArray(a)).toBe(maxSubArrayBrute(a))
    }
  })
})

describe('graphs & grids (adv-graphs)', () => {
  it('numIslands counts connected land regions', () => {
    const { numIslandsDFS } = extract('adv-graphs', ['numIslandsDFS'])
    expect(numIslandsDFS([[1, 1, 0], [0, 1, 0], [0, 0, 1]])).toBe(2)
    expect(numIslandsDFS([[0, 0], [0, 0]])).toBe(0)
    expect(numIslandsDFS([[1, 1], [1, 1]])).toBe(1)
  })

  it('DFS and BFS flood fill agree, and neither mutates the caller grid', () => {
    const { numIslandsDFS, numIslandsBFS } = extract('adv-graphs', ['numIslandsDFS', 'numIslandsBFS'])
    const grid = [
      [1, 1, 0, 0, 0],
      [1, 1, 0, 0, 1],
      [0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0],
      [1, 0, 1, 0, 1],
    ]
    const snapshot = JSON.stringify(grid)
    expect(numIslandsDFS(grid)).toBe(numIslandsBFS(grid))
    expect(numIslandsDFS(grid)).toBe(5)
    expect(JSON.stringify(grid)).toBe(snapshot) // input untouched
  })
})

describe('tries (adv-tries)', () => {
  it('search needs a full word; startsWith needs only the prefix path', () => {
    const { Trie } = extract('adv-tries', ['Trie'])
    const trie = new Trie()
    trie.insert('apple')
    expect(trie.search('apple')).toBe(true)
    expect(trie.search('app')).toBe(false) // prefix, not a word
    expect(trie.startsWith('app')).toBe(true)
    expect(trie.startsWith('axe')).toBe(false)
    trie.insert('app')
    expect(trie.search('app')).toBe(true) // now a word
  })
})

describe('bit manipulation (adv-bit-manipulation)', () => {
  it('singleNumber finds the loner via XOR, agreeing with the map count', () => {
    const { singleNumber, singleNumberBrute } = extract('adv-bit-manipulation', ['singleNumber', 'singleNumberBrute'])
    expect(singleNumber([4, 1, 2, 1, 2])).toBe(4)
    expect(singleNumber([2, 2, 1])).toBe(1)
    expect(singleNumber([7])).toBe(7)
    for (const a of [[4, 1, 2, 1, 2], [2, 2, 1], [7], [0, 1, 0]]) {
      expect(singleNumber(a)).toBe(singleNumberBrute(a))
    }
  })

  it('countBits counts set bits (Hamming weight)', () => {
    const { countBits } = extract('adv-bit-manipulation', ['countBits'])
    expect(countBits(11)).toBe(3) // 1011
    expect(countBits(0)).toBe(0)
    expect(countBits(7)).toBe(3) // 111
  })
})

describe('list virtualization (fe-perf-virtualization)', () => {
  it('visibleRange windows to the rows in view (plus overscan), clamped to bounds', () => {
    const { visibleRange } = extract('fe-perf-virtualization', ['visibleRange'])
    // at the top: no negative start, ~10 visible + 3 overscan below
    expect(visibleRange(0, 30, 300, 10000)).toEqual([0, 13])
    // scrolled into the middle
    expect(visibleRange(3000, 30, 300, 10000)).toEqual([97, 113])
    // near the bottom clamps to total, never past it
    expect(visibleRange(299970, 30, 300, 10000)).toEqual([9996, 10000])
  })

  it('renders far fewer nodes than the list length', () => {
    const { visibleRange } = extract('fe-perf-virtualization', ['visibleRange'])
    const [start, end] = visibleRange(3000, 30, 300, 10000)
    expect(end - start).toBeLessThan(20) // ~16 of 10,000
  })

  it('totalHeight keeps the scrollbar honest', () => {
    const { totalHeight, offsetFor } = extract('fe-perf-virtualization', ['totalHeight', 'offsetFor'])
    expect(totalHeight(10000, 30)).toBe(300000)
    expect(offsetFor(100, 30)).toBe(3000)
  })
})

describe('AI audit drill (adv-ai-audit-drill)', () => {
  const data = [1, 2, 3, 2, 4, 2, 5, 3]

  it('the audited fix is correct: each duplicate reported exactly once', () => {
    const { findDuplicates } = extract('adv-ai-audit-drill', ['findDuplicates'])
    expect(findDuplicates(data)).toEqual([2, 3])
    expect(findDuplicates([1, 2, 3])).toEqual([]) // no duplicates
    expect(findDuplicates([])).toEqual([])
    const out = findDuplicates(data)
    expect(new Set(out).size).toBe(out.length) // output is deduped
  })

  it('the AI version has the correctness bug the lesson calls out (reports a value more than once)', () => {
    const { findDuplicatesAI } = extract('adv-ai-audit-drill', ['findDuplicatesAI'])
    const buggy = findDuplicatesAI(data)
    expect(new Set(buggy).size).not.toBe(buggy.length) // 2 appears twice — the bug is real
  })

  it('both agree on the SET of duplicates (the fix preserves intent)', () => {
    const { findDuplicates, findDuplicatesAI } = extract('adv-ai-audit-drill', ['findDuplicates', 'findDuplicatesAI'])
    expect(new Set(findDuplicates(data))).toEqual(new Set(findDuplicatesAI(data)))
  })
})

describe('TypeScript narrowing (fe-ts-narrowing)', () => {
  it('area dispatches on the discriminant kind', () => {
    const { area } = extract('fe-ts-narrowing', ['area'])
    expect(area({ kind: 'circle', radius: 2 })).toBeCloseTo(Math.PI * 4, 5)
    expect(area({ kind: 'square', side: 3 })).toBe(9)
    expect(area({ kind: 'rectangle', width: 2, height: 5 })).toBe(10)
  })

  it('throws on an unhandled kind (the exhaustiveness guard at runtime)', () => {
    const { area } = extract('fe-ts-narrowing', ['area'])
    expect(() => area({ kind: 'triangle', base: 1, height: 2 })).toThrow(/Unhandled shape/)
  })

  it('isString is a working runtime type guard', () => {
    const { isString } = extract('fe-ts-narrowing', ['isString'])
    expect(isString('hi')).toBe(true)
    expect(isString(5)).toBe(false)
    expect(isString(null)).toBe(false)
  })
})

describe('TypeScript generics (fe-ts-generics)', () => {
  it('first returns the head or undefined', () => {
    const { first } = extract('fe-ts-generics', ['first'])
    expect(first([1, 2, 3])).toBe(1)
    expect(first([])).toBeUndefined()
    expect(first(['a'])).toBe('a')
  })

  it('identity returns its argument unchanged', () => {
    const { identity } = extract('fe-ts-generics', ['identity'])
    expect(identity('hi')).toBe('hi')
    const obj = { a: 1 }
    expect(identity(obj)).toBe(obj) // same reference
  })

  it('pluck maps items to the named key', () => {
    const { pluck } = extract('fe-ts-generics', ['pluck'])
    const users = [{ id: 1, name: 'Ada' }, { id: 2, name: 'Lin' }]
    expect(pluck(users, 'name')).toEqual(['Ada', 'Lin'])
    expect(pluck(users, 'id')).toEqual([1, 2])
  })
})

describe('Pure functions & immutability (fe-fp-pure)', () => {
  const cart = () => [{ id: 1, price: 10, qty: 1 }, { id: 2, price: 5, qty: 3 }]

  it('addItem appends without mutating the original', () => {
    const { addItem } = extract('fe-fp-pure', ['addItem'])
    const c = cart()
    const next = addItem(c, { id: 3, price: 2, qty: 10 })
    expect(next).toHaveLength(3)
    expect(c).toHaveLength(2) // original untouched
    expect(next).not.toBe(c) // new reference
  })

  it('setQty updates one item immutably', () => {
    const { setQty } = extract('fe-fp-pure', ['setQty'])
    const c = cart()
    const next = setQty(c, 1, 5)
    expect(next.find((it) => it.id === 1).qty).toBe(5)
    expect(c.find((it) => it.id === 1).qty).toBe(1) // original untouched
    expect(next).not.toBe(c)
    expect(next.find((it) => it.id === 2)).toBe(c.find((it) => it.id === 2)) // unchanged item reused
  })

  it('removeItem filters immutably', () => {
    const { removeItem } = extract('fe-fp-pure', ['removeItem'])
    const c = cart()
    const next = removeItem(c, 1)
    expect(next.map((it) => it.id)).toEqual([2])
    expect(c).toHaveLength(2) // original untouched
  })

  it('total is a pure sum of price * qty', () => {
    const { total } = extract('fe-fp-pure', ['total'])
    expect(total(cart())).toBe(25) // 10*1 + 5*3
    expect(total([])).toBe(0)
  })
})

describe('Higher-order functions & composition (fe-fp-compose)', () => {
  it('pipe runs functions left-to-right', () => {
    const { pipe } = extract('fe-fp-compose', ['pipe'])
    const add1 = (n) => n + 1
    const double = (n) => n * 2
    expect(pipe(add1, double)(3)).toBe(8) // (3+1)*2
    expect(pipe(double, add1)(3)).toBe(7) // (3*2)+1
  })

  it('compose runs functions right-to-left', () => {
    const { compose } = extract('fe-fp-compose', ['compose'])
    const add1 = (n) => n + 1
    const double = (n) => n * 2
    expect(compose(add1, double)(3)).toBe(7) // add1(double(3))
    expect(compose(double, add1)(3)).toBe(8) // double(add1(3))
  })

  it('slugify composes the taught steps', () => {
    const { slugify } = extract('fe-fp-compose', ['slugify'])
    expect(slugify('  Hello World  ')).toBe('hello-world')
  })

  it('sumOfEvenSquares folds the pipeline to the taught value', () => {
    const { sumOfEvenSquares } = extract('fe-fp-compose', ['sumOfEvenSquares'])
    expect(sumOfEvenSquares).toBe(56) // 2²+4²+6²
  })
})

describe('React equality checks (fe-react-equality)', () => {
  it('shallowEqual matches React.memo: same keys + Object.is-equal values', () => {
    const { shallowEqual } = extract('fe-react-equality', ['shallowEqual'])
    const fn = () => {}
    expect(shallowEqual({ a: 1, onPick: fn }, { a: 1, onPick: fn })).toBe(true)
    expect(shallowEqual({ a: 1, onPick: fn }, { a: 1, onPick: () => {} })).toBe(false) // new fn ref
    expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false) // different key count
    expect(shallowEqual({ nested: {} }, { nested: {} })).toBe(false) // shallow: rebuilt object differs
  })

  it('shallowEqual short-circuits on identical/primitive references', () => {
    const { shallowEqual } = extract('fe-react-equality', ['shallowEqual'])
    const obj = { a: 1 }
    expect(shallowEqual(obj, obj)).toBe(true) // same reference
    expect(shallowEqual(1, 1)).toBe(true)
    expect(shallowEqual(null, null)).toBe(true)
    expect(shallowEqual(null, { a: 1 })).toBe(false)
  })

  it('depsChanged matches a hook deps array (Object.is per element)', () => {
    const { depsChanged } = extract('fe-react-equality', ['depsChanged'])
    expect(depsChanged(null, [1])).toBe(true) // first render
    expect(depsChanged([1, 'a'], [1, 'a'])).toBe(false) // unchanged -> skip
    expect(depsChanged([1, 'a'], [2, 'a'])).toBe(true) // one changed
    expect(depsChanged([1], [1, 2])).toBe(true) // length changed
    const obj = {}
    expect(depsChanged([obj], [obj])).toBe(false) // same reference
    expect(depsChanged([{}], [{}])).toBe(true) // new reference each render
  })
})
