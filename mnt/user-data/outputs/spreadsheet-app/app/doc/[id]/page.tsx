"use client";

/**
 * Spreadsheet Editor — /app/doc/[id]/page.tsx
 *
 * PURPOSE:
 *   The main spreadsheet editor. This is where all the pieces come together:
 *   - Loads (or creates) the document from mock data
 *   - Holds the entire spreadsheet cell state
 *   - Handles cell edits → formula re-evaluation → state update
 *   - Simulates auto-save (idle → saving → saved)
 *   - Renders Toolbar, Presence, and Grid
 *
 * STATE MANAGEMENT:
 *   All cell data lives in a single `cells` state:
 *     cells = {
 *       "A1": { raw: "10",          computed: "10" },
 *       "A2": { raw: "20",          computed: "20" },
 *       "A3": { raw: "=SUM(A1,A2)", computed: "30" },
 *     }
 *
 *   When a cell changes:
 *     1. Store the new raw value in `cells`
 *     2. Call recomputeAllCells() to re-evaluate every formula
 *     3. Start the auto-save timer
 *
 *   WHY RECOMPUTE ALL?
 *     Changing A1 could affect A3 (which has =SUM(A1,A2)).
 *     A full recompute on every edit is simple and fast for a 10×10 grid.
 *     For large grids, dependency graphs would be used instead.
 *
 * NOTE: When Firebase is added, replace the local useState with
 *       real-time listeners. The cell update logic stays the same.
 */

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Toolbar from "@/components/Toolbar";
import Grid from "@/components/Grid";
import Presence from "@/components/Presence";
import type { CellAddress, CellMap, SaveStatus } from "@/types/cell";
import { evaluateCell, recomputeAllCells } from "@/lib/formulas";
import { MOCK_DOCUMENTS, MOCK_USERS } from "@/lib/mockData";

export default function SpreadsheetEditorPage() {
  const params   = useParams();
  const router   = useRouter();
  const docId    = params.id as string;

  // ── Load document from mock data (replace with Firebase later) ──────────────
  const mockDoc = MOCK_DOCUMENTS.find((d) => d.id === docId);

  // ── Core State ─────────────────────────────────────────────────────────────
  const [title, setTitle]               = useState(mockDoc?.title ?? "Untitled Spreadsheet");
  const [cells, setCells]               = useState<CellMap>(mockDoc?.cells ?? {});
  const [selectedCell, setSelectedCell] = useState<CellAddress | null>("A1");
  const [saveStatus, setSaveStatus]     = useState<SaveStatus>("idle");

  // ── Auto-save simulation ────────────────────────────────────────────────────
  // Whenever cells or title change, simulate a "saving" → "saved" cycle.
  useEffect(() => {
    if (saveStatus === "idle") return; // don't run on mount
    setSaveStatus("saving");
    const timer = setTimeout(() => {
      setSaveStatus("saved");
      // Return to idle after a few seconds
      const resetTimer = setTimeout(() => setSaveStatus("idle"), 2500);
      return () => clearTimeout(resetTimer);
    }, 800);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells, title]);

  // ── Handle cell value change ────────────────────────────────────────────────
  /**
   * Called by Cell or the formula bar when a user types a new value.
   *
   * Flow:
   *   1. Evaluate the new cell immediately to get its computed value
   *   2. Build an updated CellMap with the new raw + computed value
   *   3. Recompute all cells so formulas that depend on this cell update too
   *   4. Trigger auto-save
   */
  const handleCellChange = useCallback(
    (address: CellAddress, rawValue: string) => {
      setCells((prev) => {
        // Step 1: create updated map with new cell
        const updated: CellMap = {
          ...prev,
          [address]: {
            raw:      rawValue,
            computed: rawValue, // placeholder; will be filled in step 2
          },
        };

        // Step 2: evaluate just this cell first (it might reference others)
        const computed = evaluateCell(rawValue, updated);
        updated[address] = { raw: rawValue, computed };

        // Step 3: recompute ALL cells so dependents update
        return recomputeAllCells(updated);
      });

      // Step 4: trigger save
      setSaveStatus("saving");
    },
    []
  );

  // ── Handle title change ─────────────────────────────────────────────────────
  function handleTitleChange(newTitle: string) {
    setTitle(newTitle);
    setSaveStatus("saving");
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col"
      style={{ height: "100vh", background: "var(--bg-base)", overflow: "hidden" }}
    >
      {/* ── Toolbar with Presence ──────────────────────────────────────────── */}
      <Toolbar
        title={title}
        onTitleChange={handleTitleChange}
        saveStatus={saveStatus}
        onBack={() => router.push("/")}
        presenceSlot={<Presence users={MOCK_USERS} />}
      />

      {/* ── Spreadsheet Grid ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <Grid
          cells={cells}
          selectedCell={selectedCell}
          onSelectCell={setSelectedCell}
          onCellChange={handleCellChange}
          activeUsers={MOCK_USERS}
        />
      </div>

      {/* ── Status Bar ─────────────────────────────────────────────────────── */}
      <StatusBar selectedCell={selectedCell} cells={cells} docId={docId} />
    </div>
  );
}

// ─── Status Bar ───────────────────────────────────────────────────────────────
/**
 * A thin footer bar showing the currently selected cell's address
 * and any helpful context (formula hint, cell count, etc.)
 */
function StatusBar({
  selectedCell,
  cells,
  docId,
}: {
  selectedCell: CellAddress | null;
  cells: CellMap;
  docId: string;
}) {
  const nonEmptyCells = Object.keys(cells).length;
  const selectedData  = selectedCell ? cells[selectedCell] : undefined;
  const isFormula     = (selectedData?.raw ?? "").startsWith("=");

  return (
    <div
      className="flex items-center justify-between px-4 shrink-0"
      style={{
        height: 28,
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      {/* Left: selected cell info */}
      <div className="flex items-center gap-4">
        {selectedCell && (
          <span
            className="text-xs"
            style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}
          >
            {selectedCell}
            {isFormula && (
              <span style={{ color: "#60a5fa", marginLeft: 8 }}>
                {selectedData?.raw}
              </span>
            )}
          </span>
        )}
      </div>

      {/* Right: cell count + doc id */}
      <div className="flex items-center gap-4">
        <span
          className="text-xs"
          style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}
        >
          {nonEmptyCells} cell{nonEmptyCells !== 1 ? "s" : ""} used
        </span>
        <span
          className="text-xs"
          style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}
        >
          {docId}
        </span>
      </div>
    </div>
  );
}
