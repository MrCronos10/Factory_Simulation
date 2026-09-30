import { LAYOUT, ROADS, FARM_SIZE } from './farmLayout'

/** Ground plane, fields, and dirt roads for the farm. */
export default function FarmGround() {
  return (
    <group>
      {/* Grass ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[FARM_SIZE, FARM_SIZE]} />
        <meshStandardMaterial color="#5a8f42" />
      </mesh>

      {/* Fields */}
      <Field {...LAYOUT.cornField} color="#c9a34a" />
      <Field {...LAYOUT.wheatField} color="#d9c469" />

      {/* Pond */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[LAYOUT.pond.pos[0], 0.02, LAYOUT.pond.pos[1]]}
        receiveShadow
      >
        <circleGeometry args={[Math.min(LAYOUT.pond.size[0], LAYOUT.pond.size[1]) / 2, 32]} />
        <meshStandardMaterial color="#3b6e8a" metalness={0.2} roughness={0.4} />
      </mesh>

      {/* Dirt roads */}
      {ROADS.map((r, i) => {
        const dx = r.to[0] - r.from[0]
        const dz = r.to[1] - r.from[1]
        const length = Math.hypot(dx, dz)
        const angle = Math.atan2(dz, dx)
        const cx = (r.from[0] + r.to[0]) / 2
        const cz = (r.from[1] + r.to[1]) / 2
        return (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, -angle]}
            position={[cx, 0.01, cz]}
            receiveShadow
          >
            <planeGeometry args={[length, r.width ?? 2]} />
            <meshStandardMaterial color="#8b6b47" />
          </mesh>
        )
      })}
    </group>
  )
}

function Field({ pos, size, color }: { pos: [number, number]; size: [number, number]; color: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[pos[0], 0.015, pos[1]]} receiveShadow>
      <planeGeometry args={[size[0], size[1]]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}
