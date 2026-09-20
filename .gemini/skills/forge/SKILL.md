---
name: forge-sdlc
description: Universal Capability-Oriented SDLC Orchestrator for BMAD, Spec Kit, and Internal Providers. Includes /implement, /brainstorm, /heal, /swarm, and /sdlc full runner agents with research-first & brainstorm on top of all agents.
---

# Forge SDLC Skill

Use this skill when the user requests SDLC capabilities, autonomous code implementation, architecture, specification, code review, auto-healing, swarm consensus, or full SDLC pipeline execution.

## 🧠 Universal Rule: Research First, Brainstorm on Top (All Agents)
Every single agent must execute a mandatory two-phase inception at the top of its workflow:
1. **Phase 0.A (Deep Research & Codebase Grounding):** When starting, thoroughly research existing codebase files, dependencies (`package.json`), interfaces, schemas, test suites, and relevant artifacts.
2. **Phase 0.B (Divergent Brainstorming on Top of Research):** Ingest `.forge/artifacts/brainstorm.md` and brainstorm divergent approaches, candidate designs, failure recovery paths, edge cases, and architectural trade-offs on top of research findings BEFORE generating artifacts or code.

## Key Agents & Slash Commands:
- `/brainstorm` (or `/ideate`): **Stage 0 (Top of All Agents)** — Brainstorm & Lateral Ideation (brainstorm.md) (BMAD)
- `/research`: Technical Research & Spike Agent (research.md) (Internal)
- `/sdlc`: Full SDLC Master Orchestrator (End-to-End 15 stages starting with /brainstorm)
- `/heal`: Cross-Artifact Auto-Healing & Drift Sync (healing-plan.md) (Internal)
- `/swarm`: Multi-Provider Swarm Consensus Engine (BMAD + SpecKit + Internal)
- `/implement`: Autonomous Implementation Agent (Writes typed code & tests with research and brainstorming on top)
- `/brd`: Business Requirements & ROI modeling (BMAD)
- `/constitution`: Non-negotiable Architectural Invariants (Spec Kit)
- `/specify`: Given-When-Then Specification (spec.md) (Spec Kit)
- `/clarify`: Deep Ambiguity Elicitation (BMAD)
- `/architecture`: C4 Technical Architecture (architecture.md) (BMAD)
- `/plan`: Technical Execution Plan (plan.md) (Spec Kit)
- `/tasks`: Developer Task Checklist (tasks.md) (Spec Kit)
- `/analyze`: Cross-Artifact Consistency Audit (Spec Kit)
- `/test`: Automated Test Suite & Coverage (Internal)
- `/review`: 5-Lens Multi-Perspective Code Review (BMAD)
- `/security`: STRIDE & OWASP SAST Scan (Internal)
- `/converge`: Task Burndown & Release Readiness (Spec Kit)
- `/release`: KeepAChangelog & Release Notes (Internal)
