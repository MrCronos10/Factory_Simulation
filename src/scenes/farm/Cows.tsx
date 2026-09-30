import { useMemo, useRef, useState } from 'react'
import { Object3D, Color, InstancedMesh } from 'three'
import { Html } from '@react-three/drei'

type Props = { positions: Array<[number, number]> }

const BODY_COLOR = '#f2f2f2'
const HOVER_COLOR = '#ffd97a'

/**
 * Herd of cows rendered as two InstancedMeshes (body + head).
 * Individual instance highlight on hover via per-instance color.
 */
export default function Cows({ positions }: Props) {
  const bodyRef = useRef<InstancedMesh>(null)
  const headRef = useRef<InstancedMesh>(null)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const dummy = useMemo(() => new Object3D(), [])
  const bodyColor = useMemo(() => new Color(BODY_COLOR), [])
  const hoverColor = useMemo(() => new Color(HOVER_COLOR), [])

  // Set instance transforms once.
  useMemo(() => {
    if (!bodyRef.current || !headRef.current) return
    positions.forEach(([x, z], i) => {
      dummy.position.set(x, 0.6, z)
      dummy.rotation.set(0, ((x * 12.9898 + z * 78.233) % 1) * Math.PI * 2, 0)
      dummy.updateMatrix()
      bodyRef.current!.setMatrixAt(i, dummy.matrix)

      dummy.position.set(x + Math.cos(dummy.rotation.y) * 0.9, 0.9, z + Math.sin(dummy.rotation.y) * 0.9)
      dummy.updateMatrix()
      headRef.current!.setMatrixAt(i, dummy.matrix)

      bodyRef.current!.setColorAt(i, bodyColor)
      headRef.current!.setColorAt(i, bodyColor)
    })
    bodyRef.current.instanceMatrix.needsUpdate = true
    headRef.current.instanceMatrix.needsUpdate = true
    if (bodyRef.current.instanceColor) bodyRef.current.instanceColor.needsUpdate = true
    if (headRef.current.instanceColor) headRef.current.instanceColor.needsUpdate = true
  }, [positions, dummy, bodyColor])

  const setInstanceColor = (idx: number | null) => {
    if (!bodyRef.current) return
    positions.forEach((_, i) => {
      const c = i === idx ? hoverColor : bodyColor
      bodyRef.current!.setColorAt(i, c)
      headRef.current?.setColorAt(i, c)
    })
    if (bodyRef.current.instanceColor) bodyRef.current.instanceColor.needsUpdate = true
    if (headRef.current?.instanceColor) headRef.current.instanceColor.needsUpdate = true
  }

  const hoverPos = hoverIdx != null ? positions[hoverIdx] : null

  return (
    <group
      onPointerMove={(e) => {
        if (e.instanceId == null) return
        e.stopPropagation()
        if (e.instanceId !== hoverIdx) {
          setHoverIdx(e.instanceId)
          setInstanceColor(e.instanceId)
        }
      }}
      onPointerOut={() => { setHoverIdx(null); setInstanceColor(null) }}
    >
      <instancedMesh
        ref={bodyRef}
        args={[undefined, undefined, positions.length]}
        castShadow
      >
        <boxGeometry args={[1.6, 0.9, 0.8]} />
        <meshStandardMaterial />
      </instancedMesh>
      <instancedMesh
        ref={headRef}
        args={[undefined, undefined, positions.length]}
        castShadow
      >
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial />
      </instancedMesh>

      {hoverPos && (
        <Html position={[hoverPos[0], 2, hoverPos[1]]} center distanceFactor={10}>
          <div className="px-2 py-1 rounded bg-black/70 text-white text-[10px] border border-white/10">
            Dairy Cow
          </div>
        </Html>
      )}
    </group>
  )
}
