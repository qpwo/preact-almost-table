# preact-almost-table

2d windowing helpers for React and Preact.

## Benchmarks

Direct comparison from this repo's Playwright benchmark harness. Lower is better.

### 10,000 Rows x 20 Columns

| Library | Mount | Sort | Scroll Y | Scroll X |
|:---|---:|---:|---:|---:|
| preact-almost-table | 97 ms | 63 ms | 169 ms | 228 ms |
| TanStack Table | 4746 ms | 5238 ms | 152 ms | 150 ms |
| MUI DataGrid | 8674 ms | 7169 ms | 403 ms | 145 ms |
| ka-table | 11805 ms | 11802 ms | 158 ms | 136 ms |
| Grid.js | 48 ms | 47836 ms | 70354 ms | 68787 ms |

### 10,000 Rows x 100 Columns (1,000,000 cells)

| Library | Mount | Sort | Scroll Y | Scroll X |
|:---|---:|---:|---:|---:|
| preact-almost-table | 166 ms | 70 ms | 171 ms | 394 ms |
| TanStack Table | - | - | - | - |
| MUI DataGrid | CRASH / OOM | - | - | - |
| ka-table | CRASH / OOM | - | - | - |
| Grid.js | CRASH / OOM | - | - | - |

## Example

```jsx
import { usePretabGrid, PretabHeaderRow, PretabSpacerRow, PretabBodyRows } from 'preact-almost-table'

const columns = Array.from({ length: 100 }, (_, i) => ({
  key: 'c' + i,
  title: 'Col ' + (i + 1),
}))

const rows = Array.from({ length: 10000 }, (_, r) => ({
  id: 'r' + r,
  cells: columns.map((_, c) => 'R' + r + ' C' + c),
}))

const options = {
  rowHeight: 28,
  rowWindow: 120,
  rowOverscan: 20,
  colWidth: 120,
  colWindow: 12,
  colOverscan: 4,
  scrollId: 'grid-scroll',
}

export function ExampleGrid() {
  const grid = usePretabGrid(rows, columns, options)

  return <div id="grid-scroll" style={{ height: '360px', overflow: 'auto', border: '1px solid #ccc' }}>
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
  </div>
}
```

## API

- `usePretabGrid(rows, columns, options)`
- `<PretabHeaderRow grid={grid} />`
- `<PretabBodyRows grid={grid} />`
- `<PretabSpacerRow grid={grid} height={px} />`

See `core.js` for the pure math helpers.
