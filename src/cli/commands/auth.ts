/**
 * Forge SDLC - Auth Verification CLI Command Handler
 */

import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import Table from 'cli-table3';
import { AuthManager } from '../../engine/auth.js';
import { LLMManager } from '../../engine/llm.js';

export async function handleAuthCommand(
  action: 'test' | 'verify' | 'status' = 'verify',
  tokenToTest?: string,
  options: { workspace?: string; model?: string } = {}
): Promise<void> {
  const root = options.workspace || process.cwd();
  const config = LLMManager.resolveConfig(root, {
    apiKey: tokenToTest,
    model: options.model,
  });

  const spinner = ora(`Authenticating API token against ${chalk.cyan(config.vendor?.toUpperCase() || 'AI Provider')}...`).start();

  const result = await AuthManager.validateToken(config, root);

  if (result.valid) {
    spinner.succeed(chalk.green.bold('Authentication Successful!'));

    const table = new Table({
      head: [chalk.dim('Field'), chalk.dim('Value')],
      style: { head: [], border: [] },
    });

    table.push(
      ['Status', chalk.bold.green('✓ 200 OK (Authorized)')],
      ['Provider Vendor', chalk.cyan.bold(result.vendor.toUpperCase())],
      ['Active Model', chalk.yellow(result.model)],
      ['Network Latency', chalk.dim(`${result.latencyMs}ms`)],
      ['Message', chalk.white(result.message)]
    );

    if (result.accountInfo?.availableModels && result.accountInfo.availableModels.length > 0) {
      table.push(['Available Models', chalk.dim(result.accountInfo.availableModels.slice(0, 4).join(', '))]);
    }

    console.log(`\n${table.toString()}\n`);

    const readyBox = boxen(
      `${chalk.bold.green('🚀 Ready for Agentic Workflows!')}\n` +
      `${chalk.white('Your API token is verified and ready to run ')}${chalk.cyan.bold('forge architecture')}${chalk.white(', ')}${chalk.cyan.bold('forge specify')}${chalk.white(', ')}${chalk.cyan.bold('forge review')}${chalk.white(', etc.')}`,
      {
        padding: 1,
        borderStyle: 'round',
        borderColor: 'green',
      }
    );

    console.log(readyBox);
  } else {
    spinner.fail(chalk.red.bold('Authentication Failed!'));

    console.log(chalk.red(`\n❌ Error: ${result.message}`));

    console.log(chalk.dim('\nHow to fix:'));
    console.log(`  1. Export valid token: ${chalk.yellow(`export ${result.vendor === 'anthropic' ? 'ANTHROPIC_API_KEY' : 'OPENAI_API_KEY'}="your-key-here"`)}`);
    console.log(`  2. Or save in config:  ${chalk.yellow('npx forge config set token <your-token>')}`);
    console.log(`  3. Or create .env:     ${chalk.yellow('OPENAI_API_KEY=sk-proj-...')}\n`);
    process.exitCode = 1;
  }
}
