import { useEffect, useSyncExternalStore } from 'react'
import { gameStore } from '../game/gameState'
import { tick } from '../game/simulation'
import { GAME_MINUTES_PER_SECOND } from '../game/constants'

/**
 * Drives the game tick loop and exposes live game state.
 * Mount `{ run: true }` once at the app root.
 * The `speed` state field acts as the multiplier — 0 pauses everything.
 */
export function useGameSimulation({ run = false }: { run?: boolean } = {}) {
  const state = useSyncExternalStore(
    (cb) => gameStore.subscribe(cb),
    () => gameStore.getState(),
  )

  useEffect(() => {
    if (!run) return
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dtSecondsReal = Math.min(0.1, (now - last) / 1000)
      last = now
      const speed = gameStore.getState().speed
      if (speed > 0) {
        const dtSeconds = dtSecondsReal * speed
        const deltaMinutes = dtSeconds * GAME_MINUTES_PER_SECOND
        gameStore.setState((s) => tick(s, deltaMinutes, dtSeconds, (m, k) => gameStore.notify(m, k)))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [run])

  return state
}
