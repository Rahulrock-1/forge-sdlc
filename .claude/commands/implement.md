---
description: Autonomous Implementation Agent - Senior Staff Engineer implementing typed code & tests with telemetry & resiliency
---

Execute Forge capability: **Senior Staff Implementation (/implement)**

## 📥 Required Files Checklist:
- Mandatory: `.forge/artifacts/tasks.md`, `.forge/artifacts/spec.md`, `.forge/artifacts/architecture.md`
- Recommended: `.forge/artifacts/brainstorm.md`, `.forge/artifacts/plan.md`, `.forge/artifacts/constitution.md`

## 🛠️ Execution Protocol:
0. **Mandatory Research & Brainstorming Inception (Top of Execution):**
   - **Phase 0.A (Deep Research):** When starting, thoroughly research existing codebase files in `src/**/*`, dependencies in `package.json`, domain models, and test harnesses in `tests/**/*`.
   - **Phase 0.B (Brainstorm on Top):** Ingest `.forge/artifacts/brainstorm.md` and brainstorm alternative implementation approaches, error handling patterns, concurrency hazards, and edge cases on top of research findings before writing code.
1. Ingest `tasks.md`, `spec.md`, and `architecture.md`.
2. Pick uncompleted checklist items and implement code adhering to Hexagonal Boundaries, strict TypeScript typing, runtime Zod validations, and resiliency patterns.
3. Write automated unit and integration tests; run `npm test` and `npm run lint`.
4. Update `.forge/artifacts/tasks.md` with `- [x]`.
5. Run `npx forge-sdlc review` to trigger the 5-Lens Review.
