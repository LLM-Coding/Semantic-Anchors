# Contributing to Semantic Anchors

Thank you for your interest in contributing to the Semantic Anchors catalog! This project aims to build a curated collection of well-defined terms, methodologies, and frameworks that serve as reference points when communicating with Large Language Models (LLMs).

## Table of Contents

- [What are Semantic Anchors?](#what-are-semantic-anchors)
- [Artifact Types: Anchor, Contract, Skill](#artifact-types-anchor-contract-skill)
- [Quality Criteria](#quality-criteria)
- [Testing Your Semantic Anchor](#testing-your-semantic-anchor)
- [Viability Test (Does the anchor deliver?)](#viability-test-does-the-anchor-deliver)
- [Developer Setup](#developer-setup)
- [How to Propose a New Anchor](#how-to-propose-a-new-anchor)
- [Anchor File Format](#anchor-file-format)
- [Counter-Examples](#counter-examples)
- [Categories](#categories)
- [Professional Roles](#professional-roles)
- [PR Review Policy](#pr-review-policy)
- [Issue Title Convention](#issue-title-convention)
- [Code of Conduct](#code-of-conduct)
- [Questions?](#questions)
- [License](#license)

## What are Semantic Anchors?

Semantic anchors are well-defined terms, methodologies, and frameworks that serve as reference points when communicating with Large Language Models (LLMs). They act as shared vocabulary that triggers specific, contextually rich knowledge domains within an LLM's training data.

**Example:** When you mention "TDD, London School" to an LLM, it activates knowledge about mock-heavy testing, outside-in development, and the work of Steve Freeman and Nat Pryce - much richer than simply saying "use mocks in testing."

## Artifact Types: Anchor, Contract, Skill

The catalog ships three artifact types. Knowing which one you are proposing decides where your contribution belongs. The full rationale lives in [ADR-007](docs/specs/adrs/adr-007-artifact-taxonomy.adoc); the working definitions are here.

| Type | Function | Linguistic shape | Loading |
|------|----------|-----------------|---------|
| **Anchor** | "What do I know?" — focuses pre-existing knowledge | Noun / named concept ("Cockburn Use Cases") | Passive (activation signal) |
| **Contract** | "What may I do?" — pins which anchors apply + invariants | Declarative ("follows / NEVER / MUST") | Always-on |
| **Skill** | "How do I do it?" — supplies procedure | Verb / imperative ("Create / Verify / Write") | On-demand |

- **Anchor** — a named activation signal for a knowledge cluster that is *already dense* in an LLM's training data. It focuses; it does not teach. Must pass the four Quality Criteria below.
- **Contract** — terse, always-on shared vocabulary (in `CLAUDE.md` / `AGENTS.md`) that pins which anchors apply and states invariants. The moment it describes *how* to do something step by step, that part belongs in a Skill.
- **Skill** — on-demand procedural machinery (`references/`, prompts, a workflow) for a *how* the model cannot execute from a name alone.

**Discrimination test:**

1. Knowledge already dense in the LLM, only needs focusing → **Anchor**
2. Need to pin which anchors apply and what is allowed/forbidden → **Contract**
3. Need to describe *how* something is concretely done → **Skill**

**The thin-prior rule.** If a name is *not* dense in the training data, it is *not an anchor* — naming it does not reliably change the output structure compared to a generic prompt. What repairs it depends on what is missing: a missing *meaning/framing* → a **Contract** (it supplies its own meaning; a URL never repairs a prior); a missing *procedure* → a **Skill**. A thin name is never forced to be an anchor.

## Quality Criteria

Before proposing a new semantic anchor, ensure it meets these four criteria:

### ✅ Precise

The anchor references a *specific, established body of knowledge* with clear boundaries.

- ✓ "SOLID Principles" - five specific design principles (SRP, OCP, LSP, ISP, DIP)
- ✗ "Good design" - vague and subjective

### ✅ Rich

The anchor activates *multiple interconnected concepts*, not just a single instruction.

- ✓ "Domain-Driven Design" - activates bounded contexts, ubiquitous language, aggregates, value objects, entities, repositories, etc.
- ✗ "Use meaningful names" - single instruction with no conceptual depth

### ✅ Consistent

Different users invoking the anchor should get *similar conceptual activation* from the LLM.

- ✓ "Test-Driven Development" - widely documented methodology with consistent understanding
- ✗ "Modern testing" - different interpretations by different people

### ✅ Attributable

The anchor can be *traced to key proponents, publications, or documented standards*.

- ✓ "Hexagonal Architecture" (Alistair Cockburn, 2005)
- ✗ "Best practices" - no specific source or authority

> **Tip:** Not sure if your proposal qualifies? Check our [Rejected Proposals](https://raifdmueller.github.io/Semantic-Anchors/#/rejected-proposals) page to see previously evaluated terms that didn't meet the criteria — and why.

## Testing Your Semantic Anchor

Before proposing, test the anchor with this prompt in an LLM:

```text
What concepts do you associate with '<your semantic anchor name>'?
```

> **Note:** The proposal template includes a required **LLM Activation Test Result** field. Paste your test output there — it front-loads the Precise/Rich/Consistent signal for reviewers.

Evaluate the response:

- **Recognition**: Does the LLM recognize the term?
- **Accuracy**: Is the explanation correct?
- **Depth**: Does it cover multiple related concepts?
- **Specificity**: Is the scope well-defined?

## Viability Test (Does the anchor deliver?)

Recognition is not activation. A model can talk fluently *about* a term while naming it changes nothing in the output — or worse, silently substitutes an older concept or confabulates a plausible-but-fictitious one. The [training-data-vs-practice](https://llm-coding.github.io/Semantic-Anchors/training-data-vs-practice) article documents these failure modes across model families. The activation test above catches recognition; the viability test below catches delivery.

1. **Before/After test.** Give a model a task *without* the anchor term, then the same task *with* it. Does the output structure change? If not, the term is decorative, not functional.
2. **Substitution check.** Ask "What is [term]?" on a weaker model (Haiku-class). If it hedges, silently substitutes, or confabulates, the prior is too thin for an anchor — it belongs in a **Contract** (which supplies its own meaning), per the thin-prior rule in _Artifact Types_ above.
3. **Cross-model check.** Does the before/after difference hold on at least one weak *and* one strong model? If it only fires on frontier models, note it as ★★ (needs qualification).

A term that passes the four Quality Criteria but fails the viability test is a **Contract**, not an Anchor.

**This gate is topic-neutral.** No subject area is privileged or banned — personality and assessment frameworks (MBTI, DISC, Big Five, HEXACO) are neither excluded for their topic nor admitted for being well-known. They must clear the same Viability Test as any other candidate, and — given their contested empirical standing — carry a `== Criticism` / `== Current Status` section. The rationale is in [ADR-008](docs/specs/adrs/adr-008-personality-assessment-anchors.adoc).

## Developer Setup

### Prerequisites

- Git
- Python 3.12+ (for pre-commit hooks)
- Node.js 20+ (for website development, optional)

### Installing Pre-Commit Hooks

**Required for all contributors!**

Run the installation script:

```bash
./.pre-commit-install.sh
```

This installs:

- **AsciiDoc Linter** - validates anchor file syntax automatically
- **pre-commit framework** - runs checks before each commit
- **Standard hooks** - trailing whitespace, YAML/JSON validation

### Manual Hook Execution

Run all hooks on all files:

```bash
pre-commit run --all-files
```

Run specific hook:

```bash
pre-commit run asciidoc-linter --all-files
```

> **Note:** Local build artifacts (e.g. `website/dist/`, generated files in `website/public/docs/`) must not be committed. These are produced by the CI/CD pipeline.

## How to Propose a New Anchor

We use an **automated workflow with GitHub Copilot** to validate and enrich proposals:

### Step 1: Create an Issue

Click the [Propose New Anchor](https://github.com/LLM-Coding/Semantic-Anchors/issues/new?template=propose-anchor.yml) button on the [website](https://raifdmueller.github.io/Semantic-Anchors/) or create an issue using our proposal template.

**All you need to provide:**

- The term or concept name
- An LLM activation test result (required)
- (Optional) Why you think it would be valuable

### Step 2: Copilot Validation

GitHub Copilot automatically:

1. Tests the anchor against the four quality criteria
2. Either accepts or rejects the proposal
3. If rejected: Explains why it doesn't meet criteria
4. If accepted: Enriches the issue with detailed information

### Step 3: Copilot Creates the Anchor

Once accepted and enriched, Copilot is assigned to:

1. Create the AsciiDoc file in `docs/anchors/`
2. Add all required metadata (categories, roles, proponents, tags)
3. Submit a Pull Request
4. Maintainers review and merge

### Step 4: Published

After merge, the new anchor appears on the website within minutes via automated deployment!

## Anchor File Format

Each anchor is stored as an AsciiDoc file with metadata attributes:

```asciidoc
= TDD, London School
:categories: testing-quality
:roles: software-developer, qa-engineer, software-architect
:related: tdd-chicago-school, hexagonal-architecture
:proponents: Steve Freeman, Nat Pryce
:tags: testing, tdd, mocking, outside-in
:tier: 2

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

### Required Metadata

- `:categories:` — One or more category IDs (see website for list)
- `:roles:` — One or more professional role IDs (see [Professional Roles](#professional-roles) for valid IDs)
- `:proponents:` — Key people, publications, or standards. If the anchor is an established term of art with no single originator (e.g. `sota`, `ssot-principle`), use the sentinel `Community` rather than omitting the required field or inventing an attribution. A missing proponent is a signal worth checking: a term traceable to no person, publication, or standard is weakly _attributable_ and may be general vocabulary rather than a semantic anchor.
- `:tags:` — Keywords for search (optional but recommended)
- `:related:` — Related anchor IDs (optional)
- `:tier:` — Activation tier: `1` (frontier-only), `2` (needs qualification), `3` (broadly recognized)
- `:advisory:` — Short caution label (optional). Use only for *counter-consensus framing*: the anchor activates reliably but its framing conflicts with its own field's documented consensus. Renders as a visible badge in the card/modal; keep the detail and the cited source in the `== Criticism` / `== Current Status` section (single source of truth). See `eisenhower-matrix.adoc`.

### Criticism and Current Status (research required, include when found)

The catalog is a lexicon, not a list of endorsements — inclusion means the term works as a precise pointer, not that we recommend the practice. For every new anchor, research whether documented criticism or drift exists, and add the finding as a section:

- `== Criticism` — the method itself is contested. Only named, citable critique (critic + linked source), never vibes like "nobody uses this anymore". The section reports the discourse; it does not adjudicate. Where the discourse names alternatives, name them too.
- `== Current Status` — the method stands, but the training-data prior and the present have drifted apart: a newer edition exists (name the edition the prior likely points to), a successor emerged, or adoption faded.

Verify every linked source by actually fetching it before committing. If the research finds nothing citable, omit both sections — an empty section is noise. See [#603](https://github.com/LLM-Coding/Semantic-Anchors/issues/603) for the full-catalog triage behind this convention.

## Counter-Examples

These are **NOT** semantic anchors:

| Term | Why not |
|------|---------|
| "TLDR" | Underspecified instruction, no defined structure |
| "ELI5" | Vague target level, no pedagogical framework |
| "Keep it short" | Pure instruction, no conceptual depth |
| "Best practices" | No specific body of knowledge, not attributable |
| "Modern approach" | Too vague, not consistent across users |

## Categories

Anchors are organized into 12 MECE (Mutually Exclusive, Collectively Exhaustive) categories:

1. Communication & Presentation
2. Design Principles & Patterns
3. Development Workflow
4. Dialogue & Interaction Patterns
5. Documentation Practices
6. Meta (repository and catalog concepts)
7. Problem-Solving Methodologies
8. Requirements Engineering
9. Software Architecture
10. Statistical Methods & Process Monitoring
11. Strategic Planning & Decision Making
12. Testing & Quality Practices

See the website for full category descriptions.

## Professional Roles

Anchors are tagged with professional roles to help filter relevant content. Use the **role ID** (kebab-case) in the `:roles:` metadata attribute.

See [`docs/roles/`](docs/roles/) for detailed role descriptions (EN + DE).

### Operational Professional Roles

| ID | Display Name |
|----|--------------|
| software-developer | Software Developer / Engineer |
| software-architect | Software Architect |
| qa-engineer | QA Engineer / Tester |
| devops-engineer | DevOps Engineer |
| product-owner | Product Owner / Product Manager |
| business-analyst | Business Analyst / Requirements Engineer |
| technical-writer | Technical Writer / Documentation Specialist |
| ux-designer | UX Designer / Researcher |
| data-scientist | Data Scientist / Statistician |
| consultant | Consultant / Coach |
| team-lead | Team Lead / Engineering Manager |
| educator | Educator / Trainer |

### Organizational Governance Roles

| ID | Display Name |
|----|--------------|
| data-protection-officer | Data Protection Officer |
| ethics-officer | Ethics Officer |
| legal-compliance | Legal & Compliance |

## PR Review Policy

### Review Requirements

All pull requests to `main` require at least one approving review before merging.

### Sampling Review (~20%)

For active periods with many contributions, maintainers apply a **20% sampling review**:

- At least 1 in 5 PRs receives a thorough, line-by-line review
- All other PRs receive a high-level review (structure, quality criteria, CI status)
- AI-generated PRs (GitHub Copilot) always receive human review

### Automated Checks (Required to Pass)

Every PR must pass all of the following before merge:

- **E2E Tests** — all 28+ Playwright tests green
- **Lint & Format Check** — ESLint + Prettier (no errors)
- **Dependency Audit** — `npm audit --audit-level=high` clean
- **CodeQL** — no high/critical security findings
- **AsciiDoc Linter** — anchor files conform to format (pre-commit hook)

### What Reviewers Check

For **new semantic anchors**:

1. Quality criteria met (Precise, Rich, Consistent, Attributable)
2. All required metadata attributes present (`:categories:`, `:roles:`, `:proponents:`, `:tier:`)
3. AsciiDoc format correct (`[%collapsible]` block, proper attribute syntax)
4. Anchor tested with LLM prompt (see [Testing Your Semantic Anchor](#testing-your-semantic-anchor))
5. Documented criticism / edition drift researched — and captured in a _Criticism_ or _Current Status_ section with named, fetch-verified sources where found

For **code changes**:

1. No regressions in existing tests
2. No new high/critical security vulnerabilities
3. Follows ESLint/Prettier code style
4. No build artifacts in commit (e.g. `website/dist/`, generated files)

### AI-Assisted Reviews

This project uses **CodeRabbit** for automated AI code review on all PRs. CodeRabbit reviews are advisory — human maintainer approval is still required.

## Issue Title Convention

All issues should follow a consistent `[Type]: <Name>` title format. This makes filtering, searching, and triaging materially easier.

### Recognized Prefixes

| Prefix | Used For | Source |
|--------|----------|--------|
| `[Anchor Proposal]:` | New semantic anchor proposals | Issue template |
| `[Contract Proposal]:` | New semantic contract proposals | Issue template |
| `[Improve]:` | Improvements to existing anchors | Issue template |
| `[Bug]:` | Bug reports | Issue template |
| `[Process Proposal]:` | Changes to project processes | Issue template |
| `[Feature]:` | Feature requests | Free-form |
| `EPIC:` | Tracking issues for larger initiatives | Free-form |

### Guidelines

- **Use the issue template** whenever one exists — the prefix is set automatically.
- **Free-form issues** (no matching template) should manually use one of the recognized prefixes.
- **Apply going forward only** — do not retro-rename closed issues.
- **EPICs** use the bare `EPIC:` prefix without brackets, as a sanctioned exception.

## Code of Conduct

### Our Pledge

We pledge to make participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behaviors:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behaviors:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project maintainers. All complaints will be reviewed and investigated and will result in a response that is deemed necessary and appropriate to the circumstances.

## Questions?

- Browse existing anchors on the [website](https://raifdmueller.github.io/Semantic-Anchors/)
- Check the [README](README.adoc) for project overview
- Open a [GitHub issue](https://github.com/LLM-Coding/Semantic-Anchors/issues) for questions

## License

By contributing, you agree that your contributions will be licensed under the same license as this project (see [LICENSE](LICENSE) file).

---

**Ready to propose?** Click here: [Propose New Semantic Anchor](https://github.com/LLM-Coding/Semantic-Anchors/issues/new?template=propose-anchor.yml)
