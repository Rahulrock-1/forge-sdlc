import { LLMConfig } from './model.js';

export interface ProjectContext {
  workspaceRoot: string;
  projectName: string;
  projectType: 'greenfield' | 'brownfield' | 'refactor' | 'library' | 'monorepo' | 'ai_system' | 'web_app' | 'cli';
  techStack: {
    languages: string[];
    frameworks: string[];
    buildTools: string[];
    packageManager?: string;
    hasTests: boolean;
    hasCiCd: boolean;
    hasDocker: boolean;
  };
  existingArtifacts: string[]; // List of artifact IDs currently found on disk
  userPreferences: {
    preferredProviders?: Record<string, string>; // capabilityId -> providerId
    excludedProviders?: string[];
    strictQualityGates?: boolean;
    interactiveReview?: boolean;
    customWeights?: Partial<Record<string, number>>;
    llm?: LLMConfig;
  };
  gitInfo?: {
    isGitRepo: boolean;
    branch?: string;
    uncommittedChanges?: boolean;
  };
}

export interface ForgeConfig {
  version: string;
  projectName?: string;
  defaultWorkflow?: string[];
  llm?: LLMConfig;
  providers?: {
    enabled?: string[];
    custom?: Array<{
      id: string;
      name: string;
      modulePath: string;
    }>;
    overrides?: Record<string, string>; // capabilityId -> providerId
  };
  artifactsDir?: string;
  qualityGates?: {
    enforceStrictChecklists?: boolean;
    requireArtifactReview?: boolean;
    customGates?: Array<{
      stage: string;
      check: string;
    }>;
  };
  scoringWeights?: {
    capabilityMatch?: number;
    specialization?: number;
    workflowFit?: number;
    artifactFit?: number;
    projectContext?: number;
    providerQuality?: number;
    userPreference?: number;
  };
}

