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
description: Autonomous Implementation Agent (IMPLEMENTATION) - Ingests spec, architecture, and tasks to write production code & tests
globs: *
alwaysApply: false
---

# /implement - Autonomous Code Implementation Agent

You are the specialized **Autonomous Implementation Agent** orchestrated by **Forge SDLC**.

## 🎯 Mission
Transform specifications and tasks into clean, production-ready, typed code with complete test coverage, strict architectural alignment, and zero requirement drift.

## 📋 Execution Protocol:
1. **Ingest Existing Project Artifacts:**
   - \`.forge/artifacts/spec.md\` (Functional requirements & Given-When-Then criteria)
   - \`.forge/artifacts/architecture.md\` (C4 diagrams, component boundaries, patterns)
   - \`.forge/artifacts/plan.md\` (Phased milestones & technical roadmap)
   - \`.forge/artifacts/tasks.md\` (Atomic task checklist)
   - \`.forge/artifacts/constitution.md\` (Non-negotiable invariants, if present)

2. **Select & Execute Tasks:**
   - Scan \`.forge/artifacts/tasks.md\` for the next uncompleted task (\`- [ ]\`).
   - Implement the code following Clean Architecture and Hexagonal/Ports-and-Adapters boundaries.
   - Write corresponding automated unit and integration tests (TDD).

3. **Verify Quality Gates:**
   - Run linter and type-checker: \`npm run lint\` or \`npx tsc --noEmit\`.
   - Run test suite: \`npm test\`.
   - Ensure zero regressions and strict type-safety.

4. **Update Burndown:**
   - Update \`.forge/artifacts/tasks.md\` by marking completed items: \`- [x]\`.

5. **Proceed to Next Capability:**
   - Run \`npx forge-sdlc test\` or \`npx forge-sdlc review\` to trigger the 5-Lens Review.
`;
      } else if (cap.name === 'tasks') {
        mdcContent = `---
description: Task Decomposition & Work Breakdown Agent (PLANNING) - Decomposes plan and spec into atomic developer tasks in tasks.md
globs: *
alwaysApply: false
---

# /tasks - Task Decomposition & Work Breakdown Agent

You are the specialized **Task Decomposition & Work Breakdown Agent** orchestrated by **Forge SDLC**.

## 🎯 Mission
Decompose the technical execution plan (\`plan.md\`), functional specification (\`spec.md\`), and architecture (\`architecture.md\`) into granular, atomic, test-verified developer tasks with explicit file paths and acceptance criteria in \`.forge/artifacts/tasks.md\`.

## 📋 Task Decomposition Protocol:
1. **Ingest Existing Project Artifacts:**
   - \`.forge/artifacts/plan.md\` (Phased technical roadmap & milestones)
   - \`.forge/artifacts/spec.md\` (Functional requirements & Given-When-Then scenarios)
   - \`.forge/artifacts/architecture.md\` (C4 components & design patterns)
   - \`.forge/artifacts/constitution.md\` (Architectural invariants)

2. **Structure Atomic Developer Tasks:**
   - Group tasks by Phase / Milestone matching \`plan.md\`.
   - Each task item MUST follow this exact format:
     \`\`\`markdown
     - [ ] **Task X.Y: <Actionable Title>**
       *Files:* \`<explicit file paths to create/modify>\`
       *Given-When-Then:* \`<Scenario ID or acceptance criteria reference>\`
       *Verification:* \`<explicit command or test assertion, e.g. npm test>\`
     \`\`\`

3. **Enforce Atomicity & Quality Gates:**
   - Tasks must be small enough for an AI coding agent to execute in a single focused pass.
   - Every task must declare target files and concrete verification criteria.
   - Zero orphaned requirements; 100% of \`spec.md\` criteria must map to at least one task.

4. **Output Target Artifact:**
   - Write or update: \`.forge/artifacts/tasks.md\` (and optionally \`tasks.md\` in project root).
   - If executing via CLI: run \`npx forge-sdlc tasks\`.

5. **Downstream Next Steps:**
   - Run \`npx forge-sdlc analyze\` to verify cross-artifact consistency with 0 drift.
   - Hand off to \`/implement\` (Autonomous Implementation Agent).
`;
      } else {
        mdcContent = `---
description: ${cap.displayName} (${cap.group.toUpperCase()}) - Runs optimal provider (${bestProv}) via Forge
globs: *
alwaysApply: false
---

# /${cap.name} - ${cap.displayName}

You are the specialized **${cap.displayName} Agent** orchestrated by **Forge SDLC**.

## Capability Objective
${cap.description}

## How to Execute:
1. First, check existing project artifacts in \`.forge/artifacts/\` or root.
2. Follow the optimal provider methodology for **${cap.name}** (Recommended Provider: **${bestProv}**).
3. If executing via CLI, run:
   \`\`\`bash
   npx forge-sdlc ${cap.name}
   \`\`\`
4. Read or generate the target artifact: \`.forge/artifacts/${cap.outputs[0]?.artifactName || `${cap.name}.md`}\`.
5. Ensure all requirements, constraints, and non-negotiables from \`constitution.md\` / \`spec.md\` are preserved.
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
description: Full SDLC Master Orchestrator - Runs the complete 13-stage autonomous lifecycle from Discovery to Release
globs: *
alwaysApply: false
---

# /sdlc - Full SDLC Master Orchestrator Agent

You are the **Master SDLC Orchestrator Agent** powered by **Forge SDLC**.

## 🚀 Mission
Drive the end-to-end software development lifecycle sequentially across all 13 specialized capabilities.

## 🔄 End-to-End Pipeline Stages:
1. **Discovery / BRD** (\`/brd\` or \`forge brd\`): Business Requirements & ROI model (\`brd.md\`)
2. **Specification** (\`/specify\` or \`forge specify\`): Given-When-Then functional spec (\`spec.md\`)
3. **Clarification** (\`/clarify\` or \`forge clarify\`): Deep ambiguity & edge-case elicitation (\`clarifications.md\`)
4. **Architecture** (\`/architecture\` or \`forge architecture\`): C4 design & ADRs (\`architecture.md\`)
5. **Planning** (\`/plan\` or \`forge plan\`): Phased milestone execution roadmap (\`plan.md\`)
6. **Tasks** (\`/tasks\` or \`/task\` or \`forge tasks\`): Atomic developer task checklist (\`tasks.md\`)
7. **Analysis** (\`/analyze\` or \`forge analyze\`): Cross-artifact consistency & drift audit (\`analysis.md\`)
8. **Implementation** (\`/implement\` or \`forge implement\`): Autonomous coding adhering to spec & architecture
9. **Testing** (\`/test\` or \`forge test\`): Automated test synthesis & coverage verification (\`test-report.md\`)
10. **Review** (\`/review\` or \`forge review\`): 5-Lens Multi-Perspective Code Review (\`review.md\`)
11. **Security** (\`/security\` or \`forge security\`): STRIDE threat model & OWASP scan (\`security-audit.md\`)
12. **Convergence** (\`/converge\` or \`forge converge\`): Task burndown & release candidate certification (\`convergence.md\`)
13. **Release** (\`/release\` or \`forge release\`): KeepAChangelog & Release Notes (\`CHANGELOG.md\`, \`RELEASE_NOTES.md\`)

## 💻 CLI Fast-Track:
\`\`\`bash
npx forge-sdlc workflow run full-sdlc
# or
npx forge-sdlc sdlc
\`\`\`
`;
    fs.writeFileSync(path.join(cursorDir, 'forge-sdlc.mdc'), sdlcMdcContent, 'utf-8');
    fs.writeFileSync(path.join(cursorDir, 'forge-workflow.mdc'), sdlcMdcContent.replace('/sdlc', '/workflow'), 'utf-8');
    cursorCount += 2;
    installedPaths.push('.cursor/rules/ (Cursor Slash Commands, /task & /sdlc)');

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
description: Autonomous Implementation Agent - Writes typed code & tests adhering to spec.md, architecture.md, and tasks.md
---

Execute Forge capability: **Agentic Code Implementation (/implement)**

## Instructions:
1. Read \`.forge/artifacts/tasks.md\`, \`.forge/artifacts/spec.md\`, and \`.forge/artifacts/architecture.md\`.
2. Pick uncompleted checklist items and implement code following architectural constraints.
3. Write test suites and verify with \`npm test\` and \`npm run lint\`.
4. Update \`.forge/artifacts/tasks.md\` with \`- [x]\` upon completion.
5. Run \`npx forge-sdlc implement\` or proceed to \`npx forge-sdlc review\`.
`;
      } else if (cap.name === 'tasks') {
        cmdContent = `---
description: Task Decomposition Agent - Decomposes plan and spec into atomic developer tasks in tasks.md
---

Execute Forge capability: **Task Decomposition (/tasks, /task)**

## Instructions:
1. Read \`.forge/artifacts/plan.md\`, \`.forge/artifacts/spec.md\`, and \`.forge/artifacts/architecture.md\`.
2. Decompose milestones into atomic tasks with target file paths and explicit verification steps.
3. Output to \`.forge/artifacts/tasks.md\`.
4. Run \`npx forge-sdlc tasks\` or proceed to \`npx forge-sdlc analyze\`.
`;
      } else {
        cmdContent = `---
description: ${cap.description}
---

Execute Forge capability: **${cap.displayName}**
Run: \`npx forge-sdlc ${cap.name}\` and synthesize target artifact \`${cap.outputs[0]?.artifactName || `${cap.name}.md`}\`.
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
description: Full SDLC Master Orchestrator - Drives complete 13-stage lifecycle from Discovery to Release
---

Execute **Forge Full SDLC Pipeline (/sdlc)**

Run: \`npx forge-sdlc workflow run full-sdlc\` or execute sequentially:
1. \`forge brd\` -> 2. \`forge specify\` -> 3. \`forge clarify\` -> 4. \`forge architecture\` -> 5. \`forge plan\` -> 6. \`forge tasks\` -> 7. \`forge analyze\` -> 8. \`forge implement\` -> 9. \`forge test\` -> 10. \`forge review\` -> 11. \`forge security\` -> 12. \`forge converge\` -> 13. \`forge release\`
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

    const copilotContent = `# Forge SDLC - AI Editor Custom Instructions

When working in this repository, you have access to the **Forge SDLC Capability Pipeline**:

## 🚀 Primary Agents & Slash Commands:
- \`/sdlc\` / \`/workflow\`: Master SDLC Orchestrator — executes the complete 13-stage pipeline.
- \`/implement\`: Autonomous Implementation Agent — reads \`spec.md\`, \`architecture.md\`, \`tasks.md\` and writes production code with tests.
- \`/brd\`: Formulates Business Requirements Document & ROI model (\`brd.md\`) via BMAD.
- \`/specify\`: Formulates Given-When-Then functional specification (\`spec.md\`) via Spec Kit.
- \`/clarify\`: Probes ambiguities & edge cases (\`clarifications.md\`) via BMAD.
- \`/architecture\`: Designs C4 system architecture & ADRs (\`architecture.md\`) via BMAD.
- \`/plan\`: Synthesizes phased technical execution milestones (\`plan.md\`) via Spec Kit.
- \`/tasks\` (or \`/task\`): Decomposes plan into atomic checklist items (\`tasks.md\`) via Spec Kit.
- \`/analyze\`: Performs cross-artifact consistency & drift audit (\`analysis.md\`) via Spec Kit.
- \`/test\`: Synthesizes automated unit/integration test suites (\`test-report.md\`) via Internal.
- \`/review\`: Runs 5-Lens code review (\`review.md\`) via BMAD.
- \`/security\`: Runs OWASP & STRIDE threat audit (\`security-audit.md\`) via Forge Internal.
- \`/converge\`: Verifies task burndown and certifies release readiness (\`convergence.md\`) via Spec Kit.
- \`/release\`: Generates KeepAChangelog notes and SemVer release draft (\`CHANGELOG.md\`).

Artifacts are located in \`.forge/artifacts/\`. Always align implementations with these artifacts.
`;
    fs.writeFileSync(path.join(githubDir, 'copilot-instructions.md'), copilotContent, 'utf-8');
    installedPaths.push('.github/copilot-instructions.md (GitHub Copilot)');

    // 4. Install Antigravity & Gemini Skills (.agents/skills/ and .gemini/skills/)
    const agentsSkillsDir = path.join(root, '.agents', 'skills');
    const geminiSkillsDir = path.join(root, '.gemini', 'skills');

    const keyCapabilities = [
      { id: 'sdlc', name: 'sdlc', title: 'Full SDLC Master Orchestrator', desc: 'Execute end-to-end 13-stage SDLC workflow from discovery to release' },
      { id: 'implement', name: 'implement', title: 'Autonomous Implementation Agent', desc: 'Implement production code and tests adhering to spec.md, architecture.md, and tasks.md' },
      { id: 'tasks', name: 'tasks', title: 'Task Decomposition', desc: 'Generate atomic developer checklist (tasks.md)' },
      { id: 'task', name: 'task', title: 'Task Decomposition', desc: 'Generate atomic developer checklist (tasks.md)' },
      { id: 'brd', name: 'brd', title: 'Business Requirements (BRD)', desc: 'Formulate Business Requirements Document (brd.md) and ROI models' },
      { id: 'specify', name: 'specify', title: 'Software Specification (SDD)', desc: 'Formulate Given-When-Then specification (spec.md)' },
      { id: 'clarify', name: 'clarify', title: 'Ambiguity Clarification', desc: 'Probe hidden assumptions and edge-cases' },
      { id: 'architecture', name: 'architecture', title: 'Technical Architecture', desc: 'Design C4 system architecture diagrams and ADRs' },
      { id: 'data-model', name: 'data-model', title: 'Data Modeling & Schema', desc: 'Design ERD diagrams and database schemas' },
      { id: 'api-design', name: 'api-design', title: 'API Contract Design', desc: 'Design OpenAPI 3.1 contracts and error envelopes' },
      { id: 'plan', name: 'plan', title: 'Technical Execution Plan', desc: 'Synthesize phased milestone roadmap (plan.md)' },
      { id: 'analyze', name: 'analyze', title: 'Cross-Artifact Analysis', desc: 'Audit consistency across spec, arch, and tasks' },
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

Use this skill when the user requests \`/implement\`, \`implement\`, or asks to implement code, features, or tasks from the SDLC pipeline.

## Autonomous Implementation Guidelines:
1. **Ingest Context & Artifacts:**
   - Read \`.forge/artifacts/tasks.md\` (Developer tasks checklist)
   - Read \`.forge/artifacts/spec.md\` (Functional requirements)
   - Read \`.forge/artifacts/architecture.md\` (C4 patterns & component structure)
2. **Execute Code:**
   - Write clean, modular, typed code.
   - Follow Test-Driven Development (TDD) by adding corresponding test suites.
   - Run tests: \`npm test\`.
3. **Update Tasks:**
   - Check off completed items in \`.forge/artifacts/tasks.md\` (\`- [x]\`).
4. **Trigger Review:**
   - Run \`npx forge-sdlc review\` to trigger the 5-Lens Multi-Perspective Review.
`;
        } else if (cap.id === 'tasks' || cap.id === 'task') {
          skillBody = `---
name: ${cap.id}
description: ${cap.desc}
---

# Task Decomposition Agent (Forge SDLC)

Use this skill when the user requests \`/tasks\`, \`/task\`, or asks to decompose plans or specifications into atomic developer tasks.

## Task Decomposition Guidelines:
1. **Ingest Existing Artifacts:**
   - Read \`.forge/artifacts/plan.md\` (Technical roadmap)
   - Read \`.forge/artifacts/spec.md\` (Given-When-Then criteria)
   - Read \`.forge/artifacts/architecture.md\` (C4 components & patterns)
2. **Generate Atomic Tasks:**
   - Group tasks by milestone/phase.
   - Format each task item:
     \`\`\`markdown
     - [ ] **Task X.Y: Title**
       *Files:* \`path/to/file.ts\`
       *Verification:* \`npm test\`
     \`\`\`
3. **Save Output:**
   - Save to \`.forge/artifacts/tasks.md\` (and optionally \`tasks.md\`).
   - Run: \`npx forge-sdlc tasks\`.
`;
        } else if (cap.id === 'sdlc') {
          skillBody = `---
name: ${cap.id}
description: ${cap.desc}
---

# ${cap.title} (Forge SDLC)

Use this skill when the user requests \`/sdlc\`, \`/workflow\`, or asks to run the complete end-to-end SDLC pipeline.

## Master SDLC Pipeline Execution:
Execute the full 13-stage sequential SDLC:
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

Fast CLI run: \`npx forge-sdlc workflow run full-sdlc\` or \`npx forge-sdlc sdlc\`
`;
        } else {
          skillBody = `---
name: ${cap.id}
description: ${cap.desc}
---

# ${cap.title} Agent (Forge SDLC)

Use this skill when the user requests \`${cap.id}\`, \`/${cap.id}\`, or ${cap.desc.toLowerCase()}.

## Execution Guidelines:
1. Check existing artifacts in \`.forge/artifacts/\`.
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

