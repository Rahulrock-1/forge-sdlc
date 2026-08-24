/**
 * Forge SDLC - UI & Terminal Formatter
 */

import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table3';
import { CapabilityRecommendation, WorkflowRecommendation, ProviderScoreResult } from '../../types/scoring.js';
import { MatrixRow } from '../../catalog/matrix.js';
import { CapabilityManifest } from '../../types/capability.js';

export class UIFormatter {
  public static printBanner(): void {
    const banner = boxen(
      `${chalk.bold.hex('#F59E0B')('⚡ FORGE SDLC')}  ${chalk.dim('v1.0.0')}\n` +
      `${chalk.white('Universal Capability-Oriented SDLC Framework')}\n` +
      `${chalk.dim('Orchestrating BMAD • Spec Kit • Internal Providers')}`,
      {
        padding: { top: 0, bottom: 0, left: 2, right: 2 },
        margin: { top: 0, bottom: 1, left: 0, right: 0 },
        borderStyle: 'round',
        borderColor: '#F59E0B',
      }
    );
    console.log(banner);
  }

  public static printRecommendationCard(rec: CapabilityRecommendation): void {
    const top = rec.recommendedProvider;
    const topColor = top.providerId === 'bmad' ? '#3B82F6' : top.providerId === 'speckit' ? '#10B981' : '#8B5CF6';

    console.log(
      chalk.bold(`\n🎯 Capability Requested: `) +
      chalk.bold.cyan(rec.capabilityName) +
      chalk.dim(` (${rec.group.toUpperCase()})\n`)
    );

    console.log(chalk.bold('Available Providers & Scores:'));
    const table = new Table({
      head: [
        chalk.dim('Rank'),
        chalk.dim('Provider'),
        chalk.dim('Score'),
        chalk.dim('Specialization'),
        chalk.dim('Workflow Fit'),
        chalk.dim('Artifact Fit'),
      ],
      colAligns: ['center', 'left', 'center', 'center', 'center', 'center'],
      style: { head: [], border: [] },
    });

    rec.candidateScores.forEach((cand) => {
      const isTop = cand.rank === 1;
      const nameStr = isTop ? chalk.bold.green(`✓ ${cand.providerName}`) : cand.providerName;
      const scoreStr = isTop ? chalk.bold.green(`${cand.totalScore}/100`) : `${cand.totalScore}/100`;

      table.push([
        isTop ? chalk.bold.green(`#${cand.rank}`) : `#${cand.rank}`,
        nameStr,
        scoreStr,
        `${cand.factors.specialization}/100`,
        `${cand.factors.workflowFit}/100`,
        `${cand.factors.artifactFit}/100`,
      ]);
    });

    console.log(table.toString());

    // Highlighted Recommendation Box
    const whyList = top.whyExplanation.map((w) => `  • ${w}`).join('\n');
    let altBox = '';

    if (top.alternativeRecommendation) {
      altBox = `\n\n${chalk.yellow.bold('Alternative:')} ${top.alternativeRecommendation.providerName}\n${chalk.dim('Use alternative if:')}\n  • ${top.alternativeRecommendation.useCaseCondition}`;
    }

    const recBox = boxen(
      `${chalk.bold.hex(topColor)(`RECOMMENDED: ${top.providerName.toUpperCase()}`)}  ${chalk.bold.green(`(Score: ${top.totalScore}/100)`)}\n\n` +
      `${chalk.bold('Why:')}\n${whyList}${altBox}`,
      {
        padding: 1,
        borderStyle: 'round',
        borderColor: topColor,
      }
    );

    console.log(recBox);
  }

  public static printWorkflowRecommendation(workflowRec: WorkflowRecommendation): void {
    console.log(chalk.bold(`\n🧭 Project: `) + chalk.cyan.bold(workflowRec.projectName) + chalk.dim(` (${workflowRec.projectType})\n`));
    console.log(chalk.bold('Recommended SDLC Workflow Pipeline:'));

    const table = new Table({
      head: [
        chalk.dim('Stage'),
        chalk.dim('Capability'),
        chalk.dim('Recommended Provider'),
        chalk.dim('Score'),
        chalk.dim('Key Rationale'),
      ],
      style: { head: [], border: [] },
    });

    workflowRec.stages.forEach((st, idx) => {
      const pColor = st.recommendedProvider === 'bmad' ? chalk.blue : st.recommendedProvider === 'speckit' ? chalk.green : chalk.magenta;
      table.push([
        chalk.dim(`${idx + 1}.`),
        chalk.bold(st.capabilityName),
        pColor(`✓ ${st.providerName}`),
        chalk.bold(`${st.score}`),
        chalk.dim(st.reason.slice(0, 50) + (st.reason.length > 50 ? '...' : '')),
      ]);
    });

    console.log(table.toString());

    const strategyBox = boxen(
      `${chalk.bold.hex('#F59E0B')('Strategic Rationale:')}\n${chalk.white(workflowRec.overallStrategy)}`,
      {
        padding: 1,
        borderStyle: 'round',
        borderColor: '#F59E0B',
      }
    );

    console.log(strategyBox);
  }

  public static printMatrix(rows: MatrixRow[]): void {
    console.log(chalk.bold.cyan('\n📊 Universal Capability vs Provider Comparison Matrix\n'));

    const table = new Table({
      head: [
        chalk.dim('Capability'),
        chalk.dim('Group'),
        chalk.blue('BMAD'),
        chalk.green('Spec Kit'),
        chalk.magenta('Internal'),
        chalk.yellow('Initial Recommendation'),
      ],
      style: { head: [], border: [] },
    });

    rows.forEach((r) => {
      table.push([
        chalk.bold(r.capabilityName),
        chalk.dim(r.group),
        r.bmadSupport,
        r.speckitSupport,
        r.internalSupport,
        chalk.bold(r.initialRecommendation),
      ]);
    });

    console.log(table.toString());
  }

  public static printSkillsList(caps: CapabilityManifest[]): void {
    console.log(chalk.bold.cyan(`\n🛠️  Forge Generic Capability Catalog (${caps.length} Capabilities)\n`));

    const table = new Table({
      head: [
        chalk.dim('Command'),
        chalk.dim('SDLC Group'),
        chalk.dim('Description'),
        chalk.dim('Supported Providers'),
      ],
      style: { head: [], border: [] },
    });

    caps.forEach((c) => {
      const provs = c.providers.map((p) => {
        if (p.providerId === 'bmad') return chalk.blue('BMAD');
        if (p.providerId === 'speckit') return chalk.green('SpecKit');
        return chalk.magenta('Internal');
      }).join(', ');

      table.push([
        chalk.bold.hex('#F59E0B')(`forge ${c.name}`),
        chalk.dim(c.group),
        chalk.white(c.description.slice(0, 48) + (c.description.length > 48 ? '...' : '')),
        provs,
      ]);
    });

    console.log(table.toString());
  }
}
