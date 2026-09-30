import { useState } from 'react'
import { Html } from '@react-three/drei'
import { LAYOUT } from './farmLayout'

type Props = { onClick: () => void }

/** Farm-side "exit" marker where the tractor departs to the factory. */
export default function FactoryGate({ onClick }: Props) {
  const [hovered, setHovered] = useState(false)
  const [x, z] = LAYOUT.factoryGate.pos
  return (
    <group
      position={[x, 0, z]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      {/* two gate posts and a sign */}
      <mesh position={[0, 1.5, -1.2]} castShadow>
        <boxGeometry args={[0.3, 3, 0.3]} />
        <meshStandardMaterial color="#4a3120" />
      </mesh>
      <mesh position={[0, 1.5, 1.2]} castShadow>
        <boxGeometry args={[0.3, 3, 0.3]} />
        <meshStandardMaterial color="#4a3120" />
      </mesh>
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[0.2, 0.5, 2.7]} />
        <meshStandardMaterial color={hovered ? '#3aa15a' : '#2d7a3a'} />
      </mesh>
      {hovered && (
        <Html position={[0, 4, 0]} center distanceFactor={10}>
          <div className="px-2 py-1 rounded bg-black/75 text-white text-[11px] border border-white/10 whitespace-nowrap">
            To Factory · Transport
          </div>
        </Html>
      )}
    </group>
  )
}
