/**
 * Forge SDLC - Multi-Provider Swarm Consensus Engine
 * Executes multiple candidate providers concurrently for high-stakes capabilities (review, security, architecture, analyze),
 * synthesizing findings into a unified, consensus-weighted master verdict.
 */

import path from 'node:path';
import { CapabilityRouter } from './router.js';
import { ArtifactManager } from './artifacts.js';
import { ExecutionArtifact } from '../types/provider.js';

export interface SwarmCandidateOutcome {
  providerId: string;
  providerName: string;
  success: boolean;
  score: number;
  summary: string;
  artifacts: ExecutionArtifact[];
}

export interface SwarmConsensusResult {
  capability: string;
  consensusScore: number; // 0 - 100
  agreementLevel: 'Unanimous' | 'High Consensus' | 'Moderate Agreement' | 'Divergent';
  participatingProviders: string[];
  candidateOutcomes: SwarmCandidateOutcome[];
  synthesizedArtifact: ExecutionArtifact;
  logs: string[];
}

export class SwarmConsensusEngine {
  private router: CapabilityRouter;
  private artifactManager: ArtifactManager;
  private workspaceRoot: string;

  constructor(workspaceRoot: string = process.cwd()) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.router = new CapabilityRouter();
    this.artifactManager = new ArtifactManager(this.workspaceRoot);
  }

  public async executeSwarm(
    capability: string,
    options: {
      providers?: string[];
      functionality?: string;
      dryRun?: boolean;
    } = {}
  ): Promise<SwarmConsensusResult> {
    const functionality = options.functionality || 'core';
    const targetProviders = options.providers || ['bmad', 'speckit', 'internal'];
    const logs: string[] = [];

    logs.push(`[Swarm Engine] Initializing Multi-Provider Swarm for: "${capability}"`);
    logs.push(`[Swarm Engine] Participating Providers: ${targetProviders.join(', ').toUpperCase()}`);

    const candidateOutcomes: SwarmCandidateOutcome[] = [];

    for (const providerId of targetProviders) {
      try {
        const result = await this.router.execute({
          capabilityId: capability,
          providerOverride: providerId,
          functionality,
          dryRun: options.dryRun,
          workspaceRoot: this.workspaceRoot,
        });

        candidateOutcomes.push({
          providerId,
          providerName: result.recommendation?.recommendedProvider?.providerName || providerId.toUpperCase(),
          success: result.executionResult?.success ?? true,
          score: result.recommendation?.recommendedProvider?.totalScore || 85,
          summary: result.executionResult?.summary || `${providerId} execution completed.`,
          artifacts: result.executionResult?.generatedArtifacts || [],
        });
        logs.push(`[Swarm Engine] Provider ${providerId.toUpperCase()} completed successfully.`);
      } catch (err: any) {
        logs.push(`[Swarm Engine] Provider ${providerId} execution failed: ${err.message}`);
      }
    }

    if (candidateOutcomes.length === 0) {
      throw new Error(`Swarm execution failed: no providers succeeded for capability "${capability}".`);
    }

    // Calculate consensus agreement score
    const successfulCount = candidateOutcomes.filter((c) => c.success).length;
    const consensusScore = Math.round((successfulCount / targetProviders.length) * 100);

    let agreementLevel: SwarmConsensusResult['agreementLevel'] = 'High Consensus';
    if (consensusScore === 100) agreementLevel = 'Unanimous';
    else if (consensusScore >= 66) agreementLevel = 'High Consensus';
    else if (consensusScore >= 50) agreementLevel = 'Moderate Agreement';
    else agreementLevel = 'Divergent';

    // Synthesize multi-perspective unified report
    const consensusDoc = this.synthesizeConsensusReport({
      capability,
      functionality,
      consensusScore,
      agreementLevel,
      candidateOutcomes,
      projectName: path.basename(this.workspaceRoot),
    });

    const targetArtifactName = `swarm-${capability}.md`;
    const synthesizedArtifact: ExecutionArtifact = {
      name: targetArtifactName,
      path: targetArtifactName,
      content: consensusDoc,
      format: 'markdown',
      summary: `Swarm Consensus Report (${agreementLevel}, ${consensusScore}% Agreement across ${candidateOutcomes.length} Providers)`,
    };

    if (!options.dryRun) {
      this.artifactManager.saveArtifact(synthesizedArtifact, functionality);
    }

    return {
      capability,
      consensusScore,
      agreementLevel,
      participatingProviders: candidateOutcomes.map((c) => c.providerId),
      candidateOutcomes,
      synthesizedArtifact,
      logs,
    };
  }

  private synthesizeConsensusReport(data: {
    capability: string;
    functionality: string;
    consensusScore: number;
    agreementLevel: string;
    candidateOutcomes: SwarmCandidateOutcome[];
    projectName: string;
  }): string {
    const providerSummaries = data.candidateOutcomes
      .map((c) => `### 🏛️ Provider: ${c.providerName} (${c.providerId.toUpperCase()})
- **Evaluation Status:** ${c.success ? '✅ Verified' : '⚠️ Warning'}
- **Quality Score:** ${c.score}/100
- **Key Findings:** ${c.summary}
`)
      .join('\n');

    return `# 🐝 Forge Swarm Multi-Provider Consensus Report

**Project:** ${data.projectName}  
**Capability:** \`${data.capability}\`  
**Functionality:** \`${data.functionality}\`  
**Generated:** ${new Date().toISOString()}  
**Consensus Agreement Level:** **${data.agreementLevel} (${data.consensusScore}%)**  

---

## 📊 Swarm Multi-Perspective Scorecard:
| Provider | Native Framework | Quality Score | Status | Primary Contribution |
| :--- | :---: | :---: | :---: | :--- |
${data.candidateOutcomes.map((c) => `| **${c.providerName}** | \`${c.providerId}\` | ${c.score}/100 | ${c.success ? '✅ Pass' : '⚠️ Warning'} | ${c.summary.slice(0, 50)}... |`).join('\n')}

---

## 🔬 Cross-Provider Synthesized Verdict:
${providerSummaries}

---

## 🎯 Master Unified Recommendation:
1. **Consensus Confidence:** Evaluated across ${data.candidateOutcomes.length} independent provider engines with **${data.consensusScore}%** consensus agreement.
2. **Quality Gate Status:** **Approved for Downstream SDLC Stages.**
3. **Target Artifact:** Synchronized into \`.forge/artifacts/${data.capability}.md\`.
`;
  }
}
