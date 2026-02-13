# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This repository is a curated catalog of **semantic anchors** - well-defined terms, methodologies, and frameworks that serve as reference points when communicating with Large Language Models (LLMs). Semantic anchors act as shared vocabulary that triggers specific, contextually rich knowledge domains within an LLM's training data.

**Current Status:** The repository is undergoing a major redesign to become an interactive, bilingual website with treemap visualization, role-based filtering, and automated contribution workflow.

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
