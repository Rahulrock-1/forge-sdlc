---
name: tasks
description: Generate atomic developer checklist (tasks.md)
---

# Task Decomposition Agent (Forge SDLC)

Use this skill when the user requests `tasks`, `/tasks`, or generate atomic developer checklist (tasks.md).

## Execution Guidelines:
1. Check existing artifacts in `.forge/artifacts/`.
2. Execute the Forge capability:
   ```bash
   forge tasks
   ```
3. Inspect and refine the generated artifact in `.forge/artifacts/`.
