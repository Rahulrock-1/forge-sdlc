# ⚡ Forge SDLC

> **Universal Capability-Oriented SDLC Framework & Autonomous Multi-Agent Orchestrator**  
> Run the best agentic engineering skills across **BMAD**, **GitHub Spec Kit**, and **Internal Engines** through a single unified CLI and native IDE slash commands.

<div align="center">

[![npm version](https://img.shields.io/npm/v/forge-sdlc.svg?style=flat-square&color=cb3837)](https://www.npmjs.com/package/forge-sdlc)
[![CI](https://github.com/Rahulrock-1/forge-sdlc/actions/workflows/ci.yml/badge.svg)](https://github.com/Rahulrock-1/forge-sdlc/actions/workflows/ci.yml)
[![Publish](https://github.com/Rahulrock-1/forge-sdlc/actions/workflows/publish.yml/badge.svg)](https://github.com/Rahulrock-1/forge-sdlc/actions/workflows/publish.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg?style=flat-square)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/Rahulrock-1/forge-sdlc/pulls)

</div>

---

## 🎯 The Problem Forge Solves

Modern agentic coding ecosystems force developers into single-vendor silos:
- Use **BMAD** and you're locked into BMAD commands and prompts.
- Use **Spec Kit** and you're locked into Spec Kit pipelines.

In reality, **no single framework is best at everything**:
- **BMAD** excels in specialized **C4 Technical Architecture**, **Deep Ambiguity Elicitation**, and **5-Lens Code Reviews (`bmad-review`)**.
- **Spec Kit** excels in **Spec-Driven Development (`spec.md`)**, **Project Constitutions (`constitution.md`)**, **Technical Plans (`plan.md`)**, **Atomic Tasks (`tasks.md`)**, **Consistency Audits (`analysis.md`)**, and **Readiness Convergence (`convergence.md`)**.
- **Forge Internal** excels in **STRIDE Threat Modeling**, **OWASP SAST Security Audits**, **Test Suite Synthesis**, and **KeepAChangelog Packaging**.

**Forge decouples your intent from vendor tooling.**

Instead of learning vendor-specific commands (`bmad-architecture`, `speckit-plan`), you simply ask for the **capability**:

```bash
npx forge-sdlc architecture
```

Forge dynamically scores all candidate providers based on project context, recommends the best tool with full explainability ("Why"), and executes it seamlessly through a unified artifact and functionality pipeline.

---

## 🚀 Quickstart (Zero Installation Required)

Run instantly anywhere via `npx`:

```bash
# 1. Run the Complete 14-Stage SDLC Pipeline for a feature:
npx forge-sdlc sdlc --functionality auth-module

# 2. Establish Non-Negotiable Invariants & Constitution:
npx forge-sdlc constitution

# 3. Design C4 Technical Architecture (dynamically routes to BMAD):
npx forge-sdlc architecture

# 4. Generate Given-When-Then Specification (dynamically routes to Spec Kit):
npx forge-sdlc specify

# 5. Run 5-Lens Multi-Perspective Code Review (dynamically routes to BMAD):
npx forge-sdlc review

# 6. Check 100% Pipeline Artifact Progress:
npx forge-sdlc status
```

Or install globally:

```bash
npm install -g forge-sdlc
forge sdlc --functionality billing
```

---

## 🤖 15 Active AI Editor Slash Commands & Agents

Forge automatically configures native slash commands and autonomous agent rules for **Cursor**, **Claude Code**, **Antigravity / Gemini**, **GitHub Copilot**, and **Windsurf**:

```bash
npx forge-sdlc init
# or
npx forge-sdlc agent-rules
```

### 🌟 Active Agents in your AI Chat:

| Slash Command | Agent Role | Specialized Provider | Mandatory Ingestion Files | Target Generated Artifact |
| :--- | :--- | :---: | :--- | :--- |
| **`/sdlc`** | 🚀 **Full SDLC Master Orchestrator** | Multi-Provider | Workspace Context | Complete 14-Stage Lifecycle |
| **`/implement`** | 💻 **Senior Staff Implementation** | BMAD / Spec Kit | `tasks.md`, `spec.md`, `architecture.md` | Source Code in `src/`, `implementation.md` |
| **`/brd`** | 📊 **Business Requirements & ROI** | BMAD | Goals & Context | `brd.md`, `discovery.md` |
| **`/constitution`**| 🏛️ **Constitution & Invariants** | Spec Kit | Project Requirements | `constitution.md` |
| **`/specify`** | 📐 **Given-When-Then Specification**| Spec Kit | `constitution.md`, `brd.md` | `spec.md` |
| **`/clarify`** | 🔍 **Ambiguity Elicitation** | BMAD | `spec.md` | `clarifications.md` |
| **`/architecture`**| 🏗️ **C4 System Design & ADRs** | BMAD | `spec.md`, `constitution.md` | `architecture.md`, `data-model.md` |
| **`/plan`** | 📅 **Phased Milestone Roadmap** | Spec Kit | `spec.md`, `architecture.md` | `plan.md` |
| **`/tasks`** | ✅ **Atomic Developer Checklist** | Spec Kit | `plan.md`, `spec.md`, `constitution.md`| `tasks.md` |
| **`/analyze`** | 🔬 **Cross-Artifact Drift Audit** | Spec Kit | `spec.md`, `architecture.md`, `tasks.md`| `analysis.md` |
| **`/test`** | 🧪 **Automated QA & Test Suites** | Internal | Source Code, `spec.md` | `test-report.md`, tests in `tests/` |
| **`/review`** | 🛡️ **5-Lens Code Review** | BMAD (`bmad-review`) | Source Code, `architecture.md` | `review.md` |
| **`/security`** | 🔒 **STRIDE & OWASP SAST Scan** | Internal | Source Code, `package.json` | `security-audit.md`, `threat-model.md` |
| **`/converge`** | 🎯 **Release Readiness Burndown** | Spec Kit | `tasks.md`, `test-report.md`, `review.md`| `convergence.md` |
| **`/release`** | 📦 **KeepAChangelog & SemVer Bump** | Internal | `convergence.md`, Git history | `CHANGELOG.md`, `RELEASE_NOTES.md` |

---

## 📁 Functionality Folders Architecture

Forge organizes all agent outputs into self-contained **Functionality / Feature Modules** under `.forge/functionalities/<feature>/`:

```
.forge/
├── artifacts/                           # Active workspace artifacts (latest synchronized)
│   ├── discovery.md
│   ├── brd.md
│   ├── constitution.md
│   ├── spec.md
│   ├── clarifications.md
│   ├── architecture.md
│   ├── plan.md
│   ├── tasks.md
│   ├── analysis.md
│   ├── implementation.md
│   ├── test-report.md
│   ├── review.md
│   ├── security-audit.md
│   ├── convergence.md
│   ├── CHANGELOG.md
│   └── RELEASE_NOTES.md
│
├── functionalities/                     # 📂 DEDICATED FUNCTIONALITY MODULES
│   ├── authentication/                  # Full 14-Agent Suite for 'authentication'
│   │   ├── constitution.md
│   │   ├── spec.md
│   │   ├── architecture.md
│   │   ├── tasks.md
│   │   ├── implementation.md
│   │   ├── manifest.json
│   │   └── workflow-state.json
│   │
│   ├── billing-module/                  # Full 14-Agent Suite for 'billing-module'
│   └── core/                            # Default core functionality suite
│
├── iterations/                          # Historical SDLC iteration snapshots
└── runs/                                # Execution snapshots & execution logs
```

---

## 🔄 The 14-Stage SDLC Pipeline & 16 Artifacts (100% Complete)

```
1. DISCOVERY (/brd) ────────► 2. CONSTITUTION (/constitution) ────────► 3. SPECIFICATION (/specify)
         │                                                                       │
         ▼                                                                       ▼
6. PLANNING (/plan) ◄──────── 5. ARCHITECTURE (/architecture) ◄──────── 4. CLARIFICATION (/clarify)
         │
         ▼
7. TASKS (/tasks)   ────────► 8. ANALYSIS (/analyze)         ────────► 9. IMPLEMENTATION (/implement)
                                                                                 │
                                                                                 ▼
12. SECURITY (/security) ◄─── 11. REVIEW (/review)            ◄──────── 10. TESTING (/test)
         │
         ▼
13. CONVERGENCE (/converge) ──► 14. RELEASE (/release)
```

---

## 🧮 Intelligent Multi-Factor Scoring

Forge dynamically scores all candidate providers using a multi-factor weighted algorithm:

$$\text{Score} = w_1 \cdot \text{Match} + w_2 \cdot \text{Spec} + w_3 \cdot \text{WorkflowFit} + w_4 \cdot \text{ArtifactFit} + w_5 \cdot \text{Context} + w_6 \cdot \text{Quality} + w_7 \cdot \text{UserPref}$$

View provider scores and explainability for any capability:

```bash
npx forge-sdlc recommend
npx forge-sdlc matrix
```

---

## 📦 Programmatic TypeScript / Node.js SDK

Forge is also available as a programmatic SDK:

```typescript
import { CapabilityRouter, WorkflowEngine, ArtifactManager } from 'forge-sdlc';

// 1. Intelligent Capability Routing
const router = new CapabilityRouter();
const recommendation = await router.recommend('architecture');
console.log(`Recommended Provider: ${recommendation.recommendedProvider.providerName}`);

// 2. Execute with Functionality Isolation
const result = await router.execute({
  capabilityId: 'specify',
  functionality: 'payment-gateway',
});

// 3. Execute 14-Stage SDLC Pipeline
const engine = new WorkflowEngine();
const fullSdlc = engine.getAvailableWorkflows().find(w => w.id === 'full-sdlc');
await engine.executeWorkflow(fullSdlc!, undefined, { functionality: 'payment-gateway' });
```

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

**Built with ⚡ by [Rahulrock-1](https://github.com/Rahulrock-1)**  
*Universal Capability-Oriented SDLC Framework*

</div>
