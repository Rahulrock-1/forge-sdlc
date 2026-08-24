# ⚡ Forge SDLC

> **Universal Capability-Oriented SDLC Framework & Intelligent Provider Router**  
> Run the best agentic engineering skills across **BMAD**, **GitHub Spec Kit**, and **Internal Engines** through a single unified CLI.

[![npm version](https://img.shields.io/npm/v/forge-sdlc.svg)](https://www.npmjs.com/package/forge-sdlc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org)

---

## 🎯 The Problem Forge Solves

Modern agentic coding ecosystems force developers to pick a single vendor stack:
- Use **BMAD** and you're locked into BMAD commands and workflows.
- Use **Spec Kit** and you're locked into Spec Kit pipelines.

In reality, **no single framework is best at everything**:
- **BMAD** provides industry-leading specialized **Architecture & System Design**, **Multi-Lens Code Review (`bmad-review`)**, and **Deep Ambiguity Elicitation**.
- **Spec Kit** provides industry gold-standard **Spec-Driven Development (`spec.md`)**, **Strict Technical Planning (`plan.md`)**, **Atomic Task Decomposition (`tasks.md`)**, **Cross-Artifact Analysis (`analysis.md`)**, and **Convergence (`convergence.md`)**.
- **Forge Internal** provides rock-solid **STRIDE Security Audits**, **Test Automation Synthesis**, **Release Management**, and **CI/CD Deployment**.

**Forge decouples your intent from vendor tooling.**

Instead of learning vendor-specific commands (`bmad-architecture`, `speckit-plan`), you simply ask for the **capability**:

```bash
npx forge-sdlc architecture
```

Forge dynamically scores all candidate providers based on project context, recommends the best tool with full explainability ("Why"), and executes it seamlessly through a unified artifact pipeline.

---

## 🚀 Quickstart (Zero Installation Required)

Run instantly anywhere via `npx`:

```bash
# Recommend optimal SDLC workflow for the current project
npx forge-sdlc recommend

# Design technical architecture (dynamically routes to BMAD)
npx forge-sdlc architecture

# Generate functional specification (dynamically routes to Spec Kit)
npx forge-sdlc specify

# Run multi-lens code & architecture review (dynamically routes to BMAD)
npx forge-sdlc review

# View full capability matrix across BMAD, Spec Kit, and Internal
npx forge-sdlc matrix
```

Or install globally:

```bash
npm install -g forge-sdlc
forge recommend
```

---

## 🧭 Complete Generic Capability Catalog

Forge organizes 30+ generic SDLC capabilities into 7 core stages:

```
forge/
├── Discovery
│   ├── brainstorm          # Lateral ideation & feasibility ranking
│   ├── discover            # Domain boundaries & actor mapping
│   ├── brd                 # Business Requirements Document (brd.md) & ROI analysis
│   ├── research            # Technical spikes & trade-off analysis
│   ├── requirements        # Requirements engineering (MoSCoW)
│   └── clarify             # Ambiguity & edge-case elicitation
├── Specification
│   ├── constitution        # Architectural invariants & governance
│   ├── specify             # Software Specification Document (spec.md)
│   ├── acceptance          # Given-When-Then BDD scenarios
│   └── checklist           # Quality readiness checklist
├── Architecture
│   ├── architecture        # Technical architecture & C4 diagrams
│   ├── system-design       # Service topology & caching strategies
│   ├── data-model          # Entity ERD & database schema design
│   ├── api-design          # OpenAPI 3.1 & API contracts
│   ├── security-design     # STRIDE threat modeling & auth rules
│   ├── ai-architecture     # Agentic workflows & RAG pipelines
│   └── infrastructure-design # Cloud topology & IaC templates
├── Planning
│   ├── plan                # Technical execution plan (plan.md)
│   ├── tasks               # Atomic task decomposition (tasks.md)
│   ├── estimate            # Complexity & story point sizing
│   └── dependency-analysis # DAG critical path analysis
├── Implementation
│   ├── implement           # Agentic code synthesis
│   ├── refactor            # Clean code & tech debt cleanup
│   ├── migrate             # Language & framework upgrades
│   └── fix                 # Root cause bug fix & regression test
├── Verification
│   ├── test                # Automated test suite generation
│   ├── analyze             # Cross-artifact consistency & drift audit
│   ├── review              # 5-Lens Code Review (bmad-review)
│   ├── security            # OWASP SAST & secret scanning
│   ├── performance         # Profiling & bottleneck analysis
│   └── conformance         # Constitution invariant audit
└── Delivery
    ├── converge            # Task burndown & release readiness
    ├── release             # KeepAChangelog & SemVer bump
    ├── deploy              # Deployment & smoke testing
    └── rollback            # Incident recovery & post-mortem
```

---

## 📊 Capability Comparison Matrix

| Generic Capability | BMAD | Spec Kit | Internal | Default Recommendation |
| :--- | :---: | :---: | :---: | :--- |
| **Constitution / Invariants** | Partial | ✅ **Strong (98)** | ✅ (88) | **Spec Kit** (Strict SDD governance) |
| **Requirements / Specification** | ✅ (82) | ✅ **Strong (99)** | ✅ (84) | **Spec Kit** (Given-When-Then criteria) |
| **Ambiguity Clarification** | ✅ **Strong (96)** | ✅ **Strong (91)** | ✅ (80) | **BMAD** for deep elicitation / **Spec Kit** for structured Q&A |
| **Brainstorming & Ideation** | ✅ **Strong (95)** | Limited (65) | ✅ (80) | **BMAD** (Multi-perspective exploration) |
| **Technical Architecture** | ✅ **Strong (97)** | Plan includes arch (76) | ✅ (88) | **BMAD** (Specialized architecture workflows) |
| **Data Modeling** | ✅ **Strong (94)** | In plan (72) | ✅ (88) | **BMAD** (ERD & relational modeling) |
| **API Contracts** | ✅ **Strong (95)** | In plan (74) | ✅ (90) | **BMAD** (Formal OpenAPI 3.1 schemas) |
| **Technical Planning** | ✅ (91) | ✅ **Strong (97)** | ✅ (86) | **Spec Kit** (Phased milestone contracts) |
| **Task Decomposition** | ✅ (85) | ✅ **Strong (98)** | ✅ (89) | **Spec Kit** (Atomic developer tasks) |
| **Cross-Artifact Analysis** | ✅ (82) | ✅ **Strong (98)** | ✅ (90) | **Spec Kit** (Zero-drift gap analysis) |
| **Agentic Implementation** | ✅ **Strong (93)** | ✅ **Strong (92)** | ✅ (88) | **Context-dependent** (BMAD for complex / Spec Kit for TDD) |
| **Multi-Lens Review** | ✅ **Gold Std (98)** | Less specialized (80) | ✅ (86) | **BMAD** (`bmad-review` 5-lens audit) |
| **Security & Threat Model** | ✅ (91) | Not core | ✅ **Strong (97)** | **Forge Internal** (STRIDE & SAST) |
| **Readiness Convergence** | ✅ (82) | ✅ **Strong (98)** | ✅ (88) | **Spec Kit** (Tasks burndown certification) |
| **Release & Deployment** | ✅ (85) | Not core | ✅ **Strong (96)** | **Forge Internal** (KeepAChangelog & CI/CD) |

---

## 🧮 Intelligent Multi-Factor Scoring

Forge does **not** rely on hardcoded `if capability == 'architecture'` statements. Instead, candidate providers are evaluated dynamically using a multi-factor weighted scoring formula:

$$\text{Score} = w_1 \cdot \text{Match} + w_2 \cdot \text{Spec} + w_3 \cdot \text{WorkflowFit} + w_4 \cdot \text{ArtifactFit} + w_5 \cdot \text{Context} + w_6 \cdot \text{Quality} + w_7 \cdot \text{UserPref}$$

```
Architecture Request
        │
        ├── BMAD Architecture
        │     capability match  = 100
        │     specialization     = 97
        │     workflow fit       = 95
        │     artifact fit       = 75
        │     project context    = 85
        │     provider quality   = 95
        │     ─────────────────────────
        │     Total Score        = 92/100  --> RECOMMENDED ✓
        │
        ├── Forge Internal
        │     Total Score        = 88/100
        │
        └── Spec Kit Plan
              Total Score        = 82/100
```

### Explainability ("Why" & Alternatives)

Forge always explains why a provider was recommended and when to consider alternatives:

```
RECOMMENDED: BMAD ARCHITECTURE & SYSTEM DESIGN (Score: 92/100)

Why:
• Industry-leading specialization in Technical Architecture & System Design (97/100).
• Specialized multi-tier architectural workflows
• Deep pattern reasoning (Event-driven, Microservices, Hexagonal, Clean Arch)
• Exhaustive trade-off matrices

Alternative: Spec Kit Plan (Score: 82/100)
Use alternative if:
• You want architecture tightly coupled to SDD artifacts and prefer Spec Kit's plan -> tasks pipeline.
```

---

## 🔄 Sequential End-to-End SDLC Pipeline

Run a complete SDLC pipeline from discovery through release:

```bash
npx forge-sdlc workflow run full-sdlc
```

```
DISCOVER  ──────►  SPECIFY  ──────►  CLARIFY  ──────►  ARCHITECTURE  ──────►  PLAN
 (BMAD)           (Spec Kit)         (BMAD)               (BMAD)             (Spec Kit)
                                                                                  │
                                                                                  ▼
CONVERGE  ◄──────  SECURITY  ◄──────  REVIEW  ◄──────  TEST  ◄──────  IMPLEMENT  ◄──────  TASKS
(Spec Kit)        (Internal)         (BMAD)          (Internal)      (BMAD/Spec)       (Spec Kit)
   │
   ▼
RELEASE
(Internal)
```

---

## 📁 Artifact Pipeline & Quality Gates

Artifacts are saved to `.forge/artifacts/` using standard Markdown contracts:

```
.forge/
├── artifacts/
│   ├── constitution.md     # Governance & invariants (Spec Kit)
│   ├── spec.md             # Functional specification (Spec Kit)
│   ├── clarifications.md   # Ambiguity decisions (BMAD)
│   ├── architecture.md     # C4 architecture & system design (BMAD)
│   ├── plan.md             # Milestone roadmap (Spec Kit)
│   ├── tasks.md            # Actionable developer tasks (Spec Kit)
│   ├── analysis.md         # Cross-artifact consistency audit (Spec Kit)
│   ├── review.md           # 5-lens code review report (BMAD)
│   ├── security-audit.md   # OWASP & STRIDE audit (Forge Internal)
│   └── convergence.md      # Burndown & release readiness (Spec Kit)
├── workflow-state.json     # Live stage tracking
```

Check the pipeline state at any time:

```bash
npx forge-sdlc status
```

---

## 🔐 Token Authentication & AI Models

Forge provides built-in token authentication and verification across **OpenAI, Anthropic, Gemini, DeepSeek, OpenRouter, and Ollama**:

### 1. Authenticate & Verify Your Token
Test live connectivity, verify authorization (HTTP 200 OK), and check latency:

```bash
# Verify active token (from env, .env, or .forgerc.json)
npx forge-sdlc auth

# Or test a specific token directly
npx forge-sdlc auth test sk-ant-api03-xxxxxxxxx
```

### 2. Configure Token & Active Model
```bash
# Set your active model
npx forge-sdlc config set model claude-3-7-sonnet

# Set your API token
npx forge-sdlc config set token sk-ant-api03-xxxxxxxxx

# View configuration status
npx forge-sdlc config
```

### 3. List Supported Models
```bash
npx forge-sdlc models
```

---

## ⚙️ Configuration (`.forgerc.json`)

Initialize configuration in any repository:

```bash
npx forge-sdlc init
```

`.forgerc.json` example:

```json
{
  "version": "1.0.0",
  "projectName": "my-saas-platform",
  "providers": {
    "enabled": ["bmad", "speckit", "internal"],
    "overrides": {
      "forge.architecture": "bmad",
      "forge.specify": "speckit"
    }
  },
  "qualityGates": {
    "enforceStrictChecklists": true
  },
  "scoringWeights": {
    "specialization": 0.30,
    "artifactFit": 0.20
  }
}
```

---

## 📦 Programmatic SDK Usage

Forge can be used as a TypeScript / JavaScript library:

```typescript
import { CapabilityRouter, ScoringEngine, WorkflowEngine } from 'forge-sdlc';

const router = new CapabilityRouter();

// 1. Get recommendation for a capability
const rec = await router.recommend('architecture');
console.log(`Recommended: ${rec.recommendedProvider.providerName}`);

// 2. Execute capability
const result = await router.execute({
  capabilityId: 'architecture',
  writeToRoot: true,
});
console.log(result.executionResult?.summary);

// 3. Run full workflow
const workflowEngine = new WorkflowEngine();
const workflows = workflowEngine.getAvailableWorkflows();
await workflowEngine.executeWorkflow(workflows[0]);
```

---

## 📜 License

MIT © 2026 Forge SDLC Project.
