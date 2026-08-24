/**
 * Forge SDLC - CLI Application Definition
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { CAPABILITY_CATALOG } from '../catalog/capabilities.js';
import { handleExecuteCapability } from './commands/execute.js';
import { handleRecommendCommand } from './commands/recommend.js';
import { handleMatrixCommand } from './commands/matrix.js';
import { handleWorkflowCommand } from './commands/workflow.js';
import { handleSkillsCommand } from './commands/skills.js';
import { handleInitCommand } from './commands/init.js';
import { handleStatusCommand } from './commands/status.js';
import { handleDoctorCommand } from './commands/doctor.js';
import { handleConfigCommand } from './commands/config.js';
import { handleModelsCommand } from './commands/models.js';
import { handleAuthCommand } from './commands/auth.js';
import { handleGuideCommand } from './commands/guide.js';
import { UIFormatter } from './ui/formatter.js';


export function createCliApp(): Command {
  const program = new Command();


  program
    .name('forge')
    .description('Universal Capability-Oriented SDLC Framework & Intelligent Provider Router')
    .version('1.2.0');

  // Hook banner on display
  program.hook('preAction', (thisCommand) => {
    // Only print banner for top-level interactive runs
    if (process.stdout.isTTY && !process.env.FORGE_QUIET) {
      UIFormatter.printBanner();
    }
  });

  // ==========================================
  // Primary Commands
  // ==========================================

  // 1. forge recommend [capability]
  program
    .command('recommend [capability]')
    .description('Recommend optimal provider(s) for a capability or full SDLC workflow')
    .option('-j, --json', 'Output recommendation as JSON')
    .option('-w, --workspace <path>', 'Target workspace root')
    .action(async (capability, options) => {
      await handleRecommendCommand(capability, options);
    });

  // 2. forge matrix
  program
    .command('matrix')
    .description('Display the complete capability vs provider comparison matrix')
    .option('-j, --json', 'Output matrix as JSON')
    .action((options) => {
      handleMatrixCommand(options);
    });

  // 3. forge workflow [action] [id] / forge sdlc
  program
    .command('workflow [action] [id]')
    .description('Manage and run multi-stage SDLC workflows (e.g. "workflow run full-sdlc" or "workflow list")')
    .option('-w, --workspace <path>', 'Target workspace root')
    .action(async (action, id, options) => {
      await handleWorkflowCommand(action as any, id, options);
    });

  program
    .command('sdlc [action] [id]')
    .alias('run-sdlc')
    .description('Execute full end-to-end SDLC pipeline across all 13 stages')
    .option('-w, --workspace <path>', 'Target workspace root')
    .action(async (action, id, options) => {
      const act = action || 'run';
      const targetId = id || 'full-sdlc';
      await handleWorkflowCommand(act as any, targetId, options);
    });

  // 4. forge skills [action] [query]
  program
    .command('skills [action] [query]')
    .description('Search and explore generic capabilities catalog (e.g. "skills search architecture")')
    .option('-w, --workspace <path>', 'Target workspace root')
    .action(async (action, query, options) => {
      await handleSkillsCommand(action as any, query, options);
    });

  // 5. forge init
  program
    .command('init')
    .description('Initialize .forge directory and configuration in the current project')
    .option('-n, --name <name>', 'Project name')
    .option('-w, --workspace <path>', 'Target workspace root')
    .action((options) => {
      handleInitCommand(options);
    });

  // 6. forge status
  program
    .command('status')
    .description('Inspect existing project artifacts and SDLC pipeline completion state')
    .option('-w, --workspace <path>', 'Target workspace root')
    .action(async (options) => {
      await handleStatusCommand(options);
    });

  // 7. forge doctor / providers
  program
    .command('doctor')
    .alias('providers')
    .description('Check provider runtime health and embedded engine status (BMAD, Spec Kit, Internal)')
    .action(async () => {
      await handleDoctorCommand();
    });


  // 8. forge config [action] [key] [value]
  program
    .command('config [action] [key] [value]')
    .description('Get, set, or list model and API token configuration (e.g. "config set model claude-3-7-sonnet")')
    .option('-w, --workspace <path>', 'Target workspace root')
    .action((action, key, value, options) => {
      handleConfigCommand(action, key, value, options);
    });

  // 9. forge models
  program
    .command('models')
    .description('List all supported AI models (OpenAI, Claude, Gemini, DeepSeek, Ollama, OpenRouter)')
    .action(() => {
      handleModelsCommand();
    });

  // 10. forge auth [action] [token]
  program
    .command('auth [action] [token]')
    .alias('verify')
    .description('Authenticate and test live token connectivity with target AI provider')
    .option('-m, --model <model>', 'Model name to test')
    .option('-w, --workspace <path>', 'Target workspace root')
    .action(async (action, token, options) => {
      await handleAuthCommand(action as any, token, options);
    });

  // 11. forge brd (Business Requirements Document)
  program
    .command('brd')
    .description('Business Requirements & BRD Engineering (DISCOVERY)')
    .option('-p, --provider <name>', 'Override provider (bmad, speckit, internal)')
    .option('-r, --recommend-only', 'Only show recommendation and scoring without executing')
    .option('-d, --dry-run', 'Perform dry-run without writing artifacts')
    .option('--root', 'Also write generated artifact to project root in addition to .forge/artifacts/')
    .option('-w, --workspace <path>', 'Target workspace root')
    .action(async (options) => {
      await handleExecuteCapability('business-requirements', {
        provider: options.provider,
        recommendOnly: options.recommendOnly,
        dryRun: options.dryRun,
        writeToRoot: options.root,
        workspace: options.workspace,
      });
    });



  // 12. forge guide / docs
  program
    .command('guide')
    .alias('docs')
    .description('Interactive User Guide & Capability Cheat Sheet')
    .action(() => {
      handleGuideCommand();
    });

  // ==========================================
  // Register Direct Capability Commands
  // e.g. forge architecture, forge specify, forge review, etc.
  // ==========================================
  for (const cap of CAPABILITY_CATALOG) {
    program
      .command(cap.name)
      .description(`${cap.displayName} (${cap.group.toUpperCase()})`)
      .option('-p, --provider <name>', 'Override provider (bmad, speckit, internal)')
      .option('-m, --model <model>', 'AI model to use (e.g. gpt-4o, claude-3-7-sonnet, deepseek-chat)')
      .option('-t, --token <token>', 'API Key / Token')
      .option('-r, --recommend-only', 'Only show recommendation and scoring without executing')
      .option('-d, --dry-run', 'Perform dry-run without writing artifacts')
      .option('--root', 'Also write generated artifact to project root in addition to .forge/artifacts/')
      .option('-v, --verbose', 'Verbose logs')
      .option('-w, --workspace <path>', 'Target workspace root')
      .action(async (options) => {
        await handleExecuteCapability(cap.name, {
          provider: options.provider,
          recommendOnly: options.recommendOnly,
          dryRun: options.dryRun,
          verbose: options.verbose,
          writeToRoot: options.root,
          workspace: options.workspace,
        });
      });
  }

  // Fallback for custom or alias capability names
  program
    .arguments('<capability>')
    .action(async (capability, options) => {
      // If it matches a recognized command already handled, Commander handles it.
      // Otherwise, attempt capability routing.
      await handleExecuteCapability(capability, {
        provider: program.opts().provider,
        recommendOnly: program.opts().recommendOnly,
        dryRun: program.opts().dryRun,
        verbose: program.opts().verbose,
        writeToRoot: program.opts().root,
        workspace: program.opts().workspace,
      });
    });

  return program;
}
