import { useMemo } from 'react'
import { Html } from '@react-three/drei'
import type { TractorState } from '../../game/gameTypes'
import { LAYOUT } from './farmLayout'
import GLBModel from '../models/GLBModel'

type Props = { tractor: TractorState }

/**
 * A simple tractor built from primitives. Its position is interpolated based
 * on the tractor's phase + progress so the player can *see* the transport loop.
 */
export default function Tractor({ tractor }: Props) {
  const shed: [number, number] = [LAYOUT.tractorShed.pos[0], LAYOUT.tractorShed.pos[1]]
  const manure: [number, number] = [LAYOUT.manureArea.pos[0], LAYOUT.manureArea.pos[1]]
  const factory: [number, number] = LAYOUT.factoryGate.pos

  const { pos, angle } = useMemo(() => {
    const { phase, progress } = tractor
    // Route: shed → manure → factory → shed
    let from = shed
    let to = shed
    switch (phase) {
      case 'idle':
        from = to = shed
        break
      case 'loading':
        from = to = manure
        break
      case 'transporting':
        from = manure
        to = factory
        break
      case 'unloading':
        from = to = factory
        break
      case 'returning':
        from = factory
        to = shed
        break
    }
    const x = from[0] + (to[0] - from[0]) * progress
    const z = from[1] + (to[1] - from[1]) * progress
    const dx = to[0] - from[0]
    const dz = to[1] - from[1]
    const a = dx === 0 && dz === 0 ? 0 : Math.atan2(dz, dx)
    return { pos: [x, z] as [number, number], angle: a }
    // rerun when tractor changes; shed/manure/factory are stable constants
  }, [tractor, shed, manure, factory])

  const loadRatio = tractor.load / tractor.capacity
  const bedColor = tractor.phase === 'transporting' || tractor.phase === 'unloading'
    ? '#6a4622'
    : '#3a2a20'

  const chassis = (
    <group>
      {/* cab */}
      <mesh position={[0.5, 0.9, 0]} castShadow>
        <boxGeometry args={[1, 1.1, 1.2]} />
        <meshStandardMaterial color="#2d7a3a" />
      </mesh>
      {/* hood / engine */}
      <mesh position={[1.4, 0.55, 0]} castShadow>
        <boxGeometry args={[0.9, 0.7, 1]} />
        <meshStandardMaterial color="#2d7a3a" />
      </mesh>
      {/* trailer bed */}
      <mesh position={[-1.1, 0.6, 0]} castShadow>
        <boxGeometry args={[1.6, 0.3, 1.2]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
      {/* wheels */}
      {[[1.4, 0.8], [1.4, -0.8], [-1.1, 0.8], [-1.1, -0.8]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.35, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.3, 12]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
    </group>
  )

  return (
    <group position={[pos[0], 0, pos[1]]} rotation={[0, -angle, 0]}>
      {/* Static chassis: GLB when available, else primitive. */}
      <GLBModel name="tractor" fitHeight={2} rotation={[0, Math.PI / 2, 0]} fallback={chassis} />

      {/* State-driven load pile (kept as primitive, sits on the trailer bed). */}
      {loadRatio > 0 && (
        <mesh position={[-1.1, 0.85, 0]} castShadow>
          <boxGeometry args={[1.4, 0.1 + loadRatio * 0.5, 1.0]} />
          <meshStandardMaterial color={bedColor} />
        </mesh>
      )}

      {tractor.phase !== 'idle' && (
        <Html position={[0, 2.4, 0]} center distanceFactor={10}>
          <div className="px-2 py-1 rounded bg-black/75 text-emerald-200 text-[10px] border border-white/10 whitespace-nowrap capitalize">
            {tractor.phase} · {Math.round(tractor.load)} kg
          </div>
        </Html>
      )}
    </group>
  )
}
