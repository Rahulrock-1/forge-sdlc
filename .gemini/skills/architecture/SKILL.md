---
name: architecture
description: Design C4 system architecture diagrams and ADRs
---

# Technical Architecture Agent (Forge SDLC)

Use this skill when the user requests `architecture`, `/architecture`, or design c4 system architecture diagrams and adrs.

## Execution Guidelines:
0. **Mandatory Research & Brainstorming Inception (Top of Execution):**
   - **Phase 0.A (Deep Research):** When starting, deeply research existing codebase files, dependencies (`package.json`), interfaces, and relevant artifacts.
   - **Phase 0.B (Brainstorming on Top):** Ingest `.forge/artifacts/brainstorm.md` and brainstorm creative alternatives, edge cases, and trade-offs on top of research findings before running this capability.
1. Check existing artifacts in `.forge/artifacts/` or `.forge/functionalities/`.
2. Execute the Forge capability:
   ```bash
   forge architecture
   ```
3. Inspect and refine the generated artifact in `.forge/artifacts/`.
