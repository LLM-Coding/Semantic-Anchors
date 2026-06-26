# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This repository is a curated catalog of **semantic anchors** - well-defined terms, methodologies, and frameworks that serve as reference points when communicating with Large Language Models (LLMs). Semantic anchors act as shared vocabulary that triggers specific, contextually rich knowledge domains within an LLM's training data.

**Current Status:** The repository is undergoing a major redesign to become an interactive, bilingual website with treemap visualization, role-based filtering, and automated contribution workflow.

## First-Time Setup

After cloning, activate the shared Git hooks with one command (works on Unix/macOS and Windows Git Bash):

```bash
git config core.hooksPath .githooks
```

This installs the pre-commit hook that automatically syncs `skill/` into `plugins/semantic-anchors/skills/` on every commit. No other tools are required.

## Git Workflow & Fork Setup

**Development takes place in the fork until PRD implementation is complete.**

**Git Remotes:**
- `origin` → `raifdmueller/Semantic-Anchors` (fork for development)
- `upstream` → `LLM-Coding/Semantic-Anchors` (original repository)

**Workflow:**
1. All feature branches are created in the fork (`origin`)
2. PRs are created within the fork for review
3. After PRD implementation is complete, changes will be merged back to upstream
4. Use `git push origin <branch>` for all development work
5. Use `git fetch upstream` to sync with original repository if needed

**Issue References:**
- Issues are tracked in upstream repository: https://github.com/LLM-Coding/Semantic-Anchors/issues
- Reference issues in commits: `feat: implement X (#42)`

### Git Worktrees for Parallel Team Development

**When using agent teams, use Git Worktrees to enable true parallel development:**

**Setup:**
```bash
# Create worktree directory
mkdir -p ~/projects/Semantic-Anchors-worktrees

# Create worktree for each feature branch
git worktree add ../Semantic-Anchors-worktrees/feature-<name> -b feature/<name>
```

**Directory Structure:**
```
~/projects/
├── Semantic-Anchors/              # Main worktree (main branch)
└── Semantic-Anchors-worktrees/    # Feature branch worktrees
    ├── feature-mece-analysis/     # Teammate 1
    ├── feature-role-mapping/      # Teammate 2
    ├── feature-split-readme/      # Teammate 3
    └── feature-metadata-script/   # Teammate 4
```

**Team Workflow:**
1. Create worktrees for each feature branch
2. Spawn teammates with `working_directory` parameter pointing to their worktree
3. Each teammate works independently in their directory
4. Teammates commit and push to their feature branches
5. Create PRs from feature branches to main
6. After merge, cleanup: `git worktree remove <path>`

**Advantages:**
- No branch switching conflicts
- True parallel development
- Each teammate has isolated workspace
- Shared Git history (.git directory)
- Clean separation of concerns

## Project Documentation

All project documentation is located in the `docs/` directory:

- **`docs/PRD.md`**: Product Requirements Document with user personas, user stories, timeline
- **`docs/specs/`**: Detailed specifications
  - `01_use_cases.adoc`: 10 use cases with PlantUML diagrams
  - `02_api_specification.adoc`: Data models and API structure
  - `03_acceptance_criteria.adoc`: Gherkin scenarios (in German)
  - `adrs/`: Architecture Decision Records with Pugh matrices
- **`docs/arc42/`**: Complete architecture documentation (12 chapters)
- **`PROJECT_STATUS.md`**: Current implementation status and roadmap

**Always review these documents before starting work on implementation issues.**

## Current Repository Structure

```
Semantic-Anchors/
├── docs/                           # All documentation
│   ├── PRD.md                      # Product Requirements
│   ├── specs/                      # Specifications & ADRs
│   └── arc42/                      # Architecture (arc42 template)
├── README.adoc                     # Current catalog (will be split in Phase 1)
├── PROJECT_STATUS.md               # Implementation tracking
├── CLAUDE.md                       # This file
└── LICENSE
```

## Target Repository Structure (After Phase 1)

```
Semantic-Anchors/
├── docs/
│   ├── anchors/                    # Individual anchor files (60+)
│   │   ├── _template.adoc          # Template for new anchors
│   │   ├── tdd-london-school.adoc
│   │   └── ...
│   ├── categories/                 # Category include files
│   │   ├── testing-quality.adoc
│   │   └── ...
│   ├── roles/                      # Role include files
│   │   ├── software-developer.adoc
│   │   └── ...
│   ├── metadata/                   # Generated metadata
│   │   ├── categories.yml
│   │   ├── roles.yml
│   │   └── anchors.yml
│   └── ... (specs, arc42)
├── website/                        # Vite-based static site (Phase 2)
│   ├── src/
│   ├── public/
│   └── package.json
├── scripts/                        # Build scripts
│   ├── extract-metadata.js
│   └── generate-includes.js
└── ...
```

## File Format

All content is written in **AsciiDoc** format (.adoc), not Markdown. Key AsciiDoc patterns:

- Section headers: `== Level 1`, `=== Level 2`, `==== Level 3`
- Collapsible sections: `[%collapsible]` followed by `====` delimiters
- Anchors: `[[anchor-id]]` before a section header
- Internal links: `<<anchor-id,Link Text>>`
- Bullet lists: `*` for unordered, `.` for ordered (not `-` like Markdown)
- Bold text: `*bold*` (not `**bold**`)
- Code blocks: `[source]` or `[source,language]` followed by `----` delimiters

## Semantic Anchor Format (Post-Phase 1)

Each semantic anchor will be in its own file with AsciiDoc attributes for metadata:

```asciidoc
= TDD, London School
:categories: testing-quality
:roles: software-developer, qa-engineer, architect
:related: tdd-chicago-school, hexagonal-architecture
:proponents: Steve Freeman, Nat Pryce
:tags: testing, tdd, mocking, outside-in

[%collapsible]
====
*Full Name*: Test-Driven Development, London School

*Also known as*: Mockist TDD, Outside-In TDD

*Core Concepts*:
* Mock-heavy testing
* Outside-in development
* Interaction-based testing

*Key Proponents*: Steve Freeman, Nat Pryce ("Growing Object-Oriented Software, Guided by Tests")

*When to Use*:
* Complex systems with many collaborating objects
* When designing APIs and interfaces
* Distributed systems where integration is costly
====
```

**Key Metadata Attributes:**
- `:categories:` - Category IDs (comma-separated, required)
- `:roles:` - Role IDs (comma-separated, required)
- `:related:` - Related anchor IDs (comma-separated, optional)
- `:proponents:` - Key proponents (comma-separated, required)
- `:tags:` - Search keywords (comma-separated, optional)

## Quality Criteria for Semantic Anchors

Before adding a new anchor, verify it meets these criteria:

- **Precise**: References a specific, established body of knowledge with clear boundaries
- **Rich**: Activates multiple interconnected concepts, not just a single instruction
- **Consistent**: Different users invoking it get similar conceptual activation
- **Attributable**: Can be traced to key proponents, publications, or documented standards

**Counter-examples** (NOT semantic anchors):
- "TLDR" - underspecified, no defined structure
- "ELI5" - vague target level, no pedagogical framework
- "Keep it short/simple" - pure instruction, no conceptual depth

### Testing a Semantic Anchor

Before adding, test with this prompt:

```
What concepts do you associate with '<semantic anchor name>'?
```

Evaluate: Recognition, Accuracy, Depth, Specificity

## Categories (MECE-compliant after Phase 1)

Current categories (subject to MECE analysis in Issue #36):

1. Testing & Quality Practices
2. Architecture & Design
3. Design Principles & Patterns
4. Requirements Engineering
5. Documentation
6. Communication & Presentation
7. Decision Making & Strategy
8. Development Practices
9. Statistical Methods & Process Monitoring
10. Interaction & Reasoning Patterns

## Roles (12 Professional Roles)

1. Software Developer / Engineer
2. Software Architect
3. QA Engineer / Tester
4. DevOps Engineer
5. Product Owner / Product Manager
6. Business Analyst / Requirements Engineer
7. Technical Writer / Documentation Specialist
8. UX Designer / Researcher
9. Data Scientist / Statistician
10. Consultant / Coach
11. Team Lead / Engineering Manager
12. Educator / Trainer

## Implementation Phases

### Phase 1: Foundation & Planning (Week 1-2)
- MECE analysis of categories
- Role mapping for all anchors
- Split README.adoc into individual files
- Create metadata extraction script
- Generate category/role include files

**Key Issues:** #35 (Epic), #36-40

### Phase 2: Website Development (Week 3-5)
- Setup Vite project
- Implement treemap visualization (Apache ECharts)
- Role-based filtering
- Search functionality
- AsciiDoc rendering (asciidoctor.js)
- i18n (EN/DE)
- Dark/Light theme

**Key Issues:** #41 (Epic), #42-48

### Phase 3: Automation & Deployment (Week 6-7)
- GitHub Actions deployment workflow
- Issue templates for contributions
- CONTRIBUTING.md guide
- Automated testing (E2E, Lighthouse)

**Key Issues:** #49 (Epic), #50-53

### Phase 4: Enhancement (Week 8+)
- GitHub Copilot validation workflow
- Advanced search
- Analytics (privacy-first)

## Contribution Workflow

**Current (Pre-Phase 1):**
1. Create feature branch: `git checkout -b add-semantic-anchor-<name>`
2. Edit `README.adoc` to add new anchor
3. Follow standard format
4. Commit: `feat: Add <Anchor Name> to <Category> section`
5. Create PR for review

### ⚠️ AgentSkill Sync Required

When adding new anchors, **also update the AgentSkill catalog**:

```
skill/semantic-anchor-translator/references/catalog.md
```

The AgentSkill enables AI agents (Claude Code, Codex, Cursor, etc.) to recognize and suggest semantic anchors. If the catalog is not updated, new anchors won't be discoverable by agents using the skill.

**Checklist for new anchors:**
- [ ] Add anchor to `docs/anchors/<name>.adoc`
- [ ] Update `skill/semantic-anchor-translator/references/catalog.md` with the new entry
- [ ] Research documented criticism and edition drift; if found, add a `== Criticism` / `== Current Status` section (EN + DE) with named, fetch-verified linked sources (see CONTRIBUTING and issue #603)

**Future (Post-Phase 3):**
1. User creates GitHub Issue via template
2. GitHub Actions validates with Copilot
3. Maintainer assigns to Copilot
4. Copilot generates AsciiDoc file
5. PR created automatically
6. Maintainer reviews and merges

## Key Architecture Decisions (ADRs)

All decisions documented with Pugh matrices in `docs/specs/adrs/`:

1. **ADR-001**: Vite as Static Site Generator (+88 points vs. Astro baseline)
2. **ADR-002**: AsciiDoc Attributes for Metadata (+51 points vs. separate YAML)
3. **ADR-003**: Apache ECharts for Treemap (+77 points vs. D3.js)
4. **ADR-004**: One File per Anchor (+105 points vs. files per category)

## Technology Stack

- **Build Tool**: Vite (fast, modern, no framework lock-in)
- **Visualization**: Apache ECharts (treemap with built-in theming)
- **Content Rendering**: asciidoctor.js (AsciiDoc → HTML in browser)
- **Styling**: Tailwind CSS (utility-first, responsive, dark mode)
- **i18n**: Custom JSON-based (lightweight)
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

## Specification Conventions

When creating specifications for this project:

### Use Cases (`docs/specs/01_use_cases.adoc`)
- Use PlantUML Activity Diagrams for each use case
- Structure: Akteure, Vorbedingungen, Ablauf, Nachbedingungen, Fehlerszenarien

### API Specification (`docs/specs/02_api_specification.adoc`)
- OpenAPI-style in AsciiDoc format
- Data models as JSON schemas
- Group endpoints: Navigation, Content Access, Manipulation, Meta-Information

### Acceptance Criteria (`docs/specs/03_acceptance_criteria.adoc`)
- Gherkin format (Given-When-Then)
- Group by feature/use case
- **Language**: German

### Architecture Decision Records (ADRs)
- Follow **Nygard format**: Status, Context, Decision, Consequences
- Include **Pugh Matrix** comparing alternatives
- Store in `docs/specs/adrs/`

## Development Commands (Post-Phase 2)

```bash
# Development
npm run dev                  # Start Vite dev server

# Build
npm run extract-metadata     # Extract metadata from .adoc files
npm run validate             # Validate anchors
npm run generate-json        # Generate JSON for website
npm run build                # Build website for production

# Testing
npm run test                 # Unit tests
npm run test:e2e             # E2E tests with Playwright
npm run test:a11y            # Accessibility tests

# Deployment
npm run deploy               # Deploy to GitHub Pages (via GH Actions)
```

## Working with GitHub Issues

All implementation work is tracked in GitHub Issues. See `PROJECT_STATUS.md` for current status.

**Issue Labels:**
- `epic` - High-level phases
- `phase-1`, `phase-2`, `phase-3` - Phase assignment
- `new-anchor` - Proposals for new semantic anchors
- `bug`, `enhancement`, `documentation`

**Workflow:**
1. Check PROJECT_STATUS.md for current phase
2. Pick an issue from current phase
3. Work on feature branch
4. Reference issue in commits: `feat: implement X (#42)`
5. Create PR linking to issue

## Quality Requirements

### Performance
- Page load < 2s on 3G
- Treemap rendering < 500ms
- Search response < 300ms

### Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader support

### SEO & Metrics
- Lighthouse Performance > 90
- Lighthouse Accessibility: 100
- Lighthouse SEO > 90

## Important Notes

- **AsciiDoc is mandatory** - Do not convert to Markdown
- **MECE categories** - After Phase 1, all categories must be MECE-compliant
- **Bilingual UI** - Website UI in EN/DE, but anchor content stays English
- **Privacy-first** - No tracking without consent
- **One file per anchor** - Improves Git history and parallel contributions
- **Test before adding** - Always validate semantic anchors with LLM first

## References

- PRD: `docs/PRD.md`
- Architecture: `docs/arc42/arc42.adoc`
- Project Status: `PROJECT_STATUS.md`
- GitHub Issues: https://github.com/LLM-Coding/Semantic-Anchors/issues

## Risk Radar Assessment

_Generated by `/risk-assess` on 2026-02-13_

**Mitigation Tracking:** [Risk Radar Issues](https://github.com/LLM-Coding/Semantic-Anchors/labels/risk-radar)
**Documentation:** [Vibe Coding Risk Radar](https://llm-coding.github.io/vibe-coding-risk-radar/)

### Module: scripts
| Dimension | Score | Level | Evidence |
|-----------|-------|-------|----------|
| Code Type | 1 | Build Scripts / Tests | extract-metadata.js, split-readme.js, update-anchor-categories.js, translate-anchors.py |
| Language | 2 | Dynamically typed | 3 .js files, 1 .py file |
| Deployment | 1 | Internal tool | CI/CD automation, build-time scripts |
| Data Sensitivity | 0 | Public data | Processes public AsciiDoc documentation |
| Blast Radius | 0 | Cosmetic / Tech debt | Build failures, incorrect metadata generation |

**Tier: 2** — determined by Language = 2

### Mitigations: scripts (Tier 2)

#### Tier 1 — Automated Gates
| Measure | Status | Details | Issue |
|---------|--------|---------|-------|
| Linter & Formatter | ❌ Ausstehend | No ESLint or Prettier config detected | [#81](https://github.com/LLM-Coding/Semantic-Anchors/issues/81) |
| Type Checking | ❌ N/A | JavaScript without TypeScript | — |
| Pre-Commit Hooks | ❌ Ausstehend | No husky or pre-commit framework | [#82](https://github.com/LLM-Coding/Semantic-Anchors/issues/82) |
| Dependency Check | ❌ Ausstehend | No npm audit in CI workflows | [#83](https://github.com/LLM-Coding/Semantic-Anchors/issues/83) |
| CI Build & Unit Tests | ✅ Vorhanden | GitHub Actions (.github/workflows/test.yml) | — |

#### Tier 2 — Extended Assurance
| Measure | Status | Details | Issue |
|---------|--------|---------|-------|
| SAST | ❌ Ausstehend | No Semgrep or CodeQL detected | [#84](https://github.com/LLM-Coding/Semantic-Anchors/issues/84) |
| AI Code Review | ❌ Ausstehend | No CodeRabbit or Copilot Review | [#86](https://github.com/LLM-Coding/Semantic-Anchors/issues/86) |
| Property-Based Tests | ❌ Ausstehend | No fast-check or hypothesis | [#85](https://github.com/LLM-Coding/Semantic-Anchors/issues/85) |
| SonarQube Quality Gate | ❌ Ausstehend | No SonarQube config | [#87](https://github.com/LLM-Coding/Semantic-Anchors/issues/87) |
| Sampling Review (~20%) | ⚠️ Teilweise | PR review process (assumed) | [#88](https://github.com/LLM-Coding/Semantic-Anchors/issues/88) |

---

### Module: website
| Dimension | Score | Level | Evidence |
|-----------|-------|-------|----------|
| Code Type | 0 | UI / CSS / Docs | Frontend components with DOM manipulation (header.js, card-grid.js, anchor-modal.js) |
| Language | 2 | Dynamically typed | 17 .js files (JavaScript) |
| Deployment | 2 | Public-facing app | GitHub Pages deployment, public documentation website |
| Data Sensitivity | 0 | Public data | Public semantic anchor documentation |
| Blast Radius | 0 | Cosmetic / Tech debt | UI glitches, broken features |

**Tier: 2** — determined by Language = 2, Deployment = 2

### Mitigations: website (Tier 2)

#### Tier 1 — Automated Gates
| Measure | Status | Details | Issue |
|---------|--------|---------|-------|
| Linter & Formatter | ❌ Ausstehend | No ESLint or Prettier config detected | [#81](https://github.com/LLM-Coding/Semantic-Anchors/issues/81) |
| Type Checking | ❌ N/A | JavaScript without TypeScript | — |
| Pre-Commit Hooks | ❌ Ausstehend | No husky or pre-commit framework | [#82](https://github.com/LLM-Coding/Semantic-Anchors/issues/82) |
| Dependency Check | ❌ Ausstehend | No npm audit in CI workflows | [#83](https://github.com/LLM-Coding/Semantic-Anchors/issues/83) |
| CI Build & Unit Tests | ✅ Vorhanden | GitHub Actions with Playwright E2E tests and Lighthouse CI (.github/workflows/test.yml) | — |

#### Tier 2 — Extended Assurance
| Measure | Status | Details | Issue |
|---------|--------|---------|-------|
| SAST | ❌ Ausstehend | No Semgrep or CodeQL detected | [#84](https://github.com/LLM-Coding/Semantic-Anchors/issues/84) |
| AI Code Review | ❌ Ausstehend | No CodeRabbit or Copilot Review | [#86](https://github.com/LLM-Coding/Semantic-Anchors/issues/86) |
| Property-Based Tests | ❌ Ausstehend | No fast-check or hypothesis | [#85](https://github.com/LLM-Coding/Semantic-Anchors/issues/85) |
| SonarQube Quality Gate | ❌ Ausstehend | No SonarQube config | [#87](https://github.com/LLM-Coding/Semantic-Anchors/issues/87) |
| Sampling Review (~20%) | ⚠️ Teilweise | PR review process (assumed) | [#88](https://github.com/LLM-Coding/Semantic-Anchors/issues/88) |

## Specification

When we talk about a "specification" or "spec", we mean:
- Persona Use Cases in Cockburn's Fully Dressed format (Primary Actor, Trigger, Main Success Scenario, Extensions, Postconditions) at User Goal level, with Business Rules (BR-IDs)
- System Use Cases for each technical interface (API endpoint, CLI command, event, file format): input/validation, processing, output/status codes, error responses
- Activity Diagrams for all flows (not just the happy path)
- Acceptance criteria in Gherkin format (Given/When/Then)
- Individual requirements in EARS syntax where applicable (When/While/If/Shall)
- Supplementary Specifications as needed: Entity Model, State Machines, Interface Contracts, Validation Rules

## Requirements Discovery

Clarify requirements using the Socratic Method:
- Ask at most 3 questions at a time, challenge assumptions
- Use MECE to ensure questions cover all areas without overlap
- Keep asking until you fully understand the requirements

Frame the scope before writing it down:
- Impact Mapping connects deliverables to business goals and actors — so you build what moves a goal, not just what was asked.
- User Story Mapping lays stories along the user's journey and exposes a coherent first slice.

Document the result as a PRD (problem, goals, personas, success criteria, scope).

## Architecture Documentation

Architecture documentation follows arc42. Scaffold the arc42 "with-help" template into the project's `src/docs/` via docToolchain `downloadTemplate` rather than restating chapter structure here — each chapter's help text is its structural spec, which the process fills and then replaces.

Every context, building-block and runtime chapter carries at least one diagram. Diagrams are PlantUML, not Mermaid; building blocks use C4 via PlantUML's bundled C4-PlantUML standard library — the `!include <C4/...>` stdlib form (angle brackets), never the remote `https://` URL and never vendored file copies. Not generic boxes.

Decisions are ADRs (Nygard) with a 3-point Pugh Matrix (-1/0/+1). When the rationale is unconfirmed, ADR Status is "Accepted (inferred)" and Pugh cells needing team judgment are marked `?` rather than guessed. Each ADR's Consequences name the risks the decision creates, referencing the Chapter 11 risk IDs (R-NNN); a decision that creates a risk not yet in Chapter 11 either adds it there or records the consequence as explicitly accepted without a tracked risk. Conversely, Chapter 8 concepts back-reference the ADR that decided them.

Cross-section traceability — arc42 templates do not enforce these, so the contract does:
- Every Chapter 1.2 quality goal maps to a named approach in Chapter 4.
- The external systems in Chapter 3 (context) and the Chapter 5 Level-1 building-block view are the same set — one system boundary in both.
- Every Chapter 5 building block appears in at least one Chapter 6 runtime scenario; Chapter 6 includes at least one error/recovery scenario, not only the happy path.
- Chapter 9 carries an in-document ADR index (ADR | Title | Status), even when the ADRs live in a separate register.
- Each Chapter 5 building block states responsibility, interface, and source location.

Chapter 1.2 lists only the top 3-5 quality goals — the ones that drive architecture decisions. Chapter 10 may elaborate further quality characteristics beyond those top goals; that is correct arc42, not a defect. The Chapter 10 quality tree marks each characteristic as either concretising a Chapter 1.2 top goal or as a derived quality requirement, and each Chapter 10 quality scenario cross-links back to the Chapter 1.2 goal it concretises (or is marked "derived"). Each Chapter 10 scenario is written in the six-part quality attribute scenario form (Source, Stimulus, Artifact, Environment, Response, Response Measure); the Response Measure carries a literal figure, so the requirement is testable rather than an adjective.

Chapter 11 separates Risks from Technical Debt into two subsections. Each Risk carries probability, impact, a derived priority, and a mitigation/action cross-referencing an existing mitigation in Chapter 8 or a quality scenario where one exists; risks are ordered by priority. Each Technical Debt item references the specific Chapter 5 building block it burdens.

## Crosscutting Concepts

arc42 leaves Chapter 8 open. We require five baseline crosscutting concepts, in this order:

- 8.1 Threat Model — STRIDE; threats get IDs (T-001…).
- 8.2 Security — every mitigation references the T-IDs it closes.
- 8.3 Test — testing pyramid; tests trace to Use Cases and Business Rules.
- 8.4 Observability — logs, metrics, traces, audit trails.
- 8.5 Error Handling — retry, circuit breaker, fallback, recovery.

Add further Chapter 8.x concepts (persistence, i18n, accessibility, configuration, performance) only when the system actually has that concern.

## Layer Boundaries

At every layer boundary:
- Expose only well-defined DTOs and contracts — never domain entities
- Use explicit mapping at every seam
- Apply Anti-Corruption Layers when integrating external systems
- Dependency direction points inward (DIP)

## Backlog Management

Create EPICs and User Stories as GitHub issues from the specification.
- User Stories follow INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable)
- Prioritize with MoSCoW (Must/Should/Could/Won't)
- Mark dependencies between issues
- Groom the backlog regularly as the project evolves

## Vertical Slicing

Build the first increment as a walking skeleton: a deployable end-to-end slice that wires every architectural layer together and does almost nothing else.

Grow the system as thin vertical slices — each slice cuts through all layers and delivers one small piece of user value. Slices are tracer bullets: kept and refined, never thrown away.

When a technical unknown blocks a slice, run a spike solution first — a timeboxed, throwaway experiment that removes the risk. Spike code is discarded; only its lesson carries into the slice.

## Implement Next

For each issue:
- Create a feature branch for the EPIC
- Select next issue from backlog (respect dependencies)
- Analyze and document analysis as a comment on the issue
- Implement using TDD (London or Chicago School as appropriate)
- Each test references its Use Case ID for traceability
- Commit with Conventional Commits, reference issue number
- Check if spec or architecture docs need updating
- When EPIC is complete, create a Pull Request

## Refactoring

Refactoring targets are named code smells, not a vague urge to "clean up".

For any refactoring that does not complete in one step, use the Mikado Method: attempt the change, note what breaks, revert, and do the prerequisites first — never leave the build broken while you dig.

Refactoring commits change structure only. Behaviour changes go in separate commits, and the test suite stays green at every commit.

## Code Quality

Our code follows:
- SOLID principles
- DRY, KISS
- Ubiquitous Language from Domain-Driven Design (same terms in code as in the specification)

## Quality Review

Quality assurance follows three layers:
- Code review using Fagan Inspection (structured, systematic, with defined phases)
- Security review based on OWASP Top 10
- Architecture review using ATAM (scenario-based tradeoff analysis against quality goals)
- Use a different AI model or fresh session for reviews to avoid blind spots

## Docs-as-Code

Documentation follows Docs-as-Code according to Ralf D. Müller:
- AsciiDoc as format, PlantUML for inline diagrams, built by docToolchain
- Version-controlled, peer-reviewed, and built automatically
- Plain English according to Strunk & White (or Gutes Deutsch nach Wolf Schneider)
- Projects following this contract include the `dtcw` wrapper and `docToolchainConfig.groovy` so PlantUML / AsciiDoc actually render.

## Socratic Code Theory Recovery

Recover a program's "theory" (Naur 1985) from source code through recursive question refinement.

- Start with 5 root questions: Q1 Problem/Users, Q2 Specification, Q3 Architecture, Q4 Quality Goals, Q5 Risks.

- The second level of the tree is FIXED, not free. Every run emits exactly these nodes, in this order, even when a node's only leaf is [OPEN] or [ANSWERED: not applicable]:
  - Q1.1-Q1.6: product identity, primary users, channels, why-built, success metrics, segment priority
  - Q2.1-Q2.6: actors, use-case catalog, per-interface system specs, data/entity model, acceptance criteria, cross-cutting business rules
  - Q3.1-Q3.12: the twelve arc42 chapters, in arc42 order
  - Q4.1-Q4.8: the eight ISO/IEC 25010 characteristics; plus Q4.9: which characteristic has priority
  - Q5.1-Q5.5: technical debt, security risks, operational risks, dependency/supply-chain risks, scaling/performance risks

- Below the fixed second level, decompose adaptively and code-driven; a node is a leaf only when it can be answered from one specific file:line evidence (a directory is too coarse — decompose further) or definitively marked [OPEN]. Depth tracks code density: a small bounded context yields a shallow tree, a large one a deep tree, capped at four levels below a fixed node. Depth varies between runs — expected.

- Q-IDs are stable: Q3.7 is always Deployment View, in every run, so trees from different runs can be diffed node-by-node.

- Each leaf is [ANSWERED] (with file:line evidence) or [OPEN] (with Category, Ask role, and why it is unanswerable from code).

- Quality is not wholly team knowledge. Derive quality scenarios for the Q4 branch and arc42 Chapter 10 from measurable code behaviour — literal thresholds, timeouts, budgets, the threat catalogue and test concept from Q3.8 — as [ANSWERED] with file:line; never invent target numbers. Only the quality-goal ranking (Q4.9) is [OPEN]. arc42 Chapter 10 carries the derivable scenarios, never just an [OPEN] pointer. Chapter 1.2 names only the top 3-5 quality goals; Chapter 10 covers all eight characteristics — mark each Chapter 10 entry as concretising a Chapter 1.2 top goal or as derived.

- Open Questions are the handoff document: always emit one section per role (Product Owner, Architect, Developer, Domain Expert, Operations), even when a section is empty ("No open questions for this role").

- Two-phase workflow: Phase 1 builds the tree; the team answers the Open Questions; Phase 2 synthesizes documentation from the answered tree.

## Concise Response (TLDR)

Responses lead with the conclusion first (BLUF). Keep to essential points. No filler, no preamble. Use short sentences, active voice, and no unnecessary words (Strunk & White).

## Simple Explanation (ELI5)

Explain complex concepts using simple language and everyday analogies. When the explanation feels hard to write, that reveals gaps in understanding — study those areas first (Feynman Technique).

## Explaining and Teaching

When asked to explain or teach something (including "why does X…"), act as a teacher running a dialogue, not a lecture — your goal is that the learner can apply it afterwards, not that you delivered it.

Start by having the learner restate what they already understand (Socratic Method), so you teach the gap, not the whole topic; adjust depth on request (ELI5 / ELI-intern). Keep a short running checklist of what they must grasp — the problem and why it exists, the solution with its design decisions and edge cases, and why it matters — a Definition of Done for understanding, worked one item at a time; for a long or multi-session explanation, persist that checklist as a file so it survives context loss and can be resumed.

Take one small step per turn: fill the gap with questions, not answers; ask, or explain the next smallest piece in a few sentences and then check it — then stop and wait. Never stack several steps in one turn. Lead with why something matters before its mechanics (4MAT), and keep drilling into the why beneath the why — the reasoning behind the design, not just what it does (Naur); cover what and how too.

Check by quizzing, never "makes sense?" — open or multiple-choice questions; for multiple choice, vary which option is correct and don't reveal the answer until the learner has committed. The sharpest check is having them explain it back in their own words (Feynman Technique) or apply it to a fresh case; use a concrete artifact (an example, code, a trace) when it helps. React to the actual answer: if they've got it, advance; if not, give a short targeted hint and re-ask. "Understood" means they can use it on a new case, not recite it (Bloom's Apply, not recall) — don't move on, and don't end, until they've shown that.

Don't announce or walk through the method you're using — let it shape what you do, not what you say. Scale to the question: a small factual ask gets a one-line answer, and the learner can say "just tell me" anytime. If you're unsure of the topic, learn it before teaching.

## Writing Style

Writing follows Gutes Deutsch nach Wolf Schneider (or Plain English according to Strunk & White).

Additionally:
- Technical terms stay in English (LLM, Prompt, Token, Spec, etc.)
- Address the reader directly, use first person sparingly but deliberately
- Use analogies to human thinking to explain technical concepts
- One thought per paragraph (5-8 sentences is fine)
- Section headings are statements, not topic announcements
- First sentence says what the paragraph is about
- Show code and prompts, don't just claim things work
- Conclusions make a clear statement — never end with 'it remains exciting'

## TDD, Hamburg Style

Design-led TDD recipe by Ralf Westphal — close the requirements/logic gap before writing code, then test at service boundaries with minimal mocking. Use it when the problem is too complex for pure micro-step Red-Green-Refactor.

- **ACD cycle (Analyze → Design → Code)** precedes the test loop: first model the solution to close the gap between requirements and logic, only then code.
- **"Right from the start" philosophy** — implement correctly the first time so refactoring is a correction, not routine cleanup.
- **Service-level testing** — test behind the public API, independent of API technology.
- **Minimal mocking** — closer to *TDD, Chicago School* than *London School*.
- **IOSP (Integration Operation Segregation Principle)** — a function is either composition (Integration) or logic (Operation), never both; structural support for simple unit tests.
- **Deep Work over Small Steps** — accept that some problems can't be sliced into tiny green increments; stay red longer when the design demands it.

Composes: *TDD, London School*, *TDD, Chicago School*, *Red-Green-Refactor*, *IOSP*.
Sources: https://ralfw.de/hamburg-style-tdd/, https://ralfw.de/tdd-how-it-can-be-done-right/

## Strategic Architecture Analysis

Strategic architecture analysis combines four lenses, each for a different question. Reach for it when evaluating build-vs-buy, assessing architecture fitness for changing requirements, or running a strategic technology-radar review.

Map the value chain with Wardley Mapping to see how each component evolves — what is commodity, what is genesis, and where the strategic differentiation actually sits.

Classify each challenge with the Cynefin Framework — Clear, Complicated, Complex, or Chaotic — so the response fits the domain instead of forcing one playbook onto every problem.

When a decision has a wide solution space, lay the dimensions and their options out in a Morphological Box and combine them deliberately, rather than anchoring on the first design that comes to mind.

Evaluate the shortlisted architectures against the quality goals with ATAM, naming the sensitivity points, the tradeoff points, and the risks each option carries.

When the root cause of a problem stays unclear, drill down with the Five Whys before committing to a direction.
