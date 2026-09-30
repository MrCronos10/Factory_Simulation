import { motion } from 'framer-motion'
import { Coins, PackageOpen, Wheat, Zap, Factory, CalendarDays } from 'lucide-react'
import { formatKg, formatMoney } from '../utils/formatNumber'
import type { GameState, SpeedSetting } from '../game/gameTypes'
import { translate, type Lang } from '../data/i18n'
import SpeedControls from './SpeedControls'

type Props = {
  state: Pick<
    GameState,
    | 'money' | 'manure' | 'fertilizer' | 'day' | 'timeOfDay'
    | 'energyKw' | 'factoryOperating' | 'speed'
  >
  language: Lang
  onSpeedChange: (s: SpeedSetting) => void
}

/**
 * Corner-anchored HUD.
 *   TL: money + day/time
 *   TC: factory status pill
 *   TR: manure / fertilizer / energy
 *   BR: speed controls
 * Contextual hints (BL) render separately via ContextualHints.
 */
export default function GameHUD({ state, language, onSpeedChange }: Props) {
  const t = (k: string) => translate(language, k)
  const hh = String(Math.floor(state.timeOfDay / 60)).padStart(2, '0')
  const mm = String(Math.floor(state.timeOfDay % 60)).padStart(2, '0')

  return (
    <>
      {/* TOP-LEFT: Money + Day/Time */}
      <motion.div
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="absolute top-16 left-4 z-10 flex flex-col gap-2 pointer-events-none"
      >
        <Tile icon={Coins} label={t('hud.money')} value={formatMoney(state.money)} />
        <Tile icon={CalendarDays} label={`${t('hud.day')} · ${t('hud.time')}`} value={`${state.day} · ${hh}:${mm}`} />
      </motion.div>

      {/* TOP-CENTER: Factory status */}
      <motion.div
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="absolute top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      >
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-md ${
          state.factoryOperating
            ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100'
            : 'bg-white/10 border-white/10 text-white/70'
        }`}>
          <Factory size={13} />
          {t('hud.factoryStatus')}: {state.factoryOperating ? t('hud.factoryRunning') : t('hud.factoryOffline')}
        </div>
      </motion.div>

      {/* TOP-RIGHT: Manure / Fertilizer / Energy */}
      <motion.div
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="absolute top-16 right-4 z-10 flex flex-col gap-2 items-end pointer-events-none"
      >
        <Tile icon={PackageOpen} label={t('hud.manure')}     value={formatKg(state.manure)} align="right" />
        <Tile icon={Wheat}       label={t('hud.fertilizer')} value={formatKg(state.fertilizer)} align="right" />
        <Tile icon={Zap}         label={t('hud.energy')}     value={`${Math.round(state.energyKw)} kW`} align="right" />
      </motion.div>

      {/* BOTTOM-RIGHT: Speed */}
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-4 right-4 z-10"
      >
        <SpeedControls speed={state.speed} onChange={onSpeedChange} />
      </motion.div>
    </>
  )
}

function Tile({
  icon: Icon, label, value, align = 'left',
}: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string; align?: 'left' | 'right' }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 shadow-lg ${
      align === 'right' ? 'flex-row-reverse' : ''
    }`}>
      <Icon size={14} className="text-emerald-300" />
      <div className={`leading-tight ${align === 'right' ? 'text-right' : ''}`}>
        <div className="text-[10px] uppercase tracking-wider text-white/50">{label}</div>
        <div className="text-sm font-semibold text-white">{value}</div>
      </div>
    </div>
  )
}
