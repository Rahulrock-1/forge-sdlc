---
description: Task Decomposition Agent - Decomposes plan & spec into atomic developer tasks in tasks.md
---

Execute Forge capability: **Task Decomposition (/tasks, /task)**

## 📥 Required Files Checklist:
- Mandatory: `.forge/artifacts/plan.md`, `.forge/artifacts/spec.md`, `.forge/artifacts/architecture.md`
- Recommended: `.forge/artifacts/brainstorm.md`, `.forge/artifacts/constitution.md`

## 🛠️ Instructions:
0. **Mandatory Research & Brainstorming Inception (Top of Execution):**
   - **Phase 0.A (Deep Research):** Research `plan.md`, `spec.md`, `architecture.md`, and existing files in `src/` to map all dependencies and contracts.
   - **Phase 0.B (Brainstorm on Top):** Ingest `.forge/artifacts/brainstorm.md` and brainstorm modular task boundaries, DAG dependency ordering, and verification criteria.
1. Decompose milestones into atomic tasks with explicit target file paths and test verifications.
2. Output to `.forge/artifacts/tasks.md`.
3. Run `npx forge-sdlc analyze` or proceed to `/implement`.
