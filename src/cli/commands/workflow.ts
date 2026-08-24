/**
 * Forge SDLC - Workflow Command Handler
 */

import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
import { WorkflowEngine } from '../../engine/workflow.js';
import { UIFormatter } from '../ui/formatter.js';

export async function handleWorkflowCommand(
  action: 'run' | 'list' = 'list',
  workflowId?: string,
  options: { workspace?: string } = {}
): Promise<void> {
  const engine = new WorkflowEngine(options.workspace);
  const workflows = engine.getAvailableWorkflows();

  if (action === 'list') {
    console.log(chalk.bold.cyan('\n📋 Available Forge SDLC Workflows\n'));

    const table = new Table({
      head: [
        chalk.dim('ID'),
        chalk.dim('Name'),
        chalk.dim('Stages'),
        chalk.dim('Description'),
      ],
      style: { head: [], border: [] },
    });

    workflows.forEach((w) => {
      table.push([
        chalk.bold.yellow(w.id),
        chalk.bold(w.name),
        `${w.stages.length} stages`,
        chalk.dim(w.description),
      ]);
    });

    console.log(table.toString());
    console.log(chalk.dim('\nRun a workflow with: ') + chalk.bold.hex('#F59E0B')('forge workflow run <workflow-id>\n'));
    return;
  }

  if (action === 'run') {
    const targetId = workflowId || 'full-sdlc';
    const targetWorkflow = workflows.find((w) => w.id === targetId);

    if (!targetWorkflow) {
      console.error(chalk.red(`Workflow "${targetId}" not found. Run "forge workflow list" to see options.`));
      process.exitCode = 1;
      return;
    }

    console.log(
      chalk.bold(`\n🚀 Launching Workflow: `) +
      chalk.bold.cyan(targetWorkflow.name) +
      chalk.dim(` (${targetWorkflow.stages.length} Stages)\n`)
    );

    const spinner = ora('Initializing workflow execution pipeline...').start();

    const state = await engine.executeWorkflow(targetWorkflow, (stage, idx, total) => {
      if (stage.status === 'running') {
        spinner.text = `[Stage ${idx + 1}/${total}] Executing ${chalk.bold(stage.stageId)}...`;
      } else if (stage.status === 'completed') {
        spinner.succeed(`[Stage ${idx + 1}/${total}] Completed ${chalk.bold(stage.stageId)} (Provider: ${stage.providerId.toUpperCase()})`);
        spinner.start();
      } else if (stage.status === 'failed') {
        spinner.fail(`[Stage ${idx + 1}/${total}] Failed at stage ${chalk.bold(stage.stageId)}: ${stage.error}`);
      }
    });

    if (state.status === 'completed') {
      spinner.succeed(chalk.green.bold('🎉 Full SDLC Workflow Completed Successfully!'));
      console.log(chalk.dim(`\nArtifacts and state saved to .forge/artifacts/ and .forge/workflow-state.json\n`));
    } else {
      spinner.fail(chalk.red('Workflow stopped due to stage failure.'));
    }
  }
}
