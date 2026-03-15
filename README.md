# Job Tracker

72-role application tracker across 7 industry verticals built as a React artifact for Claude.ai.

## Features

- **3 views**: Dashboard (urgency-sorted action items), Pipeline (search/sort/filter + bulk actions), Kanban (4-column board)
- **8 metrics**: Total, Active, Applied, Interviews, Overdue, Offers, Warm, Rejected
- **Location picker**: Auto-triggers for multi-location roles when marking Applied
- **Company logos**: Pulled via Clearbit API with graceful fallback
- **Posted + Deadline tracking**: Relative timestamps, color-coded countdown pills, deadline alerts on dashboard
- **Score system**: 100-point composite per role with visual score bars
- **Activity log**: Timestamped history of all status changes per role
- **Persistent storage**: State saved via Claude.ai artifact storage (key: hickey-v7)
- **Bulk actions**: Select all, bulk apply, bulk touch, bulk reject

## Verticals

1. Federal Intelligence (10 roles)
2. AI Companies (10 roles)
3. PE / Private Debt (11 roles)
4. Investment Banking (10 roles)
5. Management Consulting (10 roles)
6. Tech Consulting (11 roles)
7. Fortune 500 (10 roles)

## Tech Stack

- React (JSX, hooks, useCallback, useRef)
- Outfit + JetBrains Mono fonts
- Clearbit logo API
- Claude.ai persistent artifact storage

## Usage

Paste `App.jsx` into a Claude.ai React artifact to run. Designed for the Claude.ai artifact runtime, not standalone deployment.

## Author

Connor Hickey - Georgetown MSF 2026
