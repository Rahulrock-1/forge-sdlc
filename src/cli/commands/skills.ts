/**
 * Forge SDLC - Skills & Capabilities Marketplace Command Handler
 */

import chalk from 'chalk';
import Table from 'cli-table3';
import { CAPABILITY_CATALOG } from '../../catalog/capabilities.js';
import { UIFormatter } from '../ui/formatter.js';
import { CapabilityRouter } from '../../engine/router.js';

export async function handleSkillsCommand(
  action: 'list' | 'search' | 'recommend' = 'list',
  query?: string,
  options: { workspace?: string } = {}
): Promise<void> {
  if (action === 'list' || !query) {
    UIFormatter.printSkillsList(CAPABILITY_CATALOG);
    return;
  }

  const q = query.toLowerCase().trim();

  if (action === 'search') {
    const matched = CAPABILITY_CATALOG.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );

    if (matched.length === 0) {
      console.log(chalk.yellow(`No capabilities found matching "${query}".`));
      return;
    }

    console.log(chalk.bold.cyan(`\n🔍 Search Results for "${query}":\n`));

    const table = new Table({
      head: [
        chalk.dim('Capability'),
        chalk.dim('Provider'),
        chalk.dim('Specialization Score'),
        chalk.dim('Best For'),
      ],
      style: { head: [], border: [] },
    });

    matched.forEach((c) => {
      c.providers.forEach((p) => {
        const pColor = p.providerId === 'bmad' ? chalk.blue : p.providerId === 'speckit' ? chalk.green : chalk.magenta;
        table.push([
          chalk.bold(`forge ${c.name}`),
          pColor(p.providerName),
          chalk.bold(`${p.specializationScore}/100`),
          chalk.dim(p.bestFor.join(', ')),
        ]);
      });
    });

    console.log(table.toString());
    return;
  }

  if (action === 'recommend') {
    const router = new CapabilityRouter();
    try {
      const rec = await router.recommend(query, options.workspace);
      UIFormatter.printRecommendationCard(rec);
    } catch (err: any) {
      console.error(chalk.red(`Error: ${err.message}`));
    }
  }
}
