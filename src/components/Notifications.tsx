import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react'
import type { Notification } from '../game/gameTypes'

const ICONS = { info: Info, success: CheckCircle2, warn: AlertTriangle }
const COLORS = {
  info: 'bg-sky-500/20 border-sky-400/40 text-sky-100',
  success: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100',
  warn: 'bg-amber-500/20 border-amber-400/40 text-amber-100',
}

/** Stacked toast list. Expiry is driven by the store. */
export default function Notifications({ items }: { items: Notification[] }) {
  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex flex-col gap-2">
      <AnimatePresence>
        {items.map((n) => {
          const Icon = ICONS[n.kind]
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-md text-xs ${COLORS[n.kind]}`}
            >
              <Icon size={14} />
              {n.message}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
