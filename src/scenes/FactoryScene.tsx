import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { CameraControls, Sky, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

import FactoryGround from './factory/FactoryGround'
import FactoryBuilding from './factory/FactoryBuilding'
import ProductionLine from './factory/ProductionLine'
import type { GameState, StationId } from '../game/gameTypes'
import { VIEWPOINTS, type ViewpointKey } from './cameraViewpoints'

type Props = {
  stations: GameState['stations']
  selected: StationId | null
  onSelect: (id: StationId) => void
  viewpoint: ViewpointKey
  dayNight: 'day' | 'night'
}

/** Factory scene with named camera viewpoints and day/night lighting. */
export default function FactoryScene({ stations, selected, onSelect, viewpoint, dayNight }: Props) {
  const isDay = dayNight === 'day'
  return (
    <Canvas shadows camera={{ position: [0, 24, 44], fov: 45 }}>
      {isDay ? (
        <Sky sunPosition={[40, 40, 20]} />
      ) : (
        <>
          <color attach="background" args={['#050510']} />
          <Stars radius={120} depth={40} count={2500} factor={3} fade />
        </>
      )}

      <ambientLight intensity={isDay ? 0.6 : 0.15} />
      <directionalLight
        position={[30, 40, 20]}
        intensity={isDay ? 1.1 : 0.15}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <hemisphereLight args={[isDay ? '#ffffff' : '#3a5a80', '#222222', isDay ? 0.35 : 0.2]} />

      {/* Artificial factory lights at night */}
      {!isDay && (
        <>
          <pointLight position={[-30, 6, 6]} intensity={30} distance={22} color="#ffb265" />
          <pointLight position={[  0, 6, 6]} intensity={30} distance={22} color="#ffb265" />
          <pointLight position={[ 30, 6, 6]} intensity={30} distance={22} color="#ffb265" />
          <pointLight position={[  0, 12, 0]} intensity={20} distance={30} color="#a4d4ff" />
        </>
      )}

      <Suspense fallback={null}>
        <FactoryGround />
        <FactoryBuilding />
        <ProductionLine stations={stations} selected={selected} onSelect={onSelect} />
      </Suspense>

      <EffectComposer>
        <Bloom
          intensity={isDay ? 0.35 : 0.6}
          luminanceThreshold={isDay ? 0.85 : 0.4}
          luminanceSmoothing={0.2}
          mipmapBlur
        />
      </EffectComposer>

      <ViewpointControls viewpoint={viewpoint} />
    </Canvas>
  )
}

/** Bridges the `viewpoint` prop into an animated `CameraControls.setLookAt`. */
function ViewpointControls({ viewpoint }: { viewpoint: ViewpointKey }) {
  const ref = useRef<CameraControls>(null)
  useEffect(() => {
    if (!ref.current) return
    const v = VIEWPOINTS[viewpoint]
    ref.current.setLookAt(v[0], v[1], v[2], v[3], v[4], v[5], true)
  }, [viewpoint])
  return (
    <CameraControls
      ref={ref}
      smoothTime={0.7}
      minDistance={14}
      maxDistance={110}
      dollyToCursor={false}
    />
  )
}
