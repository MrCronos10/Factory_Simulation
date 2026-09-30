/**
 * Static, design-time data for farm content (barns, animal pens, fields).
 * Runtime state (population, stored manure) lives in game state, not here.
 */

export interface FarmBuilding {
  id: string
  label: string
  position: [number, number, number]
  color: string
  description: string
}

export const FARM_BUILDINGS: FarmBuilding[] = [
  {
    id: 'cow-barn',
    label: 'Cow Barn',
    position: [-6, 0, -2],
    color: '#a15a3a',
    description: 'Houses dairy cows. Primary source of high-volume manure.',
  },
  {
    id: 'pig-pen',
    label: 'Pig Pen',
    position: [4, 0, -4],
    color: '#c98a4b',
    description: 'Pigs produce medium-volume manure suitable for composting.',
  },
  {
    id: 'chicken-coop',
    label: 'Chicken Coop',
    position: [0, 0, 5],
    color: '#d9b56a',
    description: 'Chickens produce nitrogen-rich manure in small quantities.',
  },
]
