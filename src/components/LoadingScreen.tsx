import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0f0a]"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        className="h-12 w-12 rounded-full border-2 border-emerald-400 border-t-transparent"
      />
      <p className="mt-4 text-sm text-emerald-200/80 tracking-widest uppercase">
        Loading scene…
      </p>
    </motion.div>
  )
}
