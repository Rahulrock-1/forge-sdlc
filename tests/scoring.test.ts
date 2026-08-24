import { describe, it, expect } from 'vitest';
import { ScoringEngine, DEFAULT_SCORING_WEIGHTS } from '../src/scoring/engine.js';
import { getCapabilityById } from '../src/catalog/capabilities.js';
import { ProjectContext } from '../src/types/context.js';

describe('ScoringEngine', () => {
  const dummyContext: ProjectContext = {
    workspaceRoot: '/test/workspace',
    projectName: 'test-app',
    projectType: 'greenfield',
    techStack: {
      languages: ['TypeScript'],
      frameworks: ['Node.js'],
      buildTools: ['tsup'],
      hasTests: true,
      hasCiCd: false,
      hasDocker: false,
    },
    existingArtifacts: [],
    userPreferences: {},
  };

  it('should recommend BMAD for architecture capability', () => {
    const engine = new ScoringEngine();
    const manifest = getCapabilityById('architecture');
    expect(manifest).toBeDefined();

    const rec = engine.evaluateCapability(manifest!, dummyContext);
    expect(rec.recommendedProvider.providerId).toBe('bmad');
    expect(rec.recommendedProvider.totalScore).toBeGreaterThanOrEqual(85);
    expect(rec.candidateScores.length).toBeGreaterThanOrEqual(2);
    expect(rec.recommendedProvider.whyExplanation.length).toBeGreaterThan(0);
  });

  it('should recommend Spec Kit for specification capability', () => {
    const engine = new ScoringEngine();
    const manifest = getCapabilityById('specify');
    expect(manifest).toBeDefined();

    const rec = engine.evaluateCapability(manifest!, dummyContext);
    expect(rec.recommendedProvider.providerId).toBe('speckit');
    expect(rec.recommendedProvider.totalScore).toBeGreaterThanOrEqual(85);
  });

  it('should recommend BMAD for review capability', () => {
    const engine = new ScoringEngine();
    const manifest = getCapabilityById('review');
    expect(manifest).toBeDefined();

    const rec = engine.evaluateCapability(manifest!, dummyContext);
    expect(rec.recommendedProvider.providerId).toBe('bmad');
  });

  it('should recommend Spec Kit for tasks decomposition', () => {
    const engine = new ScoringEngine();
    const manifest = getCapabilityById('tasks');
    expect(manifest).toBeDefined();

    const rec = engine.evaluateCapability(manifest!, dummyContext);
    expect(rec.recommendedProvider.providerId).toBe('speckit');
  });

  it('should recommend Internal for security audit', () => {
    const engine = new ScoringEngine();
    const manifest = getCapabilityById('security');
    expect(manifest).toBeDefined();

    const rec = engine.evaluateCapability(manifest!, dummyContext);
    expect(rec.recommendedProvider.providerId).toBe('internal');
  });

  it('should respect user preferred provider overrides', () => {
    const customContext: ProjectContext = {
      ...dummyContext,
      userPreferences: {
        preferredProviders: {
          'forge.architecture': 'speckit',
        },
      },
    };

    const engine = new ScoringEngine();
    const manifest = getCapabilityById('architecture');
    const rec = engine.evaluateCapability(manifest!, customContext);
    const specCandidate = rec.candidateScores.find((c) => c.providerId === 'speckit');
    expect(specCandidate?.factors.userPreference).toBe(100);
  });
});
