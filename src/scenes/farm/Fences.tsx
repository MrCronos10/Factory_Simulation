import { useMemo, useRef } from 'react'
import { Object3D, InstancedMesh } from 'three'
import { FENCES } from './farmLayout'

/** Fence posts rendered as one InstancedMesh around each fence rectangle. */
export default function Fences() {
  const posts = useMemo(() => {
    const step = 1.2
    const out: Array<[number, number]> = []
    for (const [cx, cz, w, d] of FENCES) {
      const x0 = cx - w / 2
      const x1 = cx + w / 2
      const z0 = cz - d / 2
      const z1 = cz + d / 2
      for (let x = x0; x <= x1 + 0.001; x += step) {
        out.push([x, z0])
        out.push([x, z1])
      }
      for (let z = z0 + step; z <= z1 - 0.001; z += step) {
        out.push([x0, z])
        out.push([x1, z])
      }
    }
    return out
  }, [])

  const ref = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])

  useMemo(() => {
    if (!ref.current) return
    posts.forEach(([x, z], i) => {
      dummy.position.set(x, 0.55, z)
      dummy.updateMatrix()
      ref.current!.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [posts, dummy])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, posts.length]} castShadow>
      <boxGeometry args={[0.1, 1.1, 0.1]} />
      <meshStandardMaterial color="#8a6a48" />
    </instancedMesh>
  )
}
