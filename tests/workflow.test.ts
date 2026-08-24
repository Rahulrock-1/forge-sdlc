import { describe, it, expect } from 'vitest';
import { WorkflowEngine } from '../src/engine/workflow.js';

describe('WorkflowEngine', () => {
  it('should list available standard workflows', () => {
    const engine = new WorkflowEngine();
    const workflows = engine.getAvailableWorkflows();
    expect(workflows.length).toBeGreaterThanOrEqual(3);
    expect(workflows.some((w) => w.id === 'full-sdlc')).toBe(true);
    expect(workflows.some((w) => w.id === 'fast-design')).toBe(true);
  });
});
