import assert from 'node:assert/strict'
import test from 'node:test'
import { createHeroScrollGesture } from '../app/utils/heroScrollGesture.ts'

test('one downward wheel gesture lands on content without momentum scrolling past it', () => {
  const gesture = createHeroScrollGesture()

  assert.equal(gesture.wheel(100, 0, true), 'jump')
  assert.equal(gesture.wheel(80, 100, true), 'block')
  gesture.arrive()
  assert.equal(gesture.wheel(30, 150, false), 'block')
  assert.equal(gesture.wheel(10, 290, false), 'block')
  assert.equal(gesture.wheel(90, 500, false), 'native')
})

test('an upward wheel interrupts the jump and a later downward gesture can retry', () => {
  const gesture = createHeroScrollGesture()

  assert.equal(gesture.wheel(100, 0, true), 'jump')
  assert.equal(gesture.wheel(-40, 50, true), 'cancel')
  assert.equal(gesture.wheel(100, 300, true), 'jump')
})

test('clicking the scroll prompt holds wheel input only until the jump settles', () => {
  const gesture = createHeroScrollGesture()

  gesture.startFromClick()
  assert.equal(gesture.wheel(40, 50, true), 'block')
  gesture.arrive()
  assert.equal(gesture.wheel(100, 300, false), 'native')
})
