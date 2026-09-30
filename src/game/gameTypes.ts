/**
 * Core type definitions for the manure-to-fertilizer simulation game.
 * Kept independent of React so it can be reused in workers, tests, or servers.
 */

export type SceneKey = 'farm' | 'factory' | 'process'

export type StationStatus =
  | 'offline'
  | 'idle'
  | 'running'
  | 'waiting_material'
  | 'storage_full'
  | 'maintenance'

export type StationId =
  | 'receiving'
  | 'preprocessing'
  | 'fermentation'
  | 'crushing'
  | 'screening'
  | 'mixing'
  | 'granulation'
  | 'drying'
  | 'cooling'
  | 'finalScreening'
  | 'bagging'
  | 'storage'

export interface StationState {
  id: StationId
  status: StationStatus
  buffer: number
  efficiency: number
  level: number
  progress: number
}

/** A composting batch that ferments over multiple days. */
export interface FermentationBatch {
  id: number
  kg: number
  startedDay: number
  progress: number // 0..1
}

export type AnimalKind = 'cow' | 'pig' | 'chicken'
export interface AnimalPopulation { cow: number; pig: number; chicken: number }

export type TractorPhase = 'idle' | 'loading' | 'transporting' | 'unloading' | 'returning'
export interface TractorState {
  phase: TractorPhase
  capacity: number
  load: number
  progress: number
}

export type UpgradeId =
  | 'buyCow'
  | 'buyPig'
  | 'buyChicken'
  | 'farmStoragePlus'
  | 'tractorCapacityPlus'
  | 'hireWorker'
  | 'receivingCapPlus'
  | 'fermentationSpeed'
  | 'crusherSpeed'
  | 'granulatorSize'
  | 'dryerSpeed'
  | 'storagePlus'
  | 'baggingSpeed'

export type SpeedSetting = 0 | 1 | 2 | 5

export interface Notification {
  id: number
  kind: 'info' | 'success' | 'warn'
  message: string
}

export interface GameState {
  /* -- Resources ------------------------------------------------------- */
  money: number
  workers: number
  fuel: number
  fuelTank: number
  /** Instantaneous factory power draw in kW. */
  energyKw: number
  /** Cumulative energy consumed today, kWh. */
  energyUsedToday: number

  /* -- Farm ------------------------------------------------------------ */
  farmManure: number
  farmManureCapacity: number
  animals: AnimalPopulation

  /* -- Inventory in transit / at factory intake ------------------------ */
  manure: number
  manureCapacity: number

  /* -- Finished goods -------------------------------------------------- */
  fertilizer: number
  fertilizerCapacity: number

  /* -- Rates (derived) ------------------------------------------------- */
  manureProductionRate: number
  factoryProductionRate: number
  factoryEfficiency: number

  /* -- Clock / speed --------------------------------------------------- */
  day: number
  timeOfDay: number
  speed: SpeedSetting

  /* -- Factory --------------------------------------------------------- */
  factoryOperating: boolean
  stations: Record<StationId, StationState>
  fermentationBatches: FermentationBatch[]
  bagsProducedToday: number

  /* -- Transport ------------------------------------------------------- */
  tractor: TractorState

  /* -- Progression ----------------------------------------------------- */
  purchasedUpgrades: Record<string, number>

  /* -- UI ------------------------------------------------------------- */
  selectedStation: StationId | null
  selectedScene: SceneKey
  language: 'en' | 'zh'
  dayNight: 'day' | 'night'
  soundEnabled: boolean
  tourActive: boolean

  /* -- Ephemeral / stats ---------------------------------------------- */
  notifications: Notification[]
  manureGeneratedToday: number
  fertilizerProducedToday: number
  moneyEarnedToday: number
  _lastManureDay: number
  _batchSeq: number
}
