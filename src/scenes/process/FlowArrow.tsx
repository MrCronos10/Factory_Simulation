import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { CatmullRomCurve3, Vector3 } from 'three'

type Props = {
  from: [number, number, number]
  to: [number, number, number]
  /** Particles per arrow segment. */
  particles?: number
  offset?: number
}

/**
 * A glowing tube connecting two cards with small particles flowing along it.
 * Path bends slightly outward to avoid crossing card faces.
 */
export default function FlowArrow({ from, to, particles = 4, offset = 0 }: Props) {
  const curve = useMemo(() => {
    const a = new Vector3(...from)
    const b = new Vector3(...to)
    const mid = a.clone().add(b).multiplyScalar(0.5)
    // lift the mid-point slightly for a subtle arc
    mid.y += 0.4
    return new CatmullRomCurve3([a, mid, b])
  }, [from, to])

  const tube = useMemo(() => curve, [curve])
  const points = useMemo(() => tube.getPoints(24), [tube])
  const positions = useMemo(() => {
    const arr = new Float32Array(points.length * 3)
    points.forEach((p, i) => {
      arr[i * 3] = p.x
      arr[i * 3 + 1] = p.y
      arr[i * 3 + 2] = p.z
    })
    return arr
  }, [points])

  const dots = useRef<Array<Mesh | null>>([])
  useFrame((s) => {
    const t = (s.clock.elapsedTime * 0.35 + offset) % 1
    for (let i = 0; i < particles; i++) {
      const local = (t + i / particles) % 1
      const p = curve.getPointAt(local)
      const m = dots.current[i]
      if (m) m.position.set(p.x, p.y, p.z)
    }
  })

  return (
    <group>
      {/* baseline glow line */}
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#2d7a3a" transparent opacity={0.45} />
      </line>
      {/* particles */}
      {Array.from({ length: particles }).map((_, i) => (
        <mesh key={i} ref={(el) => { dots.current[i] = el }}>
          <sphereGeometry args={[0.09, 10, 10]} />
          <meshStandardMaterial
            color="#a4f0b8"
            emissive="#4aa15a"
            emissiveIntensity={1.8}
          />
        </mesh>
      ))}
    </group>
  )
}
