import { Component, Suspense, useMemo, type ReactNode } from 'react'
import { useGLTF, Html } from '@react-three/drei'
import { Box3, Vector3, type Object3D } from 'three'
import { getModelUrl, type ModelName } from './modelRegistry'

type Transform = {
  position?: [number, number, number]
  rotation?: [number, number, number]
  /** Explicit uniform scale. If omitted, the model is auto-fit to `fitHeight`. */
  scale?: number
  /** Target height (world units) to normalize the model to when `scale` is unset. */
  fitHeight?: number
}

type Props = Transform & {
  name: ModelName
  /** Rendered when the GLB is missing or fails to load. */
  fallback: ReactNode
}

/**
 * Loads a GLB by registry name and renders it with sensible scale/shadows.
 * - If the file is absent → renders `fallback` (no network attempt).
 * - If loading → shows an <Html> "Loading model..." chip.
 * - If loading throws → error boundary swaps in `fallback` (no crash).
 *
 * GLB models are visual only; game state/simulation are untouched.
 */
export default function GLBModel({ name, fallback, ...transform }: Props) {
  const url = getModelUrl(name)
  if (!url) return <>{fallback}</>
  return (
    <ModelErrorBoundary fallback={fallback}>
      <Suspense fallback={<LoadingChip />}>
        <LoadedModel url={url} {...transform} />
      </Suspense>
    </ModelErrorBoundary>
  )
}

function LoadedModel({ url, position, rotation, scale, fitHeight = 3 }: Transform & { url: string }) {
  const { scene } = useGLTF(url)

  // Clone so the same GLB can be reused at multiple positions without conflicts.
  const clone = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((o: Object3D) => {
      const m = o as unknown as { isMesh?: boolean; castShadow: boolean; receiveShadow: boolean; frustumCulled: boolean }
      if (m.isMesh) {
        m.castShadow = true
        m.receiveShadow = true
        m.frustumCulled = true
      }
    })
    return c
  }, [scene])

  // Auto-fit height when no explicit scale is given (GLBs use varying units).
  const autoScale = useMemo(() => {
    if (scale != null) return scale
    const box = new Box3().setFromObject(clone)
    const size = new Vector3()
    box.getSize(size)
    return size.y > 0 ? fitHeight / size.y : 1
  }, [clone, scale, fitHeight])

  return (
    <group position={position} rotation={rotation} scale={autoScale}>
      <primitive object={clone} />
    </group>
  )
}

function LoadingChip() {
  return (
    <Html center distanceFactor={12}>
      <div className="px-2 py-1 rounded bg-black/70 text-white text-[10px] border border-white/10 whitespace-nowrap">
        Loading model…
      </div>
    </Html>
  )
}

class ModelErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <>{this.props.fallback}</> : this.props.children
  }
}
