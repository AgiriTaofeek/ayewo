# Ayewo MVP (v1.0) High-Level Plan

This document outlines the steps to achieve the MVP (v1.0) of Ayewo, focusing on core test management features.

## 1. Core Objectives
- **Authentication**: Secure login and session management for QA teams.
- **Project CRUD**: Create and manage isolated project workspaces.
- **Test Case CRUD**: Robust authoring of manual and automated test cases.
- **Test Execution**: Record pass/fail results with execution logs.
- **Dashboard**: High-level visibility into quality metrics.

## 2. Technical Roadmap

### Phase 1: Database & Backend Foundation
- [ ] **Extend Schema**: Add `Project`, `TestCase`, `TestRun`, and `TestExecution` models to `schema.prisma`.
- [ ] **API Implementation**:
    - Project management endpoints.
    - Test case authoring endpoints.
    - Test execution and status update endpoints.
- [ ] **Validation**: Use TypeBox for rigorous request/response validation in Elysia.

### Phase 2: Frontend Core Views
- [ ] **Shell & Navigation**: Implement the global layout with sidebars and breadcrumbs.
- [ ] **Project Dashboard**: A list view for all active projects.
- [ ] **Test Case Library**: Folder-based or list-based view for managing test cases.
- [ ] **Execution Runner**: A "Player" mode for executing manual tests step-by-step.

### Phase 3: Analytics & Polish
- [ ] **Stats Aggregation**: Simple counts for total tests, pass rate, and recent failures.
- [ ] **UI/UX Refinement**: Ensure premium feel with animations and consistent styling using the `@repo/ui` package.

## 3. Implementation Sequence
1.  **Schema Update**: Migrate DB to support new models.
2.  **API Development**: Build and test endpoints using Bun.
3.  **Frontend Plumbing**: Connect TanStack Start and Query to the new API.
4.  **UI Construction**: Build components for projects, tests, and execution.

## 4. Definition of Done (v1.0)
- A user can log in.
- A user can create a project and add 5 test cases.
- A user can start a run, mark tests as pass/fail, and see the results on a dashboard.
- 100% type safety from DB to Frontend.
