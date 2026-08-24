/**
 * Forge SDLC - Capability Router
 * Core routing mechanism resolving generic capability requests to optimal provider adapters.
 */

import { getCapabilityById, CAPABILITY_CATALOG } from '../catalog/capabilities.js';
import { ProviderRegistry } from '../providers/registry.js';
import { ScoringEngine } from '../scoring/engine.js';
import { ContextManager } from './context.js';
import { ArtifactManager } from './artifacts.js';
import { QualityGateEngine } from './quality-gates.js';
import { CapabilityRecommendation, WorkflowRecommendation } from '../types/scoring.js';
import { ProviderExecutionResult } from '../types/provider.js';
import { ProjectContext } from '../types/context.js';

export interface RouteExecutionOptions {
  capabilityId: string;
  providerOverride?: string;
  dryRun?: boolean;
  verbose?: boolean;
  writeToRoot?: boolean;
  inputParams?: Record<string, unknown>;
  workspaceRoot?: string;
  runId?: string;
  iteration?: number;
}

export interface RouteExecutionOutcome {
  capabilityId: string;
  capabilityName: string;
  group: string;
  recommendation: CapabilityRecommendation;
  selectedProviderId: string;
  isOverride: boolean;
  executionResult?: ProviderExecutionResult;
  gatePassed: boolean;
  warnings: string[];
}

export class CapabilityRouter {
  private registry: ProviderRegistry;
  private scoringEngine: ScoringEngine;

  constructor() {
    this.registry = ProviderRegistry.getInstance();
    this.scoringEngine = new ScoringEngine();
  }

  /**
   * Recommend the optimal provider for a single capability
   */
  public async recommend(
    capabilityId: string,
    workspaceRoot: string = process.cwd()
  ): Promise<CapabilityRecommendation> {
    const manifest = getCapabilityById(capabilityId);
    if (!manifest) {
      throw new Error(`Unknown capability: "${capabilityId}". Run "forge matrix" to see all valid capabilities.`);
    }

    const context = await ContextManager.analyzeWorkspace(workspaceRoot);
    return this.scoringEngine.evaluateCapability(manifest, context);
  }

  /**
   * Recommend end-to-end SDLC workflow provider mappings for the project
   */
  public async recommendProjectWorkflow(
    workspaceRoot: string = process.cwd()
  ): Promise<WorkflowRecommendation> {
    const context = await ContextManager.analyzeWorkspace(workspaceRoot);
    const defaultPipeline = [
      'discover',
      'specify',
      'clarify',
      'architecture',
      'plan',
      'tasks',
      'analyze',
      'implement',
      'test',
      'review',
      'security',
      'converge',
      'release',
    ];

    const stages: WorkflowRecommendation['stages'] = [];

    for (const capName of defaultPipeline) {
      const manifest = getCapabilityById(capName);
      if (manifest) {
        const rec = this.scoringEngine.evaluateCapability(manifest, context);
        stages.push({
          capabilityId: manifest.id,
          capabilityName: manifest.displayName,
          group: manifest.group,
          recommendedProvider: rec.recommendedProvider.providerId,
          providerName: rec.recommendedProvider.providerName,
          score: rec.recommendedProvider.totalScore,
          reason: rec.recommendedProvider.whyExplanation[0] || 'Optimal capability match',
        });
      }
    }

    return {
      projectName: context.projectName,
      projectType: context.projectType,
      stages,
      overallStrategy:
        'BMAD provides specialized architecture, elicitation, and multi-lens review; Spec Kit provides strict specification, planning, task decomposition, and convergence discipline; Forge Internal ensures rock-solid security invariants and test automation.',
    };
  }

  /**
   * Route and execute a capability
   */
  public async execute(options: RouteExecutionOptions): Promise<RouteExecutionOutcome> {
    const workspace = options.workspaceRoot || process.cwd();
    const manifest = getCapabilityById(options.capabilityId);

    if (!manifest) {
      throw new Error(`Capability "${options.capabilityId}" is not recognized.`);
    }

    const context = await ContextManager.analyzeWorkspace(workspace);
    const artifactManager = new ArtifactManager(workspace);
    const artifacts = artifactManager.loadArtifacts();

    // 1. Evaluate scoring & recommendation
    const recommendation = this.scoringEngine.evaluateCapability(manifest, context);

    // 2. Determine provider (Override or Recommended)
    let selectedProviderId = recommendation.recommendedProvider.providerId;
    let isOverride = false;

    if (options.providerOverride) {
      selectedProviderId = options.providerOverride.toLowerCase();
      isOverride = true;
    }

    const providerAdapter = this.registry.get(selectedProviderId);
    if (!providerAdapter) {
      throw new Error(
        `Provider "${selectedProviderId}" is not registered. Available providers: ${this.registry.getAll().map((p) => p.metadata.id).join(', ')}`
      );
    }

    // 3. Pre-execution Quality Gate Check
    const preCheck = QualityGateEngine.checkPrerequisites(manifest, artifacts);

    // 4. Execution (or dry-run)
    let executionResult: ProviderExecutionResult | undefined = undefined;

    if (!options.dryRun) {
      executionResult = await providerAdapter.execute({
        capabilityId: manifest.id,
        inputParams: options.inputParams || {},
        projectContext: context,
        artifacts,
        dryRun: options.dryRun,
        verbose: options.verbose,
      });

      // 5. Post-execution validation & artifact saving
      const postCheck = QualityGateEngine.validateStageOutput(executionResult, manifest);

      if (executionResult.generatedArtifacts.length > 0) {
        await artifactManager.saveArtifacts(executionResult.generatedArtifacts, {
          providerId: selectedProviderId,
          runId: options.runId,
          iteration: options.iteration,
          writeToRoot: options.writeToRoot,
        });
      }

      return {
        capabilityId: manifest.id,
        capabilityName: manifest.name,
        group: manifest.group,
        recommendation,
        selectedProviderId,
        isOverride,
        executionResult,
        gatePassed: postCheck.passed,
        warnings: [...preCheck.warnings, ...postCheck.warnings],
      };
    }

    return {
      capabilityId: manifest.id,
      capabilityName: manifest.name,
      group: manifest.group,
      recommendation,
      selectedProviderId,
      isOverride,
      gatePassed: preCheck.passed,
      warnings: preCheck.warnings,
    };
  }
}
