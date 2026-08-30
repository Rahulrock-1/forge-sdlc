/**
 * Forge SDLC - Model Context Protocol (MCP) Server
 * Compatible with Cursor, Claude Desktop, Antigravity, Windsurf, and VS Code MCP.
 */

import readline from 'node:readline';
import fs from 'node:fs';
import path from 'node:path';
import { CapabilityRouter } from '../engine/router.js';
import { WorkflowEngine } from '../engine/workflow.js';
import { ArtifactManager } from '../engine/artifacts.js';
import { CAPABILITY_CATALOG } from '../catalog/capabilities.js';
import { JsonRpcRequest, JsonRpcResponse, McpTool, McpResource, McpPrompt } from './types.js';

export class ForgeMcpServer {
  private workspaceRoot: string;
  private router: CapabilityRouter;
  private workflowEngine: WorkflowEngine;
  private artifactManager: ArtifactManager;

  constructor(workspaceRoot: string = process.cwd()) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.router = new CapabilityRouter();
    this.workflowEngine = new WorkflowEngine(this.workspaceRoot);
    this.artifactManager = new ArtifactManager(this.workspaceRoot);
  }

  public getTools(): McpTool[] {
    return [
      {
        name: 'forge_execute_capability',
        description: 'Execute an SDLC capability (e.g. brainstorm, architecture, specify, implement, review, security) with intelligent provider routing.',
        inputSchema: {
          type: 'object',
          properties: {
            capability: {
              type: 'string',
              description: 'The name of the capability to run (e.g. brainstorm, architecture, specify, implement, review, test, security, converge)',
            },
            provider: {
              type: 'string',
              description: 'Optional provider override (bmad, speckit, internal)',
            },
            functionality: {
              type: 'string',
              description: 'Target functionality/feature folder (defaults to "core")',
            },
            dryRun: {
              type: 'boolean',
              description: 'If true, simulates execution without writing disk artifacts',
            },
          },
          required: ['capability'],
        },
      },
      {
        name: 'forge_recommend_provider',
        description: 'Analyze project context and recommend the optimal provider (BMAD, Spec Kit, Internal) for an SDLC capability with full explainability scoring.',
        inputSchema: {
          type: 'object',
          properties: {
            capability: {
              type: 'string',
              description: 'Capability name to evaluate',
            },
          },
          required: ['capability'],
        },
      },
      {
        name: 'forge_get_status',
        description: 'Inspect existing project artifacts in .forge/artifacts/ and .forge/functionalities/ with completion percentages.',
        inputSchema: {
          type: 'object',
          properties: {
            functionality: {
              type: 'string',
              description: 'Optional functionality module filter',
            },
          },
        },
      },
      {
        name: 'forge_run_workflow',
        description: 'Execute a multi-stage sequential SDLC workflow (full-sdlc, ideation-to-spec, verification-gate, fast-design).',
        inputSchema: {
          type: 'object',
          properties: {
            workflowId: {
              type: 'string',
              description: 'Workflow ID to run (defaults to "full-sdlc")',
            },
            functionality: {
              type: 'string',
              description: 'Target functionality folder',
            },
          },
        },
      },
      {
        name: 'forge_list_capabilities',
        description: 'List all available capabilities and their provider bindings in the Forge catalog.',
        inputSchema: {
          type: 'object',
          properties: {
            group: {
              type: 'string',
              description: 'Filter by SDLC group (discovery, specification, architecture, planning, implementation, verification, release)',
            },
          },
        },
      },
    ];
  }

  public getResources(): McpResource[] {
    const artifacts = this.artifactManager.listArtifacts();
    return artifacts.map((art) => ({
      uri: `forge://artifacts/${art.filename}`,
      name: art.filename,
      description: art.title || `Forge SDLC artifact: ${art.filename}`,
      mimeType: 'text/markdown',
    }));
  }

  public getPrompts(): McpPrompt[] {
    return [
      {
        name: 'forge_sdlc_master',
        description: 'Full 14-stage SDLC Master Orchestrator prompt with active project artifacts',
      },
      {
        name: 'forge_implement',
        description: 'Senior Staff implementation agent prompt with tasks.md, spec.md, and architecture.md context',
      },
      {
        name: 'forge_brainstorm',
        description: 'Lateral Ideation & Brainstorming agent prompt with problem space exploration',
      },
      {
        name: 'forge_review_5lens',
        description: '5-Lens Multi-Perspective Code Review prompt (Architecture, Quality, Security, Performance, Tests)',
      },
    ];
  }

  public async handleToolCall(name: string, args: any): Promise<any> {
    switch (name) {
      case 'forge_execute_capability': {
        const capability = args.capability;
        const providerOverride = args.provider;
        const functionality = args.functionality || 'core';
        const dryRun = args.dryRun ?? false;

        const outcome = await this.router.execute({
          capabilityId: capability,
          providerOverride,
          functionality,
          dryRun,
          workspaceRoot: this.workspaceRoot,
        });

        const artifactsSummary = outcome.executionResult?.generatedArtifacts
          .map((a) => `- **${a.name}**: ${a.summary}\n\n\`\`\`markdown\n${a.content.slice(0, 1500)}${a.content.length > 1500 ? '\n...[truncated]' : ''}\n\`\`\``)
          .join('\n\n') || 'No artifacts generated.';

        const providerDisplayName = outcome.recommendation?.recommendedProvider?.providerName || outcome.selectedProviderId;

        return {
          content: [
            {
              type: 'text',
              text: `### Forge SDLC Execution: ${outcome.capabilityName.toUpperCase()}
- **Selected Provider:** ${providerDisplayName} (${outcome.selectedProviderId})
- **Status:** ${outcome.executionResult?.success ? 'Success' : 'Failed'}
- **Summary:** ${outcome.executionResult?.summary || 'Execution completed.'}
- **Next Recommended Step:** \`forge ${outcome.executionResult?.nextRecommendedCapability?.replace(/^forge\./, '') || 'status'}\`

#### Generated Artifacts:
${artifactsSummary}`,
            },
          ],
        };
      }

      case 'forge_recommend_provider': {
        const capability = args.capability || 'architecture';
        const rec = await this.router.recommend(capability, this.workspaceRoot);
        const candidatesText = rec.candidateScores
          .map((p) => `- **${p.providerName}** (Score: ${p.totalScore}/100) — ${(p.whyExplanation && p.whyExplanation[0]) || ''}`)
          .join('\n');

        return {
          content: [
            {
              type: 'text',
              text: `### Provider Recommendation for: ${rec.capabilityName}
- **Recommended Provider:** **${rec.recommendedProvider.providerName}** (${rec.recommendedProvider.providerId})
- **Confidence Score:** ${rec.recommendedProvider.totalScore}/100
- **Explanation:** ${rec.reasoning}

#### Evaluated Candidates:
${candidatesText}`,
            },
          ],
        };
      }

      case 'forge_get_status': {
        const artifacts = this.artifactManager.listArtifacts(args.functionality);
        const functionalities = this.artifactManager.listFunctionalities();

        const artList = artifacts.length > 0
          ? artifacts.map((a) => `- [x] **${a.filename || a.id}** — *Updated ${a.lastUpdated || 'recently'}*`).join('\n')
          : 'No artifacts currently generated in .forge/artifacts/.';

        return {
          content: [
            {
              type: 'text',
              text: `### Forge SDLC Workspace Status (${path.basename(this.workspaceRoot)})
- **Active Functionality Modules:** ${functionalities.join(', ') || 'core'}
- **Total Synchronized Artifacts:** ${artifacts.length}

#### Artifacts:
${artList}`,
            },
          ],
        };
      }

      case 'forge_run_workflow': {
        const workflowId = args.workflowId || 'full-sdlc';
        const workflows = this.workflowEngine.getAvailableWorkflows();
        const targetWf = workflows.find((w) => w.id === workflowId) || workflows[0];

        const state = await this.workflowEngine.executeWorkflow(targetWf, undefined, {
          functionality: args.functionality || 'core',
        });

        const stageSummary = state.stages
          .map((s, idx) => `${idx + 1}. **${s.stageId}** (${s.providerId}) — ${s.status === 'completed' ? '✅ Completed' : '❌ Failed'}`)
          .join('\n');

        return {
          content: [
            {
              type: 'text',
              text: `### Workflow Execution: ${targetWf.name}
- **Run ID:** \`${state.runId}\`
- **Final Status:** ${state.status.toUpperCase()}
- **Stages Executed:** ${state.stages.length}

#### Stage Results:
${stageSummary}`,
            },
          ],
        };
      }

      case 'forge_list_capabilities': {
        let caps = CAPABILITY_CATALOG;
        if (args.group) {
          caps = caps.filter((c) => c.group.toLowerCase() === String(args.group).toLowerCase());
        }

        const listText = caps
          .map((c) => `- **${c.name}** (\`${c.displayName}\`): ${c.description} [Best: ${c.providers[0]?.providerName || 'Internal'}]`)
          .join('\n');

        return {
          content: [
            {
              type: 'text',
              text: `### Forge SDLC Catalog (${caps.length} Capabilities)\n\n${listText}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  public async processRequest(request: JsonRpcRequest): Promise<JsonRpcResponse> {
    const id = request.id;

    try {
      switch (request.method) {
        case 'initialize':
          return {
            jsonrpc: '2.0',
            id,
            result: {
              protocolVersion: '2024-11-05',
              serverInfo: {
                name: 'forge-sdlc',
                version: '1.4.0',
              },
              capabilities: {
                tools: {},
                resources: {},
                prompts: {},
              },
            },
          };

        case 'notifications/initialized':
        case 'initialized':
          return { jsonrpc: '2.0', id, result: {} };

        case 'ping':
          return { jsonrpc: '2.0', id, result: {} };

        case 'tools/list':
          return {
            jsonrpc: '2.0',
            id,
            result: {
              tools: this.getTools(),
            },
          };

        case 'tools/call': {
          const params = request.params || {};
          const toolResult = await this.handleToolCall(params.name, params.arguments || {});
          return {
            jsonrpc: '2.0',
            id,
            result: toolResult,
          };
        }

        case 'resources/list':
          return {
            jsonrpc: '2.0',
            id,
            result: {
              resources: this.getResources(),
            },
          };

        case 'resources/read': {
          const uri = request.params?.uri || '';
          const match = uri.match(/^forge:\/\/artifacts\/(.+)$/);
          if (!match) {
            return {
              jsonrpc: '2.0',
              id,
              error: { code: -32602, message: `Invalid resource URI: ${uri}` },
            };
          }
          const artifactName = match[1];
          const art = this.artifactManager.getArtifact(artifactName);
          if (!art) {
            return {
              jsonrpc: '2.0',
              id,
              error: { code: -32602, message: `Artifact not found: ${artifactName}` },
            };
          }
          return {
            jsonrpc: '2.0',
            id,
            result: {
              contents: [
                {
                  uri,
                  mimeType: 'text/markdown',
                  text: art.content,
                },
              ],
            },
          };
        }

        case 'prompts/list':
          return {
            jsonrpc: '2.0',
            id,
            result: {
              prompts: this.getPrompts(),
            },
          };

        default:
          return {
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: `Method not found: ${request.method}`,
            },
          };
      }
    } catch (err: any) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: err.message || String(err),
        },
      };
    }
  }

  /**
   * Start stdio JSON-RPC listener for MCP client connection
   */
  public startStdio(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    rl.on('line', async (line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      try {
        const request = JSON.parse(trimmed) as JsonRpcRequest;
        const response = await this.processRequest(request);
        // Only write response if request had an id (JSON-RPC notifications have no id)
        if (request.id !== undefined) {
          process.stdout.write(JSON.stringify(response) + '\n');
        }
      } catch (err: any) {
        const errorResponse: JsonRpcResponse = {
          jsonrpc: '2.0',
          error: {
            code: -32700,
            message: `Parse error: ${err.message}`,
          },
        };
        process.stdout.write(JSON.stringify(errorResponse) + '\n');
      }
    });
  }
}
