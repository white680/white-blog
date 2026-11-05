import assert from 'node:assert/strict'
import test from 'node:test'
import { getArchiveWheelAction } from '../app/utils/archiveWheel.ts'

const wheel = (deltaY, overrides = {}) => ({
  deltaX: 0,
  deltaY,
  deltaMode: 0,
  ctrlKey: false,
  ...overrides,
})

test('vertical wheel moves the timeline and normalizes line and page units', () => {
  assert.deepEqual(getArchiveWheelAction(wheel(100), 100, 900, 700, 600), { target: 'timeline', delta: 100 })
  assert.deepEqual(getArchiveWheelAction(wheel(-3, { deltaMode: 1 }), 100, 900, 700, 600), { target: 'timeline', delta: -48 })
  assert.deepEqual(getArchiveWheelAction(wheel(1, { deltaMode: 2 }), 100, 900, 700, 600), { target: 'timeline', delta: 700 })
})

test('wheel falls through to page scrolling at the timeline edges', () => {
  assert.deepEqual(getArchiveWheelAction(wheel(-100), 0, 900, 700, 600), { target: 'page', delta: -100 })
  assert.deepEqual(getArchiveWheelAction(wheel(100), 900, 900, 700, 600), { target: 'page', delta: 100 })
  assert.deepEqual(getArchiveWheelAction(wheel(1, { deltaMode: 2 }), 900, 900, 700, 600), { target: 'page', delta: 600 })
  assert.equal(getArchiveWheelAction(wheel(100), 0, 0, 700, 600), null)
  assert.deepEqual(getArchiveWheelAction(wheel(100), 899, 900, 700, 600), { target: 'timeline', delta: 100 })
})

test('zoom gestures and predominantly horizontal gestures retain browser behavior', () => {
  assert.equal(getArchiveWheelAction(wheel(100, { ctrlKey: true }), 100, 900, 700, 600), null)
  assert.equal(getArchiveWheelAction(wheel(10, { deltaX: 30 }), 100, 900, 700, 600), null)
})
