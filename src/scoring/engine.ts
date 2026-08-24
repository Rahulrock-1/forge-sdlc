/**
 * Forge SDLC - Multi-Factor Scoring Engine
 */

import { CapabilityManifest, ProviderCapabilityBinding } from '../types/capability.js';
import { ProjectContext } from '../types/context.js';
import { ScoringFactors, ScoringWeights, ProviderScoreResult, CapabilityRecommendation } from '../types/scoring.js';
import { generateWhyExplanation, generateAlternativeRecommendation } from './explainer.js';

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  capabilityMatch: 0.25,
  specialization: 0.25,
  workflowFit: 0.15,
  artifactFit: 0.15,
  projectContext: 0.10,
  providerQuality: 0.05,
  userPreference: 0.05,
};

export class ScoringEngine {
  private weights: ScoringWeights;

  constructor(customWeights?: Partial<ScoringWeights>) {
    this.weights = { ...DEFAULT_SCORING_WEIGHTS, ...(customWeights || {}) };
    this.normalizeWeights();
  }

  private normalizeWeights(): void {
    const total =
      this.weights.capabilityMatch +
      this.weights.specialization +
      this.weights.workflowFit +
      this.weights.artifactFit +
      this.weights.projectContext +
      this.weights.providerQuality +
      this.weights.userPreference;

    if (total > 0 && Math.abs(total - 1.0) > 0.001) {
      this.weights.capabilityMatch /= total;
      this.weights.specialization /= total;
      this.weights.workflowFit /= total;
      this.weights.artifactFit /= total;
      this.weights.projectContext /= total;
      this.weights.providerQuality /= total;
      this.weights.userPreference /= total;
    }
  }

  /**
   * Score all candidate providers for a given capability manifest and project context
   */
  public evaluateCapability(
    manifest: CapabilityManifest,
    context: ProjectContext
  ): CapabilityRecommendation {
    const candidateScores: ProviderScoreResult[] = manifest.providers.map((binding) => {
      const factors = this.computeFactors(manifest, binding, context);
      const totalScore = Math.round(
        factors.capabilityMatch * this.weights.capabilityMatch +
        factors.specialization * this.weights.specialization +
        factors.workflowFit * this.weights.workflowFit +
        factors.artifactFit * this.weights.artifactFit +
        factors.projectContext * this.weights.projectContext +
        factors.providerQuality * this.weights.providerQuality +
        factors.userPreference * this.weights.userPreference
      );

      return {
        providerId: binding.providerId,
        providerName: binding.providerName,
        totalScore,
        factors,
        weights: this.weights,
        rank: 0, // Assigned after sorting
        whyExplanation: [],
      };
    });

    // Sort descending by total score
    candidateScores.sort((a, b) => b.totalScore - a.totalScore);

    // Assign ranks and generate explainability
    candidateScores.forEach((cand, idx) => {
      cand.rank = idx + 1;
      const binding = manifest.providers.find((p) => p.providerId === cand.providerId)!;
      cand.whyExplanation = generateWhyExplanation(manifest, binding, cand, context);
    });

    const topCandidate = candidateScores[0];
    const secondCandidate = candidateScores[1];

    if (topCandidate && secondCandidate) {
      const secondBinding = manifest.providers.find((p) => p.providerId === secondCandidate.providerId)!;
      topCandidate.alternativeRecommendation = generateAlternativeRecommendation(
        manifest,
        secondBinding,
        secondCandidate
      );
    }

    const reasoning = topCandidate.whyExplanation.join(' ');

    return {
      capabilityId: manifest.id,
      capabilityName: manifest.name,
      group: manifest.group,
      recommendedProvider: topCandidate,
      candidateScores,
      reasoning,
      contextSummary: `Project "${context.projectName}" (${context.projectType}) with ${context.existingArtifacts.length} active artifacts`,
    };
  }

  /**
   * Compute the 7 scoring factors (0 - 100 each)
   */
  private computeFactors(
    manifest: CapabilityManifest,
    binding: ProviderCapabilityBinding,
    context: ProjectContext
  ): ScoringFactors {
    // 1. Capability Match (100 if binding exists, adjusted for direct native capability)
    const capabilityMatch = binding.nativeCapabilityId.includes(manifest.name) ? 100 : 90;

    // 2. Specialization Score (From manifest provider binding)
    const specialization = binding.specializationScore;

    // 3. Workflow Fit (How well it integrates with surrounding SDLC pipeline)
    let workflowFit = 85;
    if (manifest.group === 'architecture' && binding.providerId === 'bmad') {
      workflowFit = 95; // BMAD architecture fits cleanly before Spec Kit planning
    } else if (manifest.group === 'specification' && binding.providerId === 'speckit') {
      workflowFit = 98; // Spec Kit is the gold standard specification pipeline
    } else if (manifest.group === 'planning' && binding.providerId === 'speckit') {
      workflowFit = 95; // Spec Kit plan/tasks pipeline seamlessly leads to execution
    } else if (manifest.group === 'delivery' && binding.providerId === 'speckit' && manifest.name === 'converge') {
      workflowFit = 98; // Spec Kit converge finishes tasks.md
    } else if (manifest.group === 'verification' && binding.providerId === 'bmad' && manifest.name === 'review') {
      workflowFit = 96; // BMAD multi-lens review provides comprehensive verification
    }

    // 4. Artifact Fit (Checks if required input artifacts exist on disk)
    let artifactFit = 80;
    const requiredArtifactNames = manifest.inputs
      .filter((i) => i.type === 'artifact' && i.required)
      .map((i) => i.defaultArtifact || `${i.name}.md`);

    const hasAllRequired = requiredArtifactNames.every((art) =>
      context.existingArtifacts.some((existing) => existing.toLowerCase().includes(art.toLowerCase()))
    );

    if (hasAllRequired) {
      artifactFit = 95;
    } else if (requiredArtifactNames.length === 0) {
      artifactFit = 90;
    } else {
      artifactFit = 75; // Missing prior artifacts
    }

    // 5. Project Context Fit
    let projectContext = 85;
    if (context.projectType === 'ai_system' && binding.providerId === 'bmad') {
      projectContext = 98; // BMAD excels at AI/Agentic systems
    } else if (context.projectType === 'greenfield' && manifest.group === 'discovery' && binding.providerId === 'bmad') {
      projectContext = 95;
    } else if (context.projectType === 'refactor' && manifest.name === 'refactor' && binding.providerId === 'bmad') {
      projectContext = 94;
    } else if (context.techStack.hasTests && manifest.group === 'verification' && binding.providerId === 'internal') {
      projectContext = 92;
    }

    // 6. Provider Base Quality Score
    const providerQuality = binding.qualityScore || 85;

    // 7. User Preference
    let userPreference = 80;
    const preferredProvider = context.userPreferences.preferredProviders?.[manifest.id] ||
                              context.userPreferences.preferredProviders?.[manifest.name];

    if (preferredProvider === binding.providerId) {
      userPreference = 100;
    } else if (context.userPreferences.excludedProviders?.includes(binding.providerId)) {
      userPreference = 0;
    }

    return {
      capabilityMatch,
      specialization,
      workflowFit,
      artifactFit,
      projectContext,
      providerQuality,
      userPreference,
    };
  }
}
