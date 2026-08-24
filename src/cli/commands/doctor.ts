/**
 * Forge SDLC - Doctor & Provider Diagnostics Command Handler
 */

import chalk from 'chalk';
import Table from 'cli-table3';
import boxen from 'boxen';
import { ProviderRegistry } from '../../providers/registry.js';

export async function handleDoctorCommand(): Promise<void> {
  const registry = ProviderRegistry.getInstance();
  const providers = registry.getAll();

  console.log(chalk.bold.cyan('\n🩺 Forge SDLC Provider Diagnostics & Health Check\n'));

  const table = new Table({
    head: [
      chalk.dim('Provider'),
      chalk.dim('Embedded Engine'),
      chalk.dim('Native CLI on PATH'),
      chalk.dim('Runtime Status'),
      chalk.dim('Optional Native Install'),
    ],
    style: { head: [], border: [] },
  });

  for (const provider of providers) {
    const health = await provider.checkHealth();
    const embeddedStr = health.embeddedReady ? chalk.bold.green('✅ Baked-In (Ready)') : chalk.red('❌ Missing');
    const nativeStr = health.nativeCliFound
      ? chalk.bold.green(`✓ Found (${health.nativeCliPath})`)
      : chalk.dim('Optional (Not on PATH)');

    const pColor = health.providerId === 'bmad' ? chalk.blue : health.providerId === 'speckit' ? chalk.green : chalk.magenta;

    table.push([
      pColor.bold(health.providerName),
      embeddedStr,
      nativeStr,
      chalk.white(health.statusText),
      health.installCommand ? chalk.dim(health.installCommand) : chalk.dim('Built-in'),
    ]);
  }

  console.log(table.toString());

  const infoBox = boxen(
    `${chalk.bold.hex('#F59E0B')('💡 Zero-Setup Architecture:')}\n` +
    `${chalk.white('When you run ')}${chalk.cyan.bold('npx forge-sdlc')}${chalk.white(', BMAD and Spec Kit methodology engines are ')}${chalk.green.bold('already bundled internally')}${chalk.white('.\n')}` +
    `${chalk.dim('You do NOT need to install Python, Git repos, or secondary npm packages to use BMAD or Spec Kit features.')}`,
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: '#F59E0B',
    }
  );

  console.log(`\n${infoBox}\n`);
}
