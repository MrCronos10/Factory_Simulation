import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

type Props = { active: boolean; hot?: boolean }

/**
 * Large inclined rotating drum used for both granulation (cool) and drying (hot).
 * When `hot`, the drum has a warm emissive tint + an exhaust stack.
 */
export default function Drum({ active, hot = false }: Props) {
  const drum = useRef<Mesh>(null)
  useFrame((_, dt) => {
    if (drum.current && active) drum.current.rotation.x += dt * 1.4
  })
  return (
    <group>
      {/* support cradles */}
      {[-1.4, 1.4].map((x) => (
        <mesh key={x} position={[x, 0.75, 0]} castShadow>
          <boxGeometry args={[0.35, 1.5, 1.8]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
      ))}
      {/* the drum itself, slightly inclined */}
      <mesh
        ref={drum}
        position={[0, 1.5, 0]}
        rotation={[0, 0, Math.PI / 2 + 0.08]}
        castShadow
      >
        <cylinderGeometry args={[0.9, 0.9, 3.6, 24]} />
        <meshStandardMaterial
          color={hot ? '#7a3a2a' : '#7a6a4a'}
          metalness={0.5}
          roughness={0.5}
          emissive={hot && active ? '#c25a2a' : '#000'}
          emissiveIntensity={hot && active ? 0.6 : 0}
        />
      </mesh>
      {/* drive gear */}
      <mesh position={[1.5, 1.5, -0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.25, 12]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* exhaust stack for dryer */}
      {hot && (
        <>
          <mesh position={[1.9, 3, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 2.6, 12]} />
            <meshStandardMaterial color="#3a3a3a" />
          </mesh>
          {active && (
            <mesh position={[1.9, 4.6, 0]}>
              <sphereGeometry args={[0.5, 12, 12]} />
              <meshStandardMaterial color="#d0d5da" transparent opacity={0.2} />
            </mesh>
          )}
        </>
      )}
    </group>
  )
}
