/**
 * Forge SDLC - Capability Matrix & Cross-Provider Comparison
 */

import { CAPABILITY_CATALOG } from './capabilities.js';

export interface MatrixRow {
  capabilityId: string;
  capabilityName: string;
  group: string;
  bmadSupport: string;
  bmadScore: number;
  speckitSupport: string;
  speckitScore: number;
  internalSupport: string;
  internalScore: number;
  initialRecommendation: string;
  recommendationReason: string;
}

export function generateCapabilityMatrix(): MatrixRow[] {
  return CAPABILITY_CATALOG.map((cap) => {
    const bmadBinding = cap.providers.find((p) => p.providerId === 'bmad');
    const speckitBinding = cap.providers.find((p) => p.providerId === 'speckit');
    const internalBinding = cap.providers.find((p) => p.providerId === 'internal');

    const bmadScore = bmadBinding ? bmadBinding.specializationScore : 0;
    const speckitScore = speckitBinding ? speckitBinding.specializationScore : 0;
    const internalScore = internalBinding ? internalBinding.specializationScore : 0;

    let recommendation = 'Internal';
    let reason = 'Forge built-in capability';

    if (cap.name === 'constitution') {
      recommendation = 'Spec Kit';
      reason = 'First-class constitution & invariant enforcement';
    } else if (cap.name === 'specify' || cap.name === 'requirements') {
      recommendation = 'Spec Kit';
      reason = 'Industry-leading SDD format & Given-When-Then criteria';
    } else if (cap.name === 'clarify') {
      recommendation = 'BMAD / Spec Kit';
      reason = 'BMAD for deep elicitation / Spec Kit for structured clarification';
    } else if (cap.name === 'brainstorm' || cap.name === 'discover') {
      recommendation = 'BMAD';
      reason = 'Deep domain modeling and multi-perspective exploration';
    } else if (cap.name === 'architecture' || cap.name === 'system-design' || cap.name === 'data-model' || cap.name === 'api-design') {
      recommendation = 'BMAD';
      reason = 'Specialized architecture reasoning & C4/ERD modeling workflows';
    } else if (cap.name === 'plan') {
      recommendation = 'Spec Kit';
      reason = 'Tight SDD coupling and milestone contracts';
    } else if (cap.name === 'tasks') {
      recommendation = 'Spec Kit';
      reason = 'Atomic task decomposition with test assertions';
    } else if (cap.name === 'analyze') {
      recommendation = 'Spec Kit';
      reason = 'Pioneering cross-artifact drift and gap analysis';
    } else if (cap.name === 'implement') {
      recommendation = 'BMAD / Spec Kit';
      reason = 'BMAD for complex patterns / Spec Kit for atomic TDD tasks';
    } else if (cap.name === 'review') {
      recommendation = 'BMAD';
      reason = 'Gold-standard multi-lens review (bmad-review)';
    } else if (cap.name === 'security' || cap.name === 'security-design') {
      recommendation = 'Internal / BMAD';
      reason = 'STRIDE threat modeling & automated SAST checks';
    } else if (cap.name === 'checklist') {
      recommendation = 'Spec Kit';
      reason = 'Native quality checklist methodology';
    } else if (cap.name === 'converge') {
      recommendation = 'Spec Kit';
      reason = 'Systematic task burndown and readiness certification';
    } else if (cap.name === 'release' || cap.name === 'deploy' || cap.name === 'rollback' || cap.name === 'test') {
      recommendation = 'Internal';
      reason = 'Built-in deterministic CI/CD and test automation';
    } else {
      if (bmadScore >= speckitScore && bmadScore >= internalScore && bmadScore > 0) {
        recommendation = 'BMAD';
        reason = 'Highest specialization score';
      } else if (speckitScore >= bmadScore && speckitScore >= internalScore && speckitScore > 0) {
        recommendation = 'Spec Kit';
        reason = 'Highest specialization score';
      } else {
        recommendation = 'Internal';
        reason = 'Built-in standard provider';
      }
    }

    return {
      capabilityId: cap.id,
      capabilityName: cap.name,
      group: cap.group,
      bmadSupport: bmadBinding ? `✅ (${bmadScore})` : '—',
      bmadScore,
      speckitSupport: speckitBinding ? `✅ (${speckitScore})` : '—',
      speckitScore,
      internalSupport: internalBinding ? `✅ (${internalScore})` : '—',
      internalScore,
      initialRecommendation: recommendation,
      recommendationReason: reason,
    };
  });
}
