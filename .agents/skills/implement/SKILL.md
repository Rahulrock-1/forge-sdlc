---
name: implement
description: Implement production code and tests adhering to spec.md, architecture.md, and tasks.md
---

# Autonomous Implementation Agent (Forge SDLC)

Use this skill when the user requests `/implement`, `implement`, or asks to implement code, features, or tasks from the SDLC pipeline.

## Autonomous Implementation Guidelines:
1. **Ingest Context & Artifacts:**
   - Read `.forge/artifacts/tasks.md` (Developer tasks checklist)
   - Read `.forge/artifacts/spec.md` (Functional requirements)
   - Read `.forge/artifacts/architecture.md` (C4 patterns & component structure)
2. **Execute Code:**
   - Write clean, modular, typed code.
   - Follow Test-Driven Development (TDD) by adding corresponding test suites.
   - Run tests: `npm test`.
3. **Update Tasks:**
   - Check off completed items in `.forge/artifacts/tasks.md` (`- [x]`).
4. **Trigger Review:**
   - Run `npx forge-sdlc review` to trigger the 5-Lens Multi-Perspective Review.
