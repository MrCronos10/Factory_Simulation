import { FACTORY_VIEWPOINTS } from '../scenes/cameraViewpoints'
import type { ViewpointKey } from '../scenes/cameraViewpoints'
import { translate, type Lang } from '../data/i18n'

type Props = {
  current: ViewpointKey
  onSelect: (v: ViewpointKey) => void
  language: Lang
}

/** Horizontal chip strip for jumping the camera to named factory viewpoints. */
export default function ViewpointSelector({ current, onSelect, language }: Props) {
  const t = (k: string) => translate(language, k)
  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-wrap gap-1 max-w-[calc(100%-2rem)] justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-1 py-1">
      {FACTORY_VIEWPOINTS.map((v) => {
        const active = current === v.key
        return (
          <button
            key={v.key}
            onClick={() => onSelect(v.key)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
              active ? 'bg-emerald-500 text-black' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            {t(v.labelKey)}
          </button>
        )
      })}
    </div>
  )
}
