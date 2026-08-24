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

  it('should create dedicated iteration folder and archive modified versions', async () => {
    const manager = new ArtifactManager();
    const iterNum = manager.getNextIterationNumber();

    // 1. First iteration
    await manager.saveArtifacts(
      [
        { name: 'test-spec.md', path: 'test-spec.md', content: '# Initial Spec v1', format: 'markdown' },
        { name: 'test-arch.md', path: 'test-arch.md', content: '# Initial Arch v1', format: 'markdown' },
      ],
      { providerId: 'speckit', iteration: iterNum }
    );

    const iterDir = path.join(process.cwd(), '.forge', 'iterations', `iteration-${iterNum}`);
    expect(fs.existsSync(path.join(iterDir, 'test-spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(iterDir, 'test-arch.md'))).toBe(true);
    expect(fs.existsSync(path.join(iterDir, 'manifest.json'))).toBe(true);

    // 2. Next iteration with modification
    const nextIterNum = iterNum + 1;
    await manager.saveArtifacts(
      [
        { name: 'test-spec.md', path: 'test-spec.md', content: '# Modified Spec v2 with changes', format: 'markdown' },
      ],
      { providerId: 'speckit', iteration: nextIterNum }
    );

    const nextIterDir = path.join(process.cwd(), '.forge', 'iterations', `iteration-${nextIterNum}`);
    expect(fs.existsSync(path.join(nextIterDir, 'test-spec.md'))).toBe(true);

    // Check version archiving in history
    const history = manager.getArtifactHistory('test-spec.md');
    expect(history.length).toBeGreaterThanOrEqual(1);

    // Check listIterations
    const allIters = manager.listIterations();
    expect(allIters.some((i) => i.iteration === iterNum)).toBe(true);
    expect(allIters.some((i) => i.iteration === nextIterNum)).toBe(true);
  });

  it('should organize artifacts into dedicated functionality folders', async () => {
    const manager = new ArtifactManager();
    const testFunctionality = 'auth-module';

    await manager.saveArtifacts(
      [
        { name: 'spec.md', path: 'spec.md', content: '# Auth Spec', format: 'markdown' },
        { name: 'architecture.md', path: 'architecture.md', content: '# Auth Architecture', format: 'markdown' },
      ],
      { providerId: 'bmad', functionality: testFunctionality }
    );

    const funcDir = path.join(process.cwd(), '.forge', 'functionalities', testFunctionality);
    expect(fs.existsSync(path.join(funcDir, 'spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(funcDir, 'architecture.md'))).toBe(true);
    expect(fs.existsSync(path.join(funcDir, 'manifest.json'))).toBe(true);

    const funcs = manager.listFunctionalities();
    expect(funcs.some((f) => f.name === testFunctionality)).toBe(true);
  });
});




