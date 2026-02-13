# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This repository is a curated catalog of **semantic anchors** - well-defined terms, methodologies, and frameworks that serve as reference points when communicating with Large Language Models (LLMs). Semantic anchors act as shared vocabulary that triggers specific, contextually rich knowledge domains within an LLM's training data.

The primary artifact is `README.adoc`, which contains the entire catalog organized by category.

## File Format

All content is written in **AsciiDoc** format (.adoc), not Markdown. Key AsciiDoc patterns used in this repository:

- Section headers: `== Level 1`, `=== Level 2`, `==== Level 3`
- Collapsible sections: `[%collapsible]` followed by `====` delimiters
- Anchors: `[[anchor-id]]` before a section header
- Internal links: `<<anchor-id,Link Text>>`
- Bullet lists: `*` for unordered, `.` for ordered (not `-` like Markdown)
- Bold text: `*bold*` (not `**bold**`)
- Code blocks: `[source]` or `[source,language]` followed by `----` delimiters

## Contributing New Semantic Anchors

### Quality Criteria for Semantic Anchors

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

Before adding a new anchor to the catalog, test it with this prompt:

```
What concepts do you associate with '<semantic anchor name>'?
```

Evaluate the response for:
1. Recognition - does the LLM know this term?
2. Accuracy - are the concepts correct?
3. Depth - deep understanding vs. surface knowledge?
4. Specificity - distinguishes from similar concepts?

### Standard Format for New Anchors

Each semantic anchor follows this structure:

```asciidoc
[[anchor-id]]
==== Anchor Name

[%collapsible]
====
*Full Name*: Complete formal name or expansion

*Also known as*: Alternative names (optional)

*Core Concepts*:

* Key concept 1 with brief explanation
* Key concept 2 with brief explanation
* Key concept 3 with brief explanation

*Key Proponents*: Name(s) and key publications

*When to Use*:

* Use case 1
* Use case 2
* Use case 3

*Related Concepts*: (optional) Links to related anchors
====
```

### Finding the Right Category

Place new anchors in the appropriate section:

- **Testing & Quality Practices**: TDD, Property-Based Testing, Mutation Testing, etc.
- **Architecture & Design**: arc42, ADR, C4-Diagrams, Hexagonal Architecture, etc.
- **Design Principles & Patterns**: SOLID, DRY, DDD, SPOT, SSOT, etc.
- **Requirements Engineering**: User Story Mapping, Impact Mapping, EARS, Jobs To Be Done, etc.
- **Documentation**: Docs-as-Code, Diátaxis Framework
- **Communication & Presentation**: Pyramid Principle, MECE
- **Decision Making & Strategy**: Pugh-Matrix, Cynefin, Wardley Mapping
- **Development Practices**: Mental Model (Naur), Conventional Commits, Semantic Versioning, BEM, etc.
- **Statistical Methods & Process Monitoring**: SPC, Control Charts, Nelson Rules
- **Interaction & Reasoning Patterns**: Socratic Method, BLUF, Chain of Thought, Five Whys, Feynman Technique, etc.

If none fit, propose a new category.

### Contribution Workflow

1. Create a feature branch: `git checkout -b add-semantic-anchor-<name>`
2. Edit `README.adoc` to add the new anchor in the appropriate category
3. Follow the standard format exactly
4. Add the anchor to the table of contents if adding a new top-level section
5. Commit with a descriptive message: `feat: Add <Anchor Name> to <Category> section`
6. Create a PR for review

## Working with AsciiDoc

### Viewing Changes Locally

AsciiDoc files can be:
- Previewed in many IDEs (VS Code with AsciiDoc extension)
- Converted to HTML using `asciidoctor README.adoc`
- Viewed directly on GitHub (renders AsciiDoc natively)

### Common Editing Tasks

**Adding a new anchor**: Copy an existing anchor section and modify all fields. Ensure the anchor ID (`[[anchor-id]]`) is unique and uses kebab-case.

**Linking to other anchors**: Use `<<anchor-id,Display Text>>` or just `<<anchor-id>>` to use the section title.

**Creating collapsible sections**: All anchor definitions should be collapsible using:
```asciidoc
[%collapsible]
====
Content here
====
```

## Repository Conventions

- **No build process**: This is a documentation-only repository
- **No tests**: Content quality is verified through PR review
- **Single source file**: All content lives in `README.adoc`
- **Feature branches**: Use descriptive branch names like `add-semantic-anchor-<name>` or `improve-<section>`
- **PR-based workflow**: All changes should come via pull requests
- **Collapsible by default**: All anchor definitions should be collapsible to keep the page scannable

## Cross-References and Links

When adding new anchors:
- Add internal cross-references to related anchors using `<<anchor-id>>`
- Update existing anchors if they should reference the new one
- Ensure anchor IDs are lowercase-with-hyphens (kebab-case)
- The anchor ID should match or abbreviate the section title

## Content Integrity

- **No AI-generated fluff**: Keep descriptions precise and sourced from established knowledge
- **Attribute properly**: Always cite key proponents and publications
- **Stay objective**: This is a reference catalog, not a persuasive document
- **Verify before adding**: Test the anchor with an LLM first to confirm it's well-established

## Specification Conventions

When creating specifications for this project, follow these conventions:

### Use Cases (`01_use_cases.adoc`)
- Use PlantUML Activity Diagrams for each use case
- Structure each use case with:
  - **Akteure** (Actors)
  - **Vorbedingungen** (Preconditions)
  - **Ablauf** (Flow)
  - **Nachbedingungen** (Postconditions)
  - **Fehlerszenarien** (Error scenarios)

### API Specification (`02_api_specification.adoc`)
- Use OpenAPI-style specification in AsciiDoc format
- Define data models as JSON schemas with descriptions
- Group endpoints by API category:
  - Navigation
  - Content Access
  - Manipulation
  - Meta-Information

### Acceptance Criteria (`03_acceptance_criteria.adoc`)
- Write in Gherkin format (Given-When-Then)
- Group by feature/use case
- **Language**: German

### Component Specifications (e.g., `04_markdown_parser.adoc`)
- Define scope and limitations (explicitly state what it does NOT do)
- Document data models (e.g., as Python dataclasses or equivalent)
- Include acceptance criteria with Gherkin scenarios
- Provide clear interface definitions

### Architecture Decision Records (ADRs)
- Follow **ADR according to Nygard** format:
  - Status (proposed, accepted, deprecated, superseded)
  - Context (forces at play)
  - Decision (what was chosen)
  - Consequences (both positive and negative)
- Include a **Pugh Matrix** for each decision comparing alternatives
- Store ADRs in `src/docs/arc42/chapters/09_architecture_decisions.adoc`
