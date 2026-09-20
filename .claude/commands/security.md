---
description: Inspect code and dependencies for OWASP vulnerabilities, injection vectors, hardcoded secrets, unsafe deserialization, and auth bypasses.
---

Execute Forge capability: **Security Audit & Vulnerability Assessment**
- Required Inputs: existing_codebase, threat-model.md
- Recommended Context: `.forge/artifacts/brainstorm.md`
- Target Output: `.forge/artifacts/security-audit.md`

## 🛠️ Instructions:
0. **Mandatory Research & Brainstorming Inception (Top of Execution):**
   - **Phase 0.A (Deep Research):** When starting, deeply research existing codebase files, dependencies (`package.json`), interfaces, and relevant artifacts.
   - **Phase 0.B (Brainstorm on Top):** Ingest `.forge/artifacts/brainstorm.md` and brainstorm creative alternatives, edge cases, and architectural trade-offs on top of research findings before executing.
1. Run: `npx forge-sdlc security`
