import { FACTORY } from './factoryLayout'

/**
 * Factory building shell: floor slab, side walls (with windows), back wall,
 * front wall (with a big roll-up door for receiving and a personnel door for
 * offices), and a pitched roof.
 * Interior remains open so the production line renders inside.
 */
export default function FactoryBuilding() {
  const [bx, bz] = FACTORY.buildingSize
  const h = FACTORY.buildingHeight
  const wallT = 0.4

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[bx, 0.1, bz]} />
        <meshStandardMaterial color={FACTORY.floorColor} />
      </mesh>

      {/* Back wall (long side, +z) */}
      <mesh position={[0, h / 2, -bz / 2]} castShadow receiveShadow>
        <boxGeometry args={[bx, h, wallT]} />
        <meshStandardMaterial color={FACTORY.wallColor} />
      </mesh>

      {/* Front wall with an opening near the receiving end.
          Compose from three segments to leave a big door opening. */}
      <mesh position={[-bx / 2 + 8, h / 2, bz / 2]} castShadow receiveShadow>
        <boxGeometry args={[16, h, wallT]} />
        <meshStandardMaterial color={FACTORY.wallColor} />
      </mesh>
      <mesh position={[6, h / 2, bz / 2]} castShadow receiveShadow>
        <boxGeometry args={[bx - 20, h, wallT]} />
        <meshStandardMaterial color={FACTORY.wallColor} />
      </mesh>
      {/* Header above roll-up door (short segment near receiving) */}
      <mesh position={[-bx / 2 + 20, h - 1, bz / 2]} castShadow>
        <boxGeometry args={[8, 2, wallT]} />
        <meshStandardMaterial color={FACTORY.wallColor} />
      </mesh>
      {/* Roll-up door */}
      <mesh position={[-bx / 2 + 20, (h - 2) / 2, bz / 2 + 0.01]}>
        <planeGeometry args={[8, h - 2]} />
        <meshStandardMaterial color="#2a3548" />
      </mesh>
      {/* Personnel door near center */}
      <mesh position={[6, 1.3, bz / 2 + 0.01]}>
        <planeGeometry args={[1.2, 2.6]} />
        <meshStandardMaterial color="#1e2430" />
      </mesh>

      {/* Side walls (short sides) */}
      <mesh position={[-bx / 2, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallT, h, bz]} />
        <meshStandardMaterial color={FACTORY.wallColor} />
      </mesh>
      <mesh position={[ bx / 2, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallT, h, bz]} />
        <meshStandardMaterial color={FACTORY.wallColor} />
      </mesh>

      {/* Windows: a strip of tinted panels along both long walls */}
      {[...Array(10)].map((_, i) => {
        const x = -bx / 2 + 6 + i * (bx - 12) / 9
        return (
          <group key={`w-${i}`}>
            <mesh position={[x, h - 2, -bz / 2 + 0.21]}>
              <planeGeometry args={[3, 1.6]} />
              <meshStandardMaterial color="#6a8fa5" emissive="#1a2a35" />
            </mesh>
          </group>
        )
      })}

      {/* Roof — flat with a slight pitch, modeled as an angled slab. */}
      <mesh position={[0, h + 0.6, 0]} rotation={[0.06, 0, 0]} castShadow>
        <boxGeometry args={[bx + 1, 0.5, bz + 1]} />
        <meshStandardMaterial color={FACTORY.roofColor} metalness={0.2} roughness={0.7} />
      </mesh>

      {/* Signage over the door */}
      <mesh position={[-bx / 2 + 20, h + 1.4, bz / 2 + 0.02]}>
        <planeGeometry args={[10, 1.2]} />
        <meshStandardMaterial color="#0f2018" emissive="#0a3020" />
      </mesh>
    </group>
  )
}
