import {
  Sprout, Truck, Package, Flame, Filter, Hammer, Blend,
  GripVertical, Sun, Wind, ListFilter, PackageCheck, Warehouse, Wheat,
} from 'lucide-react'
import type { IconName } from '../../data/processData'

const MAP = {
  sprout: Sprout,
  truck: Truck,
  package: Package,
  flame: Flame,
  filter: Filter,
  hammer: Hammer,
  blend: Blend,
  gripVertical: GripVertical,
  sun: Sun,
  wind: Wind,
  listFilter: ListFilter,
  packageCheck: PackageCheck,
  warehouse: Warehouse,
  wheat: Wheat,
} as const

/** Lookup helper so the scene never imports lucide directly. */
export default function ProcessIcon({ name, size = 22 }: { name: IconName; size?: number }) {
  const Icon = MAP[name]
  return <Icon size={size} />
}
