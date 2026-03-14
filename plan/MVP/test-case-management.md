# MVP: Test Case Management (Enterprise)

## Overview
A centralized, organized repository for manual and automated test cases.

## Requirements
- **Organization**: Use **Folders** and **Tags** to categorize tests.
- **Rich-Text Authoring**: WYSIWYG editor for descriptions and steps (supporting tables/snippets).
- **Test Planning**: Support for **Sprints** and **Milestones** (grouping tests for specific releases).
- **Search & Filter**: Find tests by priority, tag, folder, or owner.

## Implementation Details
### Database
- `Folder` model for hierarchical organization.
- `TestCase` model with `htmlContent` or `jsonSteps` for rich text.
- `Tag` system for cross-cutting categorization.
### Frontend (Premium UX)
- Folder tree sidebar.
- Rich text editor (e.g., TipTap or similar).
- Bulk actions (move, tag, delete).

## Success Criteria
- User can create a folder "Checkout" and add tests inside it.
- Description supports bold text and code blocks.
- User can filter for all "P1" tests in "Sprint 34".
