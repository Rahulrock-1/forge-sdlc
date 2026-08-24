/**
 * Forge SDLC - Recommend Command Handler
 */

import chalk from 'chalk';
import ora from 'ora';
import { CapabilityRouter } from '../../engine/router.js';
import { UIFormatter } from '../ui/formatter.js';

export async function handleRecommendCommand(
  capabilityName?: string,
  options: { workspace?: string; json?: boolean } = {}
): Promise<void> {
  const router = new CapabilityRouter();
  const workspaceRoot = options.workspace || process.cwd();

  if (capabilityName) {
    // Single capability recommendation
    const spinner = ora(`Analyzing capability "${capabilityName}" for workspace...`).start();
    try {
      const rec = await router.recommend(capabilityName, workspaceRoot);
      spinner.stop();

      if (options.json) {
        console.log(JSON.stringify(rec, null, 2));
      } else {
        UIFormatter.printRecommendationCard(rec);
      }
    } catch (err: any) {
      spinner.fail(chalk.red(err.message));
      process.exitCode = 1;
    }
  } else {
    // Full project SDLC pipeline recommendation
    const spinner = ora('Analyzing project context and synthesizing optimal SDLC workflow...').start();
    try {
      const workflowRec = await router.recommendProjectWorkflow(workspaceRoot);
      spinner.stop();

      if (options.json) {
        console.log(JSON.stringify(workflowRec, null, 2));
      } else {
        UIFormatter.printWorkflowRecommendation(workflowRec);
      }
    } catch (err: any) {
      spinner.fail(chalk.red(err.message));
      process.exitCode = 1;
    }
  }
}
