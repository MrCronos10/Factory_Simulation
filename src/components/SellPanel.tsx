import { motion } from 'framer-motion'
import { DollarSign, Fuel } from 'lucide-react'
import type { GameState } from '../game/gameTypes'
import { formatKg, formatMoney } from '../utils/formatNumber'
import { fertilizerSellingPrice } from '../game/constants'

type Props = {
  state: Pick<GameState, 'fertilizer' | 'fertilizerCapacity' | 'fuel' | 'fuelTank'>
  onSellAll: () => void
  onSellHalf: () => void
  onRefuel: () => void
}

/** Compact commerce panel: sell fertilizer + refuel tractor. */
export default function SellPanel({ state, onSellAll, onSellHalf, onRefuel }: Props) {
  const revenueAll  = state.fertilizer * fertilizerSellingPrice
  const revenueHalf = revenueAll / 2
  return (
    <motion.aside
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute right-4 bottom-4 z-10 w-72 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-4 shadow-2xl"
    >
      <div className="flex items-center gap-2 text-emerald-200 text-sm font-semibold">
        <DollarSign size={16} /> Sell Fertilizer
      </div>
      <div className="mt-2 text-xs text-white/70">
        Stock: <span className="text-white">{formatKg(state.fertilizer)}</span> / {formatKg(state.fertilizerCapacity)}
        <br />
        Price: <span className="text-white">${fertilizerSellingPrice.toFixed(2)}</span> / kg
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={onSellHalf}
          disabled={state.fertilizer <= 0}
          className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-white/10 text-white disabled:opacity-40 hover:bg-white/20"
        >
          Sell 50%<br /><span className="text-emerald-300">{formatMoney(revenueHalf)}</span>
        </button>
        <button
          onClick={onSellAll}
          disabled={state.fertilizer <= 0}
          className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-emerald-500 text-black disabled:bg-white/10 disabled:text-white/40"
        >
          Sell All<br /><span>{formatMoney(revenueAll)}</span>
        </button>
      </div>

      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-white/70">
            <Fuel size={12} /> Fuel {Math.round(state.fuel)} / {state.fuelTank} L
          </span>
          <button
            onClick={onRefuel}
            disabled={state.fuel >= state.fuelTank}
            className="px-3 py-1.5 rounded text-xs font-medium bg-amber-500/80 text-black disabled:opacity-40"
          >
            Refuel
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
