---
description: Brainstorm & Lateral Ideation Agent - Lateral ideation, divergent feature exploration, and feasibility ranking in brainstorm.md (Foundation of All Agents)
---

Execute Forge capability: **Brainstorm & Lateral Ideation (/brainstorm, /ideate)**

## 📥 Ingestion Checklist:
- Inputs: Problem statement, vision, constraints
- Target Output: `.forge/artifacts/brainstorm.md`

## 💡 Instructions:
0. **Problem Space & Context Research (Top of Execution):**
   - Research the problem statement, user personas, workspace constraints, and technical feasibility benchmarks.
1. **Divergent Lateral Brainstorming on Top of Research:**
   - Explore problem space using lateral thinking techniques across UX, architecture, and business value.
2. Synthesize feature candidates with feasibility scoring and ROI ranking.
3. Output to `.forge/artifacts/brainstorm.md` as the foundation for all downstream agents.
4. Proceed to `npx forge-sdlc brd` or `npx forge-sdlc specify`.
