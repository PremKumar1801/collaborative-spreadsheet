"use client";

/**
 * Cell — A single editable cell in the spreadsheet grid.
 *
 * PURPOSE:
 *   Handles two modes:
 *     1. Display mode — shows the computed value (or formula if selected)
 *     2. Edit mode    — shows an <input> for direct text entry
 *
 *   When the user clicks a cell, it becomes "selected" (highlighted).
 *   When they double-click or start typing, it enters "edit mode".
 *   On blur or Enter, edit mode ends and the formula is re-evaluated.
 *
 * PROPS:
 *   - address: CellAddress           — e.g. "A1"
 *   - data: CellData | undefined     — current cell content
 *   - isSelected: boolean            — is this the active cell?
 *   - onSelect: (addr) => void       — called on single click
 *   - onChange: (addr, val) => void  — called when value changes
 *   - otherUserColor?: string        — if another user is in this cell, show their color
 */

import { useEffect, useRef, useState } from "react";
import type { CellAddress, CellData } from "@/types/cell";

interface CellProps {
  address: CellAddress;
  data?: CellData;
  isSelected: boolean;
  onSelect: (address: CellAddress) => void;
  onChange: (address: CellAddress, value: string) => void;
  otherUserColor?: string; // hex color if another user is editing this cell
}

export default function Cell({
  address,
  data,
  isSelected,
  onSelect,
  onChange,
  otherUserColor,
}: CellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data?.raw ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  // When the external data changes (e.g. another user edits), sync local edit value
  useEffect(() => {
    if (!isEditing) {
      setEditValue(data?.raw ?? "");
    }
  }, [data?.raw, isEditing]);

  // Focus the input whenever we enter edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // ── Event Handlers ─────────────────────────────────────────────────────────

  function handleClick() {
    onSelect(address);
  }

  function handleDoubleClick() {
    onSelect(address);
    setIsEditing(true);
    setEditValue(data?.raw ?? ""); // show raw formula in edit mode
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    // Typing while selected (but not yet editing) starts edit mode
    if (
      !isEditing &&
      isSelected &&
      e.key.length === 1 && // printable character
      !e.ctrlKey &&
      !e.metaKey
    ) {
      setIsEditing(true);
      setEditValue(e.key); // start fresh with the typed char
    }

    // F2 or Enter to enter edit mode
    if (!isEditing && (e.key === "F2" || e.key === "Enter")) {
      setIsEditing(true);
      setEditValue(data?.raw ?? "");
    }

    // Escape cancels edit
    if (e.key === "Escape" && isEditing) {
      setIsEditing(false);
      setEditValue(data?.raw ?? "");
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      commitEdit();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(data?.raw ?? "");
    }
  }

  function handleBlur() {
    if (isEditing) {
      commitEdit();
    }
  }

  function commitEdit() {
    setIsEditing(false);
    onChange(address, editValue);
  }

  // ── Derived display values ─────────────────────────────────────────────────

  const displayValue = data?.computed ?? data?.raw ?? "";
  const isFormula    = (data?.raw ?? "").startsWith("=");
  const isError      = displayValue.startsWith("#ERROR");

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className={`grid-cell ${isSelected ? "selected" : ""}`}
      style={{
        height: 28,
        // If another user is in this cell, show a colored top border
        borderTop: otherUserColor ? `2px solid ${otherUserColor}` : undefined,
        outline: otherUserColor && !isSelected ? `1px solid ${otherUserColor}40` : undefined,
        outlineOffset: "-1px",
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isSelected ? 0 : -1}
      role="gridcell"
      aria-selected={isSelected}
      aria-label={`Cell ${address}: ${displayValue}`}
    >
      {isEditing ? (
        /* ── Edit mode: raw input ─────────────────────────────────────── */
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={handleBlur}
          aria-label={`Editing cell ${address}`}
        />
      ) : (
        /* ── Display mode: computed value ────────────────────────────── */
        <span
          className={`cell-display ${isFormula && !isError ? "is-formula" : ""} ${isError ? "is-error" : ""}`}
        >
          {displayValue}
        </span>
      )}
    </div>
  );
}
