// Global test setup: jest-dom matchers + a clean localStorage before each test.
import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'

beforeEach(() => {
  // Guarded: node-environment test files (e.g. the esbuild parse test) have no localStorage.
  if (typeof localStorage !== 'undefined') localStorage.clear()
})

afterEach(() => {
  cleanup() // unmount React trees between tests
})
