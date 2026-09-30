import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

type Props = { active: boolean }

/** Twin-shaft mixer with two hoppers feeding in from above. */
export default function Mixer({ active }: Props) {
  const shaftA = useRef<Mesh>(null)
  const shaftB = useRef<Mesh>(null)
  useFrame((_, dt) => {
    if (active) {
      if (shaftA.current) shaftA.current.rotation.z += dt * 3
      if (shaftB.current) shaftB.current.rotation.z -= dt * 3
    }
  })
  return (
    <group>
      {/* trough */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[2.6, 0.6, 1.4]} />
        <meshStandardMaterial color="#4a5058" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* two shafts with paddles (simplified as thick cylinders) */}
      <mesh ref={shaftA} position={[0, 1.2, -0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 2.4, 8]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      <mesh ref={shaftB} position={[0, 1.2, 0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 2.4, 8]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      {/* hoppers */}
      {[-0.5, 0.5].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 2.4, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.15, 0.9, 10]} />
            <meshStandardMaterial color={i === 0 ? '#6a4a2a' : '#3a5a7a'} />
          </mesh>
          <mesh position={[x, 3.2, 0]} castShadow>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshStandardMaterial color={i === 0 ? '#8a6a3a' : '#4a7a9a'} />
          </mesh>
        </group>
      ))}
      {/* legs */}
      {[[-1.1, -0.6], [1.1, -0.6], [-1.1, 0.6], [1.1, 0.6]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.5, z]} castShadow>
          <boxGeometry args={[0.15, 1, 0.15]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
      ))}
    </group>
  )
}
