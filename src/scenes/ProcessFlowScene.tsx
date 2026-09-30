import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { MathUtils } from 'three'

import { PROCESS_STEPS, type ProcessStep } from '../data/processData'
import { layoutSteps } from './process/processLayout'
import ProcessCard from './process/ProcessCard'
import FlowArrow from './process/FlowArrow'

type Props = {
  selectedId: string | null
  onSelect: (step: ProcessStep) => void
}

/** Educational 3D flow of the manure-to-fertilizer process. */
export default function ProcessFlowScene({ selectedId, onSelect }: Props) {
  const laid = useMemo(() => layoutSteps(PROCESS_STEPS), [])

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 12, 22], fov: 45 }}>
      <color attach="background" args={['#050a10']} />
      <fog attach="fog" args={['#050a10', 30, 70]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[10, 15, 10]} intensity={0.8} castShadow />
      <hemisphereLight args={['#4a7c8a', '#0a1a10', 0.4]} />

      <Suspense fallback={null}>
        {/* soft grid floor */}
        <Grid
          position={[0, 0, 0]}
          args={[80, 80]}
          cellSize={1}
          cellThickness={0.6}
          cellColor="#1a3a2a"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#2d7a3a"
          fadeDistance={45}
          fadeStrength={1.5}
          infiniteGrid
        />

        {/* Flow arrows between successive cards */}
        {laid.slice(0, -1).map((entry, i) => (
          <FlowArrow
            key={`arrow-${entry.step.id}`}
            from={entry.pos}
            to={laid[i + 1].pos}
            offset={i * 0.12}
          />
        ))}

        {/* Cards */}
        {laid.map(({ step, pos }, i) => (
          <ProcessCard
            key={step.id}
            step={step}
            index={i}
            position={pos}
            selected={selectedId === step.id}
            onSelect={() => onSelect(step)}
          />
        ))}
      </Suspense>

      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.7} luminanceSmoothing={0.25} mipmapBlur />
      </EffectComposer>

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        autoRotate
        autoRotateSpeed={0.35}
        minDistance={10}
        maxDistance={60}
        maxPolarAngle={MathUtils.degToRad(78)}
        target={[0, 1.5, 0]}
      />
    </Canvas>
  )
}
