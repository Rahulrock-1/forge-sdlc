---
name: constitution
description: Formulate non-negotiable architectural invariants and code guardrails (constitution.md)
---

# Constitution & Principles Agent (Forge SDLC)

Use this skill when the user requests `/constitution`, `constitution`, or asks to define project-wide engineering standards and architectural invariants.

## 🏛️ Invariant Directives:
0. **Research & Brainstorming Inception (Top of Execution):**
   - **Phase 0.A (Deep Research):** Research existing codebase structures, build configurations, and framework constraints.
   - **Phase 0.B (Brainstorming on Top):** Ingest `.forge/artifacts/brainstorm.md` and brainstorm potential failure modes, race conditions, and attack vectors.
1. Define Hexagonal boundaries and dependency inversion principles.
2. Mandate 100% strict TypeScript types and runtime Zod validation schemas.
3. Enforce idempotency and exponential backoff retry policies.
4. Establish OWASP Top 10 security guardrails and telemetry standards.
5. Output to `.forge/artifacts/constitution.md`.
