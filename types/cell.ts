// ─── Cell Address ────────────────────────────────────────────────────────────
// Represents a cell like "A1", "B3", "J10"
export type CellAddress = string;

// ─── Cell Data ───────────────────────────────────────────────────────────────
// The raw value stored in the cell (could be a plain string or a formula like =SUM(A1,A2))
export interface CellData {
  raw: string;       // what the user typed, e.g. "10" or "=SUM(A1,A2)"
  computed: string;  // evaluated result, e.g. "30" (same as raw if not a formula)
  error?: string;    // optional error message if formula evaluation fails
}

// ─── Spreadsheet State ───────────────────────────────────────────────────────
// A map from cell address to cell data. Cells not in the map are empty.
export type CellMap = Record<CellAddress, CellData>;

// ─── Spreadsheet Document ────────────────────────────────────────────────────
export interface SpreadsheetDocument {
  id: string;
  title: string;
  author: string;
  lastModified: string; // ISO date string
  cells: CellMap;
}

// ─── Active User (Presence) ──────────────────────────────────────────────────
export interface ActiveUser {
  id: string;
  name: string;
  color: string;        // Tailwind color class, e.g. "bg-jade-500"
  activeCell?: CellAddress; // which cell they're currently editing
}

// ─── Save Status ─────────────────────────────────────────────────────────────
export type SaveStatus = "idle" | "saving" | "saved" | "error";

// ─── Grid Dimensions ─────────────────────────────────────────────────────────
export const GRID_COLS = 10;
export const GRID_ROWS = 10;
export const COLUMN_LABELS = ["A","B","C","D","E","F","G","H","I","J"] as const;
export const ROW_LABELS    = [1,2,3,4,5,6,7,8,9,10] as const;
