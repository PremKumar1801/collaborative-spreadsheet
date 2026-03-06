import type { SpreadsheetDocument, ActiveUser, CellMap } from "@/types/cell";

// ─── Mock Cell Data for Demo Documents ───────────────────────────────────────

const budgetCells: CellMap = {
  A1: { raw: "Month",    computed: "Month" },
  B1: { raw: "Revenue",  computed: "Revenue" },
  C1: { raw: "Expenses", computed: "Expenses" },
  D1: { raw: "Profit",   computed: "Profit" },
  A2: { raw: "January",  computed: "January" },
  B2: { raw: "12000",    computed: "12000" },
  C2: { raw: "8500",     computed: "8500" },
  D2: { raw: "=B2-C2",   computed: "3500" },
  A3: { raw: "February", computed: "February" },
  B3: { raw: "15000",    computed: "15000" },
  C3: { raw: "9200",     computed: "9200" },
  D3: { raw: "=B3-C3",   computed: "5800" },
  A4: { raw: "Total",    computed: "Total" },
  B4: { raw: "=SUM(B2,B3)", computed: "27000" },
  C4: { raw: "=SUM(C2,C3)", computed: "17700" },
  D4: { raw: "=SUM(D2,D3)", computed: "9300" },
};

const inventoryCells: CellMap = {
  A1: { raw: "Item",     computed: "Item" },
  B1: { raw: "Qty",      computed: "Qty" },
  C1: { raw: "Price",    computed: "Price" },
  D1: { raw: "Total",    computed: "Total" },
  A2: { raw: "Widget A", computed: "Widget A" },
  B2: { raw: "50",       computed: "50" },
  C2: { raw: "12.5",     computed: "12.5" },
  D2: { raw: "=B2*C2",   computed: "625" },
  A3: { raw: "Widget B", computed: "Widget B" },
  B3: { raw: "30",       computed: "30" },
  C3: { raw: "25",       computed: "25" },
  D3: { raw: "=B3*C3",   computed: "750" },
  B4: { raw: "=SUM(B2,B3)", computed: "80" },
  D4: { raw: "=SUM(D2,D3)", computed: "1375" },
};

// ─── Mock Documents ───────────────────────────────────────────────────────────

export const MOCK_DOCUMENTS: SpreadsheetDocument[] = [
  {
    id: "doc-1",
    title: "Q1 Budget Report",
    author: "Prem Kumar",
    lastModified: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
    cells: budgetCells,
  },
  {
    id: "doc-2",
    title: "Inventory Tracker",
    author: "Alex Chen",
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    cells: inventoryCells,
  },
  {
    id: "doc-3",
    title: "Sales Pipeline",
    author: "Sam Rivera",
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    cells: {},
  },
  {
    id: "doc-4",
    title: "Team Expenses",
    author: "Prem Kumar",
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    cells: {},
  },
];

// ─── Mock Active Users (Presence) ────────────────────────────────────────────

export const MOCK_USERS: ActiveUser[] = [
  { id: "u1", name: "Prem",  color: "#22c55e", activeCell: "B2" },
  { id: "u2", name: "Alex",  color: "#3b82f6", activeCell: "D4" },
  { id: "u3", name: "Sam",   color: "#a855f7", activeCell: undefined },
];

// ─── Utility ─────────────────────────────────────────────────────────────────

export function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours   = Math.floor(diff / 3600000);
  const days    = Math.floor(diff / 86400000);

  if (minutes < 1)  return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours   < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function getDocumentById(id: string): SpreadsheetDocument | undefined {
  return MOCK_DOCUMENTS.find((d) => d.id === id);
}
