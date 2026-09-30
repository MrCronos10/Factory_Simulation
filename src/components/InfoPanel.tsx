import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

type Props = {
  title: string
  description?: string
  open?: boolean
  onClose?: () => void
}

/** Generic scene-level info card, anchored bottom-right. */
export default function InfoPanel({ title, description, open = true, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute right-4 bottom-4 z-10 w-80 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 p-5 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-emerald-200 font-semibold text-base">{title}</h2>
            {onClose && (
              <button onClick={onClose} className="text-white/60 hover:text-white" aria-label="Close">
                <X size={16} />
              </button>
            )}
          </div>
          {description && (
            <p className="mt-2 text-sm text-white/80 leading-relaxed">{description}</p>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
