import type { ProcessStep } from '../../data/processData'

const ROW_COUNT = 2
const SPACING_X = 6
const SPACING_Z = 6

/**
 * Snake layout: cards fill row 0 left→right, row 1 right→left, and so on.
 * That way the flow arrows can chain end-to-end without ever crossing.
 */
export function layoutSteps(steps: ProcessStep[]): Array<{ step: ProcessStep; pos: [number, number, number] }> {
  const perRow = Math.ceil(steps.length / ROW_COUNT)
  const rowOffsetZ = ((ROW_COUNT - 1) * SPACING_Z) / 2
  return steps.map((step, i) => {
    const row = Math.floor(i / perRow)
    const col = i % perRow
    const dir = row % 2 === 0 ? 1 : -1
    const orderedCol = dir === 1 ? col : perRow - 1 - col
    const x = (orderedCol - (perRow - 1) / 2) * SPACING_X
    const z = row * SPACING_Z - rowOffsetZ
    return { step, pos: [x, 1.4, z] }
  })
}
