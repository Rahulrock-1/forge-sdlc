import { describe, it, expect } from 'vitest';
import { ForgeMcpServer } from '../src/mcp/server.js';

describe('ForgeMcpServer', () => {
  it('should handle initialize request and report tools and capabilities', async () => {
    const server = new ForgeMcpServer();
    const initResponse = await server.processRequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
    });

    expect(initResponse.result.serverInfo.name).toBe('forge-sdlc');
    expect(initResponse.result.capabilities.tools).toBeDefined();
  });

  it('should list all exposed SDLC tools in tools/list', async () => {
    const server = new ForgeMcpServer();
    const listResponse = await server.processRequest({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
    });

    const toolNames = listResponse.result.tools.map((t: any) => t.name);
    expect(toolNames).toContain('forge_execute_capability');
    expect(toolNames).toContain('forge_recommend_provider');
    expect(toolNames).toContain('forge_get_status');
    expect(toolNames).toContain('forge_run_workflow');
    expect(toolNames).toContain('forge_list_capabilities');
  });

  it('should execute tool calls via tools/call', async () => {
    const server = new ForgeMcpServer();
    const callResponse = await server.processRequest({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'forge_recommend_provider',
        arguments: { capability: 'architecture' },
      },
    });

    expect(callResponse.result.content[0].text).toContain('BMAD');
  });

  it('should return error for unknown method', async () => {
    const server = new ForgeMcpServer();
    const errorResponse = await server.processRequest({
      jsonrpc: '2.0',
      id: 4,
      method: 'unknown/method',
    });

    expect(errorResponse.error?.code).toBe(-32601);
  });
});
