"use client";

/**
 * Grid — The main 10×10 spreadsheet grid.
 *
 * PURPOSE:
 *   Renders the full grid with:
 *     - A sticky top row of column headers (A–J)
 *     - A sticky left column of row numbers (1–10)
 *     - 100 editable Cell components
 *     - A formula bar above the grid showing the selected cell's raw value
 *
 *   KEYBOARD NAVIGATION: Arrow keys move selection between cells.
 *   FORMULA BAR: Editable at the top; changes sync back to the cell.
 *
 * PROPS:
 *   - cells: CellMap                                 — all cell data
 *   - selectedCell: CellAddress | null               — currently selected cell
 *   - onSelectCell: (addr) => void                   — change selection
 *   - onCellChange: (addr, value) => void            — cell value changed
 *   - activeUsers: ActiveUser[]                       — for presence indicators
 */

import { useCallback } from "react";
import Cell from "@/components/Cell";
import type { CellAddress, CellMap, ActiveUser } from "@/types/cell";
import { COLUMN_LABELS, ROW_LABELS } from "@/types/cell";

interface GridProps {
  cells: CellMap;
  selectedCell: CellAddress | null;
  onSelectCell: (address: CellAddress) => void;
  onCellChange: (address: CellAddress, value: string) => void;
  activeUsers: ActiveUser[];
}

// Build a map of cell → user color for presence indicators
function buildPresenceMap(users: ActiveUser[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const user of users) {
    if (user.activeCell) {
      map[user.activeCell] = user.color;
    }
  }
  return map;
}

export default function Grid({
  cells,
  selectedCell,
  onSelectCell,
  onCellChange,
  activeUsers,
}: GridProps) {
  const presenceMap = buildPresenceMap(activeUsers);

  // ── Arrow-key navigation ────────────────────────────────────────────────────
  const handleGridKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!selectedCell) return;

      const col = selectedCell[0]; // "A"–"J"
      const row = parseInt(selectedCell.slice(1)); // 1–10

      const colIndex = COLUMN_LABELS.indexOf(col as (typeof COLUMN_LABELS)[number]);

      let newCol = colIndex;
      let newRow = row;

      switch (e.key) {
        case "ArrowRight": newCol = Math.min(9, colIndex + 1); break;
        case "ArrowLeft":  newCol = Math.max(0, colIndex - 1); break;
        case "ArrowDown":  newRow = Math.min(10, row + 1); break;
        case "ArrowUp":    newRow = Math.max(1, row - 1); break;
        default: return; // don't intercept other keys
      }

      e.preventDefault();
      onSelectCell(`${COLUMN_LABELS[newCol]}${newRow}`);
    },
    [selectedCell, onSelectCell]
  );

  // ── Currently selected cell's raw value for formula bar ────────────────────
  const selectedData    = selectedCell ? cells[selectedCell] : undefined;
  const formulaBarValue = selectedData?.raw ?? "";

  return (
    <div
      className="flex flex-col h-full"
      onKeyDown={handleGridKeyDown}
      role="grid"
      aria-label="Spreadsheet grid"
    >
      {/* ── Formula Bar ──────────────────────────────────────────────────────── */}
      <div className="formula-bar shrink-0" style={{ height: 34 }}>
        {/* Cell reference badge */}
        <div className="formula-bar-cell-ref">
          {selectedCell ?? "—"}
        </div>

        {/* Fx icon */}
        <span
          className="px-3 text-xs font-bold select-none"
          style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}
        >
          fx
        </span>

        {/* Formula input — edits the selected cell */}
        <input
          type="text"
          value={formulaBarValue}
          placeholder={selectedCell ? "Type a value or formula…" : "Select a cell"}
          onChange={(e) => {
            if (selectedCell) {
              onCellChange(selectedCell, e.target.value);
            }
          }}
          aria-label="Formula bar"
        />
      </div>

      {/* ── Scrollable Grid ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto" style={{ background: "var(--bg-base)" }}>
        <div className="spreadsheet-grid" style={{ minWidth: "fit-content" }}>

          {/* ── Top-left corner (empty cell) ─────────────────────────────────── */}
          <div
            className="grid-col-header"
            style={{ position: "sticky", top: 0, left: 0, zIndex: 20 }}
          />

          {/* ── Column Headers: A–J ──────────────────────────────────────────── */}
          {COLUMN_LABELS.map((col) => (
            <div key={col} className="grid-col-header">
              {col}
            </div>
          ))}

          {/* ── Rows: 1–10 ───────────────────────────────────────────────────── */}
          {ROW_LABELS.map((row) => (
            <div key={row} role="row" style={{ display: "contents" }}>
              {/* Row number label */}
              <div className="grid-row-label">{row}</div>

              {/* Data cells in this row */}
              {COLUMN_LABELS.map((col) => {
                const addr: CellAddress = `${col}${row}`;
                return (
                  <Cell
                    key={addr}
                    address={addr}
                    data={cells[addr]}
                    isSelected={selectedCell === addr}
                    onSelect={onSelectCell}
                    onChange={onCellChange}
                    otherUserColor={presenceMap[addr]}
                  />
                );
              })}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
