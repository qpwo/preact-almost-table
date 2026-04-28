#!/usr/bin/env node
/** Pretab core 2D self-test. */
import assert from 'node:assert/strict'
import {
  PRETAB_DEFAULTS,
  readPretabOptions,
  readPretabStart,
  readPretabWindow,
} from './core.js'

main()

function main() {
  assert.deepEqual(readPretabOptions(), PRETAB_DEFAULTS)
  assert.deepEqual(
    readPretabOptions({ rowHeight: -1, rowWindow: 0, rowOverscan: -1, colWidth: -1, colWindow: -1, colOverscan: -1, scrollId: '' }),
    PRETAB_DEFAULTS,
  )

  assert.equal(readPretabStart(0, 28, 20), 0)
  assert.equal(readPretabStart(280, 28, 5), 5)
  assert.equal(readPretabStart(27.9, 28, 5), 0)
  assert.equal(readPretabStart(-10, 28, 5), 0)

  assert.deepEqual(
    readPretabWindow(1000, 50, 30, 100, 10),
    {
      start: 50,
      end: 170,
      visibleCount: 120,
      before: 1500,
      after: 24900,
      itemSize: 30,
    },
  )

  assert.deepEqual(
    readPretabWindow(7, 100, 10, 5, 2),
    {
      start: 7,
      end: 7,
      visibleCount: 0,
      before: 70,
      after: 0,
      itemSize: 10,
    },
  )

  console.log('pretab-test ok')
}
