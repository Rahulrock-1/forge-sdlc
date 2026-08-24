/**
 * Forge SDLC - Config & Token Management Command Handler
 */

import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import Table from 'cli-table3';
import { LLMManager } from '../../engine/llm.js';
import { POPULAR_MODELS } from '../../types/model.js';

export function handleConfigCommand(
  action?: string,
  key?: string,
  value?: string,
  options: { workspace?: string } = {}
): void {
  const root = options.workspace || process.cwd();
  const configPath = path.join(root, '.forgerc.json');

  let currentConfig: any = {};
  if (fs.existsSync(configPath)) {
    try {
      currentConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch {
      currentConfig = {};
    }
  }

  if (action === 'set' && key && value) {
    if (!currentConfig.llm) currentConfig.llm = {};

    const cleanKey = key.toLowerCase();
    if (cleanKey === 'model') {
      currentConfig.llm.model = value;
      // Auto-detect vendor if possible
      const matched = POPULAR_MODELS.find((m) => m.id === value || m.defaultModel === value);
      if (matched) currentConfig.llm.vendor = matched.vendor;
      console.log(chalk.green(`✓ Set active model to: ${chalk.bold(value)}`));
    } else if (cleanKey === 'token' || cleanKey === 'api-key' || cleanKey === 'apikey') {
      currentConfig.llm.apiKey = value;
      console.log(chalk.green(`✓ Set API token successfully (masked: ${value.slice(0, 4)}...${value.slice(-4)})`));
    } else if (cleanKey === 'vendor' || cleanKey === 'provider') {
      currentConfig.llm.vendor = value;
      console.log(chalk.green(`✓ Set model provider to: ${chalk.bold(value)}`));
    } else if (cleanKey === 'baseurl' || cleanKey === 'base-url') {
      currentConfig.llm.baseUrl = value;
      console.log(chalk.green(`✓ Set custom base URL to: ${chalk.bold(value)}`));
    } else {
      currentConfig[key] = value;
      console.log(chalk.green(`✓ Set config "${key}" to "${value}"`));
    }

    fs.writeFileSync(configPath, JSON.stringify(currentConfig, null, 2), 'utf-8');
    return;
  }

  // Default: list active configuration and token detection status
  const resolved = LLMManager.resolveConfig(root);

  console.log(chalk.bold.cyan('\n⚙️  Forge SDLC Model & Token Configuration\n'));

  const table = new Table({
    head: [chalk.dim('Setting'), chalk.dim('Active Value'), chalk.dim('Source')],
    style: { head: [], border: [] },
  });

  const hasToken = !!resolved.apiKey;
  const maskedToken = resolved.apiKey
    ? `${resolved.apiKey.slice(0, 4)}••••••••${resolved.apiKey.slice(-4)}`
    : chalk.yellow('No token set (Using offline template engine)');

  let tokenSource = 'None';
  if (process.env.ANTHROPIC_API_KEY) tokenSource = 'env: ANTHROPIC_API_KEY';
  else if (process.env.OPENAI_API_KEY) tokenSource = 'env: OPENAI_API_KEY';
  else if (process.env.GEMINI_API_KEY) tokenSource = 'env: GEMINI_API_KEY';
  else if (process.env.DEEPSEEK_API_KEY) tokenSource = 'env: DEEPSEEK_API_KEY';
  else if (process.env.OPENROUTER_API_KEY) tokenSource = 'env: OPENROUTER_API_KEY';
  else if (currentConfig.llm?.apiKey) tokenSource = '.forgerc.json';

  table.push(
    ['Active Model', chalk.bold.green(resolved.model || 'gpt-4o'), currentConfig.llm?.model ? '.forgerc.json' : 'Default'],
    ['Provider Vendor', chalk.cyan(resolved.vendor || 'openai'), currentConfig.llm?.vendor ? '.forgerc.json' : 'Auto-detected'],
    ['API Token / Key', maskedToken, tokenSource],
    ['Base URL', resolved.baseUrl ? chalk.dim(resolved.baseUrl) : chalk.dim('Default vendor endpoint'), resolved.baseUrl ? '.forgerc.json' : 'Default']
  );

  console.log(table.toString());

  console.log(chalk.dim('\nHow to set your model and token:'));
  console.log(`  ${chalk.yellow('npx forge config set model claude-3-7-sonnet')}   ${chalk.dim('# Set model')}`);
  console.log(`  ${chalk.yellow('npx forge config set token sk-ant-api03-...')}      ${chalk.dim('# Set token in .forgerc.json')}`);
  console.log(`  ${chalk.dim('Or simply export: ')}${chalk.yellow('export ANTHROPIC_API_KEY=sk-ant-...')}${chalk.dim(' or ')}${chalk.yellow('export OPENAI_API_KEY=sk-...')}\n`);
}
