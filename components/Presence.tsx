"use client";

/**
 * Presence — Shows which users are currently active in the document.
 *
 * PURPOSE:
 *   Renders a row of colored avatar chips with user names.
 *   Each chip has a pulsing dot indicator showing "live" status.
 *   When a user is editing a specific cell, that cell address is shown.
 *   This component is ready to be wired to Firebase Realtime DB later.
 *
 * PROPS:
 *   - users: ActiveUser[]  — list of currently connected users
 */

import type { ActiveUser } from "@/types/cell";

interface PresenceProps {
  users: ActiveUser[];
}

export default function Presence({ users }: PresenceProps) {
  if (users.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5" aria-label="Active users">
      {/* Label */}
      <span
        className="text-xs mr-1 hidden sm:block"
        style={{
          color: "var(--text-muted)",
          fontFamily: "'Syne', sans-serif",
          letterSpacing: "0.04em",
          fontWeight: 600,
          textTransform: "uppercase",
          fontSize: 10,
        }}
      >
        Live
      </span>

      {/* User chips */}
      {users.map((user) => (
        <UserChip key={user.id} user={user} />
      ))}
    </div>
  );
}

// ─── Individual User Chip ─────────────────────────────────────────────────────
function UserChip({ user }: { user: ActiveUser }) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1 group relative"
      style={{
        background: `${user.color}18`,   // very faint fill using the user's color
        border: `1px solid ${user.color}40`,
      }}
      title={user.activeCell ? `${user.name} — editing ${user.activeCell}` : user.name}
    >
      {/* Pulsing dot */}
      <span
        className="presence-dot shrink-0"
        style={{ background: user.color }}
        aria-hidden="true"
      />

      {/* User name */}
      <span
        className="text-xs font-semibold leading-none hidden sm:block"
        style={{
          color: user.color,
          fontFamily: "'Syne', sans-serif",
          letterSpacing: "0.03em",
        }}
      >
        {user.name}
      </span>

      {/* Active cell badge */}
      {user.activeCell && (
        <span
          className="text-[9px] font-mono leading-none opacity-60 hidden md:block"
          style={{ color: user.color }}
        >
          {user.activeCell}
        </span>
      )}
    </div>
  );
}
