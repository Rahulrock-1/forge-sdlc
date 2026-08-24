# Spec Kit Structured Clarification Log

**Project:** forge-sdlc  
**Date:** 2026-08-24T18:32:29.035Z  

---

| Item ID | Question / Ambiguity | Decision / Resolution | Impacted Artifacts |
| :--- | :--- | :--- | :--- |
| **CLR-01** | Should `forge` support interactive terminal wizards? | Yes, interactive mode prompts users when required arguments are omitted. | `cli/app.ts`, `cli/ui/prompts.ts` |
| **CLR-02** | Where should project artifacts be stored? | Defaults to `.forge/artifacts/` or project root if configured. | `engine/artifacts.ts` |
| **CLR-03** | How should multi-agent workflows pass intermediate state? | Via standard Markdown artifacts with YAML frontmatter metadata. | `types/artifact.ts` |
