import { useState, type ReactNode } from 'react'
import { Html } from '@react-three/drei'
import type { StationDef } from '../../game/factoryStations'
import type { StationState } from '../../game/gameTypes'

type Props = {
  def: StationDef
  state: StationState
  selected: boolean
  onSelect: () => void
  children: ReactNode
}

/**
 * Wraps a station's visual with a hover halo, floating label and click handler.
 * Keeps interaction wiring out of individual station components.
 */
export default function StationHost({ def, state, selected, onSelect, children }: Props) {
  const [hovered, setHovered] = useState(false)
  const active = state.status === 'running'
  const glow = hovered || selected
    ? '#f2d97a'
    : active
      ? '#5aa15a'
      : '#334455'

  return (
    <group
      position={[def.x, 0, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
    >
      {/* floor pad */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[4.4, 0.05, 5]} />
        <meshStandardMaterial color="#6d6d6d" />
      </mesh>
      {/* status glow ring */}
      <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.4, 2.7, 24]} />
        <meshStandardMaterial
          color={glow}
          emissive={glow}
          emissiveIntensity={hovered || selected ? 1.4 : active ? 0.6 : 0.15}
          transparent
          opacity={0.8}
        />
      </mesh>

      {children}

      {(hovered || selected) && (
        <Html position={[0, 5.4, 0]} center distanceFactor={12}>
          <div className="px-2 py-1 rounded bg-black/80 text-white text-[11px] border border-white/10 whitespace-nowrap">
            {def.label}
          </div>
        </Html>
      )}
    </group>
  )
}
