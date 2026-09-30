/**
 * Reusable named camera viewpoints for each scene.
 * Each viewpoint is `[camX, camY, camZ, targetX, targetY, targetZ]`, matching
 * drei's `CameraControls.setLookAt(...)` signature.
 */

export type ViewpointKey =
  | 'farmOverview'
  | 'farmManureArea'
  | 'factoryOverview'
  | 'receivingArea'
  | 'fermentationArea'
  | 'productionLine'
  | 'baggingArea'
  | 'warehouse'
  | 'processOverview'

export type CameraShot = [number, number, number, number, number, number]

export const VIEWPOINTS: Record<ViewpointKey, CameraShot> = {
  farmOverview:      [22, 22, 34,  0, 0, 0],
  farmManureArea:    [10,  8, 12,  4, 0, -2],

  factoryOverview:   [0, 24, 44,  0, 2, 0],
  receivingArea:     [-30, 10, 12, -30, 1.5, 0],
  fermentationArea:  [-18, 10, 12, -19, 1.5, 0],
  productionLine:    [-2, 18, 26,   0, 2, 0],
  baggingArea:       [22, 10, 12,  22, 1.5, 0],
  warehouse:         [32, 12, 12,  32, 1.5, 0],

  processOverview:   [0, 12, 22,   0, 1.5, 0],
}

export const FACTORY_VIEWPOINTS: Array<{ key: ViewpointKey; labelKey: string }> = [
  { key: 'factoryOverview',  labelKey: 'view.overview' },
  { key: 'receivingArea',    labelKey: 'view.receiving' },
  { key: 'fermentationArea', labelKey: 'view.fermentation' },
  { key: 'productionLine',   labelKey: 'view.production' },
  { key: 'baggingArea',      labelKey: 'view.bagging' },
  { key: 'warehouse',        labelKey: 'view.warehouse' },
]
