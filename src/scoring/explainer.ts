/**
 * Forge SDLC - Recommendation Explainability Engine ("Why" & Alternatives)
 */

import { CapabilityManifest, ProviderCapabilityBinding } from '../types/capability.js';
import { ProjectContext } from '../types/context.js';
import { ProviderScoreResult } from '../types/scoring.js';

export function generateWhyExplanation(
  manifest: CapabilityManifest,
  binding: ProviderCapabilityBinding,
  scoreResult: ProviderScoreResult,
  context: ProjectContext
): string[] {
  const points: string[] = [];

  // Primary specialization reason
  if (binding.specializationScore >= 95) {
    points.push(`Industry-leading specialization in ${manifest.displayName} (Specialization: ${binding.specializationScore}/100).`);
  } else if (binding.specializationScore >= 90) {
    points.push(`High domain specialization for ${manifest.displayName} workflows.`);
  }

  // Top strengths from binding
  if (binding.strengths && binding.strengths.length > 0) {
    binding.strengths.slice(0, 3).forEach((str) => {
      points.push(str);
    });
  }

  // Context compatibility
  if (context.existingArtifacts.length > 0) {
    points.push(`Compatible with existing project artifacts (${context.existingArtifacts.join(', ')}).`);
  }

  if (context.projectType === 'ai_system' && binding.providerId === 'bmad') {
    points.push('Optimized for AI/Agentic system topologies and deep reasoning models.');
  }

  return points;
}

export function generateAlternativeRecommendation(
  manifest: CapabilityManifest,
  secondBinding: ProviderCapabilityBinding,
  secondScoreResult: ProviderScoreResult
): { providerId: string; providerName: string; useCaseCondition: string } {
  let condition = 'You want an alternative perspective or faster turnaround.';

  if (manifest.group === 'architecture' && secondBinding.providerId === 'speckit') {
    condition = 'You want architecture tightly coupled to SDD artifacts and prefer Spec Kit\'s plan -> tasks pipeline.';
  } else if (manifest.group === 'planning' && secondBinding.providerId === 'bmad') {
    condition = 'You require multi-horizon risk mitigation and narrative architectural alignment.';
  } else if (manifest.group === 'specification' && secondBinding.providerId === 'bmad') {
    condition = 'You prefer conversational elicitation before finalizing the strict specification document.';
  } else if (manifest.group === 'verification' && secondBinding.providerId === 'internal') {
    condition = 'You want fast automated CI/CD checks without deep multi-lens review commentary.';
  } else if (secondBinding.bestFor && secondBinding.bestFor.length > 0) {
    condition = `You specifically need: ${secondBinding.bestFor.join(', ')}.`;
  }

  return {
    providerId: secondBinding.providerId,
    providerName: secondBinding.providerName,
    useCaseCondition: condition,
  };
}
