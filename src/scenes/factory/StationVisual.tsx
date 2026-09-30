import type { StationDef } from '../../game/factoryStations'
import type { StationState } from '../../game/gameTypes'
import Receiving from './stations/Receiving'
import Sorter from './stations/Sorter'
import Compost from './stations/Compost'
import Crusher from './stations/Crusher'
import Mixer from './stations/Mixer'
import Drum from './stations/Drum'
import Cooling from './stations/Cooling'
import Bagger from './stations/Bagger'
import Warehouse from './stations/Warehouse'

type Props = { def: StationDef; state: StationState }

/**
 * Picks the correct visual for a station based on its `variant`.
 * Keeps StationHost variant-agnostic.
 */
export default function StationVisual({ def, state }: Props) {
  const active = state.status === 'running'
  const fill = state.progress
  switch (def.variant) {
    case 'receiving': return <Receiving active={active} fill={fill} />
    case 'sorter':    return <Sorter active={active} />
    case 'compost':   return <Compost active={active} fill={fill} />
    case 'crusher':   return <Crusher active={active} />
    case 'mixer':     return <Mixer active={active} />
    case 'drum':      return <Drum active={active} />
    case 'drumHot':   return <Drum active={active} hot />
    case 'cooling':   return <Cooling active={active} />
    case 'bagger':    return <Bagger active={active} />
    case 'warehouse': return <Warehouse fill={state.buffer} capacity={def.capacityKg} />
  }
}
