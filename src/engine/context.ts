/**
 * Forge SDLC - Context Manager
 * Detects workspace environment, tech stack, existing artifacts, and user configurations.
 */

import fs from 'node:fs';
import path from 'node:path';
import { ProjectContext, ForgeConfig } from '../types/context.js';

export class ContextManager {
  public static async analyzeWorkspace(workspaceRoot: string = process.cwd()): Promise<ProjectContext> {
    const root = path.resolve(workspaceRoot);
    let projectName = path.basename(root);

    const techStack = {
      languages: [] as string[],
      frameworks: [] as string[],
      buildTools: [] as string[],
      packageManager: undefined as string | undefined,
      hasTests: false,
      hasCiCd: false,
      hasDocker: false,
    };

    let projectType: ProjectContext['projectType'] = 'greenfield';

    // 1. Detect Node / JavaScript / TypeScript
    const pkgJsonPath = path.join(root, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
        if (pkg.name) projectName = pkg.name;
        techStack.languages.push('JavaScript');

        if (pkg.devDependencies?.typescript || pkg.dependencies?.typescript || fs.existsSync(path.join(root, 'tsconfig.json'))) {
          techStack.languages.push('TypeScript');
        }

        if (pkg.dependencies?.react || pkg.devDependencies?.react) techStack.frameworks.push('React');
        if (pkg.dependencies?.next || pkg.devDependencies?.next) techStack.frameworks.push('Next.js');
        if (pkg.dependencies?.express) techStack.frameworks.push('Express');
        if (pkg.dependencies?.commander) techStack.frameworks.push('Commander CLI');

        if (pkg.scripts?.test || pkg.devDependencies?.vitest || pkg.devDependencies?.jest) {
          techStack.hasTests = true;
        }

        projectType = 'brownfield';
      } catch {
        // Ignore invalid package.json
      }
    }

    // 2. Detect Python
    if (fs.existsSync(path.join(root, 'pyproject.toml')) || fs.existsSync(path.join(root, 'requirements.txt'))) {
      techStack.languages.push('Python');
      projectType = 'brownfield';
    }

    // 3. Detect Rust / Go
    if (fs.existsSync(path.join(root, 'Cargo.toml'))) {
      techStack.languages.push('Rust');
      projectType = 'brownfield';
    }
    if (fs.existsSync(path.join(root, 'go.mod'))) {
      techStack.languages.push('Go');
      projectType = 'brownfield';
    }

    // 4. Detect CI / Docker
    if (fs.existsSync(path.join(root, '.github/workflows'))) {
      techStack.hasCiCd = true;
    }
    if (fs.existsSync(path.join(root, 'Dockerfile')) || fs.existsSync(path.join(root, 'docker-compose.yml'))) {
      techStack.hasDocker = true;
    }

    // 5. Detect Existing Artifacts
    const existingArtifacts: string[] = [];
    const standardArtifacts = [
      'constitution.md',
      'spec.md',
      'requirements.md',
      'clarifications.md',
      'architecture.md',
      'plan.md',
      'tasks.md',
      'checklist.md',
      'analysis.md',
      'review.md',
      'security-audit.md',
      'threat-model.md',
      'test-report.md',
      'convergence.md',
    ];

    const searchDirs = [
      root,
      path.join(root, '.forge/artifacts'),
      path.join(root, 'docs'),
      path.join(root, 'specs'),
    ];

    for (const sDir of searchDirs) {
      if (fs.existsSync(sDir)) {
        for (const art of standardArtifacts) {
          if (fs.existsSync(path.join(sDir, art)) && !existingArtifacts.includes(art)) {
            existingArtifacts.push(art);
          }
        }
      }
    }

    // 6. Detect Git Info
    const gitDir = path.join(root, '.git');
    const isGitRepo = fs.existsSync(gitDir);

    // 7. Load user config (.forgerc.json or forge.config.yaml)
    const config = this.loadConfig(root);

    return {
      workspaceRoot: root,
      projectName,
      projectType,
      techStack,
      existingArtifacts,
      userPreferences: {
        preferredProviders: config?.providers?.overrides || {},
        excludedProviders: [],
        strictQualityGates: config?.qualityGates?.enforceStrictChecklists || false,
        customWeights: config?.scoringWeights || {},
      },
      gitInfo: {
        isGitRepo,
      },
    };
  }

  public static loadConfig(workspaceRoot: string): ForgeConfig | null {
    const jsonPath = path.join(workspaceRoot, '.forgerc.json');
    if (fs.existsSync(jsonPath)) {
      try {
        return JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as ForgeConfig;
      } catch {
        return null;
      }
    }
    return null;
  }
}
