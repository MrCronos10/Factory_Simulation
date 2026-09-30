import { FACTORY } from './factoryLayout'

/** Yard around the factory: grass, road, and the outdoor loading apron. */
export default function FactoryGround() {
  const [gx, gz] = FACTORY.size
  const [bx, bz] = FACTORY.buildingSize
  return (
    <group>
      {/* yard */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[gx, gz]} />
        <meshStandardMaterial color={FACTORY.yardColor} />
      </mesh>
      {/* concrete apron under building */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[bx + 6, bz + 6]} />
        <meshStandardMaterial color="#a09a90" />
      </mesh>
      {/* main access road (front) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, bz / 2 + 6]} receiveShadow>
        <planeGeometry args={[gx, 4]} />
        <meshStandardMaterial color={FACTORY.roadColor} />
      </mesh>
      {/* truck loading zone in front of storage */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[FACTORY.warehouseX - 4, 0.03, bz / 2 + 3]} receiveShadow>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial color="#5f513c" />
      </mesh>
      {/* painted stripes on the apron in front of receiving */}
      {[-2, 0, 2].map((dx) => (
        <mesh
          key={dx}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-bx / 2 - 3 + dx, 0.04, bz / 2 + 3]}
          receiveShadow
        >
          <planeGeometry args={[0.3, 2]} />
          <meshStandardMaterial color="#f2d34a" />
        </mesh>
      ))}
    </group>
  )
}
