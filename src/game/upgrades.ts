/**
 * Data-driven upgrades. Each upgrade has:
 *   - a cost function (scales with how many times it has been purchased)
 *   - an `apply` function that mutates a state patch
 *   - an optional `max` count
 *
 * Applying an upgrade never touches React; call `applyUpgrade` and feed the
 * returned patch to `gameStore.setState`.
 */

import type { GameState, StationId, StationState, UpgradeId } from './gameTypes'
import {
  animalPurchaseCost,
  factoryUpgradeCostBase,
  tractorCost,
  workerHireCost,
} from './constants'

export interface UpgradeDef {
  id: UpgradeId
  label: string
  category: 'farm' | 'factory' | 'labor'
  description: string
  cost(state: GameState): number
  max?: number
  apply(state: GameState): Partial<GameState>
}

const bumpStation = (stationId: StationId, patch: (l: number) => Partial<StationState>) =>
  (s: GameState): Partial<GameState> => {
    const station = s.stations[stationId]
    const nextLevel = station.level + 1
    return {
      stations: { ...s.stations, [stationId]: { ...station, level: nextLevel, ...patch(nextLevel) } },
    }
  }

export const UPGRADES: UpgradeDef[] = [
  {
    id: 'buyCow',
    label: 'Buy Cow',
    category: 'farm',
    description: 'Adds one cow to the herd.',
    cost: () => animalPurchaseCost.cow,
    apply: (s) => ({ animals: { ...s.animals, cow: s.animals.cow + 1 } }),
  },
  {
    id: 'buyPig',
    label: 'Buy Pig',
    category: 'farm',
    description: 'Adds one pig to the pen.',
    cost: () => animalPurchaseCost.pig,
    apply: (s) => ({ animals: { ...s.animals, pig: s.animals.pig + 1 } }),
  },
  {
    id: 'buyChicken',
    label: 'Buy Chicken',
    category: 'farm',
    description: 'Adds one chicken to the coop.',
    cost: () => animalPurchaseCost.chicken,
    apply: (s) => ({ animals: { ...s.animals, chicken: s.animals.chicken + 1 } }),
  },
  {
    id: 'farmStoragePlus',
    label: 'Larger Manure Pile',
    category: 'farm',
    description: '+500 kg farm manure capacity.',
    cost: (s) => 700 + (s.purchasedUpgrades.farmStoragePlus ?? 0) * 400,
    apply: (s) => ({ farmManureCapacity: s.farmManureCapacity + 500 }),
  },
  {
    id: 'tractorCapacityPlus',
    label: 'Bigger Tractor',
    category: 'farm',
    description: '+150 kg per trip.',
    cost: (s) => tractorCost + (s.purchasedUpgrades.tractorCapacityPlus ?? 0) * 800,
    apply: (s) => ({ tractor: { ...s.tractor, capacity: s.tractor.capacity + 150 } }),
    max: 5,
  },
  {
    id: 'hireWorker',
    label: 'Hire Worker',
    category: 'labor',
    description: '+1 worker (raises daily wages but boosts factory efficiency).',
    cost: () => workerHireCost,
    apply: (s) => ({ workers: s.workers + 1 }),
    max: 10,
  },
  {
    id: 'receivingCapPlus',
    label: 'Receiving Bay Expansion',
    category: 'factory',
    description: 'Higher receiving efficiency (+15%).',
    cost: (s) => factoryUpgradeCostBase + (s.purchasedUpgrades.receivingCapPlus ?? 0) * 600,
    apply: bumpStation('receiving', () => ({ efficiency: 1 + Math.random() * 0.0 + 0.15 })),
    max: 3,
  },
  {
    id: 'fermentationSpeed',
    label: 'Aeration Upgrade',
    category: 'factory',
    description: 'Fermentation +20% faster.',
    cost: (s) => factoryUpgradeCostBase + (s.purchasedUpgrades.fermentationSpeed ?? 0) * 800,
    apply: bumpStation('fermentation', (l) => ({ efficiency: 1 + 0.2 * (l - 1) })),
    max: 3,
  },
  {
    id: 'crusherSpeed',
    label: 'Heavy-Duty Crusher',
    category: 'factory',
    description: 'Crusher +25% throughput.',
    cost: (s) => factoryUpgradeCostBase + (s.purchasedUpgrades.crusherSpeed ?? 0) * 700,
    apply: bumpStation('crushing', (l) => ({ efficiency: 1 + 0.25 * (l - 1) })),
    max: 3,
  },
  {
    id: 'granulatorSize',
    label: 'Larger Granulator',
    category: 'factory',
    description: 'Granulator +20% capacity / throughput.',
    cost: (s) => factoryUpgradeCostBase + (s.purchasedUpgrades.granulatorSize ?? 0) * 900,
    apply: bumpStation('granulation', (l) => ({ efficiency: 1 + 0.2 * (l - 1) })),
    max: 3,
  },
  {
    id: 'dryerSpeed',
    label: 'Efficient Dryer',
    category: 'factory',
    description: 'Dryer +25% throughput.',
    cost: (s) => factoryUpgradeCostBase + (s.purchasedUpgrades.dryerSpeed ?? 0) * 1_000,
    apply: bumpStation('drying', (l) => ({ efficiency: 1 + 0.25 * (l - 1) })),
    max: 3,
  },
  {
    id: 'storagePlus',
    label: 'Warehouse Extension',
    category: 'factory',
    description: '+1,500 kg finished fertilizer capacity.',
    cost: (s) => 1_800 + (s.purchasedUpgrades.storagePlus ?? 0) * 600,
    apply: (s) => ({ fertilizerCapacity: s.fertilizerCapacity + 1_500 }),
    max: 4,
  },
  {
    id: 'baggingSpeed',
    label: 'Auto-Bagger',
    category: 'factory',
    description: 'Bagging +30% throughput.',
    cost: (s) => factoryUpgradeCostBase + (s.purchasedUpgrades.baggingSpeed ?? 0) * 700,
    apply: bumpStation('bagging', (l) => ({ efficiency: 1 + 0.3 * (l - 1) })),
    max: 3,
  },
]

export const UPGRADES_BY_ID: Record<UpgradeId, UpgradeDef> =
  Object.fromEntries(UPGRADES.map((u) => [u.id, u])) as Record<UpgradeId, UpgradeDef>

export function applyUpgrade(state: GameState, id: UpgradeId): Partial<GameState> | null {
  const def = UPGRADES_BY_ID[id]
  if (!def) return null
  const owned = state.purchasedUpgrades[id] ?? 0
  if (def.max != null && owned >= def.max) return null
  const cost = def.cost(state)
  if (state.money < cost) return null
  const applied = def.apply(state)
  return {
    ...applied,
    money: state.money - cost,
    purchasedUpgrades: { ...state.purchasedUpgrades, [id]: owned + 1 },
  }
}
