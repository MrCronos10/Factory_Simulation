import { useMemo } from 'react'
import { clamp } from '../../../utils/calculations'

type Props = { fill: number; capacity: number }

/**
 * Finished-product storage. A grid of pallets appears based on `fill`.
 * Each pallet is a modest stack of bagged fertilizer.
 */
export default function Warehouse({ fill, capacity }: Props) {
  const ratio = clamp(fill / capacity, 0, 1)
  const totalPallets = 16 // 4x4 grid
  const shown = Math.round(ratio * totalPallets)
  const pallets = useMemo(() => {
    const out: Array<[number, number]> = []
    for (let i = 0; i < totalPallets; i++) {
      const gx = i % 4
      const gz = Math.floor(i / 4)
      out.push([(gx - 1.5) * 0.9, (gz - 1.5) * 1.1])
    }
    return out
  }, [])
  return (
    <group>
      {/* warehouse floor pad */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[4.4, 0.1, 5]} />
        <meshStandardMaterial color="#7a7a72" />
      </mesh>
      {pallets.slice(0, shown).map((p, i) => (
        <Pallet key={i} pos={p} />
      ))}
    </group>
  )
}

function Pallet({ pos }: { pos: [number, number] }) {
  return (
    <group position={[pos[0], 0, pos[1]]}>
      {/* pallet base */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.75, 0.1, 0.9]} />
        <meshStandardMaterial color="#8a6a3a" />
      </mesh>
      {/* stacked bags */}
      {[0, 1, 2].map((row) =>
        [-0.18, 0.18].map((offx, ci) => (
          <mesh
            key={`${row}${ci}`}
            position={[offx, 0.35 + row * 0.22, 0]}
            castShadow
          >
            <boxGeometry args={[0.32, 0.2, 0.7]} />
            <meshStandardMaterial color={row % 2 === 0 ? '#e2d6a8' : '#d0c294'} />
          </mesh>
        )),
      )}
    </group>
  )
}
