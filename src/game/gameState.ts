/**
 * Central game state store.
 */

import type {
  GameState,
  Notification,
  SceneKey,
  SpeedSetting,
  StationId,
  StationState,
  UpgradeId,
} from './gameTypes'
import {
  DEFAULT_FERTILIZER_CAPACITY,
  DEFAULT_MANURE_CAPACITY,
  FARM_MANURE_CAPACITY,
  fertilizerSellingPrice,
  fuelCost,
  startingMoney,
  TRACTOR_CAPACITY,
  TRACTOR_FUEL_TANK,
} from './constants'
import { STATIONS } from './factoryStations'
import { applyUpgrade } from './upgrades'
import { loadGame, saveGame, clearSave, hasSave } from './saveSystem'
import { clamp } from '../utils/calculations'

function buildInitialStations(): Record<StationId, StationState> {
  const stations = {} as Record<StationId, StationState>
  for (const s of STATIONS) {
    stations[s.id] = {
      id: s.id,
      status: 'offline',
      buffer: 0,
      efficiency: 1,
      level: 1,
      progress: 0,
    }
  }
  return stations
}

/** Fresh game state used on first load / new game. */
export function createInitialGameState(): GameState {
  return {
    money: startingMoney,
    workers: 1,
    fuel: TRACTOR_FUEL_TANK,
    fuelTank: TRACTOR_FUEL_TANK,
    energyKw: 0,
    energyUsedToday: 0,

    farmManure: 0,
    farmManureCapacity: FARM_MANURE_CAPACITY,
    animals: { cow: 6, pig: 10, chicken: 20 },

    manure: 0,
    manureCapacity: DEFAULT_MANURE_CAPACITY,

    fertilizer: 0,
    fertilizerCapacity: DEFAULT_FERTILIZER_CAPACITY,

    manureProductionRate: 0,
    factoryProductionRate: 0,
    factoryEfficiency: 1,

    day: 1,
    timeOfDay: 6 * 60,
    speed: 1,

    factoryOperating: false,
    stations: buildInitialStations(),
    fermentationBatches: [],
    bagsProducedToday: 0,

    tractor: { phase: 'idle', capacity: TRACTOR_CAPACITY, load: 0, progress: 0 },

    purchasedUpgrades: {},

    selectedStation: null,
    selectedScene: 'farm',
    language: 'en',
    dayNight: 'day',
    soundEnabled: false,
    tourActive: false,

    notifications: [],
    manureGeneratedToday: 0,
    fertilizerProducedToday: 0,
    moneyEarnedToday: 0,
    _lastManureDay: 1,
    _batchSeq: 1,
  }
}

type Listener = (state: GameState) => void

export class GameStore {
  private state: GameState
  private listeners = new Set<Listener>()
  private notifSeq = 1

  constructor(initial: GameState = createInitialGameState()) {
    this.state = initial
  }

  getState(): GameState { return this.state }

  setState(patch: Partial<GameState> | ((s: GameState) => Partial<GameState>)): void {
    const next = typeof patch === 'function' ? patch(this.state) : patch
    this.state = { ...this.state, ...next }
    for (const l of this.listeners) l(this.state)
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /* -- Actions -------------------------------------------------------- */
  selectScene(scene: SceneKey): void { this.setState({ selectedScene: scene }) }
  selectStation(id: StationId | null): void { this.setState({ selectedStation: id }) }
  toggleFactory(): void { this.setState((s) => ({ factoryOperating: !s.factoryOperating })) }
  setSpeed(speed: SpeedSetting): void { this.setState({ speed }) }
  setLanguage(language: 'en' | 'zh'): void { this.setState({ language }) }
  toggleDayNight(): void { this.setState((s) => ({ dayNight: s.dayNight === 'day' ? 'night' : 'day' })) }
  toggleSound(): void { this.setState((s) => ({ soundEnabled: !s.soundEnabled })) }
  setTourActive(tourActive: boolean): void { this.setState({ tourActive }) }

  /** Sell all finished fertilizer at the bulk price. */
  sellFertilizer(kg?: number): void {
    const s = this.state
    const amount = clamp(kg ?? s.fertilizer, 0, s.fertilizer)
    if (amount <= 0) return
    const revenue = amount * fertilizerSellingPrice
    this.setState({
      fertilizer: s.fertilizer - amount,
      money: s.money + revenue,
      moneyEarnedToday: s.moneyEarnedToday + revenue,
    })
    this.notify(`Sold ${Math.round(amount)} kg fertilizer for $${revenue.toFixed(0)}.`, 'success')
  }

  refuelTractor(): void {
    const s = this.state
    const needed = s.fuelTank - s.fuel
    if (needed <= 0) return
    const price = needed * fuelCost
    if (s.money < price) { this.notify('Not enough cash to refuel.', 'warn'); return }
    this.setState({ fuel: s.fuelTank, money: s.money - price })
    this.notify(`Refueled tractor for $${price.toFixed(0)}.`, 'success')
  }

  buyUpgrade(id: UpgradeId): void {
    const s = this.state
    const patch = applyUpgrade(s, id)
    if (!patch) { this.notify('Cannot purchase upgrade right now.', 'warn'); return }
    this.setState(patch)
    this.notify('Upgrade purchased.', 'success')
  }

  /* -- Save system --------------------------------------------------- */
  save(): void {
    if (saveGame(this.state)) this.notify('Game saved.', 'success')
    else this.notify('Failed to save game.', 'warn')
  }

  load(): void {
    const loaded = loadGame()
    if (!loaded) { this.notify('No save found.', 'warn'); return }
    this.state = loaded
    for (const l of this.listeners) l(this.state)
    this.notify('Game loaded.', 'success')
  }

  reset(): void {
    clearSave()
    this.state = createInitialGameState()
    for (const l of this.listeners) l(this.state)
    this.notify('Game reset.', 'info')
  }

  hasSave(): boolean { return hasSave() }

  notify(message: string, kind: Notification['kind'] = 'info'): void {
    const n: Notification = { id: this.notifSeq++, kind, message }
    this.setState((s) => ({ notifications: [...s.notifications, n] }))
    setTimeout(() => this.dismissNotification(n.id), 3500)
  }

  dismissNotification(id: number): void {
    this.setState((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) }))
  }
}

export const gameStore = new GameStore()
