# Forge SDLC - AI Editor Custom Instructions (Senior Staff / Principal Level)

When working in this repository, you have access to the **Forge SDLC Capability Pipeline**:

## 🧠 Universal Agent Invariant: Research First, Brainstorm on Top (All Agents)
Every single agent must execute a mandatory two-phase inception at the top of its workflow before generating artifacts or code:
1. **Phase 0.A (Deep Research & Codebase Grounding):** When starting, thoroughly research existing codebase files, dependencies (`package.json`), interfaces, schemas, test suites, and relevant artifacts.
2. **Phase 0.B (Divergent Brainstorming on Top of Research):** Ingest `.forge/artifacts/brainstorm.md` (or the feature's `brainstorm.md`) to brainstorm divergent approaches, alternative designs, failure recovery paths, edge cases, and architectural trade-offs on top of research findings.
3. **Phase 1 (Convergent Execution):** Select the most resilient and maintainable approach before generating code, tests, or specifications.

## 📋 Agent File Dependency & Ingestion Matrix (15 Stages):
- `/brainstorm` (or `/ideate`): **Stage 0 (Top of All Agents)** — Brainstorm & Lateral Ideation (`brainstorm.md`) via BMAD. Explores problem space, divergent feature ideas & feasibility ranking.
- `/research`: Technical Research & Spike Agent (`research.md`) via Forge Internal. Deep codebase research, technical library evaluation, and architectural spikes with brainstorming on top.
- `/sdlc` / `/workflow`: Master SDLC Orchestrator — executes the complete 15-stage pipeline starting from `/brainstorm`.
- `/heal` (or `/drift`): Cross-Artifact Auto-Healing & Drift Sync (`healing-plan.md`) via Internal.
- `/swarm`: Multi-Provider Swarm Consensus Engine (BMAD + SpecKit + Internal).
- `/brd`: Business Requirements & ROI Model (`brd.md`) via BMAD. **Requires:** `brainstorm.md`.
- `/constitution`: Non-negotiable architectural & security invariants (`constitution.md`) via Spec Kit. **Requires:** `brainstorm.md`.
- `/specify`: Given-When-Then functional specification (`spec.md`) via Spec Kit. **Requires:** `brainstorm.md`, `constitution.md`.
- `/clarify`: Probes ambiguities & edge cases (`clarifications.md`) via BMAD. **Requires:** `spec.md`, `brainstorm.md`.
- `/architecture`: C4 System Architecture & ADRs (`architecture.md`) via BMAD. **Requires:** `spec.md`, `constitution.md`, `brainstorm.md`.
- `/plan`: Phased technical roadmap (`plan.md`) via Spec Kit. **Requires:** `spec.md`, `architecture.md`, `brainstorm.md`.
- `/tasks` (or `/task`): Atomic task checklist (`tasks.md`) via Spec Kit. **Requires:** `plan.md`, `spec.md`, `constitution.md`, `brainstorm.md`.
- `/analyze`: Cross-artifact consistency & drift analytics (`analysis.md`) via Spec Kit. **Requires:** `spec.md`, `tasks.md`, `brainstorm.md`.
- `/implement`: Autonomous Implementation Agent — **Requires:** `tasks.md`, `spec.md`, `architecture.md`, `constitution.md`, `brainstorm.md`. Implements typed code, DDD patterns, resiliency & tests with research and brainstorming on top.
- `/test`: Automated unit/integration test suites (`test-report.md`) via Internal. **Requires:** Source code in `src/`.
- `/review`: 5-Lens code review (`review.md`) via BMAD. **Requires:** Source code, `architecture.md`, `constitution.md`, `brainstorm.md`.
- `/security`: STRIDE & OWASP SAST Threat Audit (`security-audit.md`) via Forge Internal. **Requires:** `brainstorm.md`, source code.
- `/converge`: Task burndown and release readiness certification (`convergence.md`) via Spec Kit.
- `/release`: KeepAChangelog notes and SemVer release notes (`CHANGELOG.md`, `RELEASE_NOTES.md`).

Artifacts are located in `.forge/artifacts/` and `.forge/functionalities/<feature>/`. Always align implementations with these artifacts.
