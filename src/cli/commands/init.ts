import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import boxen from 'boxen';
import { ForgeConfig } from '../../types/context.js';
import { AgentIntegrator } from '../../engine/agents.js';

export function handleInitCommand(options: { workspace?: string; name?: string } = {}): void {
  const root = path.resolve(options.workspace || process.cwd());
  const forgeDir = path.join(root, '.forge');
  const artifactsDir = path.join(forgeDir, 'artifacts');

  if (!fs.existsSync(forgeDir)) {
    fs.mkdirSync(forgeDir, { recursive: true });
  }

  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  const configPath = path.join(root, '.forgerc.json');
  if (!fs.existsSync(configPath)) {
    const defaultConfig: ForgeConfig = {
      version: '1.0.0',
      projectName: options.name || path.basename(root),
      defaultWorkflow: [
        'discover',
        'specify',
        'clarify',
        'architecture',
        'plan',
        'tasks',
        'analyze',
        'implement',
        'test',
        'review',
        'security',
        'converge',
        'release',
      ],
      providers: {
        enabled: ['bmad', 'speckit', 'internal'],
        overrides: {},
      },
      qualityGates: {
        enforceStrictChecklists: true,
        requireArtifactReview: false,
      },
      scoringWeights: {
        capabilityMatch: 0.25,
        specialization: 0.25,
        workflowFit: 0.15,
        artifactFit: 0.15,
        projectContext: 0.10,
        providerQuality: 0.05,
        userPreference: 0.05,
      },
    };

    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
    console.log(chalk.green('✓ Created .forgerc.json configuration file.'));
  }

  // Install AI Slash Commands & IDE Agent rules (Cursor, Claude, Copilot, Antigravity, Windsurf)
  const agentResult = AgentIntegrator.installSlashCommands(root);

  console.log(chalk.green('✓ Initialized .forge/ workspace directory.'));
  console.log(chalk.green(`✓ Installed ${agentResult.cursorRulesCount} Cursor slash command rules (.cursor/rules/)`));
  console.log(chalk.green(`✓ Installed ${agentResult.claudeCommandsCount} Claude Code commands (.claude/commands/)`));
  console.log(chalk.green('✓ Configured GitHub Copilot instructions (.github/copilot-instructions.md)'));
  console.log(chalk.green('✓ Configured Antigravity Skill (.gemini/skills/forge/) & Windsurf rules'));

  const slashBox = boxen(
    `${chalk.bold.hex('#F59E0B')('✨ Slash Commands (/agent) Ready in your IDE!')}\n\n` +
    `${chalk.white('Open your AI Chat (Cursor, Antigravity, Claude Code, Copilot) and type ')}${chalk.cyan.bold('/')}${chalk.white(':\n\n')}` +
    `  ${chalk.bold.yellow('/sdlc')}            ${chalk.green('★ Full SDLC Master Orchestrator (End-to-End 14 Stages)')}\n` +
    `  ${chalk.bold.yellow('/implement')}       ${chalk.green('★ Autonomous Implementation Agent (Code & Tests)')}\n` +
    `  ${chalk.yellow('/brd')}            ${chalk.dim('→ Formulates Business Requirements Document & ROI (BMAD)')}\n` +
    `  ${chalk.yellow('/constitution')}   ${chalk.dim('→ Establishes non-negotiable architectural invariants (Spec Kit)')}\n` +
    `  ${chalk.yellow('/specify')}        ${chalk.dim('→ Formulates Given-When-Then specification (Spec Kit)')}\n` +
    `  ${chalk.yellow('/clarify')}        ${chalk.dim('→ Probes ambiguities & hidden assumptions (BMAD)')}\n` +
    `  ${chalk.yellow('/architecture')}   ${chalk.dim('→ Designs C4 technical architecture & ADRs (BMAD)')}\n` +
    `  ${chalk.yellow('/plan')}           ${chalk.dim('→ Generates phased execution milestones (Spec Kit)')}\n` +
    `  ${chalk.yellow('/tasks')}          ${chalk.dim('→ Generates atomic developer checklist (Spec Kit)')}\n` +
    `  ${chalk.yellow('/analyze')}        ${chalk.dim('→ Audits cross-artifact consistency (Spec Kit)')}\n` +
    `  ${chalk.yellow('/test')}           ${chalk.dim('→ Synthesizes automated test suites & QA (Internal)')}\n` +
    `  ${chalk.yellow('/review')}         ${chalk.dim('→ Runs 5-Lens code review (bmad-review)')}\n` +
    `  ${chalk.yellow('/security')}       ${chalk.dim('→ Runs STRIDE & OWASP threat audit (Internal)')}\n` +
    `  ${chalk.yellow('/converge')}       ${chalk.dim('→ Certifies release candidate readiness (Spec Kit)')}\n` +
    `  ${chalk.yellow('/release')}        ${chalk.dim('→ Generates KeepAChangelog notes & SemVer bump (Internal)')}`,
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: '#F59E0B',
    }
  );

  console.log(`\n${slashBox}\n`);
}

