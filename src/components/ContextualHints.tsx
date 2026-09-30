import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb } from 'lucide-react'
import type { GameState, SceneKey } from '../game/gameTypes'
import { translate, type Lang } from '../data/i18n'
import { TRACTOR_FUEL_PER_TRIP } from '../game/constants'

type Props = { state: GameState; scene: SceneKey; language: Lang }

/** Bottom-left contextual hint chip. Chooses one hint appropriate to the scene. */
export default function ContextualHints({ state, scene, language }: Props) {
  const t = (k: string) => translate(language, k)
  let hintKey: string | null = null
  if (scene === 'farm') {
    if (state.fuel < TRACTOR_FUEL_PER_TRIP) hintKey = 'hint.farm.refuel'
    else if (state.farmManure > 200 && state.tractor.phase === 'idle') hintKey = 'hint.farm.collect'
  } else if (scene === 'factory') {
    if (!state.factoryOperating && state.manure > 0) hintKey = 'hint.factory.start'
    else if (state.fertilizer > 100) hintKey = 'hint.factory.sell'
  } else if (scene === 'process') {
    hintKey = 'hint.process.learn'
  }

  return (
    <AnimatePresence>
      {hintKey && (
        <motion.div
          key={hintKey}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="absolute bottom-4 left-4 z-10 max-w-[calc(100%-2rem)] flex items-center gap-2 px-3 py-2 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-100 text-xs backdrop-blur-md"
        >
          <Lightbulb size={13} />
          {t(hintKey)}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
