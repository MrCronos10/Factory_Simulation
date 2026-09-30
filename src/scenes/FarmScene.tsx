import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { CameraControls, Sky, Stars } from '@react-three/drei'

import FarmGround from './farm/FarmGround'
import Barn from './farm/Barn'
import Cows from './farm/Cows'
import Pigs from './farm/Pigs'
import Trees from './farm/Trees'
import Fences from './farm/Fences'
import ManureCollectionArea from './farm/ManureCollectionArea'
import Tractor from './farm/Tractor'
import FactoryGate from './farm/FactoryGate'
import { LAYOUT, scatter } from './farm/farmLayout'
import type { GameState } from '../game/gameTypes'
import { VIEWPOINTS, type ViewpointKey } from './cameraViewpoints'

type Props = {
  state: Pick<GameState, 'animals' | 'farmManure' | 'farmManureCapacity' | 'tractor'>
  onManureClick: () => void
  onGateClick: () => void
  viewpoint: ViewpointKey
  dayNight: 'day' | 'night'
}

export default function FarmScene({ state, onManureClick, onGateClick, viewpoint, dayNight }: Props) {
  const cowPositions = useMemo(
    () => scatter(LAYOUT.cowBarn.pos, [LAYOUT.cowBarn.size[0] + 2, LAYOUT.cowBarn.size[1] + 6], state.animals.cow, 3),
    [state.animals.cow],
  )
  const pigPositions = useMemo(
    () => scatter(LAYOUT.pigShelter.pos, [LAYOUT.pigShelter.size[0] + 2, LAYOUT.pigShelter.size[1] + 4], state.animals.pig, 5),
    [state.animals.pig],
  )
  const isDay = dayNight === 'day'

  return (
    <Canvas shadows camera={{ position: [22, 22, 34], fov: 45 }}>
      {isDay ? (
        <Sky sunPosition={[40, 30, 20]} />
      ) : (
        <>
          <color attach="background" args={['#060612']} />
          <Stars radius={120} depth={40} count={3000} factor={3} fade />
        </>
      )}

      <ambientLight intensity={isDay ? 0.55 : 0.15} />
      <directionalLight
        position={[30, 40, 20]}
        intensity={isDay ? 1.3 : 0.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      {!isDay && (
        <>
          <pointLight position={[LAYOUT.cowBarn.pos[0], 5, LAYOUT.cowBarn.pos[1]]} intensity={25} distance={16} color="#ffb265" />
          <pointLight position={[LAYOUT.tractorShed.pos[0], 5, LAYOUT.tractorShed.pos[1]]} intensity={25} distance={14} color="#ffb265" />
          <pointLight position={[LAYOUT.manureArea.pos[0], 5, LAYOUT.manureArea.pos[1]]} intensity={20} distance={14} color="#a4d4ff" />
        </>
      )}

      <Suspense fallback={null}>
        <FarmGround />
        <Barn position={LAYOUT.cowBarn.pos}     size={LAYOUT.cowBarn.size}     color="#a1442d" label="Cow Barn" />
        <Barn position={LAYOUT.pigShelter.pos}  size={LAYOUT.pigShelter.size}  color="#b56a3a" label="Pig Shelter" />
        <Barn position={LAYOUT.chickenCoop.pos} size={LAYOUT.chickenCoop.size} color="#d9a04a" label="Chicken Coop" />
        <Barn position={LAYOUT.storageBarn.pos} size={LAYOUT.storageBarn.size} color="#8a5a3a" label="Storage Barn" />
        <Barn position={LAYOUT.tractorShed.pos} size={LAYOUT.tractorShed.size} color="#5a5a5a" label="Tractor Shed" />

        <Fences />
        <Trees />

        {cowPositions.length > 0 && <Cows positions={cowPositions} />}
        {pigPositions.length > 0 && <Pigs positions={pigPositions} />}

        <ManureCollectionArea
          amount={state.farmManure}
          capacity={state.farmManureCapacity}
          onClick={onManureClick}
        />
        <Tractor tractor={state.tractor} />
        <FactoryGate onClick={onGateClick} />
      </Suspense>

      <ViewpointControls viewpoint={viewpoint} />
    </Canvas>
  )
}

function ViewpointControls({ viewpoint }: { viewpoint: ViewpointKey }) {
  const ref = useRef<CameraControls>(null)
  useEffect(() => {
    if (!ref.current) return
    const v = VIEWPOINTS[viewpoint]
    ref.current.setLookAt(v[0], v[1], v[2], v[3], v[4], v[5], true)
  }, [viewpoint])
  return <CameraControls ref={ref} smoothTime={0.7} minDistance={12} maxDistance={80} />
}
