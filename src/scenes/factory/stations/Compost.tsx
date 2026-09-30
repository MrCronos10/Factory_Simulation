import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'

type Props = { active: boolean; fill: number }

/**
 * Composting bay: three elongated windrows and a straddling turning machine
 * that walks slowly along the row when active.
 */
export default function Compost({ active, fill }: Props) {
  const turner = useRef<Group>(null)
  const drum = useRef<Mesh>(null)
  useFrame((state, dt) => {
    if (!turner.current) return
    if (active) {
      const t = state.clock.elapsedTime * 0.4
      turner.current.position.x = Math.sin(t) * 1.6
      if (drum.current) drum.current.rotation.x += dt * 4
    }
  })
  const pileH = 0.4 + Math.min(1, fill) * 0.9
  return (
    <group>
      {/* concrete pad */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.1, 4.6]} />
        <meshStandardMaterial color="#8a8a86" />
      </mesh>
      {/* three windrows */}
      {[-1.4, 0, 1.4].map((z) => (
        <mesh key={z} position={[0, pileH / 2 + 0.1, z]} castShadow>
          <boxGeometry args={[3.6, pileH, 0.7]} />
          <meshStandardMaterial color="#4d3320" />
        </mesh>
      ))}
      {/* turning machine spans the middle windrow */}
      <group ref={turner} position={[0, 1, 0]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[1.4, 0.6, 2.5]} />
          <meshStandardMaterial color="#c9622a" />
        </mesh>
        <mesh ref={drum} position={[0, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 2.2, 10]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* wheels */}
        {[-1, 1].map((sx) =>
          [-1, 1].map((sz) => (
            <mesh key={`${sx}${sz}`} position={[sx * 0.6, -0.3, sz * 1.05]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 0.2, 10]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
          )),
        )}
      </group>
      {/* faint steam when active */}
      {active && (
        <mesh position={[0, 2.4, 0]}>
          <sphereGeometry args={[0.8, 12, 12]} />
          <meshStandardMaterial color="#e0e6ec" transparent opacity={0.12} emissive="#ffffff" emissiveIntensity={0.05} />
        </mesh>
      )}
    </group>
  )
}
