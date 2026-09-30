import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'

type Props = { running: boolean; onToggle: () => void }

/** Small overlay control to start/stop the factory line. */
export default function FactoryControls({ running, onToggle }: Props) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-20 right-4 z-10"
    >
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-md transition-colors ${
          running
            ? 'bg-amber-500/20 border-amber-400/40 text-amber-100 hover:bg-amber-500/30'
            : 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/30'
        }`}
      >
        {running ? <Pause size={14} /> : <Play size={14} />}
        {running ? 'Pause Factory' : 'Start Factory'}
      </button>
    </motion.div>
  )
}
