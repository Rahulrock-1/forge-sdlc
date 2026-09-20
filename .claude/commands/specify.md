---
description: Generate definitive, complete, testable software specification documents (spec.md) based on user stories and requirements.
---

Execute Forge capability: **Software Specification (SDD)**
- Required Inputs: constitution.md, clarifications.md, user_requirements
- Recommended Context: `.forge/artifacts/brainstorm.md`
- Target Output: `.forge/artifacts/spec.md`

## 🛠️ Instructions:
0. **Mandatory Research & Brainstorming Inception (Top of Execution):**
   - **Phase 0.A (Deep Research):** When starting, deeply research existing codebase files, dependencies (`package.json`), interfaces, and relevant artifacts.
   - **Phase 0.B (Brainstorm on Top):** Ingest `.forge/artifacts/brainstorm.md` and brainstorm creative alternatives, edge cases, and architectural trade-offs on top of research findings before executing.
1. Run: `npx forge-sdlc specify`
