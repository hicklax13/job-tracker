# CLAUDE.md — Job Tracker

## What This Project Is

A **72-role job application tracker** built as an Electron desktop app with React. Created by Connor Hickey (Georgetown MSF 2026), it tracks applications across **7 industry verticals**: Federal Intelligence, AI Companies, PE/Private Debt, Investment Banking, Management Consulting, Tech Consulting, and Fortune 500.

The core UI lives in `src/App.jsx`. The app uses Vite for bundling and Electron for the desktop shell. The original version was a Claude.ai artifact; it has been converted to a standalone desktop application.

## Architecture

- **Renderer**: `src/App.jsx` — single-file React component with all UI, data, styles, and logic
- **Main process**: `main.js` — Electron window management, external link handling
- **Preload**: `preload.js` — context bridge (exposes platform info)
- **Bundler**: Vite + `@vitejs/plugin-react`
- **Packaging**: electron-builder (outputs to `release/`)
- **Storage**: `localStorage` for persistent state (key: `hickey-v7`)
- **Styling**: Inline styles with design token system (`C` object for colors, `BATCH_C` for vertical colors)
- **Fonts**: Google Fonts — Outfit (UI) + JetBrains Mono (data/scores)
- **Logos**: Clearbit API with fallback avatar

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (renderer only) |
| `npm run electron:dev` | Start Vite + Electron together for development |
| `npm start` | Launch Electron (requires `npm run build` first) |
| `npm run build` | Build renderer with Vite |
| `npm run dist` | Build + package for current platform |
| `npm run dist:mac` | Build + package macOS DMG |
| `npm run dist:win` | Build + package Windows NSIS installer |
| `npm run dist:linux` | Build + package Linux AppImage |

## Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Entire React application (components, data, styles, logic) |
| `src/main.jsx` | React DOM entry point |
| `main.js` | Electron main process |
| `preload.js` | Electron preload script |
| `index.html` | HTML shell |
| `vite.config.js` | Vite configuration |
| `package.json` | Dependencies, scripts, electron-builder config |
| `App.jsx` | Original Claude.ai artifact version (preserved for reference) |
| `README.md` | Project overview |
| `CLAUDE.md` | This file — developer guide and changelog |

## Key Features

- **3 views**: Dashboard (urgency cards + deadline alerts), Pipeline (search/sort/filter/bulk actions), Kanban (4-column board)
- **8 KPI metrics**: Total, Active, Applied, Interviews, Overdue, Offers, Warm, Rejected
- **9-state workflow**: Not Started -> Researching -> Networking -> Applied -> Screen -> Interview -> Offer/Rejected/Withdrawn
- **Urgency algorithm**: 0-10 score based on status + days since last touch
- **Location picker**: Auto-triggers for multi-location roles
- **Activity log**: Timestamped history per application
- **Bulk actions**: Select all, bulk apply, bulk touch, bulk reject
- **External links**: Job posting links open in default browser (not Electron window)

## Data Model

Each of the 72 applications has:
- **Static fields**: `id`, `co` (company), `role`, `batch` (vertical), `score` (35-75), `warm`, `link`, `loc`, `sal`, `posted`, `deadline`, `notes`
- **Mutable fields** (added at runtime): `status`, `appliedDate`, `lastTouch`, `appliedLoc`, `log[]`

## Changelog

### v1.0.0 — Electron Desktop App + Bug Fixes

**Electron conversion:**
- Converted from Claude.ai artifact to standalone Electron desktop app
- Added Vite + React build pipeline
- Replaced `window.storage` (Claude artifact API) with `localStorage`
- External links now open in default browser via Electron `shell.openExternal`
- Added electron-builder packaging for macOS, Windows, and Linux
- Moved React source to `src/App.jsx`, created `src/main.jsx` entry point

**Bugs fixed:**
1. **Notes textarea polluted activity log** (Critical) — Every keystroke added a "Touch" log entry. Added `skipLog` parameter to `upd()`.
2. **Stale closure in state updates** (Critical) — `upd()`, `confirmApply()`, `batchAct()` used stale `apps` closure. Converted to functional `setApps(prev => ...)`.
3. **Redundant ternary in view tab color** (Minor) — Dead code from copy-paste error. Simplified.
4. **Btn hover used `e.target` instead of `e.currentTarget`** (Medium) — Hover styles misapplied to child elements.
5. **Header color mismatch** (Minor) — Hardcoded green `#1A6B4A` changed to `C.navy` design token.
6. **Duplicate key in LOGO_MAP** (Minor) — "Deloitte Consulting" appeared twice. Removed duplicate.
