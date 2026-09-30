import { useMemo, useRef, useState } from 'react'
import { Object3D, Color, InstancedMesh } from 'three'
import { Html } from '@react-three/drei'

const BODY_COLOR = '#e2a597'
const HOVER_COLOR = '#ffd97a'

/** Herd of pigs (single instanced box body — pigs are stubby). */
export default function Pigs({ positions }: { positions: Array<[number, number]> }) {
  const ref = useRef<InstancedMesh>(null)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const base = useMemo(() => new Color(BODY_COLOR), [])
  const hi = useMemo(() => new Color(HOVER_COLOR), [])

  useMemo(() => {
    if (!ref.current) return
    positions.forEach(([x, z], i) => {
      dummy.position.set(x, 0.35, z)
      dummy.rotation.set(0, ((x * 3.7 + z * 5.3) % 1) * Math.PI * 2, 0)
      dummy.updateMatrix()
      ref.current!.setMatrixAt(i, dummy.matrix)
      ref.current!.setColorAt(i, base)
    })
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  }, [positions, dummy, base])

  const setColors = (idx: number | null) => {
    if (!ref.current) return
    positions.forEach((_, i) => ref.current!.setColorAt(i, i === idx ? hi : base))
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  }

  const hoverPos = hoverIdx != null ? positions[hoverIdx] : null

  return (
    <group
      onPointerMove={(e) => {
        if (e.instanceId == null) return
        e.stopPropagation()
        if (e.instanceId !== hoverIdx) { setHoverIdx(e.instanceId); setColors(e.instanceId) }
      }}
      onPointerOut={() => { setHoverIdx(null); setColors(null) }}
    >
      <instancedMesh ref={ref} args={[undefined, undefined, positions.length]} castShadow>
        <boxGeometry args={[1.1, 0.55, 0.6]} />
        <meshStandardMaterial />
      </instancedMesh>
      {hoverPos && (
        <Html position={[hoverPos[0], 1.4, hoverPos[1]]} center distanceFactor={10}>
          <div className="px-2 py-1 rounded bg-black/70 text-white text-[10px] border border-white/10">Pig</div>
        </Html>
      )}
    </group>
  )
}
