import { motion, AnimatePresence } from 'framer-motion'
import { X, GraduationCap, Info } from 'lucide-react'
import type { ProcessStep } from '../../data/processData'
import { PROCESS_DISCLAIMER } from '../../data/processData'
import ProcessIcon from '../../scenes/process/ProcessIcon'

type Props = {
  step: ProcessStep | null
  learnMode: boolean
  onClose: () => void
}

/**
 * Educational side panel. Short mode shows just facts; Learn mode expands with
 * "what happens / why / what affects it / what can go wrong" narrative.
 */
export default function ProcessLearnPanel({ step, learnMode, onClose }: Props) {
  return (
    <AnimatePresence>
      {step && (
        <motion.aside
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="absolute right-4 top-20 z-10 w-96 max-h-[80vh] overflow-y-auto rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 p-5 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-200">
                <ProcessIcon name={step.icon} size={22} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-emerald-300/80">
                  Process step
                </div>
                <h3 className="text-white font-semibold">{step.label}</h3>
              </div>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white" aria-label="Close">
              <X size={16} />
            </button>
          </div>

          <p className="mt-3 text-sm text-white/80 leading-relaxed">{step.shortDesc}</p>

          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <IO label="Input" value={step.input} />
            <IO label="Output" value={step.output} />
          </dl>

          {step.params && (
            <div className="mt-4">
              <div className="text-[10px] uppercase tracking-wider text-emerald-300/80 mb-1 inline-flex items-center gap-1">
                <Info size={12} /> Typical simulation ranges
              </div>
              <div className="rounded-lg border border-white/10 divide-y divide-white/10">
                {step.params.map((p) => (
                  <div key={p.label} className="px-3 py-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/70">{p.label}</span>
                      <span className="text-white font-medium">{p.typicalRange}</span>
                    </div>
                    {p.note && <div className="text-[10px] text-white/50 mt-0.5">{p.note}</div>}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-[10px] text-white/50 leading-snug">{PROCESS_DISCLAIMER}</div>
            </div>
          )}

          {learnMode && (
            <div className="mt-4">
              <div className="text-[10px] uppercase tracking-wider text-emerald-300/80 mb-2 inline-flex items-center gap-1">
                <GraduationCap size={12} /> Learn mode
              </div>
              <LearnRow label="What happens?"      value={step.learn.whatHappens} />
              <LearnRow label="Why is it needed?" value={step.learn.whyNeeded} />
              <LearnRow label="What goes in?"     value={step.learn.whatGoesIn} />
              <LearnRow label="What comes out?"   value={step.learn.whatComesOut} />
              {step.learn.whatAffectsIt && (
                <LearnRow label="What affects it?" value={step.learn.whatAffectsIt} />
              )}
              <LearnRow label="What can go wrong?" value={step.learn.whatCanGoWrong} />
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function IO({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/5 border border-white/10 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-white/50">{label}</div>
      <div className="text-white/90 text-[11px] leading-snug">{value}</div>
    </div>
  )
}

function LearnRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2">
      <div className="text-[10px] uppercase tracking-wider text-white/60">{label}</div>
      <div className="text-xs text-white/80 leading-snug">{value}</div>
    </div>
  )
}
