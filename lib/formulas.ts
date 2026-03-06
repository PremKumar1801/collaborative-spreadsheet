/**
 * formulas.ts — Lightweight spreadsheet formula evaluator
 *
 * ─── HOW IT WORKS ──────────────────────────────────────────────────────────────
 *
 * Step 1 — Detection
 *   A formula always starts with "=". If a cell value doesn't start with "=",
 *   it's returned as-is (plain string or number literal).
 *
 * Step 2 — Named Function Dispatch (e.g. =SUM, =AVG)
 *   We check if the formula matches a pattern like  =FUNCNAME(args)
 *   If so, we parse the argument list, resolve each arg (could be a cell ref
 *   or a literal number), then call the appropriate function.
 *
 * Step 3 — Arithmetic Expression (e.g. =A1+A2, =A1*3)
 *   We replace all cell references (like A1, B3) with their resolved numeric
 *   values, then safely evaluate the resulting arithmetic string.
 *
 * Step 4 — Cell Reference Resolution
 *   Before any math happens, cell references are looked up in the CellMap.
 *   The resolved value is parsed as a float. If it's NaN, we throw an error.
 *
 * ─── SUPPORTED SYNTAX ──────────────────────────────────────────────────────────
 *   =SUM(A1,A2,B3)        → sum of listed cells
 *   =AVG(A1,A2,B3)        → average of listed cells
 *   =MAX(A1,A2,B3)        → maximum value
 *   =MIN(A1,A2,B3)        → minimum value
 *   =A1+A2                → addition
 *   =A1-A2                → subtraction
 *   =A1*A2                → multiplication
 *   =A1/A2                → division
 *   =A1+10                → mix cell refs and literals
 *
 * ─── SAFETY ────────────────────────────────────────────────────────────────────
 *   We do NOT use eval(). Arithmetic is done by a tiny recursive descent
 *   parser that only accepts numbers and +, -, *, / operators.
 */

import type { CellMap } from "@/types/cell";

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Evaluate a cell's raw value. Returns a string result.
 * If it's not a formula (doesn't start with "="), returns the raw string as-is.
 * If evaluation fails, returns an error string like "#ERROR".
 */
export function evaluateCell(raw: string, cells: CellMap): string {
  if (!raw.startsWith("=")) return raw; // plain value, no formula

  const formula = raw.slice(1).trim().toUpperCase(); // strip "=" and normalize

  try {
    // ── Named Function: =SUM(A1,A2,...) ────────────────────────────────────
    const fnMatch = formula.match(/^([A-Z]+)\((.+)\)$/);
    if (fnMatch) {
      const [, fnName, argsRaw] = fnMatch;
      const args = parseArgList(argsRaw, cells);
      return applyFunction(fnName, args).toString();
    }

    // ── Arithmetic Expression: =A1+A2, =B3*10, etc. ────────────────────────
    const withValues = resolveCellRefs(formula, cells);
    return evaluateArithmetic(withValues).toString();

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return `#ERROR: ${message}`;
  }
}

// ─── Internal Helpers ────────────────────────────────────────────────────────

/**
 * Parse a comma-separated argument list like "A1,A2,10" into an array of numbers.
 * Each argument can be a cell reference or a numeric literal.
 */
function parseArgList(argsRaw: string, cells: CellMap): number[] {
  return argsRaw.split(",").map((arg) => {
    const trimmed = arg.trim();
    if (isCellRef(trimmed)) {
      return resolveCellToNumber(trimmed, cells);
    }
    const num = parseFloat(trimmed);
    if (isNaN(num)) throw new Error(`Invalid argument: ${trimmed}`);
    return num;
  });
}

/**
 * Apply a named function to a list of resolved numeric arguments.
 */
function applyFunction(name: string, args: number[]): number {
  if (args.length === 0) throw new Error(`${name}() requires at least one argument`);

  switch (name) {
    case "SUM": return args.reduce((a, b) => a + b, 0);
    case "AVG": return args.reduce((a, b) => a + b, 0) / args.length;
    case "MAX": return Math.max(...args);
    case "MIN": return Math.min(...args);
    case "COUNT": return args.length;
    default: throw new Error(`Unknown function: ${name}`);
  }
}

/**
 * Replace all cell references in an arithmetic expression with their numeric values.
 * e.g. "A1+A2*3" → "10+20*3"
 */
function resolveCellRefs(expr: string, cells: CellMap): string {
  // Match cell refs like A1, B10, J5 — letter(s) followed by digit(s)
  return expr.replace(/\b([A-J][1-9]|[A-J]10)\b/g, (ref) => {
    return resolveCellToNumber(ref, cells).toString();
  });
}

/**
 * Look up a cell reference and return its numeric value.
 * Throws if the cell is empty or non-numeric.
 */
function resolveCellToNumber(ref: string, cells: CellMap): number {
  const cell = cells[ref];
  const raw = cell?.computed ?? cell?.raw ?? "";
  if (raw === "") throw new Error(`Empty cell: ${ref}`);
  const num = parseFloat(raw);
  if (isNaN(num)) throw new Error(`Cell ${ref} is not a number: "${raw}"`);
  return num;
}

/**
 * Returns true if a string looks like a valid cell reference (A1–J10).
 */
function isCellRef(s: string): boolean {
  return /^[A-J](10|[1-9])$/.test(s);
}

// ─── Safe Arithmetic Parser ──────────────────────────────────────────────────
// A tiny recursive descent parser for expressions like "10+20*3-5/2"
// Handles operator precedence correctly: * and / before + and -
// NEVER calls eval() — fully safe.

/**
 * Entry point: evaluate an arithmetic string like "10+20-5*2"
 */
function evaluateArithmetic(expr: string): number {
  const tokens = tokenize(expr);
  const parser = createParser(tokens);
  const result = parseExpression(parser);
  if (parser.pos < tokens.length) {
    throw new Error(`Unexpected token: ${tokens[parser.pos]}`);
  }
  return result;
}

type Token = number | "+" | "-" | "*" | "/" | "(" | ")";

interface Parser {
  tokens: Token[];
  pos: number;
}

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const clean = expr.replace(/\s+/g, "");

  while (i < clean.length) {
    const ch = clean[i];
    if ("+-*/()".includes(ch)) {
      tokens.push(ch as Token);
      i++;
    } else if (/[0-9.]/.test(ch)) {
      let numStr = "";
      while (i < clean.length && /[0-9.]/.test(clean[i])) {
        numStr += clean[i++];
      }
      tokens.push(parseFloat(numStr));
    } else {
      throw new Error(`Invalid character in expression: '${ch}'`);
    }
  }
  return tokens;
}

function createParser(tokens: Token[]): Parser {
  return { tokens, pos: 0 };
}

// parseExpression handles + and - (lowest precedence)
function parseExpression(p: Parser): number {
  let left = parseTerm(p);
  while (p.pos < p.tokens.length && (p.tokens[p.pos] === "+" || p.tokens[p.pos] === "-")) {
    const op = p.tokens[p.pos++];
    const right = parseTerm(p);
    left = op === "+" ? left + right : left - right;
  }
  return left;
}

// parseTerm handles * and / (higher precedence)
function parseTerm(p: Parser): number {
  let left = parseFactor(p);
  while (p.pos < p.tokens.length && (p.tokens[p.pos] === "*" || p.tokens[p.pos] === "/")) {
    const op = p.tokens[p.pos++];
    const right = parseFactor(p);
    if (op === "/" && right === 0) throw new Error("Division by zero");
    left = op === "*" ? left * right : left / right;
  }
  return left;
}

// parseFactor handles numbers and parenthesized expressions
function parseFactor(p: Parser): number {
  const token = p.tokens[p.pos];
  if (token === "(") {
    p.pos++; // consume "("
    const val = parseExpression(p);
    if (p.tokens[p.pos] !== ")") throw new Error("Missing closing parenthesis");
    p.pos++; // consume ")"
    return val;
  }
  if (typeof token === "number") {
    p.pos++;
    return token;
  }
  // Handle unary minus: -5 or -(expr)
  if (token === "-") {
    p.pos++;
    return -parseFactor(p);
  }
  throw new Error(`Expected number, got: ${token}`);
}

// ─── Utility Exports ─────────────────────────────────────────────────────────

/**
 * Re-evaluate all cells that contain formulas.
 * Call this after any cell value changes since other cells may depend on it.
 */
export function recomputeAllCells(cells: CellMap): CellMap {
  const updated = { ...cells };

  // Simple single-pass evaluation (no cycle detection for now)
  for (const addr in updated) {
    const cell = updated[addr];
    if (cell.raw.startsWith("=")) {
      const computed = evaluateCell(cell.raw, updated);
      updated[addr] = { ...cell, computed };
    }
  }
  return updated;
}
