import { useMemo } from 'react'
import { STATIONS } from '../../game/factoryStations'
import type { GameState, StationId } from '../../game/gameTypes'
import StationHost from './StationHost'
import StationVisual from './StationVisual'
import LineConveyor from './LineConveyor'

type Props = {
  stations: GameState['stations']
  selected: StationId | null
  onSelect: (id: StationId) => void
}

/**
 * Renders every station in pipeline order along the factory's central axis,
 * with a connecting conveyor between consecutive stations so the material path
 * reads visually from receiving through to storage.
 */
export default function ProductionLine({ stations, selected, onSelect }: Props) {
  const segments = useMemo(() => {
    const segs: Array<{ from: number; to: number; active: boolean }> = []
    for (let i = 0; i < STATIONS.length - 1; i++) {
      const a = STATIONS[i]
      const b = STATIONS[i + 1]
      const active = stations[a.id].status === 'running' || stations[b.id].status === 'running'
      segs.push({ from: a.x, to: b.x, active })
    }
    return segs
  }, [stations])

  return (
    <group>
      {segments.map((seg, i) => (
        <LineConveyor key={i} fromX={seg.from} toX={seg.to} active={seg.active} />
      ))}

      {STATIONS.map((def) => {
        const s = stations[def.id]
        return (
          <StationHost
            key={def.id}
            def={def}
            state={s}
            selected={selected === def.id}
            onSelect={() => onSelect(def.id)}
          >
            <StationVisual def={def} state={s} />
          </StationHost>
        )
      })}
    </group>
  )
}
