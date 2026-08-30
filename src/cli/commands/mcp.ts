/**
 * Forge SDLC - MCP CLI Command Handler
 */

import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import boxen from 'boxen';
import { ForgeMcpServer } from '../../mcp/server.js';

export async function handleMcpCommand(
  action: 'start' | 'config' | 'install' = 'start',
  options: { workspace?: string } = {}
): Promise<void> {
  const workspaceRoot = path.resolve(options.workspace || process.cwd());

  if (action === 'start') {
    // Suppress other banner outputs to keep stdio clean for JSON-RPC
    process.env.FORGE_QUIET = 'true';
    const server = new ForgeMcpServer(workspaceRoot);
    server.startStdio();
    return;
  }

  if (action === 'config') {
    const configSnippet = {
      mcpServers: {
        'forge-sdlc': {
          command: 'npx',
          args: ['-y', 'forge-sdlc', 'mcp', 'start'],
          env: {},
        },
      },
    };

    console.log(chalk.bold.hex('#F59E0B')('\n🔌 Forge SDLC — Model Context Protocol (MCP) Configuration\n'));
    console.log(chalk.white('Add the following block to your MCP client config (e.g. ') + chalk.cyan('claude_desktop_config.json') + chalk.white(' or ') + chalk.cyan('.cursor/mcp.json') + chalk.white('):\n'));
    console.log(chalk.green(JSON.stringify(configSnippet, null, 2)));
    console.log(`\n${chalk.dim('Tip: Run ')}${chalk.yellow('forge mcp install')}${chalk.dim(' to automatically configure Cursor and Antigravity MCP.')}\n`);
    return;
  }

  if (action === 'install') {
    const cursorDir = path.join(workspaceRoot, '.cursor');
    if (!fs.existsSync(cursorDir)) {
      fs.mkdirSync(cursorDir, { recursive: true });
    }

    const cursorMcpPath = path.join(cursorDir, 'mcp.json');
    let currentConfig: any = { mcpServers: {} };
    if (fs.existsSync(cursorMcpPath)) {
      try {
        currentConfig = JSON.parse(fs.readFileSync(cursorMcpPath, 'utf-8'));
      } catch {}
    }

    currentConfig.mcpServers = currentConfig.mcpServers || {};
    currentConfig.mcpServers['forge-sdlc'] = {
      command: 'npx',
      args: ['-y', 'forge-sdlc', 'mcp', 'start'],
      env: {},
    };

    fs.writeFileSync(cursorMcpPath, JSON.stringify(currentConfig, null, 2), 'utf-8');

    const resultBox = boxen(
      `${chalk.bold.green('✓ Forge SDLC MCP Server Installed!')}\n\n` +
      `${chalk.white('Configured file:')} ${chalk.cyan('.cursor/mcp.json')}\n` +
      `${chalk.white('Tools registered:')}\n` +
      `  • ${chalk.yellow('forge_execute_capability')} (Run any SDLC capability)\n` +
      `  • ${chalk.yellow('forge_recommend_provider')} (Smart BMAD/SpecKit scoring)\n` +
      `  • ${chalk.yellow('forge_get_status')} (Workspace artifacts & metrics)\n` +
      `  • ${chalk.yellow('forge_run_workflow')} (Multi-stage autonomous pipelines)`,
      {
        padding: 1,
        borderStyle: 'round',
        borderColor: '#10B981',
      }
    );

    console.log(`\n${resultBox}\n`);
  }
}
