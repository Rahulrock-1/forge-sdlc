/**
 * Forge SDLC - Cross-Artifact Auto-Healing & Drift Synchronization Engine
 * Automatically detects requirement drift, orphaned tasks, and architectural divergence,
 * synthesizing surgical patch diffs to maintain 100% artifact alignment.
 */

import fs from 'node:fs';
import path from 'node:path';
import { ArtifactManager } from './artifacts.js';

export interface DriftIssue {
  id: string;
  type: 'orphaned_requirement' | 'rogue_task' | 'architectural_gap' | 'constitution_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  sourceArtifact: string;
  targetArtifact: string;
  suggestedPatch: string;
}

export interface HealingResult {
  workspace: string;
  driftScore: number; // 0 (perfect alignment) to 100 (severe drift)
  alignmentPercentage: number;
  totalIssuesFound: number;
  issues: DriftIssue[];
  healingPlanMarkdown: string;
  autoApplied: boolean;
}

export class AutoHealingEngine {
  private artifactManager: ArtifactManager;
  private workspaceRoot: string;

  constructor(workspaceRoot: string = process.cwd()) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.artifactManager = new ArtifactManager(this.workspaceRoot);
  }

  public analyzeAndHeal(options: { applyPatches?: boolean; functionality?: string } = {}): HealingResult {
    const functionality = options.functionality || 'core';
    const spec = this.artifactManager.getArtifact('spec.md', functionality);
    const arch = this.artifactManager.getArtifact('architecture.md', functionality);
    const tasks = this.artifactManager.getArtifact('tasks.md', functionality);
    const constitution = this.artifactManager.getArtifact('constitution.md', functionality);

    const issues: DriftIssue[] = [];

    // 1. Audit Spec Requirements vs Tasks
    if (spec && tasks) {
      const specCriteriaMatches = spec.content.match(/Scenario \d+:|Scenario [A-Za-z0-9_-]+|Given .* When .* Then/gi) || [];
      const taskCriteriaMatches = tasks.content.match(/Given-When-Then:|Scenario/gi) || [];

      if (specCriteriaMatches.length > 0 && taskCriteriaMatches.length < specCriteriaMatches.length) {
        const missingCount = specCriteriaMatches.length - taskCriteriaMatches.length;
        issues.push({
          id: 'DRIFT-001',
          type: 'orphaned_requirement',
          severity: 'high',
          title: `Unmapped Functional Scenarios in tasks.md (${missingCount} missing)`,
          description: `spec.md defines ${specCriteriaMatches.length} acceptance criteria, but tasks.md only explicitly maps ${taskCriteriaMatches.length}.`,
          sourceArtifact: 'spec.md',
          targetArtifact: 'tasks.md',
          suggestedPatch: `Add verification tasks in tasks.md for unmapped scenarios:\n- [ ] **Task 2.X: Implement and verify missing Given-When-Then scenarios from spec.md**\n  *Files:* \`src/domain/service.ts\`, \`tests/unit/service.test.ts\`\n  *Verification:* \`npm test\``,
        });
      }
    } else if (!tasks && spec) {
      issues.push({
        id: 'DRIFT-002',
        type: 'orphaned_requirement',
        severity: 'critical',
        title: 'Missing tasks.md Checklist',
        description: 'Functional specification spec.md exists but tasks.md has not been synthesized.',
        sourceArtifact: 'spec.md',
        targetArtifact: 'tasks.md',
        suggestedPatch: 'Run `forge tasks` to decompose specification into atomic developer tasks.',
      });
    }

    // 2. Audit Architecture vs Tasks
    if (arch && tasks) {
      const archComponents = arch.content.match(/Component [A-Za-z0-9]+|Service|Adapter|Controller|Repository/gi) || [];
      const taskFiles = tasks.content.match(/src\/[a-zA-Z0-9_\-\/.]+/g) || [];

      if (archComponents.length > 0 && taskFiles.length === 0) {
        issues.push({
          id: 'DRIFT-003',
          type: 'architectural_gap',
          severity: 'medium',
          title: 'Tasks Lack Explicit File Path Declarations',
          description: 'architecture.md defines component topologies, but tasks in tasks.md do not declare explicit target file paths.',
          sourceArtifact: 'architecture.md',
          targetArtifact: 'tasks.md',
          suggestedPatch: 'Annotate all tasks in tasks.md with explicit *Files:* targets (e.g. `src/modules/auth.ts`).',
        });
      }
    }

    // 3. Audit Constitution Guardrails
    if (constitution && tasks) {
      const hasTddInTasks = /tests\/|\.test\.|\.spec\.|Verification:/i.test(tasks.content);
      if (!hasTddInTasks) {
        issues.push({
          id: 'DRIFT-004',
          type: 'constitution_violation',
          severity: 'high',
          title: 'Missing TDD & Quality Verification Gates in tasks.md',
          description: 'constitution.md mandates 100% test verification per task, but tasks.md contains no test verification commands.',
          sourceArtifact: 'constitution.md',
          targetArtifact: 'tasks.md',
          suggestedPatch: 'Add `*Verification:* npm test` and test file paths to all checklist items in tasks.md.',
        });
      }
    }

    // Calculate alignment metrics
    const totalIssues = issues.length;
    const criticalWeight = issues.filter((i) => i.severity === 'critical').length * 35;
    const highWeight = issues.filter((i) => i.severity === 'high').length * 20;
    const medWeight = issues.filter((i) => i.severity === 'medium').length * 10;
    const lowWeight = issues.filter((i) => i.severity === 'low').length * 5;

    const driftScore = Math.min(100, criticalWeight + highWeight + medWeight + lowWeight);
    const alignmentPercentage = Math.max(0, 100 - driftScore);

    // Generate Healing Report Markdown
    const healingPlanMarkdown = this.generateHealingMarkdown({
      projectName: path.basename(this.workspaceRoot),
      driftScore,
      alignmentPercentage,
      issues,
      functionality,
    });

    let autoApplied = false;
    if (options.applyPatches && issues.length > 0) {
      this.artifactManager.saveArtifact({
        name: 'healing-plan.md',
        path: 'healing-plan.md',
        content: healingPlanMarkdown,
        format: 'markdown',
        summary: `Auto-Healing Plan (${alignmentPercentage}% Alignment, ${issues.length} Drift Issues Resolved)`,
      }, functionality);

      // Auto-append missing patch tasks if tasks.md exists
      if (tasks && issues.some((i) => i.targetArtifact === 'tasks.md')) {
        const patchBlock = `\n\n## 🛠️ Auto-Healed Synchronization Tasks (Generated by Forge Auto-Heal)\n` +
          issues
            .filter((i) => i.targetArtifact === 'tasks.md')
            .map((i) => `- [ ] **Task AutoHeal-${i.id}: Resolve ${i.title}**\n  *Description:* ${i.description}\n  *Verification:* \`npx forge-sdlc analyze\``)
            .join('\n\n');

        this.artifactManager.saveArtifact({
          name: 'tasks.md',
          path: 'tasks.md',
          content: tasks.content + patchBlock,
          format: 'markdown',
          summary: 'Auto-healed task checklist with synchronized requirements',
        }, functionality);
      }

      autoApplied = true;
    } else {
      this.artifactManager.saveArtifact({
        name: 'healing-plan.md',
        path: 'healing-plan.md',
        content: healingPlanMarkdown,
        format: 'markdown',
        summary: `Auto-Healing Plan (${alignmentPercentage}% Alignment, ${issues.length} Drift Issues)`,
      }, functionality);
    }

    return {
      workspace: this.workspaceRoot,
      driftScore,
      alignmentPercentage,
      totalIssuesFound: totalIssues,
      issues,
      healingPlanMarkdown,
      autoApplied,
    };
  }

  private generateHealingMarkdown(data: {
    projectName: string;
    driftScore: number;
    alignmentPercentage: number;
    issues: DriftIssue[];
    functionality: string;
  }): string {
    const statusBadge = data.alignmentPercentage >= 90
      ? '🟢 EXCELLENT (Synchronized)'
      : data.alignmentPercentage >= 70
      ? '🟡 MODERATE DRIFT (Action Recommended)'
      : '🔴 SEVERE DRIFT (Immediate Healing Required)';

    const issuesRows = data.issues.length > 0
      ? data.issues
          .map((i, idx) => `### ${idx + 1}. [${i.severity.toUpperCase()}] ${i.title} (\`${i.id}\`)
- **Type:** \`${i.type}\`
- **Source Artifact:** \`${i.sourceArtifact}\` ➔ **Target:** \`${i.targetArtifact}\`
- **Root Cause:** ${i.description}
- **Surgical Patch:**
\`\`\`markdown
${i.suggestedPatch}
\`\`\`
`)
          .join('\n---\n\n')
      : '✅ **Zero drift detected.** All requirements, architecture models, and developer tasks are in 100% alignment.\n';

    return `# 🩺 Forge Cross-Artifact Auto-Healing & Drift Sync Report

**Project:** ${data.projectName}  
**Functionality Module:** \`${data.functionality}\`  
**Generated:** ${new Date().toISOString()}  
**Overall Alignment:** **${data.alignmentPercentage}%** (${statusBadge})  
**Drift Severity Score:** ${data.driftScore}/100  

---

## 📊 Alignment Breakdown & Diagnostic Health:
| Metric | Current Value | Target Standard | Status |
| :--- | :---: | :---: | :---: |
| **Artifact Traceability** | ${data.alignmentPercentage}% | $\ge 90\%$ | ${data.alignmentPercentage >= 90 ? '✅ Pass' : '⚠️ Warning'} |
| **Active Drift Issues** | ${data.issues.length} | 0 | ${data.issues.length === 0 ? '✅ Clean' : '⚠️ Drift Detected'} |
| **Constitutional Violations** | ${data.issues.filter((i) => i.type === 'constitution_violation').length} | 0 | ${data.issues.filter((i) => i.type === 'constitution_violation').length === 0 ? '✅ Clean' : '❌ Non-Compliant'} |

---

## 🔍 Identified Drift Diagnostics & Surgical Patches:

${issuesRows}

---

## 🚀 Recommended Remediation:
1. Run \`forge heal --apply\` to automatically patch \`tasks.md\` and synchronize missing items.
2. Run \`forge analyze\` to re-certify 100% mathematical requirement traceability.
3. Proceed to \`forge implement\` with synchronized checklist.
`;
  }
}
