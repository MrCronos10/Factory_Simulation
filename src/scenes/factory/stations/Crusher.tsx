import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import Conveyor from './Conveyor'

type Props = { active: boolean }

/** Boxy crusher with a rotating hammer-mill disk visible through a port. */
export default function Crusher({ active }: Props) {
  const hammer = useRef<Mesh>(null)
  useFrame((_, dt) => {
    if (hammer.current && active) hammer.current.rotation.z += dt * 10
  })
  return (
    <group>
      {/* main housing */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[2.2, 2.4, 1.8]} />
        <meshStandardMaterial color="#5a5f66" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* intake hopper */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.9, 0.5, 1.2, 12]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      {/* viewing port with spinning hammer disk */}
      <mesh position={[1.11, 1.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[0.35, 0.55, 24]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh ref={hammer} position={[1.15, 1.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.15]} />
        <meshStandardMaterial color="#c94a4a" emissive={active ? '#5a1a1a' : '#000'} />
      </mesh>
      <Conveyor length={2.6} active={active} offset={[0, 0.5, 1.5]} />
    </group>
  )
}
