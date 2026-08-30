import { describe, it, expect } from 'vitest';
import { AutoHealingEngine } from '../src/engine/healing.js';

describe('AutoHealingEngine', () => {
  it('should analyze alignment and generate a healing plan', () => {
    const engine = new AutoHealingEngine();
    const result = engine.analyzeAndHeal({ functionality: 'core' });

    expect(result.alignmentPercentage).toBeGreaterThanOrEqual(0);
    expect(result.alignmentPercentage).toBeLessThanOrEqual(100);
    expect(result.healingPlanMarkdown).toContain('Forge Cross-Artifact Auto-Healing');
  });

  it('should support dry-run analysis vs applied patches', () => {
    const engine = new AutoHealingEngine();
    const dryRunResult = engine.analyzeAndHeal({ applyPatches: false, functionality: 'test-heal' });
    expect(dryRunResult.autoApplied).toBe(false);
  });
});
