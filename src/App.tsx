import { Suspense, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useSceneNavigation } from './hooks/useSceneNavigation'
import { useGameSimulation } from './hooks/useGameSimulation'
import UIOverlay from './components/UIOverlay'
import TopNavigation from './components/TopNavigation'
import GameHUD from './components/GameHUD'
import InfoPanel from './components/InfoPanel'
import StationInfoPanel from './components/StationInfoPanel'
import ManureCollectionPanel from './components/ManureCollectionPanel'
import FactoryControls from './components/FactoryControls'
import UpgradePanel from './components/UpgradePanel'
import SellPanel from './components/SellPanel'
import Notifications from './components/Notifications'
import LoadingScreen from './components/LoadingScreen'
import SceneErrorBoundary from './components/SceneErrorBoundary'
import ContextualHints from './components/ContextualHints'
import TourController from './components/TourController'
import ViewpointSelector from './components/ViewpointSelector'
import FarmScene from './scenes/FarmScene'
import FactoryScene from './scenes/FactoryScene'
import ProcessFlowScene from './scenes/ProcessFlowScene'
import ProcessLearnPanel from './scenes/process/ProcessLearnPanel'
import { GraduationCap } from 'lucide-react'
import { gameStore } from './game/gameState'
import { collectAndDispatch } from './game/simulation'
import type { ProcessStep } from './data/processData'
import { TRACTOR_FUEL_PER_TRIP } from './game/constants'
import type { ViewpointKey } from './scenes/cameraViewpoints'
import { audioManager } from './audio/AudioManager'
import { translate } from './data/i18n'

export default function App() {
  const { scene, goTo } = useSceneNavigation()
  const state = useGameSimulation({ run: true })
  const [booting, setBooting] = useState(true)
  const [manurePanelOpen, setManurePanelOpen] = useState(false)
  const [learnMode, setLearnMode] = useState(false)
  const [processStep, setProcessStep] = useState<ProcessStep | null>(null)
  const [factoryViewpoint, setFactoryViewpoint] = useState<ViewpointKey>('factoryOverview')
  const [farmViewpoint] = useState<ViewpointKey>('farmOverview')

  useEffect(() => {
    if (gameStore.hasSave()) gameStore.load()
    const t = setTimeout(() => setBooting(false), 900)
    return () => clearTimeout(t)
  }, [])

  // Audio: pick ambient track based on scene.
  useEffect(() => {
    audioManager.setEnabled(state.soundEnabled)
    if (!state.soundEnabled) return
    if (scene === 'farm') audioManager.play('birds')
    else if (scene === 'factory') audioManager.play('factoryHum')
  }, [state.soundEnabled, scene])

  const t = (k: string) => translate(state.language, k)

  const openManurePanel = () => setManurePanelOpen(true)
  const closeManurePanel = () => setManurePanelOpen(false)

  const dispatchTractor = () => {
    const before = gameStore.getState()
    if (before.fuel < TRACTOR_FUEL_PER_TRIP) {
      gameStore.notify('Tractor needs fuel — refuel first.', 'warn'); return
    }
    const patch = collectAndDispatch(before)
    if (Object.keys(patch).length === 0) { gameStore.notify('Nothing to load right now.', 'warn'); return }
    gameStore.setState(patch)
    const load = (patch.tractor as typeof before.tractor).load
    gameStore.notify(`${Math.round(load)} kg manure collected.`, 'success')
    setManurePanelOpen(false)
  }

  const gateClick = () => {
    if (state.tractor.phase === 'idle' && state.farmManure > 0) dispatchTractor()
    else gameStore.notify('Tractor route: shed → pile → factory → shed.', 'info')
  }

  const toggleFactory = () => {
    gameStore.toggleFactory()
    gameStore.notify(state.factoryOperating ? 'Factory paused.' : 'Factory production started.', 'success')
  }

  const selectedStation = state.selectedStation ? state.stations[state.selectedStation] : null

  return (
    <div className="relative h-full w-full">
      <AnimatePresence>{booting && <LoadingScreen />}</AnimatePresence>

      <Suspense fallback={<LoadingScreen />}>
        <SceneErrorBoundary>
        <div className="absolute inset-0">
          {scene === 'farm' && (
            <FarmScene
              state={state}
              onManureClick={openManurePanel}
              onGateClick={gateClick}
              viewpoint={farmViewpoint}
              dayNight={state.dayNight}
            />
          )}
          {scene === 'factory' && (
            <FactoryScene
              stations={state.stations}
              selected={state.selectedStation}
              onSelect={(id) => gameStore.selectStation(id)}
              viewpoint={factoryViewpoint}
              dayNight={state.dayNight}
            />
          )}
          {scene === 'process' && (
            <ProcessFlowScene
              selectedId={processStep?.id ?? null}
              onSelect={(s) => setProcessStep(s)}
            />
          )}
        </div>
        </SceneErrorBoundary>
      </Suspense>

      <UIOverlay>
        <TopNavigation
          scene={scene}
          onChange={goTo}
          language={state.language}
          onLanguageChange={(l) => gameStore.setLanguage(l)}
          dayNight={state.dayNight}
          onDayNightToggle={() => gameStore.toggleDayNight()}
          soundEnabled={state.soundEnabled}
          onSoundToggle={() => gameStore.toggleSound()}
          tourActive={state.tourActive}
          onTourToggle={() => gameStore.setTourActive(!state.tourActive)}
          onSave={() => gameStore.save()}
          onLoad={() => gameStore.load()}
          onReset={() => gameStore.reset()}
        />

        <Notifications items={state.notifications} />

        <GameHUD state={state} language={state.language} onSpeedChange={(s) => gameStore.setSpeed(s)} />
        <ContextualHints state={state} scene={scene} language={state.language} />
        <InfoPanel
          title={t(`nav.${scene}`)}
          description={t('hint.process.learn')}
          open={scene === 'process' && !processStep}
        />

        <TourController
          active={state.tourActive}
          scene={scene}
          language={state.language}
          onSceneChange={goTo}
          onCancel={() => gameStore.setTourActive(false)}
        />

        <UpgradePanel state={state} onBuy={(id) => gameStore.buyUpgrade(id)} />

        {scene === 'farm' && (
          <ManureCollectionPanel
            open={manurePanelOpen}
            state={state}
            onCollect={dispatchTractor}
            onClose={closeManurePanel}
          />
        )}

        {scene === 'process' && (
          <>
            <button
              onClick={() => setLearnMode((v) => !v)}
              className={`absolute top-32 right-4 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-md transition-colors ${
                learnMode
                  ? 'bg-emerald-500/25 border-emerald-400/50 text-emerald-100'
                  : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
              }`}
            >
              <GraduationCap size={14} />
              {t('process.learnMode')} · {learnMode ? t('process.learnOn') : t('process.learnOff')}
            </button>
            <ProcessLearnPanel
              step={processStep}
              learnMode={learnMode}
              onClose={() => setProcessStep(null)}
            />
          </>
        )}

        {scene === 'factory' && (
          <>
            <FactoryControls running={state.factoryOperating} onToggle={toggleFactory} />
            <ViewpointSelector current={factoryViewpoint} onSelect={setFactoryViewpoint} language={state.language} />
            <StationInfoPanel
              station={selectedStation}
              batches={selectedStation?.id === 'fermentation' ? state.fermentationBatches : undefined}
              onClose={() => gameStore.selectStation(null)}
            />
            <SellPanel
              state={state}
              onSellAll={() => gameStore.sellFertilizer()}
              onSellHalf={() => gameStore.sellFertilizer(state.fertilizer / 2)}
              onRefuel={() => gameStore.refuelTractor()}
            />
          </>
        )}
      </UIOverlay>
    </div>
  )
}
