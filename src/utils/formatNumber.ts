/** Formats a number as compact currency (e.g. 12345 → "$12,345"). */
export function formatMoney(n: number): string {
  return `$${Math.round(n).toLocaleString('en-US')}`
}

/** Formats a mass in kg with thousands separators. */
export function formatKg(n: number): string {
  return `${Math.round(n).toLocaleString('en-US')} kg`
}

/** Formats a 0..1 ratio as a whole-number percentage. */
export function formatPercent(n: number): string {
  return `${Math.round(n * 100)}%`
}
