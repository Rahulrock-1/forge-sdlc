---
name: sdlc
description: Execute end-to-end 15-stage SDLC workflow from brainstorm to release
---

# Full SDLC Master Orchestrator (Forge SDLC)

Use this skill when the user requests `/sdlc`, `/workflow`, or asks to run the complete end-to-end SDLC pipeline.

## Master SDLC Pipeline Execution (15 Stages):
All agents in this pipeline execute with Research-First & Brainstorm-on-Top inception:
0. `forge brainstorm` (Lateral Ideation & Feasibility Ranking)
1. `forge brd` (Business Requirements Document)
2. `forge constitution` (Non-Negotiable Invariants)
3. `forge specify` (Given-When-Then Specification)
4. `forge clarify` (Ambiguity Elicitation)
5. `forge architecture` (C4 Architecture & ADRs)
6. `forge plan` (Milestone Roadmap)
7. `forge tasks` (Task Decomposition Checklist)
8. `forge analyze` (Cross-Artifact Drift Analysis)
9. `forge implement` (Autonomous Code & Test Implementation)
10. `forge test` (Automated Test Verification)
11. `forge review` (5-Lens Multi-Perspective Code Review)
12. `forge security` (STRIDE & OWASP Security Audit)
13. `forge converge` (Task Burndown & Release Readiness)
14. `forge release` (KeepAChangelog & Release Notes)

Fast CLI run: `npx forge-sdlc sdlc --functionality core`
