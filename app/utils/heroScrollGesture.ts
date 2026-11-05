type WheelAction = 'jump' | 'block' | 'cancel' | 'native'

export function createHeroScrollGesture() {
  let active = false
  let arrived = false
  let lastWheelAt = -Infinity

  function reset() {
    active = false
    arrived = false
    lastWheelAt = -Infinity
  }

  return {
    wheel(deltaY: number, now: number, canJump: boolean): WheelAction {
      if (deltaY <= 0) {
        const action = active && !arrived ? 'cancel' : 'native'
        reset()
        return action
      }
      if (active) {
        if (arrived && now - lastWheelAt > 180) {
          reset()
          return 'native'
        }
        lastWheelAt = now
        return 'block'
      }
      if (!canJump) return 'native'
      active = true
      lastWheelAt = now
      return 'jump'
    },
    startFromClick() {
      active = true
      arrived = false
      lastWheelAt = -Infinity
    },
    arrive() { arrived = true },
    reset,
  }
}
