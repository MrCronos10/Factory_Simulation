/**
 * Model registry for GLB assets under `src/assets/models/`.
 *
 * Uses Vite's `import.meta.glob` so the app builds cleanly whether or not the
 * GLB files are present. When a file is added to the folder it is picked up
 * automatically; when it is absent, `getModelUrl` returns null and callers
 * fall back to primitive geometry.
 */

import { useGLTF } from '@react-three/drei'

export type ModelName =
  | 'cow'
  | 'barn'
  | 'tractor'
  | 'fermenter'
  | 'granulator'
  | 'bagging_machine'

// Eagerly resolve URLs for any .glb present in the models folder.
const GLOB = import.meta.glob('../../assets/models/*.glb', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

/** Map basename (without extension) → served URL. */
const URL_BY_NAME: Partial<Record<ModelName, string>> = {}
for (const [path, url] of Object.entries(GLOB)) {
  const base = path.split('/').pop()?.replace(/\.glb$/i, '')
  if (base) URL_BY_NAME[base as ModelName] = url
}

/** Returns the served URL for a model, or null if the file is not present. */
export function getModelUrl(name: ModelName): string | null {
  return URL_BY_NAME[name] ?? null
}

/** Preload the models that exist. Safe to call at module load. */
export function preloadModels(names: ModelName[]): void {
  for (const name of names) {
    const url = getModelUrl(name)
    if (url) {
      try { useGLTF.preload(url) } catch { /* ignore */ }
    }
  }
}
