/**
 * Forge SDLC - Artifact Manager & Pipeline
 * Manages active artifacts, functionality-grouped folders (.forge/functionalities/<feature>/),
 * historical versioning, and run snapshots.
 */

import fs from 'node:fs';
import path from 'node:path';
import { ArtifactFile, ArtifactMap } from '../types/artifact.js';
import { ExecutionArtifact } from '../types/provider.js';

export interface SaveArtifactOptions {
  providerId: string;
  functionality?: string;
  runId?: string;
  iteration?: number;
  writeToRoot?: boolean;
}

export interface RunManifest {
  runId: string;
  functionality?: string;
  iteration?: number;
  timestamp: string;
  updatedAt: string;
  artifactCount: number;
  artifacts: Array<{
    name: string;
    path: string;
    summary: string;
    authorProvider: string;
    sizeBytes: number;
  }>;
}

export class ArtifactManager {
  private workspaceRoot: string;
  private forgeDir: string;
  private artifactsDir: string;
  private functionalitiesDir: string;
  private iterationsDir: string;
  private historyDir: string;
  private runsDir: string;

  constructor(workspaceRoot: string = process.cwd()) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.forgeDir = path.join(this.workspaceRoot, '.forge');
    this.artifactsDir = path.join(this.forgeDir, 'artifacts');
    this.functionalitiesDir = path.join(this.forgeDir, 'functionalities');
    this.iterationsDir = path.join(this.forgeDir, 'iterations');
    this.historyDir = path.join(this.artifactsDir, 'history');
    this.runsDir = path.join(this.forgeDir, 'runs');
  }

  public ensureArtifactsDir(): void {
    if (!fs.existsSync(this.artifactsDir)) {
      fs.mkdirSync(this.artifactsDir, { recursive: true });
    }
    if (!fs.existsSync(this.functionalitiesDir)) {
      fs.mkdirSync(this.functionalitiesDir, { recursive: true });
    }
    if (!fs.existsSync(this.iterationsDir)) {
      fs.mkdirSync(this.iterationsDir, { recursive: true });
    }
    if (!fs.existsSync(this.historyDir)) {
      fs.mkdirSync(this.historyDir, { recursive: true });
    }
    if (!fs.existsSync(this.runsDir)) {
      fs.mkdirSync(this.runsDir, { recursive: true });
    }
  }

  /**
   * Get the next available iteration number (e.g. 1 if none, 2 if iteration-1 exists, etc.)
   */
  public getNextIterationNumber(): number {
    this.ensureArtifactsDir();
    if (!fs.existsSync(this.iterationsDir)) return 1;

    const entries = fs.readdirSync(this.iterationsDir);
    let max = 0;
    for (const entry of entries) {
      const match = entry.match(/^iteration-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > max) max = num;
      }
    }
    return max + 1;
  }

  /**
   * Get the latest active iteration number
   */
  public getCurrentIterationNumber(): number {
    this.ensureArtifactsDir();
    if (!fs.existsSync(this.iterationsDir)) return 1;

    const entries = fs.readdirSync(this.iterationsDir);
    let max = 0;
    for (const entry of entries) {
      const match = entry.match(/^iteration-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > max) max = num;
      }
    }
    return max > 0 ? max : 1;
  }

  /**
   * Save execution artifacts to:
   * 1. Active directory: .forge/artifacts/<name>
   * 2. Functionality folder: .forge/functionalities/<functionality>/<name>
   * 3. Full Iteration folder: .forge/iterations/iteration-<N>/<name>
   * 4. Run folder: .forge/runs/<runId>/<name>
   * 5. Version history: .forge/artifacts/history/<name>.v<version>.md (if modified)
   */
  public async saveArtifacts(
    artifacts: ExecutionArtifact[],
    providerOrOptions: string | SaveArtifactOptions,
    writeToRootFlag: boolean = false
  ): Promise<ArtifactFile[]> {
    this.ensureArtifactsDir();

    const options: SaveArtifactOptions =
      typeof providerOrOptions === 'string'
        ? { providerId: providerOrOptions, writeToRoot: writeToRootFlag }
        : providerOrOptions;

    const providerId = options.providerId;
    const functionality = options.functionality || 'core';
    const iteration = options.iteration ?? this.getCurrentIterationNumber();
    const runId =
      options.runId ||
      `run-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`;
    const writeToRoot = options.writeToRoot ?? false;

    // 1. Prepare Functionality folder (.forge/functionalities/<functionality>/)
    const functionalityDir = path.join(this.functionalitiesDir, functionality);
    if (!fs.existsSync(functionalityDir)) {
      fs.mkdirSync(functionalityDir, { recursive: true });
    }

    // 2. Prepare full iteration folder (.forge/iterations/iteration-<N>/)
    const iterationDir = path.join(this.iterationsDir, `iteration-${iteration}`);
    if (!fs.existsSync(iterationDir)) {
      fs.mkdirSync(iterationDir, { recursive: true });
    }

    // 3. Prepare run directory (.forge/runs/<runId>/)
    const runDir = path.join(this.runsDir, runId);
    if (!fs.existsSync(runDir)) {
      fs.mkdirSync(runDir, { recursive: true });
    }

    const saved: ArtifactFile[] = [];

    // Helper to update manifest
    const updateManifestFile = (targetDir: string, id: string) => {
      const mPath = path.join(targetDir, 'manifest.json');
      let manifest: RunManifest = {
        runId: id,
        functionality,
        iteration,
        timestamp: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        artifactCount: 0,
        artifacts: [],
      };

      if (fs.existsSync(mPath)) {
        try {
          manifest = JSON.parse(fs.readFileSync(mPath, 'utf-8'));
          manifest.updatedAt = new Date().toISOString();
          manifest.functionality = functionality;
        } catch {
          // Fallback
        }
      }

      for (const art of artifacts) {
        const artPath = path.join(targetDir, art.name);
        const existingIdx = manifest.artifacts.findIndex((a) => a.name === art.name);
        const artEntry = {
          name: art.name,
          path: path.relative(this.workspaceRoot, artPath),
          summary: art.summary || `${art.name} for ${functionality} (iteration ${iteration})`,
          authorProvider: providerId,
          sizeBytes: Buffer.byteLength(art.content, 'utf-8'),
        };

        if (existingIdx >= 0) {
          manifest.artifacts[existingIdx] = artEntry;
        } else {
          manifest.artifacts.push(artEntry);
        }
      }

      manifest.artifactCount = manifest.artifacts.length;
      fs.writeFileSync(mPath, JSON.stringify(manifest, null, 2), 'utf-8');
    };

    for (const art of artifacts) {
      const activeArtPath = path.join(this.artifactsDir, art.name);
      let version = 1;

      // 4. Check if previous active artifact exists and was modified -> archive previous version
      if (fs.existsSync(activeArtPath)) {
        try {
          const oldContent = fs.readFileSync(activeArtPath, 'utf-8');
          if (oldContent.trim() !== art.content.trim()) {
            const baseName = art.name.replace(/\.[^/.]+$/, '');
            const ext = path.extname(art.name) || '.md';

            const existingVersions = fs
              .readdirSync(this.historyDir)
              .filter((f) => f.startsWith(`${baseName}.v`) && f.endsWith(ext));

            version = existingVersions.length + 1;
            const historyPath = path.join(this.historyDir, `${baseName}.v${version}${ext}`);
            fs.writeFileSync(historyPath, oldContent, 'utf-8');
          }
        } catch {
          // Ignore archive read error
        }
      }

      // 5. Write active artifact to .forge/artifacts/<name>
      fs.writeFileSync(activeArtPath, art.content, 'utf-8');

      // 6. Write into Functionality folder (.forge/functionalities/<functionality>/<name>)
      const funcArtPath = path.join(functionalityDir, art.name);
      fs.writeFileSync(funcArtPath, art.content, 'utf-8');

      // 7. Write full agent document into .forge/iterations/iteration-<N>/<name>
      const iterArtPath = path.join(iterationDir, art.name);
      fs.writeFileSync(iterArtPath, art.content, 'utf-8');

      // 8. Write into .forge/runs/<runId>/<name>
      const runArtPath = path.join(runDir, art.name);
      fs.writeFileSync(runArtPath, art.content, 'utf-8');

      // 9. Write to project root if requested
      if (writeToRoot) {
        const rootPath = path.join(this.workspaceRoot, art.name);
        fs.writeFileSync(rootPath, art.content, 'utf-8');
      }

      saved.push({
        id: art.name.replace(/\.[^/.]+$/, ''),
        filename: art.name,
        path: activeArtPath,
        title: art.summary,
        group: 'artifacts',
        stage: 'completed',
        version,
        lastUpdated: new Date().toISOString(),
        content: art.content,
        authorProvider: providerId,
      });
    }

    // Update manifests in functionality folder, iteration folder, and run directory
    updateManifestFile(functionalityDir, `func-${functionality}`);
    updateManifestFile(iterationDir, `iteration-${iteration}`);
    updateManifestFile(runDir, runId);

    return saved;
  }

  /**
   * List all functionality folders in .forge/functionalities/
   */
  public listFunctionalities(): Array<{
    name: string;
    path: string;
    artifactCount: number;
    manifest?: RunManifest;
  }> {
    this.ensureArtifactsDir();
    if (!fs.existsSync(this.functionalitiesDir)) return [];

    const entries = fs.readdirSync(this.functionalitiesDir, { withFileTypes: true });
    const functionalities: Array<{
      name: string;
      path: string;
      artifactCount: number;
      manifest?: RunManifest;
    }> = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const funcPath = path.join(this.functionalitiesDir, entry.name);
        const manifestFile = path.join(funcPath, 'manifest.json');
        let manifest: RunManifest | undefined = undefined;
        let artifactCount = 0;

        if (fs.existsSync(manifestFile)) {
          try {
            manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
            artifactCount = manifest?.artifacts?.length || 0;
          } catch {
            // Ignore
          }
        }

        if (artifactCount === 0) {
          artifactCount = fs.readdirSync(funcPath).filter((f) => f.endsWith('.md')).length;
        }

        functionalities.push({
          name: entry.name,
          path: funcPath,
          artifactCount,
          manifest,
        });
      }
    }

    return functionalities.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * List all full iteration folders in .forge/iterations/
   */
  public listIterations(): Array<{
    iteration: number;
    name: string;
    path: string;
    artifactCount: number;
    manifest?: RunManifest;
  }> {
    this.ensureArtifactsDir();
    if (!fs.existsSync(this.iterationsDir)) return [];

    const entries = fs.readdirSync(this.iterationsDir, { withFileTypes: true });
    const iterations: Array<{
      iteration: number;
      name: string;
      path: string;
      artifactCount: number;
      manifest?: RunManifest;
    }> = [];

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith('iteration-')) {
        const iterNum = parseInt(entry.name.replace('iteration-', ''), 10) || 1;
        const iterPath = path.join(this.iterationsDir, entry.name);
        const manifestFile = path.join(iterPath, 'manifest.json');
        let manifest: RunManifest | undefined = undefined;
        let artifactCount = 0;

        if (fs.existsSync(manifestFile)) {
          try {
            manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
            artifactCount = manifest?.artifacts?.length || 0;
          } catch {
            // Ignore parse error
          }
        }

        if (artifactCount === 0) {
          artifactCount = fs.readdirSync(iterPath).filter((f) => f.endsWith('.md')).length;
        }

        iterations.push({
          iteration: iterNum,
          name: entry.name,
          path: iterPath,
          artifactCount,
          manifest,
        });
      }
    }

    return iterations.sort((a, b) => a.iteration - b.iteration);
  }

  /**
   * Load all existing artifacts from .forge/artifacts and project root
   */
  public loadArtifacts(): ArtifactMap {
    const map: ArtifactMap = {};
    const locations = [this.artifactsDir, this.workspaceRoot];

    for (const loc of locations) {
      if (fs.existsSync(loc)) {
        const files = fs.readdirSync(loc);
        for (const file of files) {
          if (file.endsWith('.md') && !map[file]) {
            const fullPath = path.join(loc, file);
            try {
              const stat = fs.statSync(fullPath);
              if (stat.isFile()) {
                const content = fs.readFileSync(fullPath, 'utf-8');
                const id = file.replace(/\.md$/, '');
                map[id] = {
                  id,
                  filename: file,
                  path: fullPath,
                  title: file,
                  group: 'artifacts',
                  stage: 'existing',
                  version: 1,
                  lastUpdated: stat.mtime.toISOString(),
                  content,
                };
              }
            } catch {
              // Ignore read errors
            }
          }
        }
      }
    }

    return map;
  }

  public getArtifact(nameOrId: string): ArtifactFile | undefined {
    const map = this.loadArtifacts();
    const cleanId = nameOrId.replace(/\.md$/, '').toLowerCase();
    return map[cleanId] || map[nameOrId];
  }

  /**
   * List all historical separated runs in .forge/runs/
   */
  public listRuns(): Array<{ runId: string; path: string; manifest?: RunManifest }> {
    this.ensureArtifactsDir();
    if (!fs.existsSync(this.runsDir)) return [];

    const entries = fs.readdirSync(this.runsDir, { withFileTypes: true });
    const runs: Array<{ runId: string; path: string; manifest?: RunManifest }> = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const runPath = path.join(this.runsDir, entry.name);
        const manifestFile = path.join(runPath, 'manifest.json');
        let manifest: RunManifest | undefined = undefined;
        if (fs.existsSync(manifestFile)) {
          try {
            manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
          } catch {
            // Ignore parse errors
          }
        }
        runs.push({
          runId: entry.name,
          path: runPath,
          manifest,
        });
      }
    }

    return runs.sort((a, b) => b.runId.localeCompare(a.runId));
  }

  /**
   * Get version history for a specific artifact from .forge/artifacts/history/
   */
  public getArtifactHistory(artifactName: string): Array<{ version: string; filename: string; path: string }> {
    this.ensureArtifactsDir();
    if (!fs.existsSync(this.historyDir)) return [];

    const baseName = artifactName.replace(/\.[^/.]+$/, '');
    const files = fs.readdirSync(this.historyDir);
    const history: Array<{ version: string; filename: string; path: string }> = [];

    for (const file of files) {
      if (file.startsWith(`${baseName}.v`)) {
        history.push({
          version: file.replace(`${baseName}.v`, '').replace(/\.md$/, ''),
          filename: file,
          path: path.join(this.historyDir, file),
        });
      }
    }

    return history;
  }
}

