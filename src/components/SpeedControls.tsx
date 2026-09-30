import { Pause, Play, FastForward, Rocket } from 'lucide-react'
import type { SpeedSetting } from '../game/gameTypes'

type Props = { speed: SpeedSetting; onChange: (s: SpeedSetting) => void }

const OPTIONS: { value: SpeedSetting; icon: React.ComponentType<{ size?: number }>; label: string }[] = [
  { value: 0, icon: Pause,       label: 'Pause' },
  { value: 1, icon: Play,        label: '1×' },
  { value: 2, icon: FastForward, label: '2×' },
  { value: 5, icon: Rocket,      label: '5×' },
]

/** Compact speed selector: pause / 1× / 2× / 5×. */
export default function SpeedControls({ speed, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 p-1">
      {OPTIONS.map(({ value, icon: Icon, label }) => {
        const active = speed === value
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            title={label}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
              active ? 'bg-emerald-500 text-black' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Icon size={12} />
            {label}
          </button>
        )
      })}
    </div>
  )
}
