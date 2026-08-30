/**
 * Forge SDLC - Interactive Terminal Cockpit & Live Dashboard
 */

import path from 'node:path';
import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table3';
import { ArtifactManager } from '../../engine/artifacts.js';
import { AutoHealingEngine } from '../../engine/healing.js';
import { DEFAULT_SDLC_WORKFLOW } from '../../engine/workflow.js';

export function handleDashboardCommand(options: { functionality?: string; workspace?: string } = {}): void {
  const workspaceRoot = path.resolve(options.workspace || process.cwd());
  const functionality = options.functionality || 'core';
  const projectName = path.basename(workspaceRoot);

  const artifactManager = new ArtifactManager(workspaceRoot);
  const healingEngine = new AutoHealingEngine(workspaceRoot);

  const artifacts = artifactManager.listArtifacts(functionality);
  const functionalities = artifactManager.listFunctionalities();
  const healing = healingEngine.analyzeAndHeal({ functionality });

  // 1. Banner Cockpit Header
  const header = boxen(
    `${chalk.bold.hex('#F59E0B')('⚡ FORGE SDLC — MULTI-AGENT DEVELOPMENT COCKPIT')}\n` +
    `${chalk.dim('Project:')} ${chalk.bold.cyan(projectName)}  ${chalk.dim('• Module:')} ${chalk.bold.yellow(functionality)}  ${chalk.dim('• Status:')} ${healing.alignmentPercentage >= 90 ? chalk.green.bold('HEALTHY') : chalk.yellow.bold('DRIFT DETECTED')}`,
    {
      padding: 1,
      borderStyle: 'double',
      borderColor: '#F59E0B',
      textAlignment: 'center',
    }
  );

  console.log(`\n${header}\n`);

  // 2. 15-Stage SDLC Pipeline Status Table
  console.log(chalk.bold.cyan('🔄 SDLC STAGES & PIPELINE COMPLETION:\n'));

  const table = new Table({
    head: [
      chalk.bold('Stage'),
      chalk.bold('Capability'),
      chalk.bold('Status'),
      chalk.bold('Target Artifact'),
      chalk.bold('Command'),
    ],
    style: { head: ['cyan'] },
  });

  const existingArtifactNames = new Set(artifacts.map((a) => a.filename || a.name || a.id));

  DEFAULT_SDLC_WORKFLOW.stages.forEach((stage, idx) => {
    const isCompleted = stage.expectedOutputs.some((out) => existingArtifactNames.has(out));
    const statusText = isCompleted ? chalk.green('✓ COMPLETED') : chalk.dim('⏳ READY');
    const artifactText = stage.expectedOutputs.join(', ');

    table.push([
      `#${idx + 1}`,
      stage.name,
      statusText,
      chalk.cyan(artifactText),
      chalk.yellow(`forge ${stage.capabilityId.replace(/^forge\./, '')}`),
    ]);
  });

  console.log(table.toString());

  // 3. Health & Diagnostics Summary Box
  const completedCount = DEFAULT_SDLC_WORKFLOW.stages.filter((stage) =>
    stage.expectedOutputs.some((out) => existingArtifactNames.has(out))
  ).length;
  const progressPct = Math.round((completedCount / DEFAULT_SDLC_WORKFLOW.stages.length) * 100);

  const healthBox = boxen(
    `${chalk.bold.white('📊 Workspace Diagnostics:')}\n\n` +
    `  • ${chalk.white('SDLC Completion:')}      ${chalk.bold.green(`${completedCount}/${DEFAULT_SDLC_WORKFLOW.stages.length} Stages (${progressPct}%)`)}\n` +
    `  • ${chalk.white('Cross-Artifact Trace:')} ${healing.alignmentPercentage >= 90 ? chalk.green.bold(`${healing.alignmentPercentage}%`) : chalk.yellow.bold(`${healing.alignmentPercentage}%`)}\n` +
    `  • ${chalk.white('Active Modules:')}        ${chalk.cyan(functionalities.join(', ') || 'core')}\n` +
    `  • ${chalk.white('Total Artifacts:')}       ${chalk.bold(artifacts.length)} files in \`.forge/artifacts/\``,
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: '#3B82F6',
    }
  );

  console.log(`\n${healthBox}\n`);

  // 4. Quick Actions
  console.log(chalk.bold.yellow('⚡ Quick Actions:'));
  console.log(`  • Run Auto-Healing:   ${chalk.cyan('forge heal --apply')}`);
  console.log(`  • Run Full Pipeline:  ${chalk.cyan('forge sdlc --functionality ' + functionality)}`);
  console.log(`  • Multi-Agent Swarm:  ${chalk.cyan('forge swarm review')}`);
  console.log(`  • CI/CD Quality Gate: ${chalk.cyan('forge ci gate')}\n`);
}
