import { describe, it, expect } from 'vitest';
import { CapabilityRouter } from '../src/engine/router.js';

describe('CapabilityRouter', () => {
  it('should recommend providers for single capability and whole workflow', async () => {
    const router = new CapabilityRouter();

    const singleRec = await router.recommend('architecture');
    expect(singleRec.recommendedProvider.providerId).toBe('bmad');

    const workflowRec = await router.recommendProjectWorkflow();
    expect(workflowRec.stages.length).toBeGreaterThan(10);
    const archStage = workflowRec.stages.find((s) => s.capabilityId === 'forge.architecture');
    expect(archStage?.recommendedProvider).toBe('bmad');
    const specStage = workflowRec.stages.find((s) => s.capabilityId === 'forge.specify');
    expect(specStage?.recommendedProvider).toBe('speckit');
  });

  it('should execute dry-run without throwing', async () => {
    const router = new CapabilityRouter();
    const result = await router.execute({
      capabilityId: 'architecture',
      dryRun: true,
    });

    expect(result.capabilityName).toBe('architecture');
    expect(result.selectedProviderId).toBe('bmad');
    expect(result.isOverride).toBe(false);
  });

  it('should support provider overrides', async () => {
    const router = new CapabilityRouter();
    const result = await router.execute({
      capabilityId: 'architecture',
      providerOverride: 'internal',
      dryRun: true,
    });

    expect(result.selectedProviderId).toBe('internal');
    expect(result.isOverride).toBe(true);
  });

  it('should route implement capability across providers', async () => {
    const router = new CapabilityRouter();
    const bmadResult = await router.execute({
      capabilityId: 'implement',
      providerOverride: 'bmad',
      dryRun: true,
    });
    expect(bmadResult.selectedProviderId).toBe('bmad');
    expect(bmadResult.capabilityName).toBe('implement');

    const specResult = await router.execute({
      capabilityId: 'implement',
      providerOverride: 'speckit',
      dryRun: true,
    });
    expect(specResult.selectedProviderId).toBe('speckit');
    expect(specResult.capabilityName).toBe('implement');

    const internalResult = await router.execute({
      capabilityId: 'implement',
      providerOverride: 'internal',
      dryRun: true,
    });
    expect(internalResult.selectedProviderId).toBe('internal');
    expect(internalResult.capabilityName).toBe('implement');
  });

  it('should route brainstorm capability with BMAD as recommended provider and support internal execution', async () => {
    const router = new CapabilityRouter();
    const singleRec = await router.recommend('brainstorm');
    expect(singleRec.recommendedProvider.providerId).toBe('bmad');

    const bmadResult = await router.execute({
      capabilityId: 'brainstorm',
      providerOverride: 'bmad',
      dryRun: true,
    });
    expect(bmadResult.selectedProviderId).toBe('bmad');
    expect(bmadResult.capabilityName).toBe('brainstorm');

    const internalResult = await router.execute({
      capabilityId: 'brainstorm',
      providerOverride: 'internal',
      dryRun: true,
    });
    expect(internalResult.selectedProviderId).toBe('internal');
    expect(internalResult.capabilityName).toBe('brainstorm');
  });
});


