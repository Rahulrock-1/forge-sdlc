/**
 * Forge SDLC - AI Editor Agent & Slash Command Integrator
 * Generates slash commands & rules for Cursor, Claude Code, GitHub Copilot, Antigravity, and Windsurf.
 */

import fs from 'node:fs';
import path from 'node:path';
import { CAPABILITY_CATALOG } from '../catalog/capabilities.js';

export interface AgentIntegrationResult {
  cursorRulesCount: number;
  claudeCommandsCount: number;
  copilotConfigured: boolean;
  geminiSkillConfigured: boolean;
  windsurfConfigured: boolean;
  installedPaths: string[];
}

export class AgentIntegrator {
  public static installSlashCommands(workspaceRoot: string = process.cwd()): AgentIntegrationResult {
    const root = path.resolve(workspaceRoot);
    const installedPaths: string[] = [];

    // 1. Install Cursor Slash Commands (.cursor/rules/)
    const cursorDir = path.join(root, '.cursor', 'rules');
    if (!fs.existsSync(cursorDir)) {
      fs.mkdirSync(cursorDir, { recursive: true });
    }

    let cursorCount = 0;
    for (const cap of CAPABILITY_CATALOG) {
      const bestProv = cap.providers[0]?.providerName || 'Forge';
      let mdcContent = '';

      if (cap.name === 'implement') {
        mdcContent = `---
description: Autonomous Implementation Agent (IMPLEMENTATION) - Senior Staff Engineer executing production-grade, typed code & tests with analytics & fault-tolerance
globs: *
alwaysApply: false
---

# /implement - Autonomous Senior Staff Implementation Agent

You are the specialized **Autonomous Implementation Agent** (Senior Staff / Principal AI Engineer) orchestrated by **Forge SDLC**.

## 📥 Required & Recommended File Dependencies:
- **Mandatory Required Files (Check before executing):**
  * \`.forge/artifacts/tasks.md\` (Actionable developer checklist with verification criteria)
  * \`.forge/artifacts/spec.md\` (Given-When-Then functional specification)
  * \`.forge/artifacts/architecture.md\` (C4 component models, patterns, and interface contracts)
- **Recommended Context Files:**
  * \`.forge/artifacts/plan.md\` (Technical milestone roadmap)
  * \`.forge/artifacts/constitution.md\` (Non-negotiable architectural invariants)
  * \`.forge/artifacts/api-contract.md\` / \`data-model.md\` (If present)
- **Target Output Files:**
  * Production source files (\`src/**/*\`)
  * Automated test suites (\`tests/**/*\`)
  * Updated task burndown in \`.forge/artifacts/tasks.md\`
- **Recommended Next Step:** Run \`forge test\` or \`forge review\` (5-Lens Review).

---

## 🎯 High-Level Problem Solving & Implementation Protocol:

### 1. Hexagonal & Clean Architecture Boundaries:
- Decouple pure domain business logic from infrastructure I/O (APIs, databases, CLI formatters).
- Define ports (interfaces) in domain layers; implement concrete adapters in infrastructure layers.
- Adhere strictly to the design patterns and boundary invariants specified in \`architecture.md\`.

### 2. Enterprise-Grade Type Safety & Runtime Validation:
- Use strict typing (Generics, Discriminated Unions, Branded Types, exhaustive \`never\` checks).
- Zero \`any\` escape hatches. Use explicit domain models and DTOs.
- Enforce runtime validation on all external inputs and API payloads using Zod/Valibot schemas.
- Throw structured custom error classes with typed error envelopes.

### 3. Fault-Tolerance, Resiliency & Concurrency:
- **Idempotency:** Ensure mutating operations support idempotent retries with unique request keys.
- **Exponential Backoff:** Wrap external network/database calls in retry loops with exponential backoff and randomized jitter.
- **Circuit Breaking:** Isolate failing external dependencies to prevent cascading failures.
- **Concurrency Control:** Implement safe async concurrency with atomic operations or mutex locks where needed.

### 4. Telemetry, Analytics & Observability:
- Instrument code with structured JSON logging containing Correlation IDs (\`traceId\`, \`spanId\`, \`timestamp\`).
- Add metric counters, gauges, and latency histograms for critical business transactions.
- Track analytics events and audit trails for state-changing actions.

### 5. Test-Driven Verification (TDD):
- Write unit tests with 100% path coverage for all domain logic.
- Write integration tests for provider adapters and repository persistence.
- Test boundary conditions, race conditions, network timeouts, and malformed inputs.
- Verify with \`npm test\` and \`npm run lint\`.

### 6. Task Burndown Update:
- Mark executed items in \`.forge/artifacts/tasks.md\` with \`- [x]\`.
`;
      } else if (cap.name === 'constitution') {
        mdcContent = `---
description: Project Constitution & Engineering Invariants Agent (SPECIFICATION) - Establishes non-negotiable architectural, security, and type-safety rules in constitution.md
globs: *
alwaysApply: false
---

# /constitution - Project Constitution & Architectural Invariants Agent

You are the specialized **Project Constitution & Engineering Invariants Agent** orchestrated by **Forge SDLC**.

## 📥 Required & Recommended File Dependencies:
- **Mandatory Required Inputs:** Project workspace context & architectural requirements
- **Target Output Files:** \`.forge/artifacts/constitution.md\`
- **Recommended Next Step:** Run \`forge specify\` (Given-When-Then Specification).

---

## 🏛️ Constitutional Governance & Invariant Protocols:
1. **Article I: Supreme Architectural Invariants**
   - Clean / Hexagonal Layering: Pure domain core decoupled from infrastructure I/O.
   - Ports & Adapters: Infrastructure adheres to domain interfaces (Ports).
   - Zero Circular Dependencies.
2. **Article II: Strict Type-Safety & Validation**
   - 100% strict TypeScript typing. Zero \`any\` escape hatches.
   - Boundary validation for all incoming DTOs using runtime Zod/Valibot schemas.
3. **Article III: Resiliency, Fault-Tolerance & Concurrency**
   - Idempotency keys on state mutations.
   - Exponential backoff with randomized jitter for all external I/O.
   - Circuit breaker isolation.
4. **Article IV: Security & Zero-Trust Invariants**
   - OWASP Top 10 defenses, zero hardcoded secrets, input sanitization, least privilege.
5. **Article V: Telemetry & Observability**
   - Structured JSON logs with Correlation IDs (\`traceId\`, \`spanId\`).
   - OpenTelemetry spans for service entrypoints.
6. **Article VI: TDD & Quality Gate Compliance**
   - Minimum 90% test coverage; mandatory negative/edge-case tests.
`;
      } else if (cap.name === 'tasks') {
        mdcContent = `---
description: Task Decomposition Agent (PLANNING) - Decomposes architecture and plans into atomic, DAG-ordered developer tasks
globs: *
alwaysApply: false
---

# /tasks - Task Decomposition & Work Breakdown Agent

You are the specialized **Task Decomposition & Work Breakdown Agent** orchestrated by **Forge SDLC**.

## 📥 Required & Recommended File Dependencies:
- **Mandatory Required Files (Check before executing):**
  * \`.forge/artifacts/plan.md\` (Phased technical roadmap & milestones)
  * \`.forge/artifacts/spec.md\` (Given-When-Then functional specification)
  * \`.forge/artifacts/architecture.md\` (C4 component models & ADRs)
- **Recommended Context Files:**
  * \`.forge/artifacts/constitution.md\` (Architectural invariants)
  * \`.forge/artifacts/clarifications.md\` (Edge-case resolutions)
- **Target Output Files:**
  * \`.forge/artifacts/tasks.md\` (Atomic developer task checklist)
- **Recommended Next Step:** Run \`forge analyze\` to audit drift, then \`forge implement\`.

---

## 📋 Advanced Task Decomposition Protocol:
1. **DAG-Ordered Milestone Grouping:**
   - Group tasks by Phase / Milestone matching \`plan.md\`.
   - Sequence tasks topologically by prerequisite dependencies.

2. **Atomic Task Schema:**
   Every task item MUST follow this exact format:
   \`\`\`markdown
   - [ ] **Task X.Y: <Actionable Title>**
     *Files:* \`<explicit source & test file paths>\`
     *Given-When-Then:* \`<Scenario ID from spec.md>\`
     *Verification:* \`<concrete test command, e.g. npm test or vitest run>\`
     *Dependencies:* \`<preceding task IDs>\`
   \`\`\`

3. **Strict Atomicity & Quality Gates:**
   - Tasks must be small enough for an AI coding agent to implement and verify in a single pass.
   - 100% of \`spec.md\` criteria must be mapped to at least one task.
   - Every task must declare explicit file targets and verification assertions.
`;
      } else if (cap.name === 'analyze') {
        mdcContent = `---
description: Cross-Artifact Analysis Agent (VERIFICATION) - High-level consistency, completeness, and requirement drift analytics
globs: *
alwaysApply: false
---

# /analyze - Cross-Artifact Consistency & Drift Analytics Agent

You are the specialized **Cross-Artifact Consistency & Drift Analytics Agent** orchestrated by **Forge SDLC**.

## 📥 Required & Recommended File Dependencies:
- **Mandatory Required Files (Check before executing):**
  * \`.forge/artifacts/spec.md\` (Functional specification)
  * \`.forge/artifacts/architecture.md\` (C4 architecture & ADRs)
  * \`.forge/artifacts/plan.md\` (Milestone roadmap)
  * \`.forge/artifacts/tasks.md\` (Developer tasks checklist)
- **Target Output Files:**
  * \`.forge/artifacts/analysis.md\` (Consistency & Drift Audit Report)
- **Recommended Next Step:** Run \`forge implement\` (Autonomous Implementation Agent).

---

## 🔍 Advanced Analytics & Audit Protocol:
1. **Requirement Traceability Matrix:**
   - Map every Given-When-Then scenario in \`spec.md\` to its architectural component in \`architecture.md\` and task in \`tasks.md\`.
   - Calculate mathematical coverage percentage ($100 \\times \\frac{\\text{covered}}{\\text{total}}$).

2. **Drift & Orphan Detection:**
   - Flag orphaned requirements (spec criteria with no matching task).
   - Flag rogue tasks (tasks that implement features not in spec or architecture).
   - Detect contract mismatches between API designs and domain models.

3. **Security & Performance Analytics:**
   - Verify all non-functional requirements (latency, throughput, auth invariants) have verification checks.
`;
      } else if (cap.name === 'architecture') {
        mdcContent = `---
description: Technical Architecture Agent (ARCHITECTURE) - C4 system design, ADRs, distributed data models & zero-trust security
globs: *
alwaysApply: false
---

# /architecture - Technical Architecture & System Design Agent

You are the specialized **Technical Architecture Agent** orchestrated by **Forge SDLC**.

## 📥 Required & Recommended File Dependencies:
- **Mandatory Required Files (Check before executing):**
  * \`.forge/artifacts/spec.md\` (Functional requirements & Given-When-Then criteria)
  * \`.forge/artifacts/discovery.md\` or \`brd.md\` (Domain scope & business objectives)
- **Recommended Context Files:**
  * \`.forge/artifacts/clarifications.md\` (Ambiguity resolutions)
- **Target Output Files:**
  * \`.forge/artifacts/architecture.md\` (C4 architecture & ADRs)
  * \`.forge/artifacts/data-model.md\` (ERD & schema design)
  * \`.forge/artifacts/api-contract.md\` (OpenAPI 3.1 contract)
- **Recommended Next Step:** Run \`forge plan\` (Technical Execution Plan).

---

## 🏗️ Advanced Architectural Design Protocol:
1. **C4 Multi-Level Architecture:**
   - Level 1: System Context Diagram (User, External Services, Core System).
   - Level 2: Container Diagram (Frontend, API Gateway, Services, Caching, DB).
   - Level 3: Component Diagram (Domain Services, Provider Adapters, Event Bus).
2. **Data & Storage Topology:**
   - Entity-Relationship Diagrams (Mermaid ERD).
   - Indexing strategies, caching policies (Redis TTLs, cache invalidation), and partitioning.
3. **Resiliency & Security Invariants:**
   - Zero-trust authentication & authorization flow (JWT/OAuth2).
   - Circuit breakers, rate-limiting, and distributed tracing context propagation.
4. **Architectural Decision Records (ADRs):**
   - Format: Context, Decision, Rationale, Trade-offs, Consequences.
`;
      } else if (cap.name === 'review') {
        mdcContent = `---
description: Multi-Lens Code Review Agent (VERIFICATION) - 5-Perspective deep review across architecture, quality, security, performance & testing
globs: *
alwaysApply: false
---

# /review - 5-Lens Multi-Perspective Code Review Agent

You are the specialized **Multi-Lens Code Review Agent** orchestrated by **Forge SDLC**.

## 📥 Required & Recommended File Dependencies:
- **Mandatory Required Files (Check before executing):**
  * Source code in \`src/**/*\` and tests in \`tests/**/*\`
  * \`.forge/artifacts/architecture.md\` (Architectural invariants)
  * \`.forge/artifacts/spec.md\` (Functional criteria)
- **Target Output Files:**
  * \`.forge/artifacts/review.md\` (5-Lens Review Report & Risk Scoring)
- **Recommended Next Step:** Run \`forge security\` (STRIDE & OWASP Security Audit).

---

## 🔬 5-Lens Deep Review Protocol:
1. **Lens 1: Architecture & Design Alignment:**
   - Hexagonal boundaries, dependency inversion, clean layer separation.
2. **Lens 2: Code Quality & SOLID Standards:**
   - DRY, single responsibility, cognitive complexity $< 10$, immutability.
3. **Lens 3: Security & Vulnerability Defense:**
   - Injection prevention, proper authorization, secret leak scanning.
4. **Lens 4: Performance, Concurrency & Big-O:**
   - Algorithmic time/space complexity ($O(N \\log N)$ or better), race condition prevention, memory leak checks.
5. **Lens 5: Test Quality & Verification:**
   - Path coverage, mock fidelity, negative/boundary test cases.
`;
      } else if (cap.name === 'security' || cap.name === 'security-review') {
        mdcContent = `---
description: Security & Threat Audit Agent (VERIFICATION) - STRIDE threat modeling & OWASP Top 10 vulnerability scan
globs: *
alwaysApply: false
---

# /security - Security & STRIDE Threat Audit Agent

You are the specialized **Security Audit Agent** orchestrated by **Forge SDLC**.

## 📥 Required & Recommended File Dependencies:
- **Mandatory Required Files (Check before executing):**
  * Source code in \`src/**/*\` and \`package.json\`
  * \`.forge/artifacts/architecture.md\` (Component boundaries)
- **Target Output Files:**
  * \`.forge/artifacts/security-audit.md\` (OWASP Audit Report)
  * \`.forge/artifacts/threat-model.md\` (STRIDE Matrix)
- **Recommended Next Step:** Run \`forge converge\` (Release Candidate Readiness).

---

## 🛡️ Advanced Security Protocol:
1. **STRIDE Threat Modeling:**
   - Evaluate Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege.
2. **OWASP Top 10 SAST Analysis:**
   - SQL/Command Injection, Broken Auth, Cryptographic Failures, Insecure Dependencies.
3. **Automated Remediation:**
   - Provide concrete code diffs to fix every identified vulnerability.
`;
      } else {
        mdcContent = `---
description: ${cap.displayName} (${cap.group.toUpperCase()}) - Runs optimal provider (${bestProv}) via Forge
globs: *
alwaysApply: false
---

# /${cap.name} - ${cap.displayName}

You are the specialized **${cap.displayName} Agent** orchestrated by **Forge SDLC**.

## 📥 Ingestion & Dependency Checklist:
- **Required Inputs:** ${cap.inputs.map((i) => i.defaultArtifact || i.name).join(', ') || 'Project context'}
- **Target Output Artifact:** \`.forge/artifacts/${cap.outputs[0]?.artifactName || `${cap.name}.md`}\`
- **Recommended Provider:** **${bestProv}**

## How to Execute:
1. Check existing artifacts in \`.forge/artifacts/\` or functionality folders.
2. Execute the Forge capability:
   \`\`\`bash
   npx forge-sdlc ${cap.name}
   \`\`\`
3. Inspect and verify generated artifact: \`.forge/artifacts/${cap.outputs[0]?.artifactName || `${cap.name}.md`}\`.
4. Ensure all non-negotiables from \`spec.md\` and \`architecture.md\` are preserved.
`;
      }

      const filePath = path.join(cursorDir, `forge-${cap.name}.mdc`);
      fs.writeFileSync(filePath, mdcContent, 'utf-8');
      cursorCount++;

      // Create convenient short aliases
      if (cap.name === 'business-requirements') {
        fs.writeFileSync(path.join(cursorDir, 'forge-brd.mdc'), mdcContent.replace('/business-requirements', '/brd'), 'utf-8');
        cursorCount++;
      } else if (cap.name === 'architecture') {
        fs.writeFileSync(path.join(cursorDir, 'forge-arch.mdc'), mdcContent.replace('/architecture', '/arch'), 'utf-8');
        cursorCount++;
      } else if (cap.name === 'specify') {
        fs.writeFileSync(path.join(cursorDir, 'forge-spec.mdc'), mdcContent.replace('/specify', '/spec'), 'utf-8');
        cursorCount++;
      } else if (cap.name === 'tasks') {
        fs.writeFileSync(path.join(cursorDir, 'forge-task.mdc'), mdcContent.replace('# /tasks', '# /task'), 'utf-8');
        fs.writeFileSync(path.join(cursorDir, 'forge-task-decomposition.mdc'), mdcContent.replace('# /tasks', '# /task-decomposition'), 'utf-8');
        cursorCount += 2;
      }
    }

    // Install Master SDLC Orchestrator Cursor Rule (/sdlc & /workflow)
    const sdlcMdcContent = `---
description: Full SDLC Master Orchestrator - Runs the complete 14-stage autonomous lifecycle with functionality folders & quality gates
globs: *
alwaysApply: false
---

# /sdlc - Full SDLC Master Orchestrator Agent

You are the **Master SDLC Orchestrator Agent** powered by **Forge SDLC**.

## 🚀 Mission
Drive the end-to-end software development lifecycle sequentially across all 14 specialized capabilities with automated dependency validation, constitutional governance, and structured functionality folder organization.

## 🔄 End-to-End Pipeline Stages & Ingestion Matrix (14 Stages):
| Stage # | Agent & Slash Command | Mandatory Required Input Files | Target Generated Artifact |
| :--- | :--- | :--- | :--- |
| **1. Discovery** | \`/brd\` (\`forge brd\`) | Workspace Context, Goals | \`discovery.md\`, \`brd.md\` |
| **2. Constitution** | \`/constitution\` (\`forge constitution\`) | Project Requirements | \`constitution.md\` (Non-Negotiable Invariants) |
| **3. Specification** | \`/specify\` (\`forge specify\`) | \`constitution.md\`, \`brd.md\` | \`spec.md\` (Given-When-Then criteria) |
| **4. Clarification** | \`/clarify\` (\`forge clarify\`) | \`spec.md\` | \`clarifications.md\` |
| **5. Architecture** | \`/architecture\` (\`forge architecture\`) | \`spec.md\`, \`constitution.md\` | \`architecture.md\`, \`data-model.md\` |
| **6. Planning** | \`/plan\` (\`forge plan\`) | \`spec.md\`, \`architecture.md\` | \`plan.md\` |
| **7. Tasks** | \`/tasks\` / \`/task\` (\`forge tasks\`) | \`plan.md\`, \`spec.md\`, \`constitution.md\` | \`tasks.md\` |
| **8. Analysis** | \`/analyze\` (\`forge analyze\`) | \`spec.md\`, \`architecture.md\`, \`tasks.md\` | \`analysis.md\` (Drift & Coverage Audit) |
| **9. Implementation** | \`/implement\` (\`forge implement\`) | \`tasks.md\`, \`spec.md\`, \`constitution.md\` | Source files in \`src/\`, \`implementation.md\` |
| **10. Testing** | \`/test\` (\`forge test\`) | Source files in \`src/\`, \`constitution.md\` | \`test-report.md\`, tests in \`tests/\` |
| **11. Review** | \`/review\` (\`forge review\`) | Source files in \`src/\`, \`constitution.md\` | \`review.md\` (5-Lens Review) |
| **12. Security** | \`/security\` (\`forge security\`) | Source files, \`package.json\` | \`security-audit.md\`, \`threat-model.md\` |
| **13. Convergence** | \`/converge\` (\`forge converge\`) | \`tasks.md\`, \`test-report.md\`, \`review.md\` | \`convergence.md\` |
| **14. Release** | \`/release\` (\`forge release\`) | \`convergence.md\`, Git commits | \`CHANGELOG.md\`, \`RELEASE_NOTES.md\` |

## 💻 CLI Fast-Track:
\`\`\`bash
npx forge-sdlc sdlc --functionality core
# or
npx forge-sdlc workflow run full-sdlc
\`\`\`
`;
    fs.writeFileSync(path.join(cursorDir, 'forge-sdlc.mdc'), sdlcMdcContent, 'utf-8');
    fs.writeFileSync(path.join(cursorDir, 'forge-workflow.mdc'), sdlcMdcContent.replace('/sdlc', '/workflow'), 'utf-8');
    cursorCount += 2;
    installedPaths.push('.cursor/rules/ (Cursor Slash Commands, /constitution, /implement, /tasks & /sdlc)');

    // 2. Install Claude Code Slash Commands (.claude/commands/)
    const claudeDir = path.join(root, '.claude', 'commands');
    if (!fs.existsSync(claudeDir)) {
      fs.mkdirSync(claudeDir, { recursive: true });
    }

    let claudeCount = 0;
    for (const cap of CAPABILITY_CATALOG) {
      let cmdContent = '';
      if (cap.name === 'implement') {
        cmdContent = `---
description: Autonomous Implementation Agent - Senior Staff Engineer implementing typed code & tests with telemetry & resiliency
---

Execute Forge capability: **Senior Staff Implementation (/implement)**

## 📥 Required Files Checklist:
- Mandatory: \`.forge/artifacts/tasks.md\`, \`.forge/artifacts/spec.md\`, \`.forge/artifacts/architecture.md\`
- Recommended: \`.forge/artifacts/plan.md\`, \`.forge/artifacts/constitution.md\`

## 🛠️ Execution Protocol:
1. Ingest \`tasks.md\`, \`spec.md\`, and \`architecture.md\`.
2. Pick uncompleted checklist items and implement code adhering to Hexagonal Boundaries, strict TypeScript typing, runtime Zod validations, and resiliency patterns.
3. Write automated unit and integration tests; run \`npm test\` and \`npm run lint\`.
4. Update \`.forge/artifacts/tasks.md\` with \`- [x]\`.
5. Run \`npx forge-sdlc review\` to trigger the 5-Lens Review.
`;
      } else if (cap.name === 'constitution') {
        cmdContent = `---
description: Project Constitution Agent - Establishes non-negotiable architectural invariants & code guardrails in constitution.md
---

Execute Forge capability: **Project Constitution (/constitution)**

## 📥 Instructions:
1. Formulate non-negotiable architectural invariants, type-safety rules, security policies, and testing standards.
2. Output to \`.forge/artifacts/constitution.md\`.
3. Proceed to \`npx forge-sdlc specify\`.
`;
      } else if (cap.name === 'tasks') {
        cmdContent = `---
description: Task Decomposition Agent - Decomposes plan & spec into atomic developer tasks in tasks.md
---

Execute Forge capability: **Task Decomposition (/tasks, /task)**

## 📥 Required Files Checklist:
- Mandatory: \`.forge/artifacts/plan.md\`, \`.forge/artifacts/spec.md\`, \`.forge/artifacts/architecture.md\`

## 🛠️ Instructions:
1. Decompose milestones into atomic tasks with explicit target file paths and test verifications.
2. Output to \`.forge/artifacts/tasks.md\`.
3. Run \`npx forge-sdlc analyze\` or proceed to \`/implement\`.
`;
      } else {
        cmdContent = `---
description: ${cap.description}
---

Execute Forge capability: **${cap.displayName}**
- Required Inputs: ${cap.inputs.map((i) => i.defaultArtifact || i.name).join(', ') || 'Workspace context'}
- Target Output: \`.forge/artifacts/${cap.outputs[0]?.artifactName || `${cap.name}.md`}\`

Run: \`npx forge-sdlc ${cap.name}\`
`;
      }
      const filePath = path.join(claudeDir, `${cap.name}.md`);
      fs.writeFileSync(filePath, cmdContent, 'utf-8');
      claudeCount++;

      if (cap.name === 'tasks') {
        fs.writeFileSync(path.join(claudeDir, 'task.md'), cmdContent, 'utf-8');
        fs.writeFileSync(path.join(claudeDir, 'task-decomposition.md'), cmdContent, 'utf-8');
        claudeCount += 2;
      }
    }

    // Claude Code /sdlc and /workflow commands
    const claudeSdlcContent = `---
description: Full SDLC Master Orchestrator - Drives complete 14-stage lifecycle from Discovery to Release
---

Execute **Forge Full SDLC Pipeline (/sdlc)**

Run: \`npx forge-sdlc sdlc --functionality core\` or execute sequentially:
1. \`forge brd\` -> 2. \`forge constitution\` -> 3. \`forge specify\` -> 4. \`forge clarify\` -> 5. \`forge architecture\` -> 6. \`forge plan\` -> 7. \`forge tasks\` -> 8. \`forge analyze\` -> 9. \`forge implement\` -> 10. \`forge test\` -> 11. \`forge review\` -> 12. \`forge security\` -> 13. \`forge converge\` -> 14. \`forge release\`
`;
    fs.writeFileSync(path.join(claudeDir, 'sdlc.md'), claudeSdlcContent, 'utf-8');
    fs.writeFileSync(path.join(claudeDir, 'workflow.md'), claudeSdlcContent, 'utf-8');
    claudeCount += 2;
    installedPaths.push('.claude/commands/ (Claude Code Slash Commands, /task & /sdlc)');

    // 3. Install GitHub Copilot Instructions (.github/copilot-instructions.md)
    const githubDir = path.join(root, '.github');
    if (!fs.existsSync(githubDir)) {
      fs.mkdirSync(githubDir, { recursive: true });
    }

    const copilotContent = `# Forge SDLC - AI Editor Custom Instructions (Senior Staff / Principal Level)

When working in this repository, you have access to the **Forge SDLC Capability Pipeline**:

## 📋 Agent File Dependency & Ingestion Matrix (14 Stages):
- \`/sdlc\` / \`/workflow\`: Master SDLC Orchestrator — executes the complete 14-stage pipeline.
- \`/brd\`: Business Requirements & ROI Model (\`brd.md\`) via BMAD.
- \`/constitution\`: Non-negotiable architectural & security invariants (\`constitution.md\`) via Spec Kit.
- \`/specify\`: Given-When-Then functional specification (\`spec.md\`) via Spec Kit. **Requires:** \`constitution.md\`.
- \`/clarify\`: Probes ambiguities & edge cases (\`clarifications.md\`) via BMAD.
- \`/architecture\`: C4 System Architecture & ADRs (\`architecture.md\`) via BMAD. **Requires:** \`spec.md\`, \`constitution.md\`.
- \`/plan\`: Phased technical roadmap (\`plan.md\`) via Spec Kit. **Requires:** \`spec.md\`, \`architecture.md\`.
- \`/tasks\` (or \`/task\`): Atomic task checklist (\`tasks.md\`) via Spec Kit. **Requires:** \`plan.md\`, \`spec.md\`, \`constitution.md\`.
- \`/analyze\`: Cross-artifact consistency & drift analytics (\`analysis.md\`) via Spec Kit. **Requires:** \`spec.md\`, \`tasks.md\`.
- \`/implement\`: Autonomous Implementation Agent — **Requires:** \`tasks.md\`, \`spec.md\`, \`architecture.md\`, \`constitution.md\`. Implements typed code, DDD patterns, resiliency & tests.
- \`/test\`: Automated unit/integration test suites (\`test-report.md\`) via Internal. **Requires:** Source code in \`src/\`.
- \`/review\`: 5-Lens code review (\`review.md\`) via BMAD. **Requires:** Source code, \`architecture.md\`, \`constitution.md\`.
- \`/security\`: STRIDE & OWASP SAST Threat Audit (\`security-audit.md\`) via Forge Internal.
- \`/converge\`: Task burndown and release readiness certification (\`convergence.md\`) via Spec Kit.
- \`/release\`: KeepAChangelog notes and SemVer release notes (\`CHANGELOG.md\`, \`RELEASE_NOTES.md\`).

Artifacts are located in \`.forge/artifacts/\` and \`.forge/functionalities/<feature>/\`. Always align implementations with these artifacts.
`;
    fs.writeFileSync(path.join(githubDir, 'copilot-instructions.md'), copilotContent, 'utf-8');
    installedPaths.push('.github/copilot-instructions.md (GitHub Copilot)');

    // 4. Install Antigravity & Gemini Skills (.agents/skills/ and .gemini/skills/)
    const agentsSkillsDir = path.join(root, '.agents', 'skills');
    const geminiSkillsDir = path.join(root, '.gemini', 'skills');

    const keyCapabilities = [
      { id: 'sdlc', name: 'sdlc', title: 'Full SDLC Master Orchestrator', desc: 'Execute end-to-end 14-stage SDLC workflow from discovery to release' },
      { id: 'brd', name: 'brd', title: 'Business Requirements (BRD)', desc: 'Formulate Business Requirements Document (brd.md) and ROI models' },
      { id: 'constitution', name: 'constitution', title: 'Constitution & Principles', desc: 'Formulate non-negotiable architectural invariants and code guardrails (constitution.md)' },
      { id: 'specify', name: 'specify', title: 'Software Specification (SDD)', desc: 'Formulate Given-When-Then specification (spec.md)' },
      { id: 'clarify', name: 'clarify', title: 'Ambiguity Clarification', desc: 'Probe hidden assumptions and edge-cases' },
      { id: 'architecture', name: 'architecture', title: 'Technical Architecture', desc: 'Design C4 system architecture diagrams and ADRs' },
      { id: 'data-model', name: 'data-model', title: 'Data Modeling & Schema', desc: 'Design ERD diagrams and database schemas' },
      { id: 'api-design', name: 'api-design', title: 'API Contract Design', desc: 'Design OpenAPI 3.1 contracts and error envelopes' },
      { id: 'plan', name: 'plan', title: 'Technical Execution Plan', desc: 'Synthesize phased milestone roadmap (plan.md)' },
      { id: 'tasks', name: 'tasks', title: 'Task Decomposition', desc: 'Generate atomic developer checklist (tasks.md)' },
      { id: 'task', name: 'task', title: 'Task Decomposition', desc: 'Generate atomic developer checklist (tasks.md)' },
      { id: 'analyze', name: 'analyze', title: 'Cross-Artifact Analysis', desc: 'Audit consistency across spec, arch, and tasks' },
      { id: 'implement', name: 'implement', title: 'Autonomous Senior Staff Implementation Agent', desc: 'Implement production code and tests adhering to spec.md, architecture.md, and tasks.md' },
      { id: 'test', name: 'test', title: 'Automated Testing & QA', desc: 'Synthesize test suites and coverage reports' },
      { id: 'review', name: 'review', title: 'Multi-Lens Review', desc: '5-Perspective code review (bmad-review)' },
      { id: 'security', name: 'security', title: 'Security & Threat Audit', desc: 'STRIDE threat model and OWASP SAST scan' },
      { id: 'converge', name: 'converge', title: 'Convergence & Burndown', desc: 'Certify task burndown and release candidate readiness' },
      { id: 'release', name: 'release', title: 'Release Packaging', desc: 'KeepAChangelog notes and SemVer release notes' },
    ];

    for (const skillTargetDir of [agentsSkillsDir, geminiSkillsDir]) {
      if (!fs.existsSync(skillTargetDir)) {
        fs.mkdirSync(skillTargetDir, { recursive: true });
      }

      for (const cap of keyCapabilities) {
        const capSkillDir = path.join(skillTargetDir, cap.id);
        if (!fs.existsSync(capSkillDir)) {
          fs.mkdirSync(capSkillDir, { recursive: true });
        }
        let skillBody = '';
        if (cap.id === 'implement') {
          skillBody = `---
name: ${cap.id}
description: ${cap.desc}
---

# ${cap.title} (Forge SDLC)

Use this skill when the user requests \`/implement\`, \`implement\`, or asks to implement features, domain services, or tasks.

## 📥 Required Files Checklist:
- **Mandatory:** \`.forge/artifacts/tasks.md\`, \`.forge/artifacts/spec.md\`, \`.forge/artifacts/architecture.md\`
- **Recommended:** \`.forge/artifacts/plan.md\`, \`.forge/artifacts/constitution.md\`

## 🚀 Autonomous Implementation Protocol:
1. **Architectural Boundaries:** Implement Clean / Hexagonal separation of concerns.
2. **Type Safety:** Strict TypeScript typing, no \`any\` types, runtime Zod validations for all external inputs.
3. **Resiliency:** Implement idempotency, retries with exponential backoff, and circuit breakers.
4. **Observability:** Structured logging with trace correlation IDs and telemetry metrics.
5. **Testing (TDD):** Automated unit and integration tests with >90% coverage.
6. **Task Update:** Check off items in \`.forge/artifacts/tasks.md\` (\`- [x]\`).
7. **Downstream Next:** Trigger \`npx forge-sdlc review\` for 5-Lens Multi-Perspective Review.
`;
        } else if (cap.id === 'constitution') {
          skillBody = `---
name: ${cap.id}
description: ${cap.desc}
---

# ${cap.title} Agent (Forge SDLC)

Use this skill when the user requests \`/constitution\`, \`constitution\`, or asks to define project-wide engineering standards and architectural invariants.

## 🏛️ Invariant Directives:
1. Define Hexagonal boundaries and dependency inversion principles.
2. Mandate 100% strict TypeScript types and runtime Zod validation schemas.
3. Enforce idempotency and exponential backoff retry policies.
4. Establish OWASP Top 10 security guardrails and telemetry standards.
5. Output to \`.forge/artifacts/constitution.md\`.
`;
        } else if (cap.id === 'tasks' || cap.id === 'task') {
          skillBody = `---
name: ${cap.id}
description: ${cap.desc}
---

# Task Decomposition Agent (Forge SDLC)

Use this skill when the user requests \`/tasks\`, \`/task\`, or asks to decompose plans or specifications into atomic developer tasks.

## 📥 Required Files Checklist:
- **Mandatory:** \`.forge/artifacts/plan.md\`, \`.forge/artifacts/spec.md\`, \`.forge/artifacts/architecture.md\`

## 📋 Guidelines:
1. Decompose milestones into atomic tasks with explicit target file paths and test verifications.
2. Format each task:
   \`\`\`markdown
   - [ ] **Task X.Y: Title**
     *Files:* \`src/path/to/file.ts\`
     *Verification:* \`npm test\`
   \`\`\`
3. Save to \`.forge/artifacts/tasks.md\`.
`;
        } else if (cap.id === 'sdlc') {
          skillBody = `---
name: ${cap.id}
description: ${cap.desc}
---

# ${cap.title} (Forge SDLC)

Use this skill when the user requests \`/sdlc\`, \`/workflow\`, or asks to run the complete end-to-end SDLC pipeline.

## Master SDLC Pipeline Execution:
Execute the full 13-stage sequential SDLC with functionality folder organization:
1. \`forge brd\` (Business Requirements Document)
2. \`forge specify\` (Given-When-Then Specification)
3. \`forge clarify\` (Ambiguity Elicitation)
4. \`forge architecture\` (C4 Architecture & ADRs)
5. \`forge plan\` (Milestone Roadmap)
6. \`forge tasks\` (Task Decomposition Checklist)
7. \`forge analyze\` (Cross-Artifact Drift Analysis)
8. \`forge implement\` (Autonomous Code & Test Implementation)
9. \`forge test\` (Automated Test Verification)
10. \`forge review\` (5-Lens Multi-Perspective Code Review)
11. \`forge security\` (STRIDE & OWASP Security Audit)
12. \`forge converge\` (Task Burndown & Release Readiness)
13. \`forge release\` (KeepAChangelog & Release Notes)

Fast CLI run: \`npx forge-sdlc sdlc --functionality core\`
`;
        } else {
          skillBody = `---
name: ${cap.id}
description: ${cap.desc}
---

# ${cap.title} Agent (Forge SDLC)

Use this skill when the user requests \`${cap.id}\`, \`/${cap.id}\`, or ${cap.desc.toLowerCase()}.

## Execution Guidelines:
1. Check existing artifacts in \`.forge/artifacts/\` or \`.forge/functionalities/\`.
2. Execute the Forge capability:
   \`\`\`bash
   forge ${cap.id}
   \`\`\`
3. Inspect and refine the generated artifact in \`.forge/artifacts/\`.
`;
        }
        fs.writeFileSync(path.join(capSkillDir, 'SKILL.md'), skillBody, 'utf-8');
      }
    }


    // Also install master forge skill in .gemini/skills/forge/SKILL.md
    const forgeMasterSkillDir = path.join(geminiSkillsDir, 'forge');
    if (!fs.existsSync(forgeMasterSkillDir)) {
      fs.mkdirSync(forgeMasterSkillDir, { recursive: true });
    }
    const masterSkillContent = `---
name: forge-sdlc
description: Universal Capability-Oriented SDLC Orchestrator for BMAD, Spec Kit, and Internal Providers. Includes /implement and /sdlc full runner agents.
---

# Forge SDLC Skill

Use this skill when the user requests SDLC capabilities, autonomous code implementation, architecture, specification, code review, or full SDLC pipeline execution.

## Key Agents & Slash Commands:
- \`/sdlc\`: Full SDLC Master Orchestrator (End-to-End 13 stages)
- \`/implement\`: Autonomous Implementation Agent (Writes typed code & tests from tasks.md)
- \`/brd\`: Business Requirements & ROI modeling (BMAD)
- \`/specify\`: Given-When-Then Specification (spec.md) (Spec Kit)
- \`/clarify\`: Deep Ambiguity Elicitation (BMAD)
- \`/architecture\`: C4 Technical Architecture (architecture.md) (BMAD)
- \`/plan\`: Technical Execution Plan (plan.md) (Spec Kit)
- \`/tasks\`: Developer Task Checklist (tasks.md) (Spec Kit)
- \`/analyze\`: Cross-Artifact Consistency Audit (Spec Kit)
- \`/test\`: Automated Test Suite & Coverage (Internal)
- \`/review\`: 5-Lens Multi-Perspective Code Review (BMAD)
- \`/security\`: STRIDE & OWASP SAST Scan (Internal)
- \`/converge\`: Task Burndown & Release Readiness (Spec Kit)
- \`/release\`: KeepAChangelog & Release Notes (Internal)
`;
    fs.writeFileSync(path.join(forgeMasterSkillDir, 'SKILL.md'), masterSkillContent, 'utf-8');

    installedPaths.push('.gemini/skills/ & .agents/skills/ (Antigravity & Gemini Skills)');

    // 5. Install GEMINI.md, AGENTS.md, and CLAUDE.md Project Rules
    const agentsMdContent = `# Forge SDLC - Agent & Capability System Rules

This project is governed by **Forge SDLC** (Universal Capability-Oriented SDLC Framework).

## 🚀 Active Agents & Slash Commands:
- \`/sdlc\` (or \`forge sdlc\`): Full SDLC Master Orchestrator — runs all 13 stages from discovery to release.
- \`/implement\` (or \`forge implement\`): Autonomous Implementation Agent — implements production code & tests from \`tasks.md\`, \`spec.md\`, and \`architecture.md\`.
- \`/brd\` (or \`forge brd\`): Business Requirements Document (\`brd.md\`) & ROI modeling (BMAD)
- \`/specify\` (or \`forge specify\`): Functional Specification (\`spec.md\`) with Given-When-Then criteria (Spec Kit)
- \`/clarify\` (or \`forge clarify\`): Deep ambiguity elicitation (BMAD)
- \`/architecture\` (or \`forge architecture\`): C4 Architecture & System Design (\`architecture.md\`) (BMAD)
- \`/plan\` (or \`forge plan\`): Phased milestone execution roadmap (\`plan.md\`) (Spec Kit)
- \`/tasks\` (or \`forge tasks\`): Atomic developer task checklist (\`tasks.md\`) (Spec Kit)
- \`/analyze\` (or \`forge analyze\`): Cross-artifact consistency audit (\`analysis.md\`) (Spec Kit)
- \`/test\` (or \`forge test\`): Automated test suite synthesis & QA report (Internal)
- \`/review\` (or \`forge review\`): 5-Lens Multi-Perspective Code Review (\`review.md\`) (BMAD)
- \`/security\` (or \`forge security\`): STRIDE & OWASP Security Audit (\`security-audit.md\`) (Internal)
- \`/converge\` (or \`forge converge\`): Task burndown & release readiness (\`convergence.md\`) (Spec Kit)
- \`/release\` (or \`forge release\`): KeepAChangelog notes and SemVer bump (Internal)

All project artifacts are stored in \`.forge/artifacts/\`. Always reference and uphold them.
`;
    fs.writeFileSync(path.join(root, 'AGENTS.md'), agentsMdContent, 'utf-8');
    fs.writeFileSync(path.join(root, 'GEMINI.md'), agentsMdContent, 'utf-8');
    fs.writeFileSync(path.join(root, 'CLAUDE.md'), agentsMdContent, 'utf-8');
    installedPaths.push('AGENTS.md, GEMINI.md & CLAUDE.md (Project Rules)');

    // 6. Install Windsurf Rules (.windsurfrules)
    fs.writeFileSync(path.join(root, '.windsurfrules'), copilotContent, 'utf-8');
    installedPaths.push('.windsurfrules (Windsurf AI)');

    return {
      cursorRulesCount: cursorCount,
      claudeCommandsCount: claudeCount,
      copilotConfigured: true,
      geminiSkillConfigured: true,
      windsurfConfigured: true,
      installedPaths,
    };
  }
}

