import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'

const require = createRequire(import.meta.url)

test('Vue Router exposes the route block plugin expected by Nuxt tooling', () => {
  assert.doesNotThrow(() => require.resolve('vue-router/volar/sfc-route-blocks'))
})
