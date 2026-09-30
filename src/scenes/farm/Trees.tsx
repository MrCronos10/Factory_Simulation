import { useMemo, useRef } from 'react'
import { Object3D, InstancedMesh } from 'three'
import { TREE_CLUSTERS, scatter } from './farmLayout'

/**
 * Trees as two instanced meshes: trunks (cylinders) and foliage (cones).
 * Positions are precomputed from clusters and deterministic across renders.
 */
export default function Trees() {
  const positions = useMemo(() => {
    const all: Array<[number, number]> = []
    TREE_CLUSTERS.forEach((c, ci) => {
      all.push(...scatter(c.center, [c.radius * 2, c.radius * 2], c.count, ci + 1))
    })
    return all
  }, [])

  const trunkRef = useRef<InstancedMesh>(null)
  const foliageRef = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])

  useMemo(() => {
    if (!trunkRef.current || !foliageRef.current) return
    positions.forEach(([x, z], i) => {
      dummy.position.set(x, 1, z)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      trunkRef.current!.setMatrixAt(i, dummy.matrix)

      dummy.position.set(x, 3, z)
      const s = 0.9 + ((x * 3.1 + z * 7.7) % 1) * 0.6
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      foliageRef.current!.setMatrixAt(i, dummy.matrix)
    })
    trunkRef.current.instanceMatrix.needsUpdate = true
    foliageRef.current.instanceMatrix.needsUpdate = true
  }, [positions, dummy])

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, positions.length]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 2, 6]} />
        <meshStandardMaterial color="#5a3a22" />
      </instancedMesh>
      <instancedMesh ref={foliageRef} args={[undefined, undefined, positions.length]} castShadow>
        <coneGeometry args={[1.6, 3, 8]} />
        <meshStandardMaterial color="#2f5a2a" />
      </instancedMesh>
    </group>
  )
}
