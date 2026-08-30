/**
 * Forge SDLC - Swarm Consensus CLI Command Handler
 */

import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import { SwarmConsensusEngine } from '../../engine/swarm.js';

export async function handleSwarmCommand(
  capabilityName: string = 'review',
  options: {
    providers?: string;
    functionality?: string;
    dryRun?: boolean;
    workspace?: string;
  } = {}
): Promise<void> {
  const workspaceRoot = path.resolve(options.workspace || process.cwd());
  const functionality = options.functionality || 'core';
  const providerList = options.providers ? options.providers.split(',').map((p) => p.trim()) : undefined;

  const spinner = ora(
    chalk.cyan(`Launching Multi-Provider Swarm for "${capabilityName}" across BMAD, Spec Kit, and Internal engines...`)
  ).start();

  try {
    const engine = new SwarmConsensusEngine(workspaceRoot);
    const result = await engine.executeSwarm(capabilityName, {
      providers: providerList,
      functionality,
      dryRun: options.dryRun,
    });

    spinner.succeed(chalk.green(`Swarm Consensus completed with ${result.agreementLevel} (${result.consensusScore}%)`));

    const summaryBox = boxen(
      `${chalk.bold.hex('#F59E0B')('🐝 Forge Multi-Provider Swarm Consensus')}\n\n` +
      `${chalk.white('Target Capability:')}  ${chalk.cyan.bold(result.capability)}\n` +
      `${chalk.white('Consensus Level:')}   ${chalk.green.bold(`${result.agreementLevel} (${result.consensusScore}%)`)}\n` +
      `${chalk.white('Active Providers:')}  ${chalk.yellow(result.participatingProviders.join(', ').toUpperCase())}\n` +
      `${chalk.white('Master Artifact:')}   ${chalk.cyan(result.synthesizedArtifact.name)}`,
      {
        padding: 1,
        borderStyle: 'round',
        borderColor: '#F59E0B',
      }
    );

    console.log(`\n${summaryBox}\n`);

    console.log(chalk.bold('Swarm Provider Breakdown:'));
    result.candidateOutcomes.forEach((c) => {
      console.log(`  • ${chalk.bold.cyan(c.providerName)}: ${chalk.green('Passed')} (Score: ${c.score}/100) — ${chalk.dim(c.summary)}`);
    });

    console.log(`\n📄 Generated: ${chalk.cyan(`.forge/artifacts/${result.synthesizedArtifact.name}`)}\n`);
  } catch (err: any) {
    spinner.fail(chalk.red(err.message || String(err)));
    process.exitCode = 1;
  }
}
