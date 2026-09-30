import { useState } from 'react'
import { Html } from '@react-three/drei'

type Props = {
  position: [number, number]
  size: [number, number]
  color?: string
  label: string
}

/** A simple barn: box body + prism roof, with a floating hover label. */
export default function Barn({ position, size, color = '#a1442d', label }: Props) {
  const [hovered, setHovered] = useState(false)
  const [w, d] = size
  const bodyH = 3.2
  const roofH = 1.6
  return (
    <group
      position={[position[0], 0, position[1]]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
    >
      {/* body */}
      <mesh position={[0, bodyH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, bodyH, d]} />
        <meshStandardMaterial color={hovered ? '#c25a3f' : color} />
      </mesh>
      {/* roof — a triangular prism approximated with a rotated box */}
      <mesh position={[0, bodyH + roofH / 2, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[w * 0.72, w * 0.72, d]} />
        <meshStandardMaterial color="#3a2a20" />
      </mesh>
      {/* door */}
      <mesh position={[0, 1, d / 2 + 0.01]}>
        <planeGeometry args={[Math.min(2, w * 0.35), 2]} />
        <meshStandardMaterial color="#2a1e18" />
      </mesh>

      {hovered && (
        <Html position={[0, bodyH + roofH + 1, 0]} center distanceFactor={10}>
          <div className="px-2 py-1 rounded-md bg-black/70 text-white text-xs whitespace-nowrap border border-white/10">
            {label}
          </div>
        </Html>
      )}
    </group>
  )
}
