/**
 * Forge SDLC - Quality Gates & Stage Validation Engine
 */

import { CapabilityManifest } from '../types/capability.js';
import { ArtifactMap } from '../types/artifact.js';
import { ProviderExecutionResult } from '../types/provider.js';

export interface GateCheckResult {
  passed: boolean;
  warnings: string[];
  errors: string[];
}

export class QualityGateEngine {
  /**
   * Check pre-execution prerequisites for a capability
   */
  public static checkPrerequisites(
    manifest: CapabilityManifest,
    artifacts: ArtifactMap
  ): GateCheckResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const requiredInputs = manifest.inputs.filter((i) => i.type === 'artifact' && i.required);

    for (const req of requiredInputs) {
      const defaultName = req.defaultArtifact || `${req.name}.md`;
      const baseId = defaultName.replace(/\.md$/, '').toLowerCase();

      const exists = Object.keys(artifacts).some(
        (key) => key.toLowerCase() === baseId || artifacts[key]?.filename.toLowerCase() === defaultName.toLowerCase()
      );

      if (!exists) {
        warnings.push(
          `Prerequisite artifact "${defaultName}" was not found. Execution will proceed with heuristic defaults.`
        );
      }
    }

    return {
      passed: errors.length === 0,
      warnings,
      errors,
    };
  }

  /**
   * Validate stage output against manifest specifications
   */
  public static validateStageOutput(
    result: ProviderExecutionResult,
    manifest: CapabilityManifest
  ): GateCheckResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!result.success) {
      errors.push(`Provider execution failed: ${result.summary}`);
      return { passed: false, warnings, errors };
    }

    // Verify each generated artifact has non-empty content
    for (const art of result.generatedArtifacts) {
      if (!art.content || art.content.trim().length < 50) {
        errors.push(`Artifact "${art.name}" content is suspiciously short or empty.`);
      }
    }

    // Check specific gates
    if (manifest.name === 'specify') {
      const specArt = result.generatedArtifacts.find((a) => a.name.includes('spec'));
      if (specArt && !specArt.content.includes('Given') && !specArt.content.includes('Scenario')) {
        warnings.push('Specification artifact does not explicitly contain Given-When-Then scenarios.');
      }
    }

    if (manifest.name === 'tasks') {
      const taskArt = result.generatedArtifacts.find((a) => a.name.includes('task'));
      if (taskArt && !taskArt.content.includes('- [')) {
        warnings.push('Tasks artifact does not contain markdown checkboxes.');
      }
    }

    return {
      passed: errors.length === 0,
      warnings,
      errors,
    };
  }
}
