import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Wrench } from 'lucide-react'
import { UPGRADES } from '../game/upgrades'
import type { GameState, UpgradeId } from '../game/gameTypes'
import { formatMoney } from '../utils/formatNumber'

type Props = {
  state: GameState
  onBuy: (id: UpgradeId) => void
}

const CATEGORIES: Array<{ id: 'farm' | 'factory' | 'labor'; label: string }> = [
  { id: 'farm',    label: 'Farm' },
  { id: 'factory', label: 'Factory' },
  { id: 'labor',   label: 'Labor' },
]

/** Upgrade shop panel. Opens from a floating button. */
export default function UpgradePanel({ state, onBuy }: Props) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'farm' | 'factory' | 'labor'>('farm')

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="absolute top-20 left-4 z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-sm hover:bg-black/70"
      >
        <Wrench size={14} className="text-emerald-300" />
        Upgrades
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute top-32 left-4 z-10 w-80 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Upgrades</h3>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white" aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div className="mt-3 flex gap-1 bg-white/5 rounded-lg p-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setTab(c.id)}
                  className={`flex-1 px-2 py-1 rounded text-xs ${
                    tab === c.id ? 'bg-emerald-500 text-black' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="mt-3 max-h-[50vh] overflow-y-auto flex flex-col gap-2 pr-1">
              {UPGRADES.filter((u) => u.category === tab).map((u) => {
                const owned = state.purchasedUpgrades[u.id] ?? 0
                const maxed = u.max != null && owned >= u.max
                const cost = u.cost(state)
                const canAfford = state.money >= cost
                const disabled = maxed || !canAfford
                return (
                  <div key={u.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-white text-sm font-medium">{u.label}</div>
                        <div className="text-white/60 text-xs leading-snug">{u.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-300 text-xs font-semibold">{formatMoney(cost)}</div>
                        <div className="text-white/40 text-[10px]">
                          {u.max ? `${owned}/${u.max}` : `x${owned}`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onBuy(u.id)}
                      disabled={disabled}
                      className={`mt-2 w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-medium ${
                        disabled
                          ? 'bg-white/5 text-white/40 cursor-not-allowed'
                          : 'bg-emerald-500 text-black hover:bg-emerald-400'
                      }`}
                    >
                      <ShoppingCart size={12} />
                      {maxed ? 'Maxed out' : canAfford ? 'Buy' : 'Not enough $'}
                    </button>
                  </div>
                )
              })}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
