/** Pretab core helpers for 2D option normalization and window math. */
export const PRETAB_DEFAULTS = Object.freeze({
  rowHeight: 28,
  rowWindow: 120,
  rowOverscan: 20,
  colWidth: 120,
  colWindow: 12,
  colOverscan: 4,
  scrollId: null,
})

export function readPretabOptions(options = {}) {
  return {
    rowHeight: readWholeNumber(options.rowHeight, PRETAB_DEFAULTS.rowHeight, 1),
    rowWindow: readWholeNumber(options.rowWindow, PRETAB_DEFAULTS.rowWindow, 1),
    rowOverscan: readWholeNumber(options.rowOverscan, PRETAB_DEFAULTS.rowOverscan, 0),
    colWidth: readWholeNumber(options.colWidth, PRETAB_DEFAULTS.colWidth, 1),
    colWindow: readWholeNumber(options.colWindow, PRETAB_DEFAULTS.colWindow, 1),
    colOverscan: readWholeNumber(options.colOverscan, PRETAB_DEFAULTS.colOverscan, 0),
    scrollId: readScrollId(options.scrollId),
  }
}

export function readPretabStart(scrollVal, size, overscan) {
  const pos = readNumber(scrollVal, 0)
  return Math.max(0, Math.floor(Math.max(0, pos) / size) - overscan)
}

export function readPretabWindow(totalItems, start, itemSize, windowSize, overscan) {
  const safeTotal = readWholeNumber(totalItems, 0, 0)
  const safeStart = Math.min(Math.max(0, Math.floor(readNumber(start, 0))), safeTotal)
  const visibleCount = Math.min(safeTotal - safeStart, windowSize + overscan * 2)
  const end = safeStart + visibleCount

  return {
    start: safeStart,
    end,
    visibleCount,
    before: safeStart * itemSize,
    after: Math.max(0, (safeTotal - end) * itemSize),
    itemSize,
  }
}

function readWholeNumber(value, fallback, min) {
  const next = Math.floor(readNumber(value, fallback))
  if (!Number.isFinite(next)) return fallback
  if (next < min) return fallback
  return next
}

function readNumber(value, fallback) {
  const next = Number(value)
  if (!Number.isFinite(next)) return fallback
  return next
}

function readScrollId(value) {
  if (typeof value !== 'string') return null
  if (!value) return null
  return value
}
