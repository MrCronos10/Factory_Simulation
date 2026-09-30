import { useSyncExternalStore } from 'react'
import { gameStore } from '../game/gameState'

/**
 * Returns the current in-game day and formatted clock (HH:MM).
 * Useful for HUDs, day/night lighting, and event triggers.
 */
export function useGameTime() {
  const { day, timeOfDay } = useSyncExternalStore(
    (cb) => gameStore.subscribe(cb),
    () => gameStore.getState(),
  )
  const hours = Math.floor(timeOfDay / 60)
  const minutes = Math.floor(timeOfDay % 60)
  const clock = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  return { day, clock, timeOfDay }
}
