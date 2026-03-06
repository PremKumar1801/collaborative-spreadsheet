"use client";

/**
 * Dashboard page (/app/page.tsx)
 *
 * PURPOSE:
 *   - Lists all available spreadsheet documents as cards
 *   - "Create New Document" button adds a new doc to the local list
 *   - Clicking a card navigates to /doc/[id]
 *
 * STATE:
 *   - documents: SpreadsheetDocument[]  — starts from MOCK_DOCUMENTS,
 *     extended locally when the user creates new docs.
 *
 * NOTE: When Firebase is connected, replace the useState initializer
 *       with a real-time listener (onSnapshot or onValue).
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import DocumentCard from "@/components/DocumentCard";
import type { SpreadsheetDocument } from "@/types/cell";
import { MOCK_DOCUMENTS } from "@/lib/mockData";

export default function DashboardPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<SpreadsheetDocument[]>(MOCK_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Create new document ────────────────────────────────────────────────────
  function handleCreateNew() {
    const newDoc: SpreadsheetDocument = {
      id: `doc-${Date.now()}`,
      title: "Untitled Spreadsheet",
      author: "You",
      lastModified: new Date().toISOString(),
      cells: {},
    };
    setDocuments((prev) => [newDoc, ...prev]);
    router.push(`/doc/${newDoc.id}`);
  }

  // ── Navigate to doc ────────────────────────────────────────────────────────
  function handleOpenDoc(id: string) {
    router.push(`/doc/${id}`);
  }

  // ── Filter documents by search ─────────────────────────────────────────────
  const filtered = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-base)" }}
    >
      {/* ── Top Navigation Bar ──────────────────────────────────────────────── */}
      <nav
        className="flex items-center justify-between px-6 sm:px-10"
        style={{
          height: 60,
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center rounded"
            style={{
              width: 28,
              height: 28,
              background: "var(--accent-dim)",
              border: "1px solid rgba(34,197,94,0.3)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="#22c55e" strokeWidth="1.4" />
              <line x1="1" y1="5" x2="13" y2="5" stroke="#22c55e" strokeWidth="1" />
              <line x1="1" y1="9" x2="13" y2="9" stroke="#22c55e" strokeWidth="1" />
              <line x1="5" y1="5" x2="5" y2="13" stroke="#22c55e" strokeWidth="1" />
              <line x1="9" y1="5" x2="9" y2="13" stroke="#22c55e" strokeWidth="1" />
            </svg>
          </div>
          <span
            className="font-bold text-sm tracking-wide"
            style={{
              color: "var(--text-primary)",
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            SheetSync
          </span>
        </div>

        {/* Right side: create button */}
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold transition-all"
          style={{
            background: "#22c55e",
            color: "#0a0a09",
            fontFamily: "'Syne', sans-serif",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#16a34a")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#22c55e")}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          New
        </button>
      </nav>

      {/* ── Page Content ───────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-10">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="mb-8 animate-fade-in">
          <h1
            className="text-2xl sm:text-3xl font-bold mb-1"
            style={{
              color: "var(--text-primary)",
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            My Documents
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--text-secondary)", fontFamily: "'Syne', sans-serif" }}
          >
            {documents.length} spreadsheet{documents.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ── Search Bar ─────────────────────────────────────────────────────── */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "40ms" }}>
          <div className="relative max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              style={{ color: "var(--text-muted)" }}
            >
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
              <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents…"
              className="w-full rounded-md pl-9 pr-4 py-2.5 text-sm outline-none transition-all"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
                fontFamily: "'Syne', sans-serif",
                fontSize: 13,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(34,197,94,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
            />
          </div>
        </div>

        {/* ── Document Grid ─────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center animate-fade-in"
          >
            <div
              className="text-4xl mb-4 opacity-20"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              [ ]
            </div>
            <p style={{ color: "var(--text-secondary)", fontFamily: "'Syne', sans-serif" }}>
              {searchQuery ? "No documents match your search." : "No documents yet."}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateNew}
                className="mt-4 text-sm font-semibold underline underline-offset-4"
                style={{ color: "var(--text-accent)", fontFamily: "'Syne', sans-serif" }}
              >
                Create your first spreadsheet →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((doc, i) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onClick={() => handleOpenDoc(doc.id)}
                animationIndex={i}
              />
            ))}
          </div>
        )}

        {/* ── Footer hint ──────────────────────────────────────────────────── */}
        <p
          className="mt-12 text-center text-xs"
          style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}
        >
          Firebase integration coming soon · All changes saved locally
        </p>
      </main>
    </div>
  );
}
