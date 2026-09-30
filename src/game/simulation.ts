/**
 * Simulation engine.
 * All numeric evolution of GameState lives here. React components should only
 * VISUALIZE state — never mutate it.
 */

import type {
  FermentationBatch,
  GameState,
  StationId,
  StationState,
  StationStatus,
  TractorPhase,
} from './gameTypes'
import {
  energyCost,
  FERMENTATION_BATCH_SIZE,
  FERMENTATION_DAYS,
  MANURE_PER_ANIMAL,
  MANURE_TO_FERTILIZER_RATIO,
  TRACTOR_FUEL_PER_TRIP,
  TRACTOR_PHASE_SECONDS,
  transportCostPerTrip,
  workerDailyWage,
} from './constants'
import { STATIONS, STATIONS_BY_ID } from './factoryStations'
import { clamp } from '../utils/calculations'

const NEXT_PHASE: Record<TractorPhase, TractorPhase> = {
  idle: 'idle',
  loading: 'transporting',
  transporting: 'unloading',
  unloading: 'returning',
  returning: 'idle',
}

/**
 * Advance the simulation by `deltaMinutes` in-game minutes and `deltaSeconds`
 * real-time seconds. Returns a state patch.
 *
 * The `notify` callback lets the engine surface player-facing events
 * (batch completes, storage full) without knowing about React.
 */
export function tick(
  state: GameState,
  deltaMinutes: number,
  deltaSeconds: number,
  notify?: (msg: string, kind?: 'info' | 'success' | 'warn') => void,
): Partial<GameState> {
  const patch: Partial<GameState> = {}

  /* -- Clock (day rollover) -------------------------------------------- */
  let day = state.day
  let timeOfDay = state.timeOfDay + deltaMinutes
  let dayChanged = false
  while (timeOfDay >= 1440) {
    timeOfDay -= 1440
    day += 1
    dayChanged = true
  }
  patch.day = day
  patch.timeOfDay = timeOfDay

  /* -- Manure production ---------------------------------------------- */
  const deltaDays = deltaMinutes / 1440
  const dailyRate =
    state.animals.cow * MANURE_PER_ANIMAL.cow +
    state.animals.pig * MANURE_PER_ANIMAL.pig +
    state.animals.chicken * MANURE_PER_ANIMAL.chicken
  const produced = dailyRate * deltaDays
  patch.manureProductionRate = dailyRate

  const nextFarmManure = clamp(state.farmManure + produced, 0, state.farmManureCapacity)
  patch.farmManure = nextFarmManure
  if (produced > 0 && nextFarmManure === state.farmManureCapacity && state.farmManure < state.farmManureCapacity && notify) {
    notify('Farm manure pile is full — collect it!', 'warn')
  }

  const rolled = day !== state._lastManureDay
  patch.manureGeneratedToday = rolled ? produced : state.manureGeneratedToday + produced
  if (rolled) {
    patch.fertilizerProducedToday = 0
    patch.bagsProducedToday = 0
    patch.moneyEarnedToday = 0
    patch.energyUsedToday = 0
    patch._lastManureDay = day
  }

  /* -- Tractor state machine ------------------------------------------ */
  const tractorPatch = advanceTractor(state, deltaSeconds, notify)
  Object.assign(patch, tractorPatch)

  /* -- Factory ---------------------------------------------------------
   * Uses already-updated inventory / money from tractor step.
   * If the day just rolled, daily counters have been reset in `patch`;
   * pass those baselines into the factory step.
   * ------------------------------------------------------------------ */
  const factoryPatch = advanceFactory(
    state,
    {
      money: patch.money ?? state.money,
      manure: patch.manure ?? state.manure,
      fertilizer: patch.fertilizer ?? state.fertilizer,
      fertilizerProducedToday: patch.fertilizerProducedToday ?? state.fertilizerProducedToday,
      bagsProducedToday: patch.bagsProducedToday ?? state.bagsProducedToday,
      energyUsedToday: patch.energyUsedToday ?? state.energyUsedToday,
    },
    deltaDays,
    notify,
  )
  Object.assign(patch, factoryPatch)

  /* -- Daily wages ----------------------------------------------------- */
  if (dayChanged) {
    const wages = state.workers * workerDailyWage
    const currentMoney = patch.money ?? state.money
    patch.money = currentMoney - wages
    if (wages > 0 && notify) notify(`Paid $${wages.toFixed(0)} in daily wages.`, 'info')
  }

  return patch
}

/* -------------------------------------------------------------------- */
/*  Tractor                                                             */
/* -------------------------------------------------------------------- */

function advanceTractor(
  state: GameState,
  deltaSeconds: number,
  notify?: (msg: string, kind?: 'info' | 'success' | 'warn') => void,
): Partial<GameState> {
  const t = state.tractor
  if (t.phase === 'idle') return {}
  const nextProgress = t.progress + deltaSeconds / TRACTOR_PHASE_SECONDS
  if (nextProgress < 1) {
    return { tractor: { ...t, progress: nextProgress } }
  }

  const nextPhase = NEXT_PHASE[t.phase]
  const patch: Partial<GameState> = {}
  let load = t.load

  if (t.phase === 'unloading') {
    const room = state.manureCapacity - state.manure
    const delivered = clamp(load, 0, room)
    patch.manure = state.manure + delivered
    load = 0
    if (delivered > 0 && notify) notify(`Truck arrived at factory — ${Math.round(delivered)} kg delivered.`, 'success')
  }

  if (t.phase === 'returning') {
    // Round trip complete: pay transport cost and consume fuel.
    const fuelUsed = Math.min(state.fuel, TRACTOR_FUEL_PER_TRIP)
    patch.fuel = state.fuel - fuelUsed
    patch.money = (patch.money ?? state.money) - transportCostPerTrip
  }

  patch.tractor = { ...t, phase: nextPhase, progress: 0, load }
  return patch
}

/* -------------------------------------------------------------------- */
/*  Factory pipeline                                                    */
/* -------------------------------------------------------------------- */

interface FactoryFrame {
  money: number
  manure: number
  fertilizer: number
  fertilizerProducedToday: number
  bagsProducedToday: number
  energyUsedToday: number
}

function advanceFactory(
  origState: GameState,
  frame: FactoryFrame,
  deltaDays: number,
  notify?: (msg: string, kind?: 'info' | 'success' | 'warn') => void,
): Partial<GameState> {
  const stations: Record<StationId, StationState> = { ...origState.stations }

  if (!origState.factoryOperating) {
    for (const s of STATIONS) {
      const st = stations[s.id]
      stations[s.id] = { ...st, status: 'offline' }
    }
    return { stations, energyKw: 0 }
  }

  let manureInventory = frame.manure
  let fertilizer = frame.fertilizer
  let producedFertilizer = 0
  const bagsBefore = frame.bagsProducedToday
  let bags = bagsBefore
  let money = frame.money
  let energyKw = 0
  let energyUsed = frame.energyUsedToday
  const state = origState

  // Worker-scaled efficiency: 1 worker is baseline, extra workers give +8% up to a cap.
  const workerBoost = 1 + Math.min(1, (state.workers - 1) * 0.08)

  /* Station 1: Receiving pulls from manure inventory. */
  const receivingDef = STATIONS_BY_ID.receiving
  const receiving = { ...stations.receiving }
  const receiveIntake = Math.min(
    receivingDef.throughputKgPerDay * deltaDays * receiving.efficiency * workerBoost,
    manureInventory,
    receivingDef.capacityKg - receiving.buffer,
  )
  if (receiveIntake > 0) {
    receiving.buffer += receiveIntake
    manureInventory -= receiveIntake
    receiving.status = 'running'
    energyKw += receivingDef.energyKw
  } else {
    receiving.status = manureInventory > 0
      ? (receiving.buffer >= receivingDef.capacityKg ? 'storage_full' : 'idle')
      : 'waiting_material'
  }
  receiving.progress = receiving.buffer / receivingDef.capacityKg
  stations.receiving = receiving

  /* Station 2: Preprocessing (flow). */
  cascadeFlow(stations, 'preprocessing', 'receiving', deltaDays, workerBoost, (kw) => { energyKw += kw })

  /* Station 3: Fermentation — batched. */
  const fermPatch = advanceFermentation(origState, stations, deltaDays, workerBoost, (kw) => { energyKw += kw }, notify)

  /* Stations 4..10: cascade flows crushing → finalScreening. */
  for (const id of ['crushing', 'screening', 'mixing', 'granulation', 'drying', 'cooling', 'finalScreening'] as StationId[]) {
    const prev = STATIONS[STATIONS_BY_ID[id].order - 1].id
    cascadeFlow(stations, id, prev, deltaDays, workerBoost, (kw) => { energyKw += kw })
  }

  /* Station 11: Bagging — cascade + emit fertilizer. */
  cascadeFlow(stations, 'bagging', 'finalScreening', deltaDays, workerBoost, (kw) => { energyKw += kw })

  const bagDef = STATIONS_BY_ID.bagging
  const bagging = { ...stations.bagging }
  const desired = Math.min(bagging.buffer / MANURE_TO_FERTILIZER_RATIO, state.fertilizerCapacity - fertilizer)
  if (desired > 0) {
    const consumed = desired * MANURE_TO_FERTILIZER_RATIO
    bagging.buffer -= consumed
    fertilizer += desired
    producedFertilizer += desired
    const wholeBags = Math.floor(desired / 25) // 25 kg bags
    bags += wholeBags
    bagging.status = 'running'
  } else {
    bagging.status = bagging.buffer <= 0.01 ? 'waiting_material' : 'storage_full'
  }
  bagging.progress = bagging.buffer / bagDef.capacityKg
  stations.bagging = bagging

  if (fertilizer >= state.fertilizerCapacity && origState.fertilizer < state.fertilizerCapacity && notify) {
    notify('Fertilizer storage is full!', 'warn')
  }

  const before100 = Math.floor(bagsBefore / 100)
  const after100 = Math.floor(bags / 100)
  if (after100 > before100 && notify) notify(`${after100 * 100} bags produced.`, 'success')

  /* Station 12: Storage — passive mirror. */
  const storageDef = STATIONS_BY_ID.storage
  stations.storage = {
    ...stations.storage,
    buffer: fertilizer,
    progress: fertilizer / storageDef.capacityKg,
    status: fertilizer >= state.fertilizerCapacity ? 'storage_full' : (fertilizer > 0 ? 'idle' : 'idle'),
  }

  // Energy cost: draw × hours × price
  const hours = deltaDays * 24
  const energyKwh = energyKw * hours
  money -= energyKwh * energyCost
  energyUsed += energyKwh

  return {
    ...fermPatch,
    stations,
    manure: manureInventory,
    fertilizer,
    money,
    fertilizerProducedToday: frame.fertilizerProducedToday + producedFertilizer,
    bagsProducedToday: bags,
    energyKw,
    energyUsedToday: energyUsed,
    factoryProductionRate: STATIONS_BY_ID.bagging.throughputKgPerDay / MANURE_TO_FERTILIZER_RATIO,
  }
}

function cascadeFlow(
  stations: Record<StationId, StationState>,
  id: StationId,
  prevId: StationId,
  deltaDays: number,
  workerBoost: number,
  addEnergy: (kw: number) => void,
): void {
  const def = STATIONS_BY_ID[id]
  const current = { ...stations[id] }
  const prev = { ...stations[prevId] }
  const room = def.capacityKg - current.buffer
  const move = Math.min(
    def.throughputKgPerDay * deltaDays * current.efficiency * workerBoost,
    prev.buffer,
    room,
  )
  if (move > 0) {
    current.buffer += move
    prev.buffer -= move
    current.status = 'running'
    addEnergy(def.energyKw)
    stations[prevId] = prev
  } else {
    current.status = prev.buffer <= 0.01 ? 'waiting_material' : (room <= 0.01 ? 'storage_full' : 'idle')
  }
  current.progress = current.buffer / def.capacityKg
  stations[id] = current
}

/* -------------------------------------------------------------------- */
/*  Fermentation with batches                                           */
/* -------------------------------------------------------------------- */

function advanceFermentation(
  origState: GameState,
  stations: Record<StationId, StationState>,
  deltaDays: number,
  workerBoost: number,
  addEnergy: (kw: number) => void,
  notify?: (msg: string, kind?: 'info' | 'success' | 'warn') => void,
): Partial<GameState> {
  const def = STATIONS_BY_ID.fermentation
  const ferm = { ...stations.fermentation }
  const prev = { ...stations.preprocessing }

  // 1. Pull material from preprocessing into fermentation staging buffer.
  const room = def.capacityKg - ferm.buffer
  const move = Math.min(
    def.throughputKgPerDay * deltaDays * workerBoost,
    prev.buffer,
    room,
  )
  if (move > 0) {
    ferm.buffer += move
    prev.buffer -= move
    stations.preprocessing = prev
  }

  // 2. Spawn batches when staging buffer crosses threshold.
  let batches = origState.fermentationBatches.slice()
  let seq = origState._batchSeq
  while (ferm.buffer >= FERMENTATION_BATCH_SIZE) {
    ferm.buffer -= FERMENTATION_BATCH_SIZE
    batches.push({
      id: seq++,
      kg: FERMENTATION_BATCH_SIZE,
      startedDay: origState.day,
      progress: 0,
    })
  }

  // 3. Progress active batches.
  const speed = 1 / FERMENTATION_DAYS * ferm.efficiency
  const completed: FermentationBatch[] = []
  batches = batches.map((b) => {
    const next = b.progress + deltaDays * speed
    if (next >= 1) {
      completed.push({ ...b, progress: 1 })
      return { ...b, progress: 1 }
    }
    return { ...b, progress: next }
  })

  // 4. Dump completed batches into crushing buffer.
  if (completed.length > 0) {
    const crushDef = STATIONS_BY_ID.crushing
    const crush = { ...stations.crushing }
    for (const done of completed) {
      const roomC = crushDef.capacityKg - crush.buffer
      const delivered = Math.min(done.kg, roomC)
      crush.buffer += delivered
    }
    stations.crushing = crush
    batches = batches.filter((b) => b.progress < 1)
    if (notify) notify(`Fermentation batch #${completed[0].id} completed.`, 'success')
  }

  // Status derivation.
  const anyActive = batches.length > 0
  if (anyActive || move > 0) {
    ferm.status = 'running'
    addEnergy(def.energyKw)
  } else {
    ferm.status = prev.buffer <= 0.01 && ferm.buffer <= 0.01 ? 'waiting_material' : 'idle'
  }
  ferm.progress = anyActive
    ? batches.reduce((a, b) => a + b.progress, 0) / batches.length
    : ferm.buffer / def.capacityKg
  stations.fermentation = ferm

  return { fermentationBatches: batches, _batchSeq: seq }
}

/* -------------------------------------------------------------------- */
/*  Player action                                                       */
/* -------------------------------------------------------------------- */

export function collectAndDispatch(state: GameState): Partial<GameState> {
  if (state.tractor.phase !== 'idle') return {}
  if (state.fuel < TRACTOR_FUEL_PER_TRIP) return {}
  const load = clamp(state.farmManure, 0, state.tractor.capacity)
  if (load <= 0) return {}
  return {
    farmManure: state.farmManure - load,
    tractor: { ...state.tractor, phase: 'loading', load, progress: 0 },
  }
}

/** Human-readable label for a station status. */
export const STATION_STATUS_LABEL: Record<StationStatus, string> = {
  offline: 'Offline',
  idle: 'Idle',
  running: 'Running',
  waiting_material: 'Waiting for Material',
  storage_full: 'Storage Full',
  maintenance: 'Maintenance',
}
