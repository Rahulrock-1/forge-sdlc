# Forge SDLC - Agent & Capability System Rules

This project is governed by **Forge SDLC** (Universal Capability-Oriented SDLC Framework).

## 🧠 Universal Agent Rule: Research-First & Brainstorm-on-Top Principle (All Agents)
Every single agent must execute a mandatory two-phase inception at the top of its workflow before generating artifacts or code:
1. **Phase 0.A (Deep Research & Codebase Grounding):** When starting, the agent must thoroughly research existing codebase files, dependencies (`package.json`), interfaces, test suites, and relevant artifacts.
2. **Phase 0.B (Divergent Brainstorming on Top of Research):** Ingest `.forge/artifacts/brainstorm.md` (or the functionality's `brainstorm.md`) to inherit the core product vision, high-ROI concepts, and creative insights, and brainstorm divergent approaches, alternative designs, edge cases, failure recovery paths, and architectural trade-offs on top of research findings.
3. **Phase 1 (Convergent Execution):** Select the most resilient and elegant path forward before codifying the artifact or implementation.

## 🚀 Active Agents & Slash Commands:
- `/brainstorm` (or `forge brainstorm`, `/ideate`): **Stage 0 (Top of All Agents)** — Brainstorm & Lateral Ideation Agent (`brainstorm.md`) & Feasibility Ranking (BMAD)
- `/research` (or `forge research`): Technical Research & Spike Agent (`research.md`) — Deep codebase research, technical library evaluation, and architectural spikes with brainstorming on top (Internal)
- `/sdlc` (or `forge sdlc`): Full SDLC Master Orchestrator — runs all 15 stages from brainstorm to release.
- `/heal` (or `forge heal`, `/drift`): Cross-Artifact Auto-Healing & Drift Sync Agent (`healing-plan.md`) (Internal)
- `/swarm` (or `forge swarm`): Multi-Provider Swarm Consensus Engine (BMAD + SpecKit + Internal)
- `/implement` (or `forge implement`): Autonomous Implementation Agent — implements production code & tests from `tasks.md`, `spec.md`, and `architecture.md` with research and brainstorming on top.
- `/brd` (or `forge brd`): Business Requirements Document (`brd.md`) & ROI modeling (BMAD)
- `/constitution` (or `forge constitution`): Non-negotiable architectural invariants (`constitution.md`) (Spec Kit)
- `/specify` (or `forge specify`): Functional Specification (`spec.md`) with Given-When-Then criteria (Spec Kit)
- `/clarify` (or `forge clarify`): Deep ambiguity elicitation (BMAD)
- `/architecture` (or `forge architecture`): C4 Architecture & System Design (`architecture.md`) (BMAD)
- `/plan` (or `forge plan`): Phased milestone execution roadmap (`plan.md`) (Spec Kit)
- `/tasks` (or `forge tasks`): Atomic developer task checklist (`tasks.md`) (Spec Kit)
- `/analyze` (or `forge analyze`): Cross-artifact consistency audit (`analysis.md`) (Spec Kit)
- `/test` (or `forge test`): Automated test suite synthesis & QA report (Internal)
- `/review` (or `forge review`): 5-Lens Multi-Perspective Code Review (`review.md`) (BMAD)
- `/security` (or `forge security`): STRIDE & OWASP Security Audit (`security-audit.md`) (Internal)
- `/converge` (or `forge converge`): Task burndown & release readiness (`convergence.md`) (Spec Kit)
- `/release` (or `forge release`): KeepAChangelog notes and SemVer bump (Internal)

All project artifacts are stored in `.forge/artifacts/`. Always reference and uphold them.
