/**
 * Data-driven definition of factory stations.
 *
 * The 12-station pipeline below models a plausible small-scale manure-to-organic-fertilizer
 * facility. It is NOT presented as the only valid process — each field is a
 * configurable simulation parameter.
 */

import type { StationId } from './gameTypes'

export type StationVariant =
  | 'receiving'
  | 'sorter'
  | 'compost'
  | 'crusher'
  | 'mixer'
  | 'drum'
  | 'drumHot'
  | 'cooling'
  | 'bagger'
  | 'warehouse'

export interface StationDef {
  id: StationId
  order: number
  label: string
  purpose: string
  input: string
  output: string
  /** kg of buffer this station can hold at once. */
  capacityKg: number
  /** kg processed per in-game day at 100% efficiency. */
  throughputKgPerDay: number
  /** kW nominal electrical draw when running. */
  energyKw: number
  variant: StationVariant
  /** Position along the production line, x-offset from building center. */
  x: number
}

/** Uniform spacing along the production line. */
const SPACING = 5.5

const raw: Omit<StationDef, 'x' | 'order'>[] = [
  {
    id: 'receiving',
    label: 'Manure Receiving',
    purpose: 'Accept incoming manure deliveries and stage them for processing.',
    input: 'Raw manure (from tractors)',
    output: 'Staged manure',
    capacityKg: 800,
    throughputKgPerDay: 1200,
    energyKw: 4,
    variant: 'receiving',
  },
  {
    id: 'preprocessing',
    label: 'Pre-processing',
    purpose: 'Remove foreign objects and coarse debris before composting.',
    input: 'Staged manure',
    output: 'Clean feedstock',
    capacityKg: 600,
    throughputKgPerDay: 1100,
    energyKw: 8,
    variant: 'sorter',
  },
  {
    id: 'fermentation',
    label: 'Fermentation / Composting',
    purpose: 'Aerobic composting with periodic turning to stabilize the material.',
    input: 'Clean feedstock',
    output: 'Compost',
    capacityKg: 2000,
    throughputKgPerDay: 900,
    energyKw: 6,
    variant: 'compost',
  },
  {
    id: 'crushing',
    label: 'Crusher',
    purpose: 'Break down compacted compost into a uniform particle size.',
    input: 'Compost',
    output: 'Crushed compost',
    capacityKg: 500,
    throughputKgPerDay: 900,
    energyKw: 22,
    variant: 'crusher',
  },
  {
    id: 'screening',
    label: 'Screening',
    purpose: 'Sort by size; oversize material returns to the crusher.',
    input: 'Crushed compost',
    output: 'Sized material',
    capacityKg: 500,
    throughputKgPerDay: 850,
    energyKw: 6,
    variant: 'sorter',
  },
  {
    id: 'mixing',
    label: 'Mixer',
    purpose: 'Blend organics, mineral additives and moisture to spec.',
    input: 'Sized material',
    output: 'Blended feed',
    capacityKg: 500,
    throughputKgPerDay: 850,
    energyKw: 10,
    variant: 'mixer',
  },
  {
    id: 'granulation',
    label: 'Granulator',
    purpose: 'Roll blended feed into uniform granules in a rotating drum.',
    input: 'Blended feed',
    output: 'Wet granules',
    capacityKg: 500,
    throughputKgPerDay: 800,
    energyKw: 30,
    variant: 'drum',
  },
  {
    id: 'drying',
    label: 'Dryer',
    purpose: 'Reduce moisture content in a rotating heated drum.',
    input: 'Wet granules',
    output: 'Dry granules',
    capacityKg: 500,
    throughputKgPerDay: 800,
    energyKw: 55,
    variant: 'drumHot',
  },
  {
    id: 'cooling',
    label: 'Cooling',
    purpose: 'Cool granules with forced airflow before final screening.',
    input: 'Dry granules',
    output: 'Cooled granules',
    capacityKg: 400,
    throughputKgPerDay: 780,
    energyKw: 15,
    variant: 'cooling',
  },
  {
    id: 'finalScreening',
    label: 'Final Screening',
    purpose: 'Separate acceptable granules from oversize/fines.',
    input: 'Cooled granules',
    output: 'Graded fertilizer',
    capacityKg: 400,
    throughputKgPerDay: 780,
    energyKw: 5,
    variant: 'sorter',
  },
  {
    id: 'bagging',
    label: 'Bagging',
    purpose: 'Fill, seal and label finished bags.',
    input: 'Graded fertilizer',
    output: 'Bagged fertilizer',
    capacityKg: 300,
    throughputKgPerDay: 780,
    energyKw: 8,
    variant: 'bagger',
  },
  {
    id: 'storage',
    label: 'Finished Product Storage',
    purpose: 'Warehouse pallets of finished bags awaiting shipment.',
    input: 'Bagged fertilizer',
    output: 'Sold fertilizer',
    capacityKg: 5000,
    throughputKgPerDay: 0,
    energyKw: 1,
    variant: 'warehouse',
  },
]

/** All 12 stations in production order, with derived x positions. */
export const STATIONS: StationDef[] = raw.map((s, i) => ({
  ...s,
  order: i,
  x: (i - (raw.length - 1) / 2) * SPACING,
}))

export const STATIONS_BY_ID: Record<StationId, StationDef> = Object.fromEntries(
  STATIONS.map((s) => [s.id, s]),
) as Record<StationId, StationDef>

/** Convenience: get the id of the next station in the pipeline, or null at end. */
export function nextStationId(id: StationId): StationId | null {
  const def = STATIONS_BY_ID[id]
  const next = STATIONS[def.order + 1]
  return next ? next.id : null
}
