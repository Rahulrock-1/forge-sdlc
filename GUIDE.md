# ⚡ Forge SDLC — Complete User Guide & Capability Catalog

> **Universal Capability-Oriented SDLC Framework & Intelligent Provider Router**  
> Dynamically orchestrates the best agentic engineering skills across **BMAD**, **GitHub Spec Kit**, and **Internal Engines** through a single unified CLI and AI Chat interface. **100% Zero-Token & Offline Capable by default.**

---

## 🧭 1. Overview & Philosophy

Instead of locking your team into a single framework (all-BMAD or all-SpecKit), Forge acts as an **intelligent capability router**:

- **BMAD** is used for: **Business Strategy (`brd.md`)**, **C4 Architecture (`architecture.md`)**, **Ambiguity Elicitation**, and **Multi-Lens Code Review (`review.md`)**.
- **Spec Kit** is used for: **Specification (`spec.md`)**, **Technical Planning (`plan.md`)**, **Atomic Tasks (`tasks.md`)**, and **Readiness Convergence (`convergence.md`)**.
- **Forge Internal** is used for: **STRIDE Security Audits**, **Automated Test Synthesis**, and **CI/CD Releases**.

You only ask for the **capability**, never vendor-locked commands:

```bash
forge architecture
```
*Forge evaluates all candidate providers, calculates context-aware scores, recommends BMAD, and executes it seamlessly!*

---

## 📥 2. Installation & Quickstart

### Method A: Run Instantly via `npx` (No Install Required)
```bash
# Initialize Forge in any project folder
npx forge-sdlc init

# Formulate Business Requirements Document (BRD)
npx forge-sdlc brd

# Design technical architecture with C4 Mermaid diagrams
npx forge-sdlc architecture

# Run 5-lens multi-perspective code review
npx forge-sdlc review
```

---

### Method B: Install Globally (Run anywhere as `forge`)
```bash
npm install -g forge-sdlc
```
Now you can run:
```bash
forge init
forge brd
forge architecture
forge specify
forge review
```

---

## ✨ 3. AI Chat & IDE Slash Commands (`/`)

When you run `forge init` in any project, Forge automatically installs **IDE Agent Rules & Slash Commands** for **Cursor IDE**, **Claude Code**, **Google Antigravity**, **GitHub Copilot**, and **Windsurf AI**!

Open your AI Chat in your favorite editor and type **`/`**:

```
Type "/" in AI Chat:
──────────────────────────────────────────────────────────────────────────────
/brd            → Formulates Business Requirements Document & ROI (BMAD)
/specify        → Formulates Given-When-Then specification (Spec Kit)
/clarify        → Probes hidden ambiguities & edge cases (BMAD)
/architecture   → Designs C4 technical architecture & ADRs (BMAD)
/data-model     → Designs database entity schemas & ER diagrams (BMAD)
/api-design     → Designs OpenAPI 3.1 & interface contracts (BMAD)
/plan           → Generates phased execution milestones (Spec Kit)
/tasks          → Generates atomic developer task checklist (Spec Kit)
/analyze        → Audits cross-artifact consistency & drift (Spec Kit)
/review         → Runs 5-Lens code review (bmad-review) (BMAD)
/security       → Runs STRIDE & OWASP threat audit (Internal)
/converge       → Certifies release candidate readiness (Spec Kit)
──────────────────────────────────────────────────────────────────────────────
```

---

## 🛠️ 4. Complete SDLC Capability Reference

| SDLC Stage | Terminal Command | Chat Slash Command | Provider Used | What it Generates in `.forge/artifacts/` |
| :--- | :--- | :--- | :---: | :--- |
| **1. Business Requirements** | `forge brd` | `/brd` | **BMAD** | `brd.md` (Stakeholder analysis, BPMN, ROI) |
| **2. Domain Discovery** | `forge discover` | `/discover` | **BMAD** | `discovery.md` (Domain boundaries & actors) |
| **3. Ambiguity Clarification** | `forge clarify` | `/clarify` | **BMAD** | `clarifications.md` (Probed edge cases) |
| **4. Specification (SDD)** | `forge specify` | `/specify` | **Spec Kit** | `spec.md` (Given-When-Then user stories) |
| **5. Technical Architecture** | `forge architecture` | `/architecture` | **BMAD** | `architecture.md` (C4 diagrams & ADRs) |
| **6. Database & Schemas** | `forge data-model` | `/data-model` | **BMAD** | `data-model.md` (Mermaid ERD schemas) |
| **7. API Contracts** | `forge api-design` | `/api-design` | **BMAD** | `api-contract.md` (OpenAPI 3.1 contracts) |
| **8. Execution Roadmap** | `forge plan` | `/plan` | **Spec Kit** | `plan.md` (Phased milestones) |
| **9. Tasks Breakdown** | `forge tasks` | `/tasks` | **Spec Kit** | `tasks.md` (Actionable developer checklist) |
| **10. Drift Analysis** | `forge analyze` | `/analyze` | **Spec Kit** | `analysis.md` (100% Traceability audit) |
| **11. Multi-Lens Review** | `forge review` | `/review` | **BMAD** | `review.md` (5-Lens review report) |
| **12. Security SAST Scan** | `forge security` | `/security` | **Internal** | `security-audit.md` (STRIDE & OWASP) |
| **13. Readiness Burndown** | `forge converge` | `/converge` | **Spec Kit** | `convergence.md` (Release certificate) |

---

## ⚡ 5. Automated 1-Command Full Workflow

To run the entire 13-stage software development lifecycle sequentially:

```bash
forge workflow run full-sdlc
```

```
BRD  ────►  SPECIFY  ────►  CLARIFY  ────►  ARCHITECTURE  ────►  PLAN  ────►  TASKS
(BMAD)     (Spec Kit)        (BMAD)             (BMAD)          (Spec Kit)    (Spec Kit)
                                                                                  │
                                                                                  ▼
RELEASE  ◄────  CONVERGE  ◄────  SECURITY  ◄────  REVIEW  ◄────  TEST  ◄────  IMPLEMENT
(Internal)      (Spec Kit)       (Internal)       (BMAD)       (Internal)     (BMAD/Spec)
```

---

## 📊 6. Check Project Pipeline Status

Inspect the artifact pipeline and stage completion at any time:

```bash
forge status
```

---

## 🔐 7. Zero-Token Offline Mode vs Optional Live AI

- **Zero-Token Offline Mode (Default & 100% Free):** Runs completely offline with zero API keys or token costs.
- **Live LLM Mode (Optional):** If you want live text generation with Claude, OpenAI, Gemini, DeepSeek, or local Ollama:
  ```bash
  # 1. Set active model
  forge config set model claude-3-7-sonnet

  # 2. Set your API token
  forge config set token sk-ant-api03-xxxxxxxxx

  # 3. Authenticate and test connection
  forge auth
  ```
