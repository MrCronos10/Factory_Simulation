/**
 * Fixed spatial layout for the farm scene.
 * Positions are `[x, z]` on the ground plane (y is derived per object).
 * Keeping this in one file makes it easy to tweak the whole farm.
 */

export const FARM_SIZE = 80

export const LAYOUT = {
  cowBarn:       { pos: [-18, -8] as [number, number], size: [10, 6] as [number, number] },
  pigShelter:    { pos: [-18,  10] as [number, number], size: [8, 5] as [number, number] },
  chickenCoop:   { pos: [-6,  16] as [number, number], size: [4, 3] as [number, number] },
  storageBarn:   { pos: [ 12,  14] as [number, number], size: [8, 6] as [number, number] },
  tractorShed:   { pos: [ 18,   4] as [number, number], size: [6, 5] as [number, number] },
  manureArea:    { pos: [  4,  -2] as [number, number], size: [6, 6] as [number, number] },
  factoryGate:   { pos: [ 36,  -4] as [number, number] },
  pond:          { pos: [-24,  22] as [number, number], size: [10, 8] as [number, number] },
  cornField:     { pos: [-22, -28] as [number, number], size: [22, 14] as [number, number] },
  wheatField:    { pos: [  8, -28] as [number, number], size: [24, 14] as [number, number] },
}

/** Road control points as [x, z] pairs. Rendered as thin dirt strips. */
export const ROADS: Array<{ from: [number, number]; to: [number, number]; width?: number }> = [
  // Main east-west road along the yard.
  { from: [-30, 0], to: [36, 0], width: 2.6 },
  // Spurs from road up to the barns / manure area.
  { from: [-18, 0], to: [-18, -5], width: 2 },
  { from: [-18, 0], to: [-18,  7], width: 2 },
  { from: [  4, 0], to: [  4, -2], width: 2 },
  { from: [ 12, 0], to: [ 12, 11], width: 2 },
  { from: [ 18, 0], to: [ 18,  2], width: 2 },
]

/** Fence rings, each a rectangle described by [x, z, w, d]. */
export const FENCES: Array<[number, number, number, number]> = [
  [-18, -8, 12, 10],
  [-18, 10, 10, 8],
]

/** Tree cluster centers with a per-cluster count and radius. */
export const TREE_CLUSTERS: Array<{ center: [number, number]; count: number; radius: number }> = [
  { center: [-32, -20], count: 8, radius: 6 },
  { center: [-30,  30], count: 6, radius: 5 },
  { center: [ 30,  22], count: 6, radius: 5 },
  { center: [ 30, -22], count: 7, radius: 6 },
]

/** Deterministic point-in-rect scatter, so cows always graze in the same spot. */
export function scatter(
  center: [number, number],
  size: [number, number],
  count: number,
  seed = 1,
): Array<[number, number]> {
  const [cx, cz] = center
  const [w, d] = size
  const out: Array<[number, number]> = []
  let s = seed
  for (let i = 0; i < count; i++) {
    s = (s * 9301 + 49297) % 233280
    const rx = s / 233280
    s = (s * 9301 + 49297) % 233280
    const rz = s / 233280
    out.push([cx + (rx - 0.5) * w, cz + (rz - 0.5) * d])
  }
  return out
}
