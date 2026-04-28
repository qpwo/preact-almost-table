/** Pretab hook and tiny table helpers for 2D row/col windowed rendering in Preact/React. */
import { useEffect, useMemo, useSyncExternalStore } from 'react'
import {
  PRETAB_DEFAULTS,
  readPretabOptions,
  readPretabStart,
  readPretabWindow,
} from './core.js'

export {
  PRETAB_DEFAULTS,
  readPretabOptions,
  readPretabStart,
  readPretabWindow,
}

export function usePretabGrid(rows, columns, options = PRETAB_DEFAULTS) {
  const settings = useMemo(readPretabSettings.bind(null, options), [
    options?.rowHeight, options?.rowWindow, options?.rowOverscan,
    options?.colWidth, options?.colWindow, options?.colOverscan,
    options?.scrollId,
  ])

  const store = useMemo(createPretabStore.bind(null, settings), [
    settings.rowHeight, settings.rowOverscan,
    settings.colWidth, settings.colOverscan,
  ])
  const pos = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)

  useEffect(syncPretabScroll.bind(null, store, settings.scrollId), [store, settings.scrollId])

  return useMemo(() => {
    const rowMath = readPretabWindow(rows.length, pos.rowStart, settings.rowHeight, settings.rowWindow, settings.rowOverscan)
    const colMath = readPretabWindow(columns.length, pos.colStart, settings.colWidth, settings.colWindow, settings.colOverscan)

    return {
      rowMath,
      colMath,
      visibleRows: rows.slice(rowMath.start, rowMath.end),
      visibleCols: columns.slice(colMath.start, colMath.end),
    }
  }, [
    rows, columns, pos.rowStart, pos.colStart,
    settings.rowHeight, settings.rowWindow, settings.rowOverscan,
    settings.colWidth, settings.colWindow, settings.colOverscan,
  ])
}

export function PretabHeaderRow({ grid }) {
  const { colMath, visibleCols } = grid
  return (
    <tr>
      {colMath.before > 0 && <th style={readPretabSpacerStyle(0, colMath.before)} />}
      {visibleCols.map(col => renderPretabHeaderCell(col, colMath.itemSize))}
      {colMath.after > 0 && <th style={readPretabSpacerStyle(0, colMath.after)} />}
    </tr>
  )
}

export function PretabBodyRows({ grid }) {
  return grid.visibleRows.map(row => renderPretabRow(row, grid))
}

export function PretabSpacerRow({ grid, height }) {
  if (height <= 0 || !grid.colMath) return null

  let colSpan = grid.visibleCols.length
  if (grid.colMath.before > 0) colSpan += 1
  if (grid.colMath.after > 0) colSpan += 1

  if (colSpan === 0) return null

  return (
    <tr aria-hidden="true">
      <td colSpan={colSpan} style={readPretabSpacerStyle(height, 0)} />
    </tr>
  )
}

function renderPretabHeaderCell(column, width) {
  return <th key={column.key} style={{ width: width + 'px', minWidth: width + 'px', maxWidth: width + 'px', overflow: 'hidden' }}>{column.title}</th>
}

function renderPretabRow(row, grid) {
  const { colMath } = grid
  const visibleCells = row.cells.slice(colMath.start, colMath.end)

  return (
    <tr key={row.id}>
      {colMath.before > 0 && <td style={readPretabSpacerStyle(0, colMath.before)} />}
      {visibleCells.map(renderPretabCell)}
      {colMath.after > 0 && <td style={readPretabSpacerStyle(0, colMath.after)} />}
    </tr>
  )
}

function renderPretabCell(cell, index) {
  return <td key={index}>{cell}</td>
}

function readPretabSpacerStyle(height, width) {
  return {
    height: height > 0 ? height + 'px' : undefined,
    width: width > 0 ? width + 'px' : undefined,
    minWidth: width > 0 ? width + 'px' : undefined,
    padding: 0,
    border: 0,
  }
}

function readPretabSettings(options) {
  return readPretabOptions(options ?? PRETAB_DEFAULTS)
}

function syncPretabScroll(store, scrollId) {
  const element = readScrollElement(scrollId)
  if (!element) return
  return store.attach(element)
}

function readScrollElement(scrollId) {
  if (scrollId) return document.getElementById(scrollId)
  return document.scrollingElement ?? document.documentElement
}

function createPretabStore(settings) {
  let element = null
  let snapshot = { rowStart: 0, colStart: 0 }
  const listeners = new Set()

  return { attach, subscribe, getSnapshot }

  function attach(nextElement) {
    if (element === nextElement) {
      update()
      return detach
    }
    detach()
    element = nextElement
    update()
    element.addEventListener('scroll', update, { passive: true })
    return detach
  }

  function detach() {
    if (!element) return
    element.removeEventListener('scroll', update)
    element = null
  }

  function subscribe(listener) {
    listeners.add(listener)
    return unsubscribe.bind(null, listener)
  }

  function unsubscribe(listener) {
    listeners.delete(listener)
  }

  function getSnapshot() {
    return snapshot
  }

  function update() {
    const nextRow = readPretabStart(element?.scrollTop ?? 0, settings.rowHeight, settings.rowOverscan)
    const nextCol = readPretabStart(element?.scrollLeft ?? 0, settings.colWidth, settings.colOverscan)

    if (nextRow === snapshot.rowStart && nextCol === snapshot.colStart) return
    snapshot = { rowStart: nextRow, colStart: nextCol }
    emit()
  }

  function emit() {
    for (const listener of listeners) {
      listener()
    }
  }
}
