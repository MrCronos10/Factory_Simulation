/**
 * Simple ambient audio manager.
 *
 * Audio files ship as STUBS — the actual `.mp3` assets are not required for
 * the app to boot. All errors are swallowed; the app never breaks when a
 * file is missing or the browser blocks autoplay.
 *
 * Browsers block autoplay until a user gesture. `play()` is safe to call
 * before a click — it just silently no-ops when the promise rejects.
 */

export type AmbientKind = 'birds' | 'factoryHum' | 'tractor'

const PATHS: Record<AmbientKind, string> = {
  birds:      '/src/assets/audio/birds.mp3',
  factoryHum: '/src/assets/audio/factory-hum.mp3',
  tractor:    '/src/assets/audio/tractor.mp3',
}

class AudioManagerImpl {
  private tracks = new Map<AmbientKind, HTMLAudioElement>()
  private enabled = false
  private currentKey: AmbientKind | null = null

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
    if (!enabled) this.stopAll()
    else if (this.currentKey) this.play(this.currentKey)
  }

  isEnabled(): boolean { return this.enabled }

  play(kind: AmbientKind): void {
    this.currentKey = kind
    if (!this.enabled) return
    try {
      let el = this.tracks.get(kind)
      if (!el) {
        el = new Audio(PATHS[kind])
        el.loop = true
        el.volume = 0.35
        this.tracks.set(kind, el)
      }
      // For other tracks: pause.
      for (const [k, other] of this.tracks) {
        if (k !== kind) other.pause()
      }
      const p = el.play()
      if (p && typeof p.catch === 'function') p.catch(() => { /* autoplay blocked */ })
    } catch {
      /* ignore */
    }
  }

  stopAll(): void {
    try { for (const el of this.tracks.values()) el.pause() } catch { /* ignore */ }
  }
}

export const audioManager = new AudioManagerImpl()
