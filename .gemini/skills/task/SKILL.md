---
name: task
description: Generate atomic developer checklist (tasks.md)
---

# Task Decomposition Agent (Forge SDLC)

Use this skill when the user requests `/tasks`, `/task`, or asks to decompose plans or specifications into atomic developer tasks.

## 📥 Required Files Checklist:
- **Mandatory:** `.forge/artifacts/plan.md`, `.forge/artifacts/spec.md`, `.forge/artifacts/architecture.md`
- **Recommended:** `.forge/artifacts/brainstorm.md`, `.forge/artifacts/constitution.md`

## 📋 Guidelines:
0. **Research & Brainstorming Inception (Top of Execution):**
   - **Phase 0.A (Deep Research):** Research `plan.md`, `spec.md`, `architecture.md`, and existing files in `src/`.
   - **Phase 0.B (Brainstorming on Top):** Ingest `.forge/artifacts/brainstorm.md` and brainstorm modular boundaries, dependency sequencing, and verification criteria.
1. Decompose milestones into atomic tasks with explicit target file paths and test verifications.
2. Format each task:
   ```markdown
   - [ ] **Task X.Y: Title**
     *Files:* `src/path/to/file.ts`
     *Verification:* `npm test`
   ```
3. Save to `.forge/artifacts/tasks.md`.
