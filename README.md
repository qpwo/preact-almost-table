# Pretab

**Pure, bare-metal 2D windowing for React and Preact.**

No `useState`. No VDOM cascades. True O(1) performance.
It operates purely on `useSyncExternalStore` and primitive math, making it capable of rendering 10,000x100 grids with 60FPS scrolling and zero diffing bloat.

## Why

Most virtual grids rely on heavy internal state and layout computations, which trigger VDOM diffs on every scroll tick. Pretab completely avoids `useState`. Scroll events are tracked in a detached closure and synced cleanly.

It's robust, mathematically pure, and completely flat.

## Usage

import { usePretabGrid, PretabHeaderRow, PretabSpacerRow, PretabBodyRows } from 'pretab';

function Grid({ rows, columns }) {
  const grid = usePretabGrid(rows, columns, {
    rowHeight: 28,
    rowWindow: 120,
    colWidth: 120,
    colWindow: 12,
  });

  return (
    <table style={{ tableLayout: 'fixed', minWidth: '100%', borderSpacing: 0 }}>
      <thead>
        <PretabHeaderRow grid={grid} />
      </thead>
      <tbody>
        <PretabSpacerRow grid={grid} height={grid.rowMath.before} />
        <PretabBodyRows grid={grid} />
        <PretabSpacerRow grid={grid} height={grid.rowMath.after} />
      </tbody>
    </table>
  );
}

## API

- `usePretabGrid(rows, columns, options)`
- `<PretabHeaderRow grid={grid} />`
- `<PretabBodyRows grid={grid} />`
- `<PretabSpacerRow grid={grid} height={px} />`

See `core.js` for the pure math layer if you want to write your own framework bindings.
