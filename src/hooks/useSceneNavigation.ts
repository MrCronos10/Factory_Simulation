import { useCallback, useSyncExternalStore } from 'react'
import { gameStore } from '../game/gameState'
import type { SceneKey } from '../game/gameTypes'

export const SCENES: { key: SceneKey; label: string }[] = [
  { key: 'farm', label: 'Farm' },
  { key: 'factory', label: 'Factory' },
  { key: 'process', label: 'Process Flow' },
]

/**
 * Reads the currently selected scene from the central game store and exposes
 * a setter. Keeps navigation state in one place so anything (autosave, tutorial,
 * cutscenes) can drive it later.
 */
export function useSceneNavigation() {
  const scene = useSyncExternalStore(
    (cb) => gameStore.subscribe(cb),
    () => gameStore.getState().selectedScene,
  )
  const goTo = useCallback((s: SceneKey) => gameStore.selectScene(s), [])
  return { scene, goTo }
}
