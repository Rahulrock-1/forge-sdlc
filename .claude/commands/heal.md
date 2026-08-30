---
description: Cross-Artifact Auto-Healing Agent - Audits drift across spec, architecture, and tasks, auto-generating surgical patches in healing-plan.md
---

Execute Forge capability: **Cross-Artifact Auto-Healing (/heal, /sync)**

## 📥 Required Files Checklist:
- Mandatory: `.forge/artifacts/spec.md`, `.forge/artifacts/architecture.md`, `.forge/artifacts/tasks.md`

## 🩺 Instructions:
1. Audit cross-artifact drift and calculate traceability score.
2. Identify orphaned requirements and architectural gaps.
3. Generate `.forge/artifacts/healing-plan.md`.
4. Run `npx forge-sdlc heal --apply` to automatically patch tasks.md.
