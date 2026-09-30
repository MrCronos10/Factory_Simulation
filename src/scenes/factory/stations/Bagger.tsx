import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

type Props = { active: boolean }

/**
 * Bagging machine: a nozzle drops a bag onto a small conveyor.
 * The bag fills and slides off in a repeating cycle when active.
 */
export default function Bagger({ active }: Props) {
  const bag = useRef<Group>(null)
  const t = useRef(0)
  useFrame((_, dt) => {
    if (!bag.current) return
    if (!active) return
    t.current += dt
    // 3-second cycle: 0..1 fill, 1..2 seal, 2..3 slide away
    const phase = t.current % 3
    let x = 0
    let scaleY = 0.1
    if (phase < 1) {
      scaleY = 0.1 + phase * 0.5
    } else if (phase < 2) {
      scaleY = 0.6
    } else {
      scaleY = 0.6
      x = (phase - 2) * 2.2
    }
    bag.current.position.x = x
    bag.current.scale.y = scaleY
  })
  return (
    <group>
      {/* frame */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[1.4, 3, 1.2]} />
        <meshStandardMaterial color="#4a5058" />
      </mesh>
      {/* nozzle */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.15, 0.6, 12]} />
        <meshStandardMaterial color="#c9a13a" emissive={active ? '#3a2a00' : '#000'} />
      </mesh>
      {/* small conveyor */}
      <mesh position={[1, 0.55, 0]} castShadow>
        <boxGeometry args={[2.4, 0.15, 0.8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* bag (animated) */}
      <group ref={bag} position={[0, 0.75, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 1.0, 0.4]} />
          <meshStandardMaterial color="#e2d6a8" />
        </mesh>
        <mesh position={[0, 0.05, 0.21]}>
          <planeGeometry args={[0.4, 0.6]} />
          <meshStandardMaterial color="#2d7a3a" />
        </mesh>
      </group>
    </group>
  )
}
