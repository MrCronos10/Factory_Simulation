import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

/** Small shared conveyor belt with a scrolling stripe when active. */
export default function Conveyor({
  length = 3,
  width = 0.7,
  active = false,
  offset = [0, 0.35, 0] as [number, number, number],
}) {
  const stripe = useRef<Mesh>(null)
  useFrame((_, dt) => {
    if (stripe.current && active) {
      stripe.current.position.x -= dt * 0.9
      if (stripe.current.position.x < -length / 2) stripe.current.position.x += length
    }
  })
  return (
    <group position={offset}>
      {/* belt body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[length, 0.15, width]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* rollers */}
      <mesh position={[-length / 2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, width, 12]} />
        <meshStandardMaterial color="#666" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[length / 2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, width, 12]} />
        <meshStandardMaterial color="#666" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* moving stripe (only visible when active) */}
      {active && (
        <mesh ref={stripe} position={[0, 0.09, 0]}>
          <boxGeometry args={[0.4, 0.02, width * 0.7]} />
          <meshStandardMaterial color="#9c7a3a" emissive="#5a3a10" emissiveIntensity={0.3} />
        </mesh>
      )}
    </group>
  )
}
