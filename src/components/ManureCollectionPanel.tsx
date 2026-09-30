import { motion, AnimatePresence } from 'framer-motion'
import { X, Truck } from 'lucide-react'
import { formatKg } from '../utils/formatNumber'
import type { GameState } from '../game/gameTypes'

type Props = {
  open: boolean
  state: Pick<GameState, 'farmManure' | 'farmManureCapacity' | 'tractor' | 'manure' | 'manureCapacity'>
  onCollect: () => void
  onClose: () => void
}

/**
 * Interaction panel for the manure collection area.
 * Shows current pile, tractor capacity, and dispatches the collect action.
 */
export default function ManureCollectionPanel({ open, state, onCollect, onClose }: Props) {
  const { farmManure, farmManureCapacity, tractor, manure, manureCapacity } = state
  const busy = tractor.phase !== 'idle'
  const canCollect = !busy && farmManure > 0 && manure < manureCapacity

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-24 z-10 w-96 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-5 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-emerald-300/80">Manure Collection</div>
              <h3 className="text-white font-semibold">Load Tractor & Transport</h3>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white" aria-label="Close">
              <X size={16} />
            </button>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/80">
            <Row label="Available manure" value={`${formatKg(farmManure)} / ${formatKg(farmManureCapacity)}`} />
            <Row label="Tractor capacity" value={formatKg(tractor.capacity)} />
            <Row label="Player inventory" value={`${formatKg(manure)} / ${formatKg(manureCapacity)}`} />
            <Row label="Transport status" value={tractor.phase} />
          </dl>

          <button
            onClick={onCollect}
            disabled={!canCollect}
            className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              canCollect
                ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
          >
            <Truck size={16} />
            {busy ? 'Tractor in transit…' : 'Collect Manure'}
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-white/50">{label}</dt>
      <dd className="capitalize">{value}</dd>
    </div>
  )
}
