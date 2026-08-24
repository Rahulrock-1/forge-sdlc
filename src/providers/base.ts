/**
 * Forge SDLC - Base Provider Adapter
 */

import {
  IProviderAdapter,
  ProviderMetadata,
  ProviderExecutionContext,
  ProviderExecutionResult,
} from '../types/provider.js';
import { CapabilityManifest } from '../types/capability.js';
import { ProjectContext } from '../types/context.js';

import { execSync } from 'node:child_process';
import { ProviderHealthStatus } from '../types/provider.js';

export abstract class BaseProvider implements IProviderAdapter {
  abstract metadata: ProviderMetadata;
  protected cliBinaryName?: string;
  protected cliInstallCommand?: string;

  public supports(capabilityId: string): boolean {
    const normalized = capabilityId.replace(/^forge\./, '').toLowerCase();
    return this.metadata.supportedCapabilities.some((cap) => {
      const normCap = cap.replace(/^forge\./, '').toLowerCase();
      return normCap === normalized || cap === capabilityId;
    });
  }

  public evaluateFitness(capabilityId: string, context: ProjectContext): number {
    if (!this.supports(capabilityId)) return 0;
    return this.metadata.baseQuality;
  }

  abstract execute(context: ProviderExecutionContext): Promise<ProviderExecutionResult>;

  public async checkHealth(): Promise<ProviderHealthStatus> {
    let nativeFound = false;
    let nativePath: string | undefined = undefined;

    if (this.cliBinaryName) {
      try {
        const cmd = process.platform === 'win32' ? `where ${this.cliBinaryName}` : `which ${this.cliBinaryName}`;
        const output = execSync(cmd, { stdio: ['pipe', 'pipe', 'ignore'], encoding: 'utf-8' });
        if (output && output.trim()) {
          nativeFound = true;
          nativePath = output.trim().split('\n')[0].trim();
        }
      } catch {
        nativeFound = false;
      }
    }

    return {
      providerId: this.metadata.id,
      providerName: this.metadata.name,
      embeddedReady: true, // Always ready via built-in engine
      nativeCliFound: nativeFound,
      nativeCliPath: nativePath,
      installCommand: this.cliInstallCommand,
      statusText: nativeFound
        ? `Built-in Ready + Native CLI detected (${nativePath})`
        : `Built-in Ready (Self-Contained in Forge)`,
    };
  }

  public async validateOutput(
    result: ProviderExecutionResult,
    manifest: CapabilityManifest
  ): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!result.success) {
      errors.push('Provider execution reported failure.');
      return { valid: false, errors };
    }

    // Check required artifact outputs
    for (const outputSpec of manifest.outputs) {
      if (outputSpec.type === 'artifact' && outputSpec.artifactName) {
        const found = result.generatedArtifacts.some((art) =>
          art.name.toLowerCase() === outputSpec.artifactName!.toLowerCase() ||
          art.path.toLowerCase().endsWith(outputSpec.artifactName!.toLowerCase())
        );

        if (!found) {
          errors.push(`Expected output artifact "${outputSpec.artifactName}" was not produced.`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

