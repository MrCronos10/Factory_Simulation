import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

type Props = { fromX: number; toX: number; active: boolean }

/**
 * A connecting conveyor segment between two stations. A scrolling stripe moves
 * along it when either adjacent station is running, so the material path from
 * receiving to storage is visible without reading the UI.
 */
export default function LineConveyor({ fromX, toX, active }: Props) {
  const stripe = useRef<Mesh>(null)
  const { cx, length } = useMemo(() => ({ cx: (fromX + toX) / 2, length: Math.abs(toX - fromX) }), [fromX, toX])

  useFrame((_, dt) => {
    if (stripe.current && active) {
      stripe.current.position.x += dt * 1.2
      if (stripe.current.position.x > length / 2) stripe.current.position.x = -length / 2
    }
  })

  if (length <= 0.01) return null
  return (
    <group position={[cx, 0.25, 2.6]}>
      {/* belt */}
      <mesh receiveShadow>
        <boxGeometry args={[length, 0.12, 0.6]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>
      {/* side rails */}
      <mesh position={[0, 0.08, 0.32]}><boxGeometry args={[length, 0.08, 0.05]} /><meshStandardMaterial color="#555" /></mesh>
      <mesh position={[0, 0.08, -0.32]}><boxGeometry args={[length, 0.08, 0.05]} /><meshStandardMaterial color="#555" /></mesh>
      {/* scrolling material stripe */}
      {active && (
        <mesh ref={stripe} position={[0, 0.1, 0]}>
          <boxGeometry args={[0.5, 0.04, 0.45]} />
          <meshStandardMaterial color="#9c7a3a" emissive="#4a2f10" emissiveIntensity={0.3} />
        </mesh>
      )}
    </group>
  )
}
