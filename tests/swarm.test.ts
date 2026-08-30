import { describe, it, expect } from 'vitest';
import { SwarmConsensusEngine } from '../src/engine/swarm.js';

describe('SwarmConsensusEngine', () => {
  it('should execute multi-provider swarm and synthesize consensus', async () => {
    const engine = new SwarmConsensusEngine();
    const result = await engine.executeSwarm('review', {
      providers: ['bmad', 'speckit', 'internal'],
      dryRun: true,
    });

    expect(result.capability).toBe('review');
    expect(result.consensusScore).toBeGreaterThanOrEqual(50);
    expect(result.participatingProviders.length).toBeGreaterThanOrEqual(2);
    expect(result.synthesizedArtifact.name).toBe('swarm-review.md');
    expect(result.synthesizedArtifact.content).toContain('Swarm Multi-Provider Consensus Report');
  });
});
