# MVP: Test Planning & Execution

## Overview
Shift from "just a log" to a managed workflow of test cycles and assignments.

## Requirements
- **Test Cycles**: Create a cycle (e.g., "v1.0 Regression") with a start/end date.
- **Assignment**: Assign specific test cases within a run to team members.
- **Execution Interface (The Player)**: Premium, card-based UI for executing tests step-by-step.
- **Real-time Updates**: Live progress bar as testers record results.

## Implementation Details
### Database
- `TestRun` extended with `assignedToId`.
- `Milestone` model to group cycles.
### Frontend (Premium UX)
- "Execution Mode" (Focus mode) with keyboard shortcuts.
- Status updates (PASS/FAIL/BLOCKED) with mandatory comment for fails.
### Notifications
- Notify users (in-app/email) when they are assigned a test run.

## Success Criteria
- Sarah assigns 10 tests to David.
- David opens the "Execution Player" and navigates through steps.
- Sarah sees the "Run Progress" update in real-time.
