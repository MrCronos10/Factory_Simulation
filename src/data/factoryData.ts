/**
 * Static factory-scene metadata. Machine placements now live alongside their
 * simulation definitions in `game/factoryStations.ts` so runtime and layout
 * stay in sync. This module intentionally re-exports for scene code that
 * prefers a data-layer import.
 */

export { STATIONS, STATIONS_BY_ID, nextStationId } from '../game/factoryStations'
