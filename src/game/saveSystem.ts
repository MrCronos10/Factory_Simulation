/**
 * Simple localStorage save/load. Notifications are stripped (ephemeral).
 * Load returns null on missing/corrupt data — callers use the initial state instead.
 */

import type { GameState } from './gameTypes'
import { SAVE_KEY, SAVE_VERSION } from './constants'

interface Envelope {
  version: number
  savedAt: number
  state: GameState
}

export function saveGame(state: GameState): boolean {
  try {
    const stripped: GameState = { ...state, notifications: [], selectedStation: null }
    const env: Envelope = { version: SAVE_VERSION, savedAt: Date.now(), state: stripped }
    localStorage.setItem(SAVE_KEY, JSON.stringify(env))
    return true
  } catch {
    return false
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const env: Envelope = JSON.parse(raw)
    if (!env || env.version !== SAVE_VERSION) return null
    const s = env.state
    // Minimal shape check.
    if (typeof s !== 'object' || typeof s.money !== 'number' || !s.stations || !s.animals) return null
    return { ...s, notifications: [] }
  } catch {
    return null
  }
}

export function clearSave(): void {
  try { localStorage.removeItem(SAVE_KEY) } catch { /* ignore */ }
}

export function hasSave(): boolean {
  try { return !!localStorage.getItem(SAVE_KEY) } catch { return false }
}
