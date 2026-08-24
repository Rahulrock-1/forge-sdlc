/**
 * Forge SDLC - Artifact Manager & Pipeline
 */

import fs from 'node:fs';
import path from 'node:path';
import { ArtifactFile, ArtifactMap } from '../types/artifact.js';
import { ExecutionArtifact } from '../types/provider.js';

export class ArtifactManager {
  private workspaceRoot: string;
  private artifactsDir: string;

  constructor(workspaceRoot: string = process.cwd()) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.artifactsDir = path.join(this.workspaceRoot, '.forge', 'artifacts');
  }

  public ensureArtifactsDir(): void {
    if (!fs.existsSync(this.artifactsDir)) {
      fs.mkdirSync(this.artifactsDir, { recursive: true });
    }
  }

  /**
   * Save execution artifacts to both .forge/artifacts and root if configured
   */
  public async saveArtifacts(
    artifacts: ExecutionArtifact[],
    providerId: string,
    writeToRoot: boolean = false
  ): Promise<ArtifactFile[]> {
    this.ensureArtifactsDir();
    const saved: ArtifactFile[] = [];

    for (const art of artifacts) {
      const artPath = path.join(this.artifactsDir, art.name);
      fs.writeFileSync(artPath, art.content, 'utf-8');

      if (writeToRoot) {
        const rootPath = path.join(this.workspaceRoot, art.name);
        fs.writeFileSync(rootPath, art.content, 'utf-8');
      }

      saved.push({
        id: art.name.replace(/\.[^/.]+$/, ''),
        filename: art.name,
        path: artPath,
        title: art.summary,
        group: 'artifacts',
        stage: 'completed',
        version: 1,
        lastUpdated: new Date().toISOString(),
        content: art.content,
        authorProvider: providerId,
      });
    }

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
}
