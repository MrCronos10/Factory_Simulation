import { useState } from 'react'
import { Html } from '@react-three/drei'
import { LAYOUT } from './farmLayout'
import { clamp } from '../../utils/calculations'

type Props = {
  amount: number
  capacity: number
  onClick: () => void
}

/**
 * Interactive manure pile. Pile scales with fill ratio.
 * Click to open the collection panel via the parent scene.
 */
export default function ManureCollectionArea({ amount, capacity, onClick }: Props) {
  const [hovered, setHovered] = useState(false)
  const [cx, cz] = LAYOUT.manureArea.pos
  const [w, d] = LAYOUT.manureArea.size
  const fill = clamp(amount / capacity, 0.05, 1)
  const pileH = 0.4 + fill * 1.6

  return (
    <group
      position={[cx, 0, cz]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      {/* concrete slab */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[w, 0.1, d]} />
        <meshStandardMaterial color="#8a8a8a" />
      </mesh>
      {/* low walls (3 sides) */}
      <mesh position={[0, 0.7, -d / 2 + 0.1]} castShadow>
        <boxGeometry args={[w, 1.2, 0.2]} />
        <meshStandardMaterial color="#6a6a6a" />
      </mesh>
      <mesh position={[-w / 2 + 0.1, 0.7, 0]} castShadow>
        <boxGeometry args={[0.2, 1.2, d]} />
        <meshStandardMaterial color="#6a6a6a" />
      </mesh>
      <mesh position={[ w / 2 - 0.1, 0.7, 0]} castShadow>
        <boxGeometry args={[0.2, 1.2, d]} />
        <meshStandardMaterial color="#6a6a6a" />
      </mesh>
      {/* the pile itself */}
      <mesh position={[0, pileH / 2 + 0.1, 0]} castShadow>
        <coneGeometry args={[Math.min(w, d) * 0.35, pileH, 12]} />
        <meshStandardMaterial color={hovered ? '#8a5a2a' : '#6a4622'} />
      </mesh>

      {hovered && (
        <Html position={[0, 3, 0]} center distanceFactor={10}>
          <div className="px-2 py-1 rounded bg-black/75 text-white text-[11px] border border-white/10 whitespace-nowrap">
            Manure Collection · {Math.round(amount)} / {capacity} kg
          </div>
        </Html>
      )}
    </group>
  )
}
