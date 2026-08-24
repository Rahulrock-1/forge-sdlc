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
      const mdcContent = `---
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
      const filePath = path.join(cursorDir, `forge-${cap.name}.mdc`);
      fs.writeFileSync(filePath, mdcContent, 'utf-8');
      cursorCount++;

      // Create convenient short aliases (e.g. forge-brd.mdc, forge-spec.mdc)
      if (cap.name === 'business-requirements') {
        fs.writeFileSync(path.join(cursorDir, 'forge-brd.mdc'), mdcContent.replace('/business-requirements', '/brd'), 'utf-8');
        cursorCount++;
      } else if (cap.name === 'architecture') {
        fs.writeFileSync(path.join(cursorDir, 'forge-arch.mdc'), mdcContent.replace('/architecture', '/arch'), 'utf-8');
        cursorCount++;
      } else if (cap.name === 'specify') {
        fs.writeFileSync(path.join(cursorDir, 'forge-spec.mdc'), mdcContent.replace('/specify', '/spec'), 'utf-8');
        cursorCount++;
      }
    }
    installedPaths.push('.cursor/rules/ (Cursor Slash Commands)');

    // 2. Install Claude Code Slash Commands (.claude/commands/)
    const claudeDir = path.join(root, '.claude', 'commands');
    if (!fs.existsSync(claudeDir)) {
      fs.mkdirSync(claudeDir, { recursive: true });
    }

    let claudeCount = 0;
    for (const cap of CAPABILITY_CATALOG) {
      const cmdContent = `---
description: ${cap.description}
---

Execute Forge capability: **${cap.displayName}**
Run: \`npx forge-sdlc ${cap.name}\` and synthesize target artifact \`${cap.outputs[0]?.artifactName || `${cap.name}.md`}\`.
`;
      const filePath = path.join(claudeDir, `${cap.name}.md`);
      fs.writeFileSync(filePath, cmdContent, 'utf-8');
      claudeCount++;
    }
    installedPaths.push('.claude/commands/ (Claude Code Slash Commands)');

    // 3. Install GitHub Copilot Instructions (.github/copilot-instructions.md)
    const githubDir = path.join(root, '.github');
    if (!fs.existsSync(githubDir)) {
      fs.mkdirSync(githubDir, { recursive: true });
    }

    const copilotContent = `# Forge SDLC - GitHub Copilot Custom Instructions

When working in this repository, you have access to the **Forge SDLC Capability Pipeline**:

## Available Slash Commands:
- \`/specify\`: Formulate Given-When-Then specification (\`spec.md\`) via Spec Kit.
- \`/clarify\`: Probe ambiguities & edge cases (\`clarifications.md\`) via BMAD.
- \`/architecture\`: Design C4 system architecture & ADRs (\`architecture.md\`) via BMAD.
- \`/plan\`: Synthesize phased technical execution milestones (\`plan.md\`) via Spec Kit.
- \`/tasks\`: Decompose plan into atomic checklist items (\`tasks.md\`) via Spec Kit.
- \`/analyze\`: Perform cross-artifact consistency & drift audit (\`analysis.md\`) via Spec Kit.
- \`/review\`: Run 5-Lens code review (\`review.md\`) via BMAD.
- \`/security\`: Run OWASP & STRIDE threat audit (\`security-audit.md\`) via Forge Internal.
- \`/converge\`: Verify task burndown and certify release readiness (\`convergence.md\`) via Spec Kit.

Artifacts are located in \`.forge/artifacts/\`. Always align implementations with these artifacts.
`;
    fs.writeFileSync(path.join(githubDir, 'copilot-instructions.md'), copilotContent, 'utf-8');
    installedPaths.push('.github/copilot-instructions.md (GitHub Copilot)');

    // 4. Install Antigravity Skills (.agents/skills/<capability>/SKILL.md)
    const agentsSkillsDir = path.join(root, '.agents', 'skills');
    if (!fs.existsSync(agentsSkillsDir)) {
      fs.mkdirSync(agentsSkillsDir, { recursive: true });
    }

    const keyCapabilities = [
      { id: 'brd', name: 'brd', title: 'Business Requirements (BRD)', desc: 'Formulate Business Requirements Document (brd.md) and ROI models' },
      { id: 'specify', name: 'specify', title: 'Software Specification (SDD)', desc: 'Formulate Given-When-Then specification (spec.md)' },
      { id: 'clarify', name: 'clarify', title: 'Ambiguity Clarification', desc: 'Probe hidden assumptions and edge-cases' },
      { id: 'architecture', name: 'architecture', title: 'Technical Architecture', desc: 'Design C4 system architecture diagrams and ADRs' },
      { id: 'data-model', name: 'data-model', title: 'Data Modeling & Schema', desc: 'Design ERD diagrams and database schemas' },
      { id: 'api-design', name: 'api-design', title: 'API Contract Design', desc: 'Design OpenAPI 3.1 contracts and error envelopes' },
      { id: 'plan', name: 'plan', title: 'Technical Execution Plan', desc: 'Synthesize phased milestone roadmap (plan.md)' },
      { id: 'tasks', name: 'tasks', title: 'Task Decomposition', desc: 'Generate atomic developer checklist (tasks.md)' },
      { id: 'analyze', name: 'analyze', title: 'Cross-Artifact Analysis', desc: 'Audit consistency across spec, arch, and tasks' },
      { id: 'review', name: 'review', title: 'Multi-Lens Review', desc: '5-Perspective code review (bmad-review)' },
      { id: 'security', name: 'security', title: 'Security & Threat Audit', desc: 'STRIDE threat model and OWASP SAST scan' },
      { id: 'converge', name: 'converge', title: 'Convergence & Burndown', desc: 'Certify task burndown and release candidate readiness' },
    ];

    for (const cap of keyCapabilities) {
      const capSkillDir = path.join(agentsSkillsDir, cap.id);
      if (!fs.existsSync(capSkillDir)) {
        fs.mkdirSync(capSkillDir, { recursive: true });
      }
      const skillFileContent = `---
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
      fs.writeFileSync(path.join(capSkillDir, 'SKILL.md'), skillFileContent, 'utf-8');
    }
    installedPaths.push('.agents/skills/ (Antigravity Skills)');

    // 5. Install GEMINI.md and AGENTS.md Project Rules for Antigravity
    const agentsMdContent = `# Forge SDLC - Agent & Capability System Rules

This project is governed by **Forge SDLC** (Universal Capability-Oriented SDLC Framework).

## Active SDLC Capabilities & Commands:
- \`/brd\` (or \`forge brd\`): Business Requirements Document (\`brd.md\`) & ROI modeling (BMAD)
- \`/specify\` (or \`forge specify\`): Functional Specification (\`spec.md\`) with Given-When-Then criteria (Spec Kit)
- \`/clarify\` (or \`forge clarify\`): Deep ambiguity elicitation (BMAD)
- \`/architecture\` (or \`forge architecture\`): C4 Architecture & System Design (\`architecture.md\`) (BMAD)
- \`/plan\` (or \`forge plan\`): Phased milestone execution roadmap (\`plan.md\`) (Spec Kit)
- \`/tasks\` (or \`forge tasks\`): Atomic developer task checklist (\`tasks.md\`) (Spec Kit)
- \`/analyze\` (or \`forge analyze\`): Cross-artifact consistency audit (\`analysis.md\`) (Spec Kit)
- \`/review\` (or \`forge review\`): 5-Lens Multi-Perspective Code Review (\`review.md\`) (BMAD)
- \`/security\` (or \`forge security\`): STRIDE & OWASP Security Audit (\`security-audit.md\`) (Internal)
- \`/converge\` (or \`forge converge\`): Task burndown & release readiness (\`convergence.md\`) (Spec Kit)

All project artifacts are stored in \`.forge/artifacts/\`. Always reference and uphold them.
`;
    fs.writeFileSync(path.join(root, 'AGENTS.md'), agentsMdContent, 'utf-8');
    fs.writeFileSync(path.join(root, 'GEMINI.md'), agentsMdContent, 'utf-8');
    installedPaths.push('AGENTS.md & GEMINI.md (Antigravity Rules)');

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
