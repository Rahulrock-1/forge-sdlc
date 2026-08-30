/**
 * Forge SDLC - Auto-Healing CLI Command Handler
 */

import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import { AutoHealingEngine } from '../../engine/healing.js';

export async function handleHealCommand(options: {
  apply?: boolean;
  functionality?: string;
  workspace?: string;
} = {}): Promise<void> {
  const workspaceRoot = path.resolve(options.workspace || process.cwd());
  const functionality = options.functionality || 'core';

  const spinner = ora(
    chalk.cyan(`Analyzing cross-artifact alignment and detecting drift [Functionality: ${functionality}]...`)
  ).start();

  try {
    const engine = new AutoHealingEngine(workspaceRoot);
    const result = engine.analyzeAndHeal({
      applyPatches: options.apply,
      functionality,
    });

    spinner.stop();

    const alignmentColor = result.alignmentPercentage >= 90 ? chalk.green : result.alignmentPercentage >= 70 ? chalk.yellow : chalk.red;

    const summaryBox = boxen(
      `${chalk.bold.hex('#F59E0B')('🩺 Forge Cross-Artifact Auto-Healing Engine')}\n\n` +
      `${chalk.white('Target Workspace:')} ${chalk.cyan(path.basename(workspaceRoot))}\n` +
      `${chalk.white('Functionality:')}    ${chalk.cyan(functionality)}\n` +
      `${chalk.white('Alignment Score:')}  ${alignmentColor.bold(`${result.alignmentPercentage}%`)}\n` +
      `${chalk.white('Drift Issues:')}     ${result.totalIssuesFound === 0 ? chalk.green('0 (Clean)') : chalk.yellow(`${result.totalIssuesFound} detected`)}\n` +
      `${chalk.white('Patches Applied:')}  ${result.autoApplied ? chalk.green('Yes (Auto-synchronized tasks.md)') : chalk.dim('No (Run with --apply to auto-patch)')}\n` +
      `${chalk.white('Report Output:')}    ${chalk.cyan('.forge/artifacts/healing-plan.md')}`,
      {
        padding: 1,
        borderStyle: 'round',
        borderColor: result.alignmentPercentage >= 90 ? '#10B981' : '#F59E0B',
      }
    );

    console.log(`\n${summaryBox}\n`);

    if (result.issues.length > 0) {
      console.log(chalk.bold.yellow('Identified Drift Diagnostics:'));
      result.issues.forEach((issue, idx) => {
        const sevColor = issue.severity === 'critical' || issue.severity === 'high' ? chalk.red : chalk.yellow;
        console.log(`  ${idx + 1}. [${sevColor.bold(issue.severity.toUpperCase())}] ${chalk.bold(issue.title)}`);
        console.log(`     ${chalk.dim('Source:')} ${issue.sourceArtifact} ➔ ${chalk.dim('Target:')} ${issue.targetArtifact}`);
        console.log(`     ${chalk.dim('Fix:')} ${issue.description}\n`);
      });

      if (!options.apply) {
        console.log(
          `💡 ${chalk.yellow('Tip:')} Run ${chalk.bold.cyan('forge heal --apply')} to automatically patch tasks.md and resolve unmapped requirements.\n`
        );
      }
    } else {
      console.log(chalk.green('✓ 100% Artifact Consistency Verified. All requirements, architecture models, and developer tasks are in sync.\n'));
    }
  } catch (err: any) {
    spinner.fail(chalk.red(err.message || String(err)));
    process.exitCode = 1;
  }
}
