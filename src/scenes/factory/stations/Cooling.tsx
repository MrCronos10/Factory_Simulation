import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import Conveyor from './Conveyor'

type Props = { active: boolean }

/** Cooling conveyor with two overhead fans. */
export default function Cooling({ active }: Props) {
  const fanA = useRef<Mesh>(null)
  const fanB = useRef<Mesh>(null)
  useFrame((_, dt) => {
    if (active) {
      if (fanA.current) fanA.current.rotation.z += dt * 12
      if (fanB.current) fanB.current.rotation.z += dt * 12
    }
  })
  const Fan = ({ ref: fanRef, x }: { ref: React.RefObject<Mesh | null>; x: number }) => (
    <group position={[x, 2.4, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.2, 16]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      <mesh ref={fanRef} position={[0, 0.12, 0]}>
        <boxGeometry args={[1.0, 0.05, 0.08]} />
        <meshStandardMaterial color="#8fb0c9" />
      </mesh>
    </group>
  )
  return (
    <group>
      <Conveyor length={3.4} active={active} offset={[0, 0.7, 0]} width={1.4} />
      {/* legs */}
      {[[-1.6, -0.7], [1.6, -0.7], [-1.6, 0.7], [1.6, 0.7]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.4, z]} castShadow>
          <boxGeometry args={[0.12, 0.8, 0.12]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
      ))}
      {/* posts holding fans */}
      {[-1, 1].map((x) => (
        <mesh key={x} position={[x, 1.6, -0.9]} castShadow>
          <boxGeometry args={[0.1, 2.0, 0.1]} />
          <meshStandardMaterial color="#5a5a5a" />
        </mesh>
      ))}
      <Fan ref={fanA} x={-1} />
      <Fan ref={fanB} x={1} />
    </group>
  )
}
