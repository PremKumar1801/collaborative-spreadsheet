"use client";

/**
 * Toolbar — Top action bar for the spreadsheet editor.
 *
 * PURPOSE:
 *   Provides document-level controls: back navigation, document title,
 *   save status indicator, and the presence widget (active users).
 *   The save status cycles: idle → saving → saved, simulated locally.
 *
 * PROPS:
 *   - title: string                  — document title (editable)
 *   - onTitleChange: (t: string) => void
 *   - saveStatus: SaveStatus         — "idle" | "saving" | "saved" | "error"
 *   - presenceSlot: React.ReactNode  — pass in <Presence users={...} />
 *   - onBack: () => void             — navigate back to dashboard
 */

import type { SaveStatus } from "@/types/cell";
import type { ReactNode } from "react";

interface ToolbarProps {
  title: string;
  onTitleChange: (title: string) => void;
  saveStatus: SaveStatus;
  presenceSlot: ReactNode;
  onBack: () => void;
}

export default function Toolbar({
  title,
  onTitleChange,
  saveStatus,
  presenceSlot,
  onBack,
}: ToolbarProps) {
  return (
    <header
      className="flex items-center gap-3 px-4 shrink-0"
      style={{
        height: 52,
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-default)",
      }}
    >
      {/* ── Back Button ─────────────────────────────────────────────────────── */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold transition-colors shrink-0"
        style={{
          color: "var(--text-secondary)",
          fontFamily: "'Syne', sans-serif",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          fontSize: 10,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        aria-label="Back to dashboard"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="hidden sm:block">Docs</span>
      </button>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: "var(--border-default)", flexShrink: 0 }} />

      {/* ── Logo mark ───────────────────────────────────────────────────────── */}
      <div
        className="text-xs font-bold tracking-widest shrink-0 hidden sm:block"
        style={{ color: "var(--text-accent)", fontFamily: "'Syne', sans-serif" }}
      >
        ⊞
      </div>

      {/* ── Editable Document Title ──────────────────────────────────────────── */}
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="flex-1 min-w-0 bg-transparent border-none outline-none font-semibold text-sm"
        style={{
          color: "var(--text-primary)",
          fontFamily: "'Syne', sans-serif",
          letterSpacing: "0.01em",
          maxWidth: 320,
        }}
        aria-label="Document title"
      />

      {/* Spacer */}
      <div className="flex-1" />

      {/* ── Save Status Indicator ────────────────────────────────────────────── */}
      <SaveIndicator status={saveStatus} />

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: "var(--border-default)", flexShrink: 0 }} />

      {/* ── Presence slot (active users) ─────────────────────────────────────── */}
      {presenceSlot}

      {/* ── Share Button (decorative for now) ───────────────────────────────── */}
      <button
        className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-all shrink-0"
        style={{
          background: "var(--accent-dim)",
          color: "var(--text-accent)",
          border: "1px solid rgba(34,197,94,0.3)",
          fontFamily: "'Syne', sans-serif",
          letterSpacing: "0.05em",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(34,197,94,0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--accent-dim)";
        }}
      >
        Share
      </button>
    </header>
  );
}

// ─── Save Status Indicator ────────────────────────────────────────────────────
function SaveIndicator({ status }: { status: SaveStatus }) {
  const config: Record<SaveStatus, { label: string; color: string }> = {
    idle:   { label: "",         color: "transparent" },
    saving: { label: "Saving…",  color: "var(--text-muted)" },
    saved:  { label: "Saved ✓",  color: "var(--text-accent)" },
    error:  { label: "Error ✕",  color: "#f87171" },
  };

  const { label, color } = config[status];

  return (
    <span
      className="save-indicator text-xs shrink-0"
      style={{ color }}
      aria-live="polite"
      aria-atomic="true"
    >
      {label}
    </span>
  );
}
