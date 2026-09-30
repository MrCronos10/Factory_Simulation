import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Group } from 'three'
import type { ProcessStep } from '../../data/processData'
import ProcessIcon from './ProcessIcon'

type Props = {
  step: ProcessStep
  position: [number, number, number]
  index: number
  selected: boolean
  onSelect: () => void
}

/**
 * 3D card for a process step. Gently bobs, glows on hover/selection, and
 * hosts an HTML overlay for icon + text so text stays crisp.
 */
export default function ProcessCard({ step, position, index, selected, onSelect }: Props) {
  const group = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  useFrame((s) => {
    if (!group.current) return
    const t = s.clock.elapsedTime + index * 0.4
    group.current.position.y = position[1] + Math.sin(t * 0.6) * 0.1
  })
  const glow = hovered || selected

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
    >
      {/* card body — a thin rounded slab */}
      <mesh castShadow>
        <boxGeometry args={[4.2, 2.4, 0.2]} />
        <meshStandardMaterial
          color={glow ? '#1a2e2a' : '#0f1a1a'}
          emissive={glow ? '#3aa15a' : '#0a1e14'}
          emissiveIntensity={glow ? 0.6 : 0.2}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>
      {/* accent bar */}
      <mesh position={[0, 1.15, 0.11]}>
        <planeGeometry args={[4.2, 0.1]} />
        <meshStandardMaterial color={glow ? '#5aa15a' : '#2d7a3a'} emissive="#2d7a3a" emissiveIntensity={0.7} />
      </mesh>

      <Html
        position={[0, 0, 0.12]}
        transform
        distanceFactor={5}
        style={{ pointerEvents: 'none' }}
      >
        <div className="w-[280px] px-3 py-2 text-white select-none">
          <div className="flex items-center gap-2">
            <div className="text-[10px] uppercase tracking-widest text-emerald-300/80">
              Step {index + 1}
            </div>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-200">
              <ProcessIcon name={step.icon} size={18} />
            </div>
            <div className="text-base font-semibold leading-tight">{step.label}</div>
          </div>
          <p className="mt-1 text-[11px] text-white/70 leading-snug">{step.shortDesc}</p>
          <div className="mt-1.5 text-[10px] text-white/60 flex justify-between gap-2">
            <span className="truncate"><span className="text-white/40">In:</span> {step.input}</span>
            <span className="truncate text-right"><span className="text-white/40">Out:</span> {step.output}</span>
          </div>
        </div>
      </Html>
    </group>
  )
}
