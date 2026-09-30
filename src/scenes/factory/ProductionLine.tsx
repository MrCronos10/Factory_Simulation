import { STATIONS } from '../../game/factoryStations'
import type { GameState, StationId } from '../../game/gameTypes'
import StationHost from './StationHost'
import StationVisual from './StationVisual'

type Props = {
  stations: GameState['stations']
  selected: StationId | null
  onSelect: (id: StationId) => void
}

/** Renders every station in pipeline order along the factory's central axis. */
export default function ProductionLine({ stations, selected, onSelect }: Props) {
  return (
    <group>
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
