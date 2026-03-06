"use client";

/**
 * DocumentCard — Displays a spreadsheet document in the dashboard.
 *
 * PURPOSE:
 *   Shows document metadata (title, author, last modified) in a clickable card.
 *   Clicking the card navigates to /doc/[id].
 *
 * PROPS:
 *   - document: SpreadsheetDocument  — the document data to display
 *   - onClick: () => void            — called when the card is clicked
 *   - animationIndex: number         — controls staggered animation delay (0-based)
 */

import type { SpreadsheetDocument } from "@/types/cell";
import { formatRelativeTime } from "@/lib/mockData";

interface DocumentCardProps {
  document: SpreadsheetDocument;
  onClick: () => void;
  animationIndex?: number;
}

// Simple spreadsheet icon (SVG)
function SheetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="2"  y1="7"  x2="18" y2="7"  stroke="currentColor" strokeWidth="1.2" />
      <line x1="2"  y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1.2" />
      <line x1="7"  y1="7"  x2="7"  y2="18" stroke="currentColor" strokeWidth="1.2" />
      <line x1="13" y1="7"  x2="13" y2="18" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

// Extracts initials from a full name
function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DocumentCard({
  document,
  onClick,
  animationIndex = 0,
}: DocumentCardProps) {
  const cardClass = `card-${(animationIndex % 4) + 1}`;

  return (
    <div
      className={`doc-card animate-fade-in ${cardClass} group`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`Open ${document.title}`}
    >
      {/* ── Thumbnail Preview ─────────────────────────────────────────────────── */}
      <div
        className="rounded-t-[7px] flex items-center justify-center overflow-hidden"
        style={{
          height: 120,
          background: "var(--bg-elevated)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        {/* Mini grid preview */}
        <div className="opacity-40 group-hover:opacity-60 transition-opacity">
          <MiniGridPreview />
        </div>
      </div>

      {/* ── Card Body ──────────────────────────────────────────────────────────── */}
      <div className="p-4">
        {/* Title row */}
        <div className="flex items-start gap-3 mb-3">
          <div style={{ color: "var(--text-accent)", marginTop: 1 }}>
            <SheetIcon />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold truncate text-sm leading-snug"
              style={{
                color: "var(--text-primary)",
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "0.01em",
              }}
            >
              {document.title}
            </h3>
          </div>
        </div>

        {/* Meta row: author + time */}
        <div className="flex items-center justify-between">
          {/* Author avatar + name */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-full text-[9px] font-bold shrink-0"
              style={{
                width: 22,
                height: 22,
                background: "var(--accent-dim)",
                color: "var(--text-accent)",
                border: "1px solid rgba(34,197,94,0.25)",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {initials(document.author)}
            </div>
            <span
              className="text-xs truncate"
              style={{ color: "var(--text-secondary)", fontFamily: "'Syne', sans-serif" }}
            >
              {document.author}
            </span>
          </div>

          {/* Last modified */}
          <span
            className="text-xs shrink-0"
            style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}
          >
            {formatRelativeTime(document.lastModified)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Mini grid preview SVG ────────────────────────────────────────────────────
function MiniGridPreview() {
  const cols = 5;
  const rows = 4;
  const cw = 28;
  const rh = 16;
  const w = cols * cw;
  const h = rows * rh;

  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      {/* Horizontal lines */}
      {Array.from({ length: rows + 1 }, (_, i) => (
        <line
          key={`h${i}`}
          x1={0} y1={i * rh} x2={w} y2={i * rh}
          stroke="rgba(255,255,255,0.25)" strokeWidth={0.75}
        />
      ))}
      {/* Vertical lines */}
      {Array.from({ length: cols + 1 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={i * cw} y1={0} x2={i * cw} y2={h}
          stroke="rgba(255,255,255,0.25)" strokeWidth={0.75}
        />
      ))}
      {/* Sample content bars */}
      {[
        { x: 4, y: 4, w: 36, o: 0.5 },
        { x: cw + 4, y: 4, w: 20, o: 0.35 },
        { x: cw * 2 + 4, y: 4, w: 24, o: 0.35 },
        { x: 4, y: rh + 4, w: 28, o: 0.25 },
        { x: cw + 4, y: rh + 4, w: 16, o: 0.25 },
        { x: cw * 2 + 4, y: rh + 4, w: 18, o: 0.25 },
        { x: 4, y: rh * 2 + 4, w: 28, o: 0.2 },
        { x: cw + 4, y: rh * 2 + 4, w: 16, o: 0.2 },
        { x: cw * 2 + 4, y: rh * 2 + 4, w: 18, o: 0.2 },
        // Accent bar (like a formula)
        { x: cw * 3 + 4, y: rh + 4, w: 22, o: 0.55, accent: true },
        { x: cw * 3 + 4, y: rh * 2 + 4, w: 22, o: 0.55, accent: true },
        { x: cw * 3 + 4, y: rh * 3 + 4, w: 22, o: 0.7, accent: true },
      ].map((b, i) => (
        <rect
          key={i}
          x={b.x} y={b.y} width={b.w} height={6}
          rx={1.5}
          fill={b.accent ? "#22c55e" : "rgba(255,255,255,0.9)"}
          opacity={b.o}
        />
      ))}
    </svg>
  );
}
