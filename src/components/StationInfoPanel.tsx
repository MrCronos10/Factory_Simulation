import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, ArrowRight } from 'lucide-react'
import type { FermentationBatch, StationState } from '../game/gameTypes'
import { formatKg, formatPercent } from '../utils/formatNumber'
import { STATIONS_BY_ID, nextStationId } from '../game/factoryStations'
import { STATION_STATUS_LABEL } from '../game/simulation'

type Props = {
  station: StationState | null
  batches?: FermentationBatch[]
  onClose?: () => void
}

/**
 * Detailed info panel for a selected factory station.
 * Combines the static definition (from factoryStations) with the live runtime
 * state slice. For fermentation, also lists active batches.
 */
export default function StationInfoPanel({ station, batches, onClose }: Props) {
  const def = station ? STATIONS_BY_ID[station.id] : null
  const nextId = station ? nextStationId(station.id) : null
  const nextLabel = nextId ? STATIONS_BY_ID[nextId].label : '—'
  const showBatches = station?.id === 'fermentation'

  return (
    <AnimatePresence>
      {station && def && (
        <motion.aside
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="absolute right-4 top-20 z-10 w-80 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-5 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-emerald-300/80">
                Station {def.order + 1} / 12
              </div>
              <h3 className="text-white font-semibold">{def.label}</h3>
            </div>
            {onClose && (
              <button onClick={onClose} className="text-white/60 hover:text-white" aria-label="Close">
                <X size={16} />
              </button>
            )}
          </div>

          <p className="mt-2 text-xs text-white/70 leading-relaxed">{def.purpose}</p>

          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/80">
            <Row label="Input"  value={def.input} />
            <Row label="Output" value={def.output} />
            <Row label="Capacity"   value={formatKg(def.capacityKg)} />
            <Row label="Throughput" value={`${formatKg(def.throughputKgPerDay)} / day`} />
            <Row label="Status"     value={STATION_STATUS_LABEL[station.status]} />
            <Row label="Efficiency" value={formatPercent(station.efficiency)} />
            <Row label="Buffer"     value={`${formatKg(station.buffer)} / ${formatKg(def.capacityKg)}`} />
            <Row label="Level"      value={String(station.level)} />
          </dl>

          <div className="mt-3">
            <div className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Progress</div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-emerald-400" style={{ width: `${Math.round(station.progress * 100)}%` }} />
            </div>
          </div>

          {showBatches && batches && batches.length > 0 && (
            <div className="mt-4">
              <div className="text-[10px] uppercase tracking-wider text-white/50 mb-1">
                Active Batches ({batches.length})
              </div>
              <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                {batches.map((b) => (
                  <div key={b.id} className="text-[11px] text-white/80">
                    <div className="flex justify-between">
                      <span>Batch #{String(b.id).padStart(3, '0')} · {Math.round(b.kg)} kg</span>
                      <span>{Math.round(b.progress * 100)}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${Math.round(b.progress * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between text-xs text-white/70">
            <span className="inline-flex items-center gap-1">
              <Zap size={12} className="text-amber-300" />
              {def.energyKw} kW
            </span>
            <span className="inline-flex items-center gap-1">
              Next <ArrowRight size={12} /> {nextLabel}
            </span>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-white/50">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
