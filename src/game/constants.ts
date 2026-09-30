/**
 * Static tuning constants for the simulation.
 *
 * NOTE ON REALISM
 * ----------------
 * The values below are GAME PARAMETERS chosen for playability, not
 * scientifically calibrated agricultural specifications. See
 * `REAL_WORLD_REFERENCE` at the bottom of this file for rough real-world
 * ballparks the game parameters were loosely inspired by.
 */

import type { AnimalKind } from './gameTypes'

/* -- Money & economy ------------------------------------------------------ */
export const startingMoney = 10_000

export const animalPurchaseCost: Record<AnimalKind, number> = {
  cow: 900,
  pig: 250,
  chicken: 12,
}

export const tractorCost = 6_500
export const factoryUpgradeCostBase = 1_500 // base cost, scaled per upgrade
export const workerHireCost = 400
export const workerDailyWage = 40

/** Fertilizer sale price per kg (bulk). */
export const fertilizerSellingPrice = 1.2
/** Retail price for a single 25kg bag. */
export const bagPrice = 34

/** Cost per kg-km of transport (applied to each tractor trip as a flat fee). */
export const transportCostPerTrip = 6
/** Cost per kWh of electricity used by the factory. */
export const energyCost = 0.14
/** Fuel cost per liter. */
export const fuelCost = 1.6

/* -- Animals (game units) ------------------------------------------------- */
export const cowManurePerDayKg = 30
export const pigManurePerDayKg = 6
export const chickenManurePerDayKg = 0.15

export const MANURE_PER_ANIMAL: Record<AnimalKind, number> = {
  cow: cowManurePerDayKg,
  pig: pigManurePerDayKg,
  chicken: chickenManurePerDayKg,
}

/* -- Farm storage & transport --------------------------------------------- */
export const FARM_MANURE_CAPACITY = 2_000
export const TRACTOR_CAPACITY = 400
export const TRACTOR_PHASE_SECONDS = 4
/** Liters of fuel consumed per completed round trip. */
export const TRACTOR_FUEL_PER_TRIP = 8
export const TRACTOR_FUEL_TANK = 80

/* -- Factory & economy ---------------------------------------------------- */
/** kg of raw manure required to yield 1 kg of finished fertilizer. */
export const MANURE_TO_FERTILIZER_RATIO = 3
export const DEFAULT_MANURE_CAPACITY = 1_000
export const DEFAULT_FERTILIZER_CAPACITY = 2_000

/* -- Fermentation batches (game tuning) ---------------------------------- */
/** kg needed before a new fermentation batch is spawned. */
export const FERMENTATION_BATCH_SIZE = 200
/** In-game days a fermentation batch takes to complete. */
export const FERMENTATION_DAYS = 0.8

/* -- Simulation cadence --------------------------------------------------- */
/** In-game minutes advanced per real-world second at 1× speed. */
export const GAME_MINUTES_PER_SECOND = 30

/* -- Save system ---------------------------------------------------------- */
export const SAVE_KEY = 'agriculture.save.v1'
export const SAVE_VERSION = 1

/* -------------------------------------------------------------------------
 * REAL_WORLD_REFERENCE
 * Rough ballpark numbers a small farm/facility might actually see.
 * NOT used by the simulation — kept here so contributors don't confuse
 * game tuning with real values.
 * ---------------------------------------------------------------------- */
export const REAL_WORLD_REFERENCE = {
  cowManurePerDayKg: 30,           // adult dairy cow, wet weight
  pigManurePerDayKg: 5,
  chickenManurePerDayKg: 0.12,
  fermentationDays: 21,            // aerobic composting cycle
  manureToFertilizerMassLoss: 0.5, // typical loss after composting + drying
}
