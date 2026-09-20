---
description: Interrogate ambiguous requirements, resolve edge cases, and eliminate hidden assumptions through structured Q&A.
---

Execute Forge capability: **Requirements Clarification & Ambiguity Elicitation**
- Required Inputs: requirements.md, user_input
- Recommended Context: `.forge/artifacts/brainstorm.md`
- Target Output: `.forge/artifacts/clarifications.md`

## 🛠️ Instructions:
0. **Mandatory Research & Brainstorming Inception (Top of Execution):**
   - **Phase 0.A (Deep Research):** When starting, deeply research existing codebase files, dependencies (`package.json`), interfaces, and relevant artifacts.
   - **Phase 0.B (Brainstorm on Top):** Ingest `.forge/artifacts/brainstorm.md` and brainstorm creative alternatives, edge cases, and architectural trade-offs on top of research findings before executing.
1. Run: `npx forge-sdlc clarify`
