import { MANURE_TO_FERTILIZER_RATIO, fertilizerSellingPrice } from '../game/constants'

/** How many kg of fertilizer a given amount of manure can yield. */
export function manureToFertilizer(manureKg: number): number {
  return manureKg / MANURE_TO_FERTILIZER_RATIO
}

/** Sale value of a given quantity of fertilizer. */
export function fertilizerValue(fertilizerKg: number): number {
  return fertilizerKg * fertilizerSellingPrice
}

/** Clamp a number to a range. */
export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}
