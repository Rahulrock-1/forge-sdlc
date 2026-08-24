/**
 * Forge SDLC - Artifact Types
 */

export interface ArtifactFile {
  id: string;              // e.g. "spec", "architecture", "plan", "tasks"
  filename: string;        // e.g. "spec.md", "architecture.md"
  path: string;            // Absolute or workspace relative path
  title: string;
  group: string;
  stage: string;
  version: number;
  lastUpdated: string;
  content: string;
  metadata?: Record<string, unknown>;
  authorProvider?: string;
  hash?: string;
}

export type ArtifactMap = Record<string, ArtifactFile>;

export interface ArtifactValidationRule {
  name: string;
  description: string;
  requiredSections?: string[];
  minWordCount?: number;
  mustReference?: string[]; // IDs of other artifacts that must be referenced
  validatorFn?: (content: string, allArtifacts: ArtifactMap) => { valid: boolean; message?: string };
}
