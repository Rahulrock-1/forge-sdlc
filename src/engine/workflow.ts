/**
 * Forge SDLC - Sequential Workflow Engine
 */

import fs from 'node:fs';
import path from 'node:path';
import { CapabilityRouter } from './router.js';
import { ArtifactManager } from './artifacts.js';
import { WorkflowDefinition, WorkflowExecutionState, WorkflowStageExecution } from '../types/workflow.js';

export const DEFAULT_SDLC_WORKFLOW: WorkflowDefinition = {
  id: 'full-sdlc',
  name: 'Standard SDLC Pipeline',
  description: 'Full-lifecycle sequential SDLC workflow routing to best specialized providers',
  stages: [
    { id: 'discover', capabilityId: 'forge.discover', name: 'Discovery', description: 'Domain & Context Discovery', requiredInputs: [], expectedOutputs: ['discovery.md'] },
    { id: 'specify', capabilityId: 'forge.specify', name: 'Specification', description: 'Functional Specification (spec.md)', requiredInputs: [], expectedOutputs: ['spec.md'] },
    { id: 'clarify', capabilityId: 'forge.clarify', name: 'Clarification', description: 'Ambiguity & Edge-case Elicitation', requiredInputs: ['spec.md'], expectedOutputs: ['clarifications.md'] },
    { id: 'architecture', capabilityId: 'forge.architecture', name: 'Architecture', description: 'Technical Architecture & C4 Design', requiredInputs: ['spec.md'], expectedOutputs: ['architecture.md'] },
    { id: 'plan', capabilityId: 'forge.plan', name: 'Planning', description: 'Technical Execution Plan (plan.md)', requiredInputs: ['spec.md', 'architecture.md'], expectedOutputs: ['plan.md'] },
    { id: 'tasks', capabilityId: 'forge.task-decomposition', name: 'Task Decomposition', description: 'Atomic Developer Tasks (tasks.md)', requiredInputs: ['plan.md'], expectedOutputs: ['tasks.md'] },
    { id: 'analyze', capabilityId: 'forge.analyze', name: 'Cross-Artifact Analysis', description: 'Consistency & Drift Audit', requiredInputs: ['spec.md', 'tasks.md'], expectedOutputs: ['analysis.md'] },
    { id: 'implement', capabilityId: 'forge.implement', name: 'Implementation', description: 'Agentic Code Implementation', requiredInputs: ['tasks.md'], expectedOutputs: ['implementation.md'] },
    { id: 'test', capabilityId: 'forge.test', name: 'Testing', description: 'Automated Test Suite Synthesis', requiredInputs: [], expectedOutputs: ['test-report.md'] },
    { id: 'review', capabilityId: 'forge.review', name: 'Multi-Lens Review', description: '5-Perspective Code & Architecture Review', requiredInputs: [], expectedOutputs: ['review.md'] },
    { id: 'security', capabilityId: 'forge.security-review', name: 'Security Audit', description: 'OWASP & STRIDE Threat Verification', requiredInputs: [], expectedOutputs: ['security-audit.md'] },
    { id: 'converge', capabilityId: 'forge.converge', name: 'Convergence', description: 'Burndown Checklist & Release Readiness', requiredInputs: ['tasks.md'], expectedOutputs: ['convergence.md'] },
    { id: 'release', capabilityId: 'forge.release', name: 'Release Packaging', description: 'KeepAChangelog & Release Notes', requiredInputs: [], expectedOutputs: ['CHANGELOG.md', 'RELEASE_NOTES.md'] },
  ],
};

export class WorkflowEngine {
  private router: CapabilityRouter;
  private artifactManager: ArtifactManager;
  private workspaceRoot: string;

  constructor(workspaceRoot: string = process.cwd()) {
    this.router = new CapabilityRouter();
    this.artifactManager = new ArtifactManager(workspaceRoot);
    this.workspaceRoot = path.resolve(workspaceRoot);
  }

  public getAvailableWorkflows(): WorkflowDefinition[] {
    return [
      DEFAULT_SDLC_WORKFLOW,
      {
        id: 'fast-design',
        name: 'Fast Design Pipeline',
        description: 'Rapid specification and architecture for early spikes',
        stages: DEFAULT_SDLC_WORKFLOW.stages.slice(0, 5),
      },
      {
        id: 'verification-gate',
        name: 'Verification & Quality Gate',
        description: 'Comprehensive testing, multi-lens review, security audit, and convergence',
        stages: DEFAULT_SDLC_WORKFLOW.stages.filter((s) =>
          ['test', 'review', 'security', 'converge'].includes(s.id)
        ),
      },
    ];
  }

  /**
   * Run a workflow definition step-by-step with dedicated iteration folders (.forge/iterations/iteration-N/)
   * and separated run logs (.forge/runs/run-...)
   */
  public async executeWorkflow(
    workflow: WorkflowDefinition,
    onStageProgress?: (stage: WorkflowStageExecution, index: number, total: number) => void,
    options?: { iteration?: number }
  ): Promise<WorkflowExecutionState> {
    const iteration = options?.iteration ?? this.artifactManager.getNextIterationNumber();
    const runTimestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const runId = `run-${runTimestamp}-${workflow.id}`;
    const runDir = path.join(this.workspaceRoot, '.forge', 'runs', runId);
    const iterationDir = path.join(this.workspaceRoot, '.forge', 'iterations', `iteration-${iteration}`);

    const state: WorkflowExecutionState = {
      workflowId: workflow.id,
      projectName: path.basename(this.workspaceRoot),
      startedAt: new Date().toISOString(),
      status: 'running',
      stages: [],
      currentStageIndex: 0,
      runId,
      runDir,
      iteration,
      iterationDir,
    };

    for (let i = 0; i < workflow.stages.length; i++) {
      const stageDef = workflow.stages[i];
      state.currentStageIndex = i;

      const stageExec: WorkflowStageExecution = {
        stageId: stageDef.id,
        capabilityId: stageDef.capabilityId,
        providerId: stageDef.preferredProvider || 'auto',
        status: 'running',
        startedAt: new Date().toISOString(),
      };

      state.stages.push(stageExec);
      if (onStageProgress) onStageProgress(stageExec, i, workflow.stages.length);

      try {
        const outcome = await this.router.execute({
          capabilityId: stageDef.capabilityId,
          providerOverride: stageDef.preferredProvider,
          workspaceRoot: this.workspaceRoot,
          runId,
          iteration,
        });

        stageExec.providerId = outcome.selectedProviderId;
        stageExec.result = outcome.executionResult;
        stageExec.status = outcome.executionResult?.success ? 'completed' : 'failed';
        stageExec.gatePassed = outcome.gatePassed;
        stageExec.completedAt = new Date().toISOString();
      } catch (err: any) {
        stageExec.status = 'failed';
        stageExec.error = err.message || String(err);
        state.status = 'failed';
        if (onStageProgress) onStageProgress(stageExec, i, workflow.stages.length);
        break;
      }

      if (onStageProgress) onStageProgress(stageExec, i, workflow.stages.length);
    }

    if (state.status === 'running') {
      state.status = 'completed';
    }
    state.completedAt = new Date().toISOString();

    // Save state to active .forge, iteration folder, and run snapshot
    this.saveWorkflowState(state);
    return state;
  }

  private saveWorkflowState(state: WorkflowExecutionState): void {
    const forgeDir = path.join(this.workspaceRoot, '.forge');
    if (!fs.existsSync(forgeDir)) {
      fs.mkdirSync(forgeDir, { recursive: true });
    }

    const stateJson = JSON.stringify(state, null, 2);

    // 1. Save global active state
    fs.writeFileSync(
      path.join(forgeDir, 'workflow-state.json'),
      stateJson,
      'utf-8'
    );

    // 2. Save inside full iteration directory (.forge/iterations/iteration-N/workflow-state.json)
    if (state.iterationDir) {
      if (!fs.existsSync(state.iterationDir)) {
        fs.mkdirSync(state.iterationDir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(state.iterationDir, 'workflow-state.json'),
        stateJson,
        'utf-8'
      );
    }

    // 3. Save inside separated run directory (.forge/runs/run-.../workflow-state.json)
    if (state.runDir) {
      if (!fs.existsSync(state.runDir)) {
        fs.mkdirSync(state.runDir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(state.runDir, 'workflow-state.json'),
        stateJson,
        'utf-8'
      );
    }
  }
}

