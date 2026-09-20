---
name: security
description: STRIDE threat model and OWASP SAST scan
---

# Security & Threat Audit Agent (Forge SDLC)

Use this skill when the user requests `security`, `/security`, or stride threat model and owasp sast scan.

## Execution Guidelines:
0. **Mandatory Research & Brainstorming Inception (Top of Execution):**
   - **Phase 0.A (Deep Research):** When starting, deeply research existing codebase files, dependencies (`package.json`), interfaces, and relevant artifacts.
   - **Phase 0.B (Brainstorming on Top):** Ingest `.forge/artifacts/brainstorm.md` and brainstorm creative alternatives, edge cases, and trade-offs on top of research findings before running this capability.
1. Check existing artifacts in `.forge/artifacts/` or `.forge/functionalities/`.
2. Execute the Forge capability:
   ```bash
   forge security
   ```
3. Inspect and refine the generated artifact in `.forge/artifacts/`.
