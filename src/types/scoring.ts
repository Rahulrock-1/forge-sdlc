/**
 * Forge SDLC - Scoring Types
 */

export interface ScoringFactors {
  capabilityMatch: number;   // 0 - 100
  specialization: number;    // 0 - 100
  workflowFit: number;       // 0 - 100
  artifactFit: number;       // 0 - 100
  projectContext: number;    // 0 - 100
  providerQuality: number;   // 0 - 100
  userPreference: number;    // 0 - 100
}

export interface ScoringWeights {
  capabilityMatch: number;   // default e.g. 0.25
  specialization: number;    // default e.g. 0.20
  workflowFit: number;       // default e.g. 0.15
  artifactFit: number;       // default e.g. 0.15
  projectContext: number;    // default e.g. 0.10
  providerQuality: number;   // default e.g. 0.10
  userPreference: number;    // default e.g. 0.05
}

export interface ProviderScoreResult {
  providerId: string;
  providerName: string;
  totalScore: number;         // 0 - 100 weighted
  factors: ScoringFactors;
  weights: ScoringWeights;
  rank: number;
  whyExplanation: string[];
  alternativeRecommendation?: {
    providerId: string;
    providerName: string;
    useCaseCondition: string;
  };
}

export interface CapabilityRecommendation {
  capabilityId: string;
  capabilityName: string;
  group: string;
  recommendedProvider: ProviderScoreResult;
  candidateScores: ProviderScoreResult[];
  reasoning: string;
  contextSummary: string;
}

export interface WorkflowRecommendation {
  projectName: string;
  projectType: string;
  stages: Array<{
    capabilityId: string;
    capabilityName: string;
    group: string;
    recommendedProvider: string;
    providerName: string;
    score: number;
    reason: string;
  }>;
  overallStrategy: string;
}
