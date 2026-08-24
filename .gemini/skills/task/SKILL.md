---
name: task
description: Generate atomic developer checklist (tasks.md)
---

# Task Decomposition Agent (Forge SDLC)

Use this skill when the user requests `/tasks`, `/task`, or asks to decompose plans or specifications into atomic developer tasks.

## Task Decomposition Guidelines:
1. **Ingest Existing Artifacts:**
   - Read `.forge/artifacts/plan.md` (Technical roadmap)
   - Read `.forge/artifacts/spec.md` (Given-When-Then criteria)
   - Read `.forge/artifacts/architecture.md` (C4 components & patterns)
2. **Generate Atomic Tasks:**
   - Group tasks by milestone/phase.
   - Format each task item:
     ```markdown
     - [ ] **Task X.Y: Title**
       *Files:* `path/to/file.ts`
       *Verification:* `npm test`
     ```
3. **Save Output:**
   - Save to `.forge/artifacts/tasks.md` (and optionally `tasks.md`).
   - Run: `npx forge-sdlc tasks`.
