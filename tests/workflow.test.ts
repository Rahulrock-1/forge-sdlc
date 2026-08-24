import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { WorkflowEngine } from '../src/engine/workflow.js';
import { AgentIntegrator } from '../src/engine/agents.js';
import { ArtifactManager } from '../src/engine/artifacts.js';

describe('WorkflowEngine', () => {
  it('should list available standard workflows', () => {
    const engine = new WorkflowEngine();
    const workflows = engine.getAvailableWorkflows();
    expect(workflows.length).toBeGreaterThanOrEqual(3);
    expect(workflows.some((w) => w.id === 'full-sdlc')).toBe(true);
    expect(workflows.some((w) => w.id === 'fast-design')).toBe(true);
  });

  it('should install slash commands and full sdlc rules', () => {
    const res = AgentIntegrator.installSlashCommands();
    expect(res.cursorRulesCount).toBeGreaterThan(30);
    expect(res.claudeCommandsCount).toBeGreaterThan(30);
    expect(res.copilotConfigured).toBe(true);
    expect(res.geminiSkillConfigured).toBe(true);
  });

  it('should create separated run folder, iteration files, and archive modified versions', async () => {
    const manager = new ArtifactManager();
    const testRunId = `test-run-${Date.now()}`;

    // 1. First iteration
    await manager.saveArtifacts(
      [{ name: 'test-spec.md', path: 'test-spec.md', content: '# Initial Spec v1', format: 'markdown' }],
      { providerId: 'speckit', runId: testRunId, iteration: 1 }
    );

    const runDir = path.join(process.cwd(), '.forge', 'runs', testRunId);
    expect(fs.existsSync(path.join(runDir, 'test-spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(runDir, 'manifest.json'))).toBe(true);

    // 2. Second iteration with modification
    await manager.saveArtifacts(
      [{ name: 'test-spec.md', path: 'test-spec.md', content: '# Modified Spec v2 with new features', format: 'markdown' }],
      { providerId: 'speckit', runId: testRunId, iteration: 2 }
    );

    // Check version archiving in history
    const history = manager.getArtifactHistory('test-spec.md');
    expect(history.length).toBeGreaterThanOrEqual(1);

    // Check iteration files in separated run directory
    expect(fs.existsSync(path.join(runDir, 'iterations', 'iteration-2', 'test-spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(runDir, 'test-spec.iter2.md'))).toBe(true);
  });
});


