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
import GLBModel from '../models/GLBModel'

type Props = { def: StationDef; state: StationState }

/**
 * Picks the correct visual for a station based on its `variant`.
 * Stations with a matching GLB (fermenter / granulator / bagging_machine) load
 * the model and fall back to the animated primitive when the file is absent.
 * All other stations keep their primitive visuals.
 */
export default function StationVisual({ def, state }: Props) {
  const active = state.status === 'running'
  const fill = state.progress
  switch (def.variant) {
    case 'receiving': return <Receiving active={active} fill={fill} />
    case 'sorter':    return <Sorter active={active} />
    case 'compost':
      return <GLBModel name="fermenter" fitHeight={3.2} fallback={<Compost active={active} fill={fill} />} />
    case 'crusher':   return <Crusher active={active} />
    case 'mixer':     return <Mixer active={active} />
    case 'drum':
      return <GLBModel name="granulator" fitHeight={3.2} fallback={<Drum active={active} />} />
    case 'drumHot':   return <Drum active={active} hot />
    case 'cooling':   return <Cooling active={active} />
    case 'bagger':
      return <GLBModel name="bagging_machine" fitHeight={3} fallback={<Bagger active={active} />} />
    case 'warehouse': return <Warehouse fill={state.buffer} capacity={def.capacityKg} />
  }
}
