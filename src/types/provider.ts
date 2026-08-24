/**
 * Forge SDLC - Provider Types
 */

import { CapabilityManifest } from './capability.js';
import { ProjectContext } from './context.js';
import { ArtifactMap } from './artifact.js';

export interface ProviderMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  website?: string;
  repository?: string;
  supportedCapabilities: string[]; // List of forge.* capability IDs
  baseQuality: number;             // Default 0 - 100
  philosophy: string;
}

export interface ProviderExecutionContext {
  capabilityId: string;
  inputParams: Record<string, unknown>;
  projectContext: ProjectContext;
  artifacts: ArtifactMap;
  dryRun?: boolean;
  verbose?: boolean;
}

export interface ExecutionArtifact {
  name: string;
  path: string;
  content: string;
  format: 'markdown' | 'json' | 'yaml' | 'source_code';
  summary: string;
}

export interface ProviderExecutionResult {
  success: boolean;
  providerId: string;
  capabilityId: string;
  generatedArtifacts: ExecutionArtifact[];
  summary: string;
  logs: string[];
  metrics: {
    durationMs: number;
    tokensEstimated?: number;
    qualityPassed: boolean;
  };
  nextRecommendedCapability?: string;
  notes?: string[];
}

export interface ProviderHealthStatus {
  providerId: string;
  providerName: string;
  embeddedReady: boolean;
  nativeCliFound: boolean;
  nativeCliPath?: string;
  nativeCliVersion?: string;
  installCommand?: string;
  statusText: string;
}

export interface IProviderAdapter {
  metadata: ProviderMetadata;
  supports(capabilityId: string): boolean;
  evaluateFitness(capabilityId: string, context: ProjectContext): number;
  execute(context: ProviderExecutionContext): Promise<ProviderExecutionResult>;
  validateOutput(result: ProviderExecutionResult, manifest: CapabilityManifest): Promise<{ valid: boolean; errors: string[] }>;
  checkHealth(): Promise<ProviderHealthStatus>;
}

