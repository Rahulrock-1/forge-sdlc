# 🔄 Forge SDLC — Unified Iteration & Documentation Architecture (ITERATIONS.md)

> **Autonomous Iteration Ledger & Token-Cost Optimized Storage Engine**  
> Tracks all sequential iteration cycles, multi-module feature folders, artifact history diffs, and token optimization metrics.

---

## 📁 1. Master Iteration & Documentation Folder Structure

All iterations and SDLC outputs are stored in a unified, deterministic hierarchy under `.forge/`:

```
.forge/
├── artifacts/                           # Active workspace artifacts (latest synchronized state)
│   ├── history/                         # Historical version archives (.v1.md, .v2.md, ...)
│   │   ├── architecture.v1.md
│   │   ├── spec.v1.md
│   │   └── tasks.v1.md
│   ├── brainstorm.md                    # Brainstorming & Lateral Ideation (BMAD)
│   ├── brd.md                           # Business Requirements Document (BMAD)
│   ├── constitution.md                  # Non-Negotiable Invariants (Spec Kit)
│   ├── spec.md                          # Given-When-Then Specification (Spec Kit)
│   ├── architecture.md                  # C4 Technical Architecture & ADRs (BMAD)
│   ├── plan.md                          # Phased Milestone Execution Roadmap (Spec Kit)
│   ├── tasks.md                         # Atomic Developer Checklist (Spec Kit)
│   ├── analysis.md                      # Cross-Artifact Consistency Audit (Spec Kit)
│   ├── test-report.md                   # Automated Test Suites (Internal)
│   ├── review.md                        # 5-Lens Multi-Perspective Review (BMAD)
│   ├── security-audit.md                # STRIDE & OWASP AppSec Audit (Internal)
│   └── convergence.md                   # Release Readiness Burndown (Spec Kit)
│
├── iterations/                          # Immutable sequential iteration snapshots
│   ├── README.md                        # Auto-generated iteration catalog
│   ├── iteration-1/                     # Full snapshot of Iteration 1
│   │   ├── manifest.json                # Execution metadata, provider authors, byte sizes
│   │   └── ...                          # Complete artifact documents at Iteration 1
│   ├── iteration-2/                     # Full snapshot of Iteration 2
│   │   ├── manifest.json
│   │   └── ...
│   └── iteration-N/                     # Active iteration snapshot
│
├── functionalities/                     # Modular feature-scoped documentation
│   ├── core/                            # Core foundational architecture & tasks
│   │   ├── manifest.json
│   │   └── ...
│   ├── auth/                            # Authentication module specs & tasks
│   └── billing/                         # Billing module specs & tasks
│
└── runs/                                # Granular execution run traces
    └── run-<timestamp>-<workflowId>/    # Isolated per-run logs & stage diffs
```

---

## 📊 2. Chronological Iteration Ledger

| Iteration # | Snapshot Folder | Feature Module | Artifacts Generated | Provider Engine(s) | Timestamp | Snapshot Directory |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **Iteration 1** | `iteration-1` | `core` | 14 artifacts | `BMAD, SPECKIT, INTERNAL` | 25/8/2026, 12:09:16 am | `.forge/iterations/iteration-1/` |
| **Iteration 2** | `iteration-2` | `core` | 14 artifacts | `BMAD, SPECKIT, INTERNAL` | 25/8/2026, 12:09:29 am | `.forge/iterations/iteration-2/` |
| **Iteration 3** | `iteration-3` | `core` | 2 artifacts | `SPECKIT` | 25/8/2026, 12:10:04 am | `.forge/iterations/iteration-3/` |
| **Iteration 4** | `iteration-4` | `core` | 1 artifacts | `SPECKIT` | 25/8/2026, 12:10:04 am | `.forge/iterations/iteration-4/` |
| **Iteration 5** | `iteration-5` | `core` | 2 artifacts | `SPECKIT` | 25/8/2026, 12:19:59 am | `.forge/iterations/iteration-5/` |
| **Iteration 6** | `iteration-6` | `auth-module` | 3 artifacts | `SPECKIT, BMAD` | 25/8/2026, 12:19:59 am | `.forge/iterations/iteration-6/` |
| **Iteration 7** | `iteration-7` | `core` | 2 artifacts | `SPECKIT` | 25/8/2026, 12:21:09 am | `.forge/iterations/iteration-7/` |
| **Iteration 8** | `iteration-8` | `auth-module` | 3 artifacts | `SPECKIT, BMAD` | 25/8/2026, 12:21:09 am | `.forge/iterations/iteration-8/` |
| **Iteration 9** | `iteration-9` | `authentication` | 14 artifacts | `BMAD, SPECKIT, INTERNAL` | 25/8/2026, 12:21:32 am | `.forge/iterations/iteration-9/` |
| **Iteration 10** | `iteration-10` | `core` | 2 artifacts | `SPECKIT` | 25/8/2026, 12:30:09 am | `.forge/iterations/iteration-10/` |
| **Iteration 11** | `iteration-11` | `auth-module` | 3 artifacts | `SPECKIT, BMAD` | 25/8/2026, 12:30:09 am | `.forge/iterations/iteration-11/` |
| **Iteration 12** | `iteration-12` | `test-14-stage` | 15 artifacts | `BMAD, SPECKIT, INTERNAL` | 25/8/2026, 12:30:10 am | `.forge/iterations/iteration-12/` |
| **Iteration 13** | `iteration-13` | `core-system` | 15 artifacts | `BMAD, SPECKIT, INTERNAL` | 25/8/2026, 12:30:29 am | `.forge/iterations/iteration-13/` |
| **Iteration 14** | `iteration-14` | `core` | 2 artifacts | `SPECKIT` | 25/8/2026, 12:34:55 am | `.forge/iterations/iteration-14/` |
| **Iteration 15** | `iteration-15` | `auth-module` | 3 artifacts | `SPECKIT, BMAD` | 25/8/2026, 12:34:55 am | `.forge/iterations/iteration-15/` |
| **Iteration 16** | `iteration-16` | `test-14-stage` | 15 artifacts | `BMAD, SPECKIT, INTERNAL` | 25/8/2026, 12:34:55 am | `.forge/iterations/iteration-16/` |
| **Iteration 17** | `iteration-17` | `core` | 2 artifacts | `SPECKIT` | 25/8/2026, 1:07:07 am | `.forge/iterations/iteration-17/` |
| **Iteration 18** | `iteration-18` | `auth-module` | 3 artifacts | `SPECKIT, BMAD` | 25/8/2026, 1:07:07 am | `.forge/iterations/iteration-18/` |
| **Iteration 19** | `iteration-19` | `test-14-stage` | 15 artifacts | `BMAD, SPECKIT, INTERNAL` | 25/8/2026, 1:07:08 am | `.forge/iterations/iteration-19/` |
| **Iteration 20** | `iteration-20` | `core` | 2 artifacts | `SPECKIT` | 25/8/2026, 1:49:17 am | `.forge/iterations/iteration-20/` |
| **Iteration 21** | `iteration-21` | `auth-module` | 3 artifacts | `SPECKIT, BMAD` | 25/8/2026, 1:49:17 am | `.forge/iterations/iteration-21/` |
| **Iteration 22** | `iteration-22` | `test-14-stage` | 15 artifacts | `BMAD, SPECKIT, INTERNAL` | 25/8/2026, 1:49:17 am | `.forge/iterations/iteration-22/` |
| **Iteration 23** | `iteration-23` | `core` | 2 artifacts | `SPECKIT` | 30/8/2026, 12:46:34 pm | `.forge/iterations/iteration-23/` |
| **Iteration 24** | `iteration-24` | `auth-module` | 3 artifacts | `SPECKIT, BMAD` | 30/8/2026, 12:46:34 pm | `.forge/iterations/iteration-24/` |
| **Iteration 25** | `iteration-25` | `test-14-stage` | 15 artifacts | `BMAD, SPECKIT, INTERNAL` | 30/8/2026, 12:46:34 pm | `.forge/iterations/iteration-25/` |
| **Iteration 26** | `iteration-26` | `auth-module` | 4 artifacts | `SPECKIT, BMAD` | 30/8/2026, 1:23:45 pm | `.forge/iterations/iteration-26/` |
| **Iteration 27** | `iteration-27` | `test-15-stage` | 1 artifacts | `BMAD` | 30/8/2026, 1:23:45 pm | `.forge/iterations/iteration-27/` |
| **Iteration 28** | `iteration-28` | `core` | 2 artifacts | `SPECKIT` | 30/8/2026, 1:24:46 pm | `.forge/iterations/iteration-28/` |
| **Iteration 29** | `iteration-29` | `auth-module` | 3 artifacts | `SPECKIT, BMAD` | 30/8/2026, 1:24:46 pm | `.forge/iterations/iteration-29/` |
| **Iteration 30** | `iteration-30` | `test-15-stage` | 16 artifacts | `BMAD, SPECKIT, INTERNAL` | 30/8/2026, 1:24:47 pm | `.forge/iterations/iteration-30/` |
| **Iteration 31** | `iteration-31` | `core` | 2 artifacts | `SPECKIT` | 30/8/2026, 1:25:43 pm | `.forge/iterations/iteration-31/` |
| **Iteration 32** | `iteration-32` | `auth-module` | 3 artifacts | `SPECKIT, BMAD` | 30/8/2026, 1:25:43 pm | `.forge/iterations/iteration-32/` |
| **Iteration 33** | `iteration-33` | `test-15-stage` | 16 artifacts | `BMAD, SPECKIT, INTERNAL` | 30/8/2026, 1:25:45 pm | `.forge/iterations/iteration-33/` |
| **Iteration 34** | `iteration-34` | `core` | 2 artifacts | `SPECKIT` | 30/8/2026, 1:29:32 pm | `.forge/iterations/iteration-34/` |
| **Iteration 35** | `iteration-35` | `auth-module` | 3 artifacts | `SPECKIT, BMAD` | 30/8/2026, 1:29:32 pm | `.forge/iterations/iteration-35/` |
| **Iteration 36** | `iteration-36` | `test-15-stage` | 16 artifacts | `BMAD, SPECKIT, INTERNAL` | 30/8/2026, 1:29:33 pm | `.forge/iterations/iteration-36/` |

---

## 📦 3. Feature / Functionality Modules

| Feature Module | Artifacts Scoped | Storage Path | Last Synchronized |
| :--- | :---: | :--- | :--- |
| **`auth-module`** | 2 artifacts | `.forge/functionalities/auth-module/` | 30/8/2026, 1:29:32 pm |
| **`authentication`** | 14 artifacts | `.forge/functionalities/authentication/` | 25/8/2026, 12:21:32 am |
| **`core`** | 2 artifacts | `.forge/functionalities/core/` | 30/8/2026, 1:29:32 pm |
| **`core-system`** | 15 artifacts | `.forge/functionalities/core-system/` | 25/8/2026, 12:30:29 am |
| **`test-14-stage`** | 15 artifacts | `.forge/functionalities/test-14-stage/` | 30/8/2026, 12:46:34 pm |
| **`test-15-stage`** | 16 artifacts | `.forge/functionalities/test-15-stage/` | 30/8/2026, 1:29:33 pm |
| **`test-heal`** | 1 artifacts | `.forge/functionalities/test-heal/` | Active |

---

## 💰 4. Token Cost Optimization Architecture

Forge enforces strict token optimization policies across every development iteration:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TOKEN CONSUMPTION CONTROL POLICIES                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  1. Zero-Token Offline Default   │ Deterministic AST analysis ($0.00 cost)  │
│  2. Strict Dependency Ingestion  │ Only passes declared input files (0 bloat│
│  3. Differential Iteration Diffs │ Passes surgical diffs, not 100k LOC code │
│  4. Local Model Offloading       │ Routes bulk tasks to Ollama / DeepSeek   │
│  5. Immutable Artifact Caching   │ Reuses cached artifacts when unchanged   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ 5. Iteration Management Commands

- **Inspect Iteration Status:** `npx forge-sdlc status` or `forge dashboard`
- **Auto-Heal Documentation Drift:** `npx forge-sdlc heal --apply`
- **Run Multi-Provider Consensus:** `npx forge-sdlc swarm review`
- **Execute Next Iteration Workflow:** `npx forge-sdlc workflow run full-sdlc --functionality <module>`
