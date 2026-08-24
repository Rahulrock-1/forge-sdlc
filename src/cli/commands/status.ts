/**
 * Forge SDLC - Status Command Handler
 */

import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import Table from 'cli-table3';
import { ArtifactManager } from '../../engine/artifacts.js';
import { ContextManager } from '../../engine/context.js';
import { WorkflowExecutionState } from '../../types/workflow.js';

export async function handleStatusCommand(options: { workspace?: string } = {}): Promise<void> {
  const root = options.workspace || process.cwd();
  const context = await ContextManager.analyzeWorkspace(root);
  const artifactManager = new ArtifactManager(root);
  const artifacts = artifactManager.loadArtifacts();

  console.log(chalk.bold.cyan(`\n🔍 Forge Project Status: `) + chalk.bold.yellow(context.projectName));
  console.log(chalk.dim(`Project Type: ${context.projectType} | Languages: ${context.techStack.languages.join(', ') || 'Unknown'}\n`));

  console.log(chalk.bold('Artifact Pipeline State:'));
  const table = new Table({
    head: [
      chalk.dim('Artifact'),
      chalk.dim('Status'),
      chalk.dim('Author Provider'),
      chalk.dim('Last Modified'),
    ],
    style: { head: [], border: [] },
  });

  const pipelineArtifacts = [
    { name: 'discovery.md', group: 'Discovery' },
    { name: 'brd.md', group: 'Discovery' },
    { name: 'constitution.md', group: 'Specification' },
    { name: 'spec.md', group: 'Specification' },
    { name: 'clarifications.md', group: 'Discovery' },
    { name: 'architecture.md', group: 'Architecture' },
    { name: 'plan.md', group: 'Planning' },
    { name: 'tasks.md', group: 'Planning' },
    { name: 'analysis.md', group: 'Verification' },
    { name: 'implementation.md', group: 'Implementation' },
    { name: 'test-report.md', group: 'Verification' },
    { name: 'review.md', group: 'Verification' },
    { name: 'security-audit.md', group: 'Verification' },
    { name: 'convergence.md', group: 'Delivery' },
    { name: 'CHANGELOG.md', group: 'Delivery' },
    { name: 'RELEASE_NOTES.md', group: 'Delivery' },
  ];

  let completedCount = 0;

  pipelineArtifacts.forEach((item) => {
    const baseId = item.name.replace(/\.md$/, '');
    const art = artifacts[baseId] || artifacts[item.name];

    if (art) {
      completedCount++;
      table.push([
        chalk.bold.green(`✓ ${item.name}`),
        chalk.green('PRESENT'),
        art.authorProvider ? chalk.blue(art.authorProvider.toUpperCase()) : chalk.dim('EXTERNAL'),
        chalk.dim(new Date(art.lastUpdated).toLocaleTimeString()),
      ]);
    } else {
      table.push([
        chalk.dim(item.name),
        chalk.dim('NOT GENERATED'),
        chalk.dim('—'),
        chalk.dim('—'),
      ]);
    }
  });

  console.log(table.toString());

  const pct = Math.round((completedCount / pipelineArtifacts.length) * 100);
  console.log(`\nPipeline Progress: ${chalk.bold.cyan(`${completedCount}/${pipelineArtifacts.length}`)} artifacts (${pct}% complete)\n`);

  // Check historical runs in .forge/runs/
  const runs = artifactManager.listRuns();
  if (runs.length > 0) {
    console.log(chalk.bold('📁 Separated Runs History (.forge/runs/):'));
    const runsTable = new Table({
      head: [
        chalk.dim('Run ID'),
        chalk.dim('Artifacts'),
        chalk.dim('Iterations'),
        chalk.dim('Timestamp'),
      ],
      style: { head: [], border: [] },
    });

    runs.slice(0, 5).forEach((r) => {
      runsTable.push([
        chalk.cyan(r.runId),
        r.manifest ? `${r.manifest.artifacts.length} files` : '—',
        r.manifest ? `${r.manifest.iterationCount} iter` : '1 iter',
        r.manifest ? chalk.dim(new Date(r.manifest.timestamp).toLocaleTimeString()) : '—',
      ]);
    });

    console.log(runsTable.toString());
    console.log('');
  }

  // Check workflow state
  const statePath = path.join(root, '.forge', 'workflow-state.json');
  if (fs.existsSync(statePath)) {
    try {
      const state: WorkflowExecutionState = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
      console.log(chalk.bold('Last Workflow State:'));
      console.log(`  Workflow: ${chalk.cyan(state.workflowId)}`);
      if (state.runId) console.log(`  Run ID: ${chalk.yellow(state.runId)}`);
      console.log(`  Status: ${state.status === 'completed' ? chalk.green('COMPLETED') : chalk.red('FAILED')}`);
      console.log(`  Stages Executed: ${state.stages.length}\n`);
    } catch {
      // Ignore
    }
  }
}

