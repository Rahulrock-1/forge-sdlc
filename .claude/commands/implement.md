---
description: Autonomous Implementation Agent - Writes typed code & tests adhering to spec.md, architecture.md, and tasks.md
---

Execute Forge capability: **Agentic Code Implementation (/implement)**

## Instructions:
1. Read `.forge/artifacts/tasks.md`, `.forge/artifacts/spec.md`, and `.forge/artifacts/architecture.md`.
2. Pick uncompleted checklist items and implement code following architectural constraints.
3. Write test suites and verify with `npm test` and `npm run lint`.
4. Update `.forge/artifacts/tasks.md` with `- [x]` upon completion.
5. Run `npx forge-sdlc implement` or proceed to `npx forge-sdlc review`.
