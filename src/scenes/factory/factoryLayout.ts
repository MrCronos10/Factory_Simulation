/** Fixed dimensions for the factory scene. */
export const FACTORY = {
  size: [90, 60] as [number, number],           // ground extent
  buildingSize: [78, 26] as [number, number],   // [length (x), depth (z)]
  buildingHeight: 10,
  wallColor: '#c9c4b8',
  roofColor: '#3a3a42',
  floorColor: '#8f8a80',
  yardColor: '#5a6552',
  roadColor: '#6a5a44',
  /** z of the production line inside the building. */
  lineZ: 0,
  /** Storage / warehouse extends to the right of the line. */
  warehouseX: 40,
}
