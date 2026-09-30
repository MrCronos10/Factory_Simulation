import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { SceneKey } from '../game/gameTypes'
import type { Lang } from '../data/i18n'
import { translate } from '../data/i18n'

type Props = {
  active: boolean
  scene: SceneKey
  language: Lang
  onSceneChange: (s: SceneKey) => void
  onCancel: () => void
  intervalMs?: number
}

const ORDER: SceneKey[] = ['farm', 'factory', 'process']

/** Cycles through scenes on a timer. Renders a tiny "tour playing" chip. */
export default function TourController({
  active, scene, language, onSceneChange, onCancel, intervalMs = 12_000,
}: Props) {
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => {
      const i = ORDER.indexOf(scene)
      const next = ORDER[(i + 1) % ORDER.length]
      onSceneChange(next)
    }, intervalMs)
    return () => clearInterval(id)
  }, [active, scene, onSceneChange, intervalMs])

  if (!active) return null
  const t = (k: string) => translate(language, k)
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-100 text-xs backdrop-blur-md"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
      </span>
      {t('tour.playing')}
      <button
        onClick={onCancel}
        className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 hover:bg-black/60"
      >
        <X size={11} /> {t('tour.cancel')}
      </button>
    </motion.div>
  )
}
