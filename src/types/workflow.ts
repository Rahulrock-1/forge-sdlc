/**
 * Forge SDLC - Workflow Types
 */

import { ProviderExecutionResult } from './provider.js';

export interface WorkflowStageDefinition {
  id: string;                      // e.g. "discover", "specify", "architecture"
  capabilityId: string;            // e.g. "forge.discover"
  name: string;
  description: string;
  preferredProvider?: string;     // Override or undefined to use recommender
  requiredInputs: string[];        // e.g. ["spec.md"]
  expectedOutputs: string[];       // e.g. ["architecture.md"]
  qualityGate?: string;            // Gate rule id
  optional?: boolean;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  stages: WorkflowStageDefinition[];
}

export interface WorkflowStageExecution {
  stageId: string;
  capabilityId: string;
  providerId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  result?: ProviderExecutionResult;
  error?: string;
  startedAt?: string;
  completedAt?: string;
  gatePassed?: boolean;
  gateMessages?: string[];
}

export interface WorkflowExecutionState {
  workflowId: string;
  projectName: string;
  startedAt: string;
  completedAt?: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  stages: WorkflowStageExecution[];
  currentStageIndex: number;
  runId?: string;
  runDir?: string;
  iteration?: number;
  iterationDir?: string;
  functionality?: string;
  functionalityDir?: string;
}
