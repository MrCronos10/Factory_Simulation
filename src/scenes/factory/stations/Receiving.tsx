import Conveyor from './Conveyor'
import { clamp } from '../../../utils/calculations'

type Props = { active: boolean; fill: number }

/** Receiving pit + manure pile + outbound conveyor into pre-processing. */
export default function Receiving({ active, fill }: Props) {
  const pileH = 0.4 + clamp(fill, 0, 1) * 1.6
  return (
    <group>
      {/* Receiving pit walls */}
      <mesh position={[-1, 0.6, 0]} castShadow>
        <boxGeometry args={[0.2, 1.2, 3]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
      <mesh position={[1.4, 0.6, 0]} castShadow>
        <boxGeometry args={[0.2, 1.2, 3]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
      <mesh position={[0.2, 0.6, -1.5]} castShadow>
        <boxGeometry args={[2.6, 1.2, 0.2]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
      {/* Manure pile */}
      <mesh position={[0.2, pileH / 2 + 0.1, 0]} castShadow>
        <coneGeometry args={[0.9, pileH, 12]} />
        <meshStandardMaterial color="#6a4622" />
      </mesh>
      {/* Loader arm marker */}
      <mesh position={[-1.7, 1.4, -0.9]} castShadow>
        <boxGeometry args={[0.15, 2.6, 0.15]} />
        <meshStandardMaterial color="#c9a13a" />
      </mesh>
      {/* Outbound conveyor */}
      <Conveyor length={2.5} active={active} offset={[1.7, 0.45, 0]} />
    </group>
  )
}
