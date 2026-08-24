/**
 * Forge SDLC - Artifact Manager & Pipeline
 * Manages active artifacts, historical versioning, separated run directories, and multi-iteration tracking.
 */

import fs from 'node:fs';
import path from 'node:path';
import { ArtifactFile, ArtifactMap } from '../types/artifact.js';
import { ExecutionArtifact } from '../types/provider.js';

export interface SaveArtifactOptions {
  providerId: string;
  runId?: string;
  iteration?: number;
  writeToRoot?: boolean;
}

export interface RunManifest {
  runId: string;
  timestamp: string;
  updatedAt: string;
  iterationCount: number;
  artifacts: Array<{
    name: string;
    path: string;
    summary: string;
    authorProvider: string;
    iteration?: number;
    sizeBytes: number;
  }>;
}

export class ArtifactManager {
  private workspaceRoot: string;
  private forgeDir: string;
  private artifactsDir: string;
  private historyDir: string;
  private runsDir: string;

  constructor(workspaceRoot: string = process.cwd()) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.forgeDir = path.join(this.workspaceRoot, '.forge');
    this.artifactsDir = path.join(this.forgeDir, 'artifacts');
    this.historyDir = path.join(this.artifactsDir, 'history');
    this.runsDir = path.join(this.forgeDir, 'runs');
  }

  public ensureArtifactsDir(): void {
    if (!fs.existsSync(this.artifactsDir)) {
      fs.mkdirSync(this.artifactsDir, { recursive: true });
    }
    if (!fs.existsSync(this.historyDir)) {
      fs.mkdirSync(this.historyDir, { recursive: true });
    }
    if (!fs.existsSync(this.runsDir)) {
      fs.mkdirSync(this.runsDir, { recursive: true });
    }
  }

  /**
   * Save execution artifacts to .forge/artifacts, historical versions if modified,
   * dedicated run-separated folder (.forge/runs/<runId>/), and root if configured.
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
    const runId =
      options.runId ||
      `run-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`;
    const iteration = options.iteration ?? 1;
    const writeToRoot = options.writeToRoot ?? false;

    // 1. Prepare separated run directory
    const runDir = path.join(this.runsDir, runId);
    if (!fs.existsSync(runDir)) {
      fs.mkdirSync(runDir, { recursive: true });
    }

    const runIterationsDir = path.join(runDir, 'iterations', `iteration-${iteration}`);
    if (!fs.existsSync(runIterationsDir)) {
      fs.mkdirSync(runIterationsDir, { recursive: true });
    }

    const saved: ArtifactFile[] = [];

    // Load or initialize run manifest
    const manifestPath = path.join(runDir, 'manifest.json');
    let manifest: RunManifest = {
      runId,
      timestamp: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      iterationCount: iteration,
      artifacts: [],
    };

    if (fs.existsSync(manifestPath)) {
      try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        manifest.iterationCount = Math.max(manifest.iterationCount, iteration);
        manifest.updatedAt = new Date().toISOString();
      } catch {
        // Fallback
      }
    }

    for (const art of artifacts) {
      const activeArtPath = path.join(this.artifactsDir, art.name);
      let version = 1;

      // 2. Check if previous active artifact exists and was modified -> archive previous version
      if (fs.existsSync(activeArtPath)) {
        try {
          const oldContent = fs.readFileSync(activeArtPath, 'utf-8');
          if (oldContent.trim() !== art.content.trim()) {
            const baseName = art.name.replace(/\.[^/.]+$/, '');
            const ext = path.extname(art.name) || '.md';

            // Count existing history versions
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

      // 3. Write active artifact to .forge/artifacts/<name>
      fs.writeFileSync(activeArtPath, art.content, 'utf-8');

      // 4. Write separated run artifact into .forge/runs/<runId>/<name>
      const runArtPath = path.join(runDir, art.name);
      fs.writeFileSync(runArtPath, art.content, 'utf-8');

      // 5. Write separated iteration artifact into .forge/runs/<runId>/iterations/iteration-<N>/<name>
      const iterArtPath = path.join(runIterationsDir, art.name);
      fs.writeFileSync(iterArtPath, art.content, 'utf-8');

      // 6. Also write separated iteration file if modified in run (e.g. spec.iter2.md)
      if (iteration > 1) {
        const baseName = art.name.replace(/\.[^/.]+$/, '');
        const ext = path.extname(art.name) || '.md';
        const iterNamedPath = path.join(runDir, `${baseName}.iter${iteration}${ext}`);
        fs.writeFileSync(iterNamedPath, art.content, 'utf-8');
      }

      // 7. Write to project root if requested
      if (writeToRoot) {
        const rootPath = path.join(this.workspaceRoot, art.name);
        fs.writeFileSync(rootPath, art.content, 'utf-8');
      }

      // Update run manifest
      const existingIdx = manifest.artifacts.findIndex((a) => a.name === art.name);
      const artEntry = {
        name: art.name,
        path: path.relative(this.workspaceRoot, runArtPath),
        summary: art.summary || `${art.name} generated during ${runId}`,
        authorProvider: providerId,
        iteration,
        sizeBytes: Buffer.byteLength(art.content, 'utf-8'),
      };

      if (existingIdx >= 0) {
        manifest.artifacts[existingIdx] = artEntry;
      } else {
        manifest.artifacts.push(artEntry);
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

    // Save updated run manifest
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

    return saved;
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

