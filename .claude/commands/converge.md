---
description: Evaluate remaining unchecked tasks, open checklist items, test failures, and synthesize convergence plan to reach release readiness.
---

Execute Forge capability: **Convergence & Residual Work Alignment**
- Required Inputs: tasks.md, checklist.md, test-report.md
- Recommended Context: `.forge/artifacts/brainstorm.md`
- Target Output: `.forge/artifacts/convergence.md`

## 🛠️ Instructions:
0. **Mandatory Research & Brainstorming Inception (Top of Execution):**
   - **Phase 0.A (Deep Research):** When starting, deeply research existing codebase files, dependencies (`package.json`), interfaces, and relevant artifacts.
   - **Phase 0.B (Brainstorm on Top):** Ingest `.forge/artifacts/brainstorm.md` and brainstorm creative alternatives, edge cases, and architectural trade-offs on top of research findings before executing.
1. Run: `npx forge-sdlc converge`
