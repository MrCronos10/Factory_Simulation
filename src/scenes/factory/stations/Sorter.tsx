import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import Conveyor from './Conveyor'

type Props = { active: boolean }

/**
 * Vibrating screen — used for pre-processing, screening and final screening.
 * The screen deck oscillates vertically when active.
 */
export default function Sorter({ active }: Props) {
  const deck = useRef<Group>(null)
  useFrame((state) => {
    if (deck.current && active) {
      deck.current.position.y = 1.1 + Math.sin(state.clock.elapsedTime * 18) * 0.04
    }
  })
  return (
    <group>
      {/* frame legs */}
      {[[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.55, z]} castShadow>
          <boxGeometry args={[0.15, 1.1, 0.15]} />
          <meshStandardMaterial color="#5c5c5c" />
        </mesh>
      ))}
      {/* screen deck (vibrates) */}
      <group ref={deck} position={[0, 1.1, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.2, 0.15, 1.8]} />
          <meshStandardMaterial color="#9aa3ad" metalness={0.4} roughness={0.5} />
        </mesh>
        {/* mesh grid on top */}
        <mesh position={[0, 0.09, 0]}>
          <boxGeometry args={[2.0, 0.02, 1.6]} />
          <meshStandardMaterial color="#3a3a3a" wireframe />
        </mesh>
      </group>
      {/* reject chute */}
      <mesh position={[0, 0.6, 1.4]} rotation={[-0.6, 0, 0]} castShadow>
        <boxGeometry args={[1.6, 0.05, 0.8]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
      {/* reject pile */}
      <mesh position={[0, 0.15, 2.1]} castShadow>
        <coneGeometry args={[0.35, 0.3, 8]} />
        <meshStandardMaterial color="#4a3a2a" />
      </mesh>
      <Conveyor length={2.6} active={active} offset={[0, 0.5, -1.6]} />
    </group>
  )
}
