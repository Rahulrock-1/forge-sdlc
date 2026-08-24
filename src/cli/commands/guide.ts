/**
 * Forge SDLC - Interactive User Guide Command
 */

import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table3';

export function handleGuideCommand(): void {
  const header = boxen(
    `${chalk.bold.hex('#F59E0B')('⚡ FORGE SDLC — COMPLETE USER GUIDE & CAPABILITY REFERENCE')}\n` +
    `${chalk.dim('Universal Capability-Oriented SDLC Framework • BMAD • GitHub Spec Kit • Internal')}`,
    {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: '#F59E0B',
      textAlignment: 'center',
    }
  );

  console.log(header);

  // Section 1: Quickstart
  console.log(chalk.bold.cyan('\n🚀 1. QUICKSTART & INITIALIZATION\n'));
  console.log(`  ${chalk.yellow('npx forge-sdlc init')}        ${chalk.dim('# Initialize .forge/ and install 37+ IDE slash commands')}`);
  console.log(`  ${chalk.yellow('npx forge-sdlc recommend')}   ${chalk.dim('# Analyze project context and print recommended workflow')}`);
  console.log(`  ${chalk.yellow('npx forge-sdlc status')}      ${chalk.dim('# Check current artifact completion and pipeline health')}`);

  // Section 2: Capability Table
  console.log(chalk.bold.cyan('\n📋 2. COMPLETE SDLC CAPABILITY REFERENCE\n'));

  const table = new Table({
    head: [
      chalk.bold('Capability Stage'),
      chalk.bold('CLI Command'),
      chalk.bold('Chat Slash (/)'),
      chalk.bold('Optimal Provider'),
      chalk.bold('Target Artifact'),
    ],
    style: { head: ['cyan'] },
  });

  table.push(
    ['1. Business Requirements', 'forge brd', '/brd', chalk.magenta('BMAD Engine'), '.forge/artifacts/brd.md'],
    ['2. Domain Discovery', 'forge discover', '/discover', chalk.magenta('BMAD Engine'), '.forge/artifacts/discovery.md'],
    ['3. Ambiguity Clarification', 'forge clarify', '/clarify', chalk.magenta('BMAD Engine'), '.forge/artifacts/clarifications.md'],
    ['4. Specification (SDD)', 'forge specify', '/specify', chalk.blue('Spec Kit (SDD)'), '.forge/artifacts/spec.md'],
    ['5. Technical Architecture', 'forge architecture', '/architecture', chalk.magenta('BMAD Engine'), '.forge/artifacts/architecture.md'],
    ['6. Database & Schemas', 'forge data-model', '/data-model', chalk.magenta('BMAD Engine'), '.forge/artifacts/data-model.md'],
    ['7. API Contracts', 'forge api-design', '/api-design', chalk.magenta('BMAD Engine'), '.forge/artifacts/api-contract.md'],
    ['8. Execution Roadmap', 'forge plan', '/plan', chalk.blue('Spec Kit (SDD)'), '.forge/artifacts/plan.md'],
    ['9. Tasks Breakdown', 'forge tasks', '/tasks', chalk.blue('Spec Kit (SDD)'), '.forge/artifacts/tasks.md'],
    ['10. Drift & Gap Analysis', 'forge analyze', '/analyze', chalk.blue('Spec Kit (SDD)'), '.forge/artifacts/analysis.md'],
    ['11. Multi-Lens Code Review', 'forge review', '/review', chalk.magenta('BMAD Engine'), '.forge/artifacts/review.md'],
    ['12. Security SAST Scan', 'forge security', '/security', chalk.green('Internal Engine'), '.forge/artifacts/security-audit.md'],
    ['13. Readiness Burndown', 'forge converge', '/converge', chalk.blue('Spec Kit (SDD)'), '.forge/artifacts/convergence.md'],
    ['14. Automated Test Suite', 'forge test', '/test', chalk.green('Internal Engine'), 'tests/']
  );

  console.log(table.toString());

  // Section 3: IDE Slash Commands
  const slashBox = boxen(
    `${chalk.bold.hex('#F59E0B')('✨ HOW TO USE IN AI EDITORS (Cursor, Antigravity, Claude Code)')}\n\n` +
    `${chalk.white('1. Run ')}${chalk.yellow('forge init')}${chalk.white(' in your project folder.\n')}` +
    `${chalk.white('2. Open your AI Chat panel and type ')}${chalk.cyan.bold('/')}${chalk.white(' to autocomplete:\n\n')}` +
    `   ${chalk.yellow('/brd')}          → Formulates Business Requirements Document & ROI\n` +
    `   ${chalk.yellow('/specify')}      → Formulates Given-When-Then functional user stories\n` +
    `   ${chalk.yellow('/architecture')} → Designs C4 architecture with Mermaid topology diagrams\n` +
    `   ${chalk.yellow('/plan')}         → Synthesizes phased milestone execution roadmap\n` +
    `   ${chalk.yellow('/tasks')}        → Generates atomic developer task checklist\n` +
    `   ${chalk.yellow('/review')}       → Runs 5-Lens code review (bmad-review)\n` +
    `   ${chalk.yellow('/security')}     → Runs STRIDE threat modeling & SAST audit\n` +
    `   ${chalk.yellow('/converge')}     → Certifies release candidate readiness`,
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: '#F59E0B',
    }
  );

  console.log(slashBox);

  // Section 4: Workflow Runner
  console.log(chalk.bold.cyan('🔄 3. SEQUENTIAL SDLC WORKFLOW RUNNER\n'));
  console.log(`  Run the complete 13-stage software lifecycle sequentially:`);
  console.log(`  ${chalk.yellow.bold('npx forge-sdlc workflow run full-sdlc')}\n`);
  console.log(chalk.dim('  BRD ──► SPECIFY ──► CLARIFY ──► ARCHITECTURE ──► PLAN ──► TASKS ──► IMPLEMENT ──► TEST ──► REVIEW ──► SECURITY ──► CONVERGE ──► RELEASE\n'));

  // Section 5: Offline & Token info
  console.log(chalk.bold.cyan('🔐 4. ZERO-TOKEN OFFLINE DEFAULT MODE\n'));
  console.log(`  • ${chalk.green('100% Free & Offline:')} Runs without any API keys or tokens by default.`);
  console.log(`  • ${chalk.blue('Optional Live AI:')} Run ${chalk.yellow('forge config set token <key>')} anytime if you want live Claude/GPT-4o text synthesis.`);
  console.log(`  • ${chalk.magenta('Documentation Online:')} https://www.npmjs.com/package/forge-sdlc\n`);
}
