/**
 * Forge SDLC - Supported Models Listing Command Handler
 */

import chalk from 'chalk';
import Table from 'cli-table3';
import { POPULAR_MODELS } from '../../types/model.js';

export function handleModelsCommand(): void {
  console.log(chalk.bold.cyan('\n🤖 Supported AI Models & Token Environment Variables\n'));

  const table = new Table({
    head: [
      chalk.dim('Preset ID'),
      chalk.dim('Display Name'),
      chalk.dim('Vendor'),
      chalk.dim('Env Variable Token'),
      chalk.dim('Model String'),
    ],
    style: { head: [], border: [] },
  });

  POPULAR_MODELS.forEach((m) => {
    table.push([
      chalk.bold.yellow(m.id),
      chalk.bold(m.displayName),
      chalk.cyan(m.vendor.toUpperCase()),
      chalk.green(m.envKeyName),
      chalk.dim(m.defaultModel),
    ]);
  });

  console.log(table.toString());
  console.log(chalk.dim('\nTo switch model on the fly:'));
  console.log(`  ${chalk.yellow('npx forge architecture --model claude-3-7-sonnet')}`);
  console.log(`  ${chalk.yellow('npx forge specify --model gpt-4o')}`);
  console.log(`  ${chalk.yellow('npx forge review --model deepseek-reasoner')}\n`);
}
