import { describe, it, expect } from 'vitest';
import { WorkflowEngine } from '../src/engine/workflow.js';
import { AgentIntegrator } from '../src/engine/agents.js';

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
});

