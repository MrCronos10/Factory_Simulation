/**
 * Educational content for the Process Flow scene.
 *
 * SCIENCE / REALISM NOTE
 * -----------------------
 * The values below are ILLUSTRATIVE simulation parameters, not universal
 * agricultural standards. Real composting and fertilizer manufacturing
 * outcomes depend on feedstock, equipment, climate, moisture, aeration,
 * pathogen targets and product spec. The game surfaces ranges — not
 * single "correct" numbers.
 */

export type IconName =
  | 'sprout'
  | 'truck'
  | 'package'
  | 'flame'
  | 'filter'
  | 'hammer'
  | 'blend'
  | 'gripVertical'
  | 'sun'
  | 'wind'
  | 'listFilter'
  | 'packageCheck'
  | 'warehouse'
  | 'wheat'

export interface ProcessParam {
  label: string
  /** Typical operating range — inclusive, human-readable. */
  typicalRange: string
  note?: string
}

export interface ProcessLearn {
  whatHappens: string
  whyNeeded: string
  whatGoesIn: string
  whatComesOut: string
  whatAffectsIt?: string
  whatCanGoWrong: string
}

export interface ProcessStep {
  id: string
  label: string
  shortDesc: string
  input: string
  output: string
  icon: IconName
  /** Optional education-mode parameters. Framed as ranges, not absolutes. */
  params?: ProcessParam[]
  learn: ProcessLearn
}

/** Global disclaimer surfaced in the Learn panel. */
export const PROCESS_DISCLAIMER =
  'Numbers shown are typical simulation ranges. Real-world results depend on feedstock, equipment, moisture, aeration, climate and product requirements — there is no single "correct" value.'

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'farm-manure',
    label: 'Farm Manure',
    shortDesc: 'Livestock produce manure that piles up at the source.',
    input: 'Feed, water, animal metabolism',
    output: 'Raw manure',
    icon: 'sprout',
    learn: {
      whatHappens: 'Housed animals excrete manure that accumulates in barns and pens.',
      whyNeeded: 'This is the primary feedstock for the whole operation.',
      whatGoesIn: 'Animal feed, water, bedding materials.',
      whatComesOut: 'Fresh manure — high in moisture, nutrients and pathogens.',
      whatAffectsIt: 'Diet, herd size, bedding choice, barn cleaning frequency.',
      whatCanGoWrong: 'Runoff, odor and pathogen risks if manure sits too long uncollected.',
    },
  },
  {
    id: 'collection',
    label: 'Collection',
    shortDesc: 'Manure is gathered from housing into a central pile.',
    input: 'Fresh manure',
    output: 'Staged pile',
    icon: 'truck',
    learn: {
      whatHappens: 'Skid steers, loaders or scrapers move manure to a covered storage area.',
      whyNeeded: 'Consolidation makes transport and processing efficient.',
      whatGoesIn: 'Manure from multiple barns and pens.',
      whatComesOut: 'A staged pile ready for pickup.',
      whatAffectsIt: 'Labor availability, layout of the farm, weather.',
      whatCanGoWrong: 'Contamination with foreign objects; nutrient leaching in rain.',
    },
  },
  {
    id: 'receiving',
    label: 'Receiving',
    shortDesc: 'The factory accepts and stages incoming loads.',
    input: 'Manure delivered by tractor',
    output: 'Metered feedstock',
    icon: 'package',
    learn: {
      whatHappens: 'Loads are weighed and dumped into a receiving pit or hopper.',
      whyNeeded: 'Even feed rates protect downstream equipment.',
      whatGoesIn: 'Loose manure from a truck or tractor.',
      whatComesOut: 'A steady flow of raw material onto the line.',
      whatAffectsIt: 'Pit size, moisture, delivery schedule.',
      whatCanGoWrong: 'Surge loads that overwhelm downstream stations.',
    },
  },
  {
    id: 'fermentation',
    label: 'Composting / Fermentation',
    shortDesc: 'Microbial activity stabilizes the material over time.',
    input: 'Raw manure',
    output: 'Stabilized compost',
    icon: 'flame',
    params: [
      { label: 'Temperature',   typicalRange: '55 – 65 °C', note: 'Thermophilic phase; depends on turning + insulation' },
      { label: 'Moisture',      typicalRange: '50 – 60 %',  note: 'Too dry stalls microbes; too wet goes anaerobic' },
      { label: 'Oxygen',        typicalRange: '≥ 5 % (aerobic)', note: 'Maintained by turning or forced aeration' },
      { label: 'Duration',      typicalRange: '2 – 12 weeks', note: 'Varies with feedstock and process style' },
      { label: 'C:N ratio',     typicalRange: '25 – 35 : 1', note: 'Balance carbon with nitrogen for efficient composting' },
    ],
    learn: {
      whatHappens: 'Aerobic microorganisms break down organic matter, releasing heat.',
      whyNeeded: 'To stabilize the material, reduce pathogens and lock in nutrients.',
      whatGoesIn: 'Raw or lightly screened manure with adjusted moisture / bulking agents.',
      whatComesOut: 'Darker, earthier, more stable compost.',
      whatAffectsIt: 'Moisture, oxygen, temperature, particle size, C:N balance, turning frequency.',
      whatCanGoWrong: 'Anaerobic zones (odor), overheating (nutrient loss), premature curing.',
    },
  },
  {
    id: 'preprocessing',
    label: 'Pre-processing',
    shortDesc: 'Coarse contaminants and oversize material are removed.',
    input: 'Stabilized compost',
    output: 'Clean feedstock',
    icon: 'filter',
    learn: {
      whatHappens: 'Foreign objects and clumps are separated with screens and magnets.',
      whyNeeded: 'Protects downstream mills and improves finished-product quality.',
      whatGoesIn: 'Compost that may include stones, bedding, plastic, metal.',
      whatComesOut: 'Cleaner material sized for milling.',
      whatAffectsIt: 'Screen aperture, feed rate, moisture.',
      whatCanGoWrong: 'Missed contaminants damage crushers; over-screening slows throughput.',
    },
  },
  {
    id: 'crushing',
    label: 'Crushing / Screening',
    shortDesc: 'Compost is broken down to a uniform particle size.',
    input: 'Cleaned compost',
    output: 'Uniform particles',
    icon: 'hammer',
    learn: {
      whatHappens: 'Hammer mills or shredders reduce particle size; a screen recycles oversize.',
      whyNeeded: 'A uniform feed is essential for granulation and blending.',
      whatGoesIn: 'Cleaned compost clumps.',
      whatComesOut: 'Fine, evenly-sized material.',
      whatAffectsIt: 'Blade wear, moisture, feed consistency.',
      whatCanGoWrong: 'Wet material blinds screens; dust from over-dry material.',
    },
  },
  {
    id: 'mixing',
    label: 'Mixing',
    shortDesc: 'Blend organics, additives and moisture to spec.',
    input: 'Uniform particles + additives',
    output: 'Blended feed',
    icon: 'blend',
    learn: {
      whatHappens: 'A twin-shaft or ribbon mixer blends inputs to a consistent recipe.',
      whyNeeded: 'Product must meet a target nutrient profile (e.g. N-P-K).',
      whatGoesIn: 'Sized compost, mineral additives, optional binders, moisture.',
      whatComesOut: 'A homogeneous feed ready for granulation.',
      whatAffectsIt: 'Mixing time, shaft geometry, moisture, additive dosing.',
      whatCanGoWrong: 'Segregation, wet spots, incorrect additive dosing.',
    },
  },
  {
    id: 'granulation',
    label: 'Granulation',
    shortDesc: 'Feed is rolled into uniform granules.',
    input: 'Blended feed',
    output: 'Wet granules',
    icon: 'gripVertical',
    learn: {
      whatHappens: 'Material rolls inside an inclined drum, growing into round granules.',
      whyNeeded: 'Granular product spreads evenly and stores well.',
      whatGoesIn: 'Moist blended feed.',
      whatComesOut: 'Round, still-moist pellets.',
      whatAffectsIt: 'Drum speed, angle, residence time, moisture, feed rate.',
      whatCanGoWrong: 'Over- or under-sized granules; sticking to drum walls.',
    },
  },
  {
    id: 'drying',
    label: 'Drying',
    shortDesc: 'Moisture is reduced to preserve shelf life.',
    input: 'Wet granules',
    output: 'Dry granules',
    icon: 'sun',
    learn: {
      whatHappens: 'Warm air passes through a rotating drum to evaporate moisture.',
      whyNeeded: 'Excess moisture rots product and clogs downstream equipment.',
      whatGoesIn: 'Wet granules straight from the granulator.',
      whatComesOut: 'Granules at a target moisture (often single-digit %).',
      whatAffectsIt: 'Inlet temperature, airflow, residence time, feed moisture.',
      whatCanGoWrong: 'Over-drying degrades nutrients; under-drying causes clumping and mold.',
    },
  },
  {
    id: 'cooling',
    label: 'Cooling',
    shortDesc: 'Granules are cooled to safe handling temperature.',
    input: 'Hot dry granules',
    output: 'Cool granules',
    icon: 'wind',
    learn: {
      whatHappens: 'Ambient or chilled airflow cools granules on a conveyor or in a cooler.',
      whyNeeded: 'Cool product resists caking and is safer to bag.',
      whatGoesIn: 'Hot granules from the dryer.',
      whatComesOut: 'Cool, hard granules ready for final screening.',
      whatAffectsIt: 'Airflow, ambient temperature, granule size.',
      whatCanGoWrong: 'Insufficient cooling causes bag-in-bag condensation.',
    },
  },
  {
    id: 'final-screening',
    label: 'Final Screening',
    shortDesc: 'Acceptable size is separated from oversize and fines.',
    input: 'Cool granules',
    output: 'Graded product',
    icon: 'listFilter',
    learn: {
      whatHappens: 'A vibrating screen sorts by size; fines and oversize are recycled.',
      whyNeeded: 'The bagged product must meet a size spec.',
      whatGoesIn: 'A mix of granule sizes.',
      whatComesOut: 'A tight size distribution of finished product.',
      whatAffectsIt: 'Screen aperture, oscillation, feed rate.',
      whatCanGoWrong: 'Blinded screens; too much recycle load.',
    },
  },
  {
    id: 'bagging',
    label: 'Bagging',
    shortDesc: 'Finished product is filled, sealed and labeled.',
    input: 'Graded fertilizer',
    output: 'Sealed bags',
    icon: 'packageCheck',
    learn: {
      whatHappens: 'A dosed weight of product is dropped into a bag, then sealed and labeled.',
      whyNeeded: 'Bags define the unit of sale and protect the product in storage.',
      whatGoesIn: 'Graded, cool granules.',
      whatComesOut: 'Uniform bags at a nominal weight (e.g. 25 kg).',
      whatAffectsIt: 'Fill speed, weigh-hopper accuracy, bag material.',
      whatCanGoWrong: 'Under/over-fill; seal defects; label misprints.',
    },
  },
  {
    id: 'storage',
    label: 'Storage',
    shortDesc: 'Pallets of bags wait in the warehouse.',
    input: 'Sealed bags',
    output: 'Palletized inventory',
    icon: 'warehouse',
    learn: {
      whatHappens: 'Bags are palletized and stored in a dry, ventilated warehouse.',
      whyNeeded: 'Buffers production against shipping cadence.',
      whatGoesIn: 'Sealed bags off the bagger.',
      whatComesOut: 'Pallets ready for shipment.',
      whatAffectsIt: 'Humidity, ventilation, stack height, FIFO discipline.',
      whatCanGoWrong: 'Moisture ingress; caking; forklift damage.',
    },
  },
  {
    id: 'finished',
    label: 'Finished Fertilizer',
    shortDesc: 'Product is sold and applied to fields — closing the loop.',
    input: 'Palletized bags',
    output: 'Revenue + healthier soil',
    icon: 'wheat',
    learn: {
      whatHappens: 'Buyers apply the finished fertilizer to crops.',
      whyNeeded: 'Returns nutrients from manure to the soil in a stable, storable form.',
      whatGoesIn: 'Bags of finished granular fertilizer.',
      whatComesOut: 'Farm revenue and improved soil organic matter.',
      whatAffectsIt: 'Application rate, timing, crop type, weather.',
      whatCanGoWrong: 'Over-application (runoff); wrong timing reduces uptake.',
    },
  },
]
