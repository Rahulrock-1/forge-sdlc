/**
 * Forge SDLC - Capability Types
 */

export type SDLCGroup =
  | 'discovery'
  | 'specification'
  | 'architecture'
  | 'planning'
  | 'implementation'
  | 'verification'
  | 'delivery';

export interface CapabilityInputSpec {
  name: string;
  type: 'artifact' | 'codebase' | 'user_input' | 'configuration' | 'test_report';
  required: boolean;
  description: string;
  defaultArtifact?: string;
}

export interface CapabilityOutputSpec {
  name: string;
  type: 'artifact' | 'code' | 'report' | 'checklist' | 'deployment';
  artifactName?: string;
  description: string;
  format: 'markdown' | 'json' | 'yaml' | 'source_code';
}

export interface ProviderCapabilityBinding {
  providerId: string;
  providerName: string;
  nativeCapabilityId: string;
  specializationScore: number; // 0 - 100
  qualityScore: number;        // 0 - 100
  strengths: string[];
  weaknesses: string[];
  bestFor: string[];
  requiredArtifacts?: string[];
  producedArtifacts?: string[];
}

export interface CapabilityManifest {
  id: string; // e.g. "forge.architecture" or "architecture"
  name: string;
  displayName: string;
  group: SDLCGroup;
  description: string;
  version: string;
  inputs: CapabilityInputSpec[];
  outputs: CapabilityOutputSpec[];
  providers: ProviderCapabilityBinding[];
  tags: string[];
  order: number;
}
