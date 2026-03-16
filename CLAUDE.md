# CLAUDE.md — Job Tracker

## What This Project Is

A **72-role job application tracker** built as a single-file React artifact for Claude.ai. Created by Connor Hickey (Georgetown MSF 2026), it tracks applications across **7 industry verticals**: Federal Intelligence, AI Companies, PE/Private Debt, Investment Banking, Management Consulting, Tech Consulting, and Fortune 500.

The entire application lives in `App.jsx` (466 lines). It runs inside the Claude.ai artifact runtime — not as a standalone web app. There is no build process, no `package.json`, and no external dependencies beyond React (provided by the runtime), Google Fonts, and the Clearbit logo API.

## Architecture

- **Single-file monolith**: `App.jsx` contains all components, data, styles, and logic
- **State**: `useState` hooks with persistence via `window.storage` (Claude artifact API, key: `hickey-v7`)
- **Styling**: Inline styles with a design token system (`C` object for colors, `BATCH_C` for vertical colors)
- **Fonts**: Outfit (UI) + JetBrains Mono (data/scores)
- **Logos**: Clearbit API with fallback avatar

## Key Features

- **3 views**: Dashboard (urgency cards + deadline alerts), Pipeline (search/sort/filter/bulk actions), Kanban (4-column board)
- **8 KPI metrics**: Total, Active, Applied, Interviews, Overdue, Offers, Warm, Rejected
- **9-state workflow**: Not Started → Researching → Networking → Applied → Screen → Interview → Offer/Rejected/Withdrawn
- **Urgency algorithm**: 0-10 score based on status + days since last touch
- **Location picker**: Auto-triggers for multi-location roles (e.g., "San Francisco / New York")
- **Activity log**: Timestamped history per application
- **Bulk actions**: Select all, bulk apply, bulk touch, bulk reject

## Files

| File | Purpose |
|------|---------|
| `App.jsx` | Entire application (components, data, styles, logic) |
| `README.md` | Project overview and feature list |
| `CLAUDE.md` | This file — developer guide and debug log |
| `.gitignore` | Standard ignores (node_modules, .env, dist, build) |

## Data Model

Each of the 72 applications has:
- **Static fields**: `id`, `co` (company), `role`, `batch` (vertical), `score` (35-75), `warm`, `link`, `loc`, `sal`, `posted`, `deadline`, `notes`
- **Mutable fields** (added at runtime): `status`, `appliedDate`, `lastTouch`, `appliedLoc`, `log[]`

## Bugs Found and Fixed

### 1. Notes textarea polluted activity log (Critical)
**File**: `App.jsx` — `upd()` function and notes `<textarea>`
**Problem**: The `upd()` function always appended to the activity log. Since the notes textarea called `upd(id, {notes: value})` on every keystroke, this created hundreds of "Touch" log entries while typing.
**Fix**: Added a `skipLog` parameter to `upd()`. Notes textarea now passes `skipLog=true`.

### 2. Stale closure in state updates (Critical)
**File**: `App.jsx` — `upd()`, `confirmApply()`, `batchAct()`
**Problem**: These functions captured `apps` from the closure and called `save(apps.map(...))`. If multiple updates fired in the same React render cycle (e.g., rapid clicks), earlier updates were silently lost because `apps` was stale.
**Fix**: Converted `upd()`, `confirmApply()`, and `batchAct()` to use `setApps(prev => ...)` functional updates, ensuring each update operates on the latest state.

### 3. Redundant ternary in view tab color (Minor)
**File**: `App.jsx` — header view tabs (line ~392)
**Problem**: `color: view===v ? "#fff" : view===v ? "#fff" : "rgba(255,255,255,0.7)"` — the second `view===v` check was unreachable dead code (copy-paste error).
**Fix**: Simplified to `color: view===v ? "#fff" : "rgba(255,255,255,0.7)"`.

### 4. Btn hover used `e.target` instead of `e.currentTarget` (Medium)
**File**: `App.jsx` — `Btn` component
**Problem**: `onMouseEnter`/`onMouseLeave` used `e.target`, which refers to the innermost element that triggered the event. If the button had child elements, hover styles would apply to children instead of the button itself, causing visual glitches.
**Fix**: Changed all `e.target.style` to `e.currentTarget.style` in the Btn component.

### 5. Header color mismatch (Minor)
**File**: `App.jsx` — header `<div>`
**Problem**: Header background was hardcoded to `#1A6B4A` (green), inconsistent with the navy (`#1B2541`) design token system used everywhere else.
**Fix**: Changed to `C.navy` to use the design token.

## Development Notes

- To run: paste `App.jsx` contents into a Claude.ai React artifact
- Storage key is `hickey-v7` — changing this resets all user progress
- The `ALL` array (lines 64-137) contains all 72 static role definitions
- `LOGO_MAP` (lines 49-58) maps company names to domains for Clearbit logos
- No tests exist — this is a single-artifact app with no test infrastructure
