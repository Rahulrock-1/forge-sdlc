---
description: Map task dependencies, identify circular dependencies, detect blocking paths, and optimize parallel execution tracks.
---

Execute Forge capability: **Dependency & Critical Path Analysis**
- Required Inputs: tasks.md
- Recommended Context: `.forge/artifacts/brainstorm.md`
- Target Output: `.forge/artifacts/dependency-graph.md`

## 🛠️ Instructions:
0. **Mandatory Research & Brainstorming Inception (Top of Execution):**
   - **Phase 0.A (Deep Research):** When starting, deeply research existing codebase files, dependencies (`package.json`), interfaces, and relevant artifacts.
   - **Phase 0.B (Brainstorm on Top):** Ingest `.forge/artifacts/brainstorm.md` and brainstorm creative alternatives, edge cases, and architectural trade-offs on top of research findings before executing.
1. Run: `npx forge-sdlc dependency-analysis`
