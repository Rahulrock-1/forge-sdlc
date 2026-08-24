/**
 * Forge SDLC - Execute Capability Command Handler
 */

import chalk from 'chalk';
import ora from 'ora';
import { CapabilityRouter } from '../../engine/router.js';
import { UIFormatter } from '../ui/formatter.js';

export interface ExecuteCommandOptions {
  provider?: string;
  recommendOnly?: boolean;
  dryRun?: boolean;
  verbose?: boolean;
  writeToRoot?: boolean;
  workspace?: string;
}

export async function handleExecuteCapability(
  capabilityName: string,
  options: ExecuteCommandOptions
): Promise<void> {
  const router = new CapabilityRouter();
  const workspaceRoot = options.workspace || process.cwd();

  // If user passed --recommend-only, show recommendation card and exit
  if (options.recommendOnly) {
    const spinner = ora(`Analyzing project context for "${capabilityName}"...`).start();
    try {
      const rec = await router.recommend(capabilityName, workspaceRoot);
      spinner.stop();
      UIFormatter.printRecommendationCard(rec);
      return;
    } catch (err: any) {
      spinner.fail(chalk.red(err.message));
      process.exitCode = 1;
      return;
    }
  }

  // First show recommendation evaluation
  try {
    const rec = await router.recommend(capabilityName, workspaceRoot);
    UIFormatter.printRecommendationCard(rec);

    const providerToRun = options.provider || rec.recommendedProvider.providerId;
    const providerName = options.provider ? options.provider.toUpperCase() : rec.recommendedProvider.providerName;

    const runSpinner = ora(`Executing ${providerName} for capability "${capabilityName}"...`).start();

    const outcome = await router.execute({
      capabilityId: capabilityName,
      providerOverride: options.provider,
      dryRun: options.dryRun,
      verbose: options.verbose,
      writeToRoot: options.writeToRoot,
      workspaceRoot,
    });

    if (outcome.executionResult?.success) {
      runSpinner.succeed(chalk.green(`Successfully executed ${providerName}!`));

      console.log(`\n${chalk.bold('Execution Summary:')} ${outcome.executionResult.summary}`);

      if (outcome.executionResult.generatedArtifacts.length > 0) {
        console.log(chalk.bold('\nGenerated Artifacts:'));
        outcome.executionResult.generatedArtifacts.forEach((art) => {
          console.log(`  📄 ${chalk.cyan(art.name)} - ${chalk.dim(art.summary)}`);
        });
      }

      if (outcome.executionResult.nextRecommendedCapability) {
        console.log(
          `\n💡 ${chalk.yellow('Next Recommended Step:')} ` +
          chalk.bold.hex('#F59E0B')(`forge ${outcome.executionResult.nextRecommendedCapability.replace(/^forge\./, '')}`)
        );
      }
    } else {
      runSpinner.warn(chalk.yellow('Execution finished with warnings.'));
    }

    if (outcome.warnings.length > 0) {
      console.log(chalk.yellow('\nWarnings:'));
      outcome.warnings.forEach((w) => console.log(`  ⚠️  ${chalk.dim(w)}`));
    }
  } catch (err: any) {
    console.error(chalk.red(`\n❌ Error: ${err.message}`));
    process.exitCode = 1;
  }
}
