# Factory Simulation — Manure → Organic Fertilizer

A 3D interactive business simulator built with Vite + React + TypeScript and
React Three Fiber. The player runs a farm that produces manure, hauls it to a
factory, processes it through a 12-station line into bagged fertilizer, sells it,
and reinvests in upgrades.

## Run

```bash
npm install
npm run dev      # Vite dev server on http://localhost:5173/
npm run build    # tsc -b && vite build (must pass with 0 TS errors)
```

Requires a browser with WebGL / hardware acceleration for the 3D scenes. If
WebGL is unavailable, `SceneErrorBoundary` shows a fallback while the 2D UI
keeps working.

## Tech stack

- Vite, React 19, TypeScript
- `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- `framer-motion` (UI transitions), `tailwindcss` v4 (`@tailwindcss/vite`), `lucide-react`

## Architecture

**Golden rule: simulation logic is separate from rendering.** All numeric state
evolution lives in `src/game/`. React/Three components only visualize state and
dispatch player actions. Never put game calculations inside 3D mesh components.

### `src/game/` — simulation core (no React)
- `gameTypes.ts` — all `GameState` types (resources, stations, tractor, batches, UI flags).
- `constants.ts` — ALL economy/tuning values (single source of truth). Includes a
  `REAL_WORLD_REFERENCE` block: game numbers are playability tuning, NOT calibrated
  agricultural specs. Do not scatter tuning values into components.
- `factoryStations.ts` — data-driven definition of the 12 stations (label, purpose,
  input/output, capacity, throughput, energy, variant, x-position).
- `gameState.ts` — `GameStore`, a tiny hand-rolled pub/sub store + all player action
  methods (sell, refuel, buyUpgrade, save/load/reset, toggles). Exports `gameStore`.
- `simulation.ts` — the tick engine: clock, manure production, tractor state machine,
  factory pipeline (with fermentation batches), energy/wages costs, station statuses.
  `tick()` is pure and returns a state patch.
- `upgrades.ts` — data-driven upgrade defs (cost fn + `apply` fn returning a patch).
- `saveSystem.ts` — localStorage save/load/reset with version envelope; recovers
  gracefully from missing/corrupt data. Strips ephemeral fields (notifications).

### `src/hooks/`
- `useGameSimulation.ts` — mounts the RAF tick loop (respects `speed`; 0 = pause) and
  exposes live state via `useSyncExternalStore`. Mount `{ run: true }` once in App.
- `useGameTime.ts`, `useSceneNavigation.ts` — thin store selectors.

### `src/data/`
- `i18n.ts` — EN/中文 translation table + `translate(lang, key)`. Wrap user-facing strings.
- `processData.ts` — all educational content for the Process Flow scene (ranges framed
  as "typical", with a disclaimer — no single value presented as universally correct).
- `farmData.ts`, `factoryData.ts` — static scene metadata (factoryData re-exports stations).

### `src/scenes/`
- `FarmScene`, `FactoryScene`, `ProcessFlowScene` — one Canvas each.
- `cameraViewpoints.ts` — named viewpoints (`[cx,cy,cz,tx,ty,tz]`) for drei `CameraControls`.
- `farm/`, `factory/`, `process/` — scene building blocks. Factory stations are
  variant-dispatched via `StationVisual`; hover/click/glow handled by `StationHost`.
- Repeated geometry (cows, pigs, trees, fences, pallets) uses `InstancedMesh`.

### `src/components/` — 2D overlay (all pointer-events aware)
- `UIOverlay` — transparent `pointer-events-none` layer; children opt into `pointer-events-auto`.
- `TopNavigation` (animated underline, tour/day-night/sound/language/save, mobile collapse),
  `GameHUD` (corner-anchored), `ContextualHints`, `SpeedControls`, `UpgradePanel`,
  `SellPanel`, `StationInfoPanel`, `ManureCollectionPanel`, `Notifications`,
  `TourController`, `ViewpointSelector`, `SceneErrorBoundary`, `LoadingScreen`.

### `src/audio/AudioManager.ts`
Ambient audio with STUB paths (`src/assets/audio/*.mp3` not required). Swallows
autoplay-block errors; scene-driven track selection; on/off via store.

## Core gameplay loop

Animals produce manure → click the pile to load the tractor → tractor hauls to
factory (consumes fuel + trip cost) → Start Factory → receiving → preprocessing →
fermentation (batches) → crushing → screening → mixing → granulation → drying →
cooling → final screening → bagging → fertilizer inventory → Sell → money →
Upgrades → higher throughput → repeat.

## Conventions

- Keep tuning in `constants.ts`; keep station config in `factoryStations.ts`.
- Player actions go through `gameStore` methods; components never mutate state directly.
- Add exported components/functions JSDoc comments.
- No GLB models — Three.js primitives only.
- Every change must keep `npm run build` at 0 TypeScript errors.
