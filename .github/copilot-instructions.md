# Forge SDLC - AI Editor Custom Instructions

When working in this repository, you have access to the **Forge SDLC Capability Pipeline**:

## 🚀 Primary Agents & Slash Commands:
- `/sdlc` / `/workflow`: Master SDLC Orchestrator — executes the complete 13-stage pipeline.
- `/implement`: Autonomous Implementation Agent — reads `spec.md`, `architecture.md`, `tasks.md` and writes production code with tests.
- `/brd`: Formulates Business Requirements Document & ROI model (`brd.md`) via BMAD.
- `/specify`: Formulates Given-When-Then functional specification (`spec.md`) via Spec Kit.
- `/clarify`: Probes ambiguities & edge cases (`clarifications.md`) via BMAD.
- `/architecture`: Designs C4 system architecture & ADRs (`architecture.md`) via BMAD.
- `/plan`: Synthesizes phased technical execution milestones (`plan.md`) via Spec Kit.
- `/tasks`: Decomposes plan into atomic checklist items (`tasks.md`) via Spec Kit.
- `/analyze`: Performs cross-artifact consistency & drift audit (`analysis.md`) via Spec Kit.
- `/test`: Synthesizes automated unit/integration test suites (`test-report.md`) via Internal.
- `/review`: Runs 5-Lens code review (`review.md`) via BMAD.
- `/security`: Runs OWASP & STRIDE threat audit (`security-audit.md`) via Forge Internal.
- `/converge`: Verifies task burndown and certifies release readiness (`convergence.md`) via Spec Kit.
- `/release`: Generates KeepAChangelog notes and SemVer release draft (`CHANGELOG.md`).

Artifacts are located in `.forge/artifacts/`. Always align implementations with these artifacts.
