# Anchor Selection

## Onboarding Interview

Ask these questions before writing startup files:

1. Is the onboarding scope project-wide, home-directory, or both?
2. Which agents must load the anchors at session start?
3. Which categories should be always on, and which should stay task-local?
4. Which conflict groups need a single primary choice?
5. What should happen when a selected anchor conflicts with an explicit user instruction?

Default answer for question 5: explicit user instructions win.

## Conflict Groups

Force a single primary choice in these clusters unless the user explicitly wants multiple lenses and understands the tradeoff.

| Cluster | Ask the user | Rule |
| --- | --- | --- |
| `TDD, Chicago School` vs `TDD, London School` | Which TDD style should shape defaults? | Choose one primary TDD style. Mixing both as always-on guidance creates contradictory advice on mocks and design direction. |
| `ADR according to Nygard` vs `MADR` | Which ADR template should be the house format? | Choose one default ADR template. Both solve the same documentation problem. |
| `DRY` vs `SPOT` vs `SSOT` | Which term should be the house vocabulary for duplication and source authority? | Pick one primary term and optionally mention the others as synonyms. Using all three as separate top-level defaults usually adds noise. |
| `BLUF` vs `Pyramid Principle` | Which communication shape should come first in default responses? | They can coexist, but choose one default output shape: `BLUF` for brevity, `Pyramid Principle` for structured argumentation. |
| `Clean Architecture` vs `Hexagonal Architecture` | Which structural lens should dominate when the agent proposes boundaries? | They can coexist, but name one primary architecture frame to avoid vague hybrids. |
| `Socratic Method` vs `Feynman Technique` vs `Rubber Duck Debugging` vs `Devil's Advocate` | Which interaction mode should be always on, if any? | Keep at most one as always-on behavior. The others are better as task-local prompting modes. |
| `Problem Space NVC` vs `JTBD` vs `Impact Mapping` vs `User Story Mapping` | Which product-discovery lens should lead planning? | These can stack, but pick one primary planning lens so the agent does not switch frames mid-session. |
| `Chain of Thought` | Should stepwise reasoning be explicitly requested at startup? | Prefer task-local use. Many agents do not expose or honor reasoning instructions in the same way. |

## Safe Always-On Defaults

These anchors usually work well as always-on defaults when they match the team's real conventions:

- `Testing Pyramid`
- `SOLID Principles`
- `Hexagonal Architecture` or `Clean Architecture`
- `Domain-Driven Design`
- `ADR according to Nygard` or `MADR`
- `Diataxis Framework`
- `Docs-as-Code`
- `BLUF` or `Pyramid Principle`
- `Conventional Commits`
- `Semantic Versioning`

## Usually Task-Local

Keep these out of the startup file unless the user explicitly wants them always on:

- `Chain of Thought`
- `Devil's Advocate`
- `Feynman Technique`
- `Rubber Duck Debugging`
- `Five Whys`
- `Morphological Box`
- `Chatham House Rule`
- `Pugh-Matrix`
- `Wardley Mapping`

## Category Guide

### Communication & Presentation

Ask: Which communication default should shape every answer: concise conclusion-first, structured argument, categorization hygiene, or private-by-default conversation handling?

| Anchor | One-sentence explainer |
| --- | --- |
| `BLUF (Bottom Line Up Front)` | Lead with the conclusion or recommendation before supporting detail. |
| `Chatham House Rule` | Allow ideas to be reused while avoiding attribution to individual speakers or organizations. |
| `MECE Principle` | Structure categories so they do not overlap and collectively cover the space. |
| `Pyramid Principle according to Barbara Minto` | Present the answer first, then organize supporting arguments into a logical hierarchy. |

### Design Principles & Patterns

Ask: Which implementation-level design principles should be treated as the default coding vocabulary?

| Anchor | One-sentence explainer |
| --- | --- |
| `DRY (Don't Repeat Yourself)` | Keep each piece of knowledge represented once to reduce drift and duplicated logic. |
| `Patterns of Enterprise Application Architecture (PEAA)` | Reach for well-known enterprise application patterns such as Repository, Unit of Work, or Data Mapper when they fit. |
| `SOLID Principles` | Favor modular, change-tolerant object design with clear responsibilities and dependency direction. |
| `SPOT (Single Point of Truth)` | Make one implementation location authoritative for a behavior or fact. |
| `SSOT (Single Source of Truth)` | Make one system authoritative for a given class of data or business fact. |

### Development Workflow

Ask: Which workflow conventions should the agent apply automatically to commits, releases, CSS, evidence gathering, or regulated work?

| Anchor | One-sentence explainer |
| --- | --- |
| `BEM Methodology` | Name CSS classes by block, element, and modifier so styles stay composable and predictable. |
| `Conventional Commits` | Format commit messages with a structured type-and-scope prefix that supports automation and readable history. |
| `Mental Model according to Naur` | Optimize for preserving developer understanding, not just source code text. |
| `Regulated Environment` | Apply traceability, validation, and evidence standards appropriate for compliance-heavy work. |
| `Semantic Versioning (SemVer)` | Signal breaking changes, features, and fixes through `MAJOR.MINOR.PATCH` versioning. |
| `SOTA (State-of-the-Art)` | Compare recommendations against the current best-known methods, not just familiar defaults. |
| `TIMTOWTDI` | Accept that more than one technically valid implementation path can exist. |
| `todo.txt-flavoured Markdown` | Track work in Markdown while preserving todo.txt-style metadata such as priority, contexts, or projects. |

### Dialogue Interaction

Ask: Do you want the agent to default to guided questioning, or should dialogue style stay neutral?

| Anchor | One-sentence explainer |
| --- | --- |
| `Socratic Method` | Use targeted questions to surface assumptions, gaps, and stronger conclusions. |

### Documentation

Ask: Should the default documentation lens focus on document types, developer workflow, or both?

| Anchor | One-sentence explainer |
| --- | --- |
| `Diataxis Framework` | Separate docs into tutorials, how-to guides, explanations, and reference so each serves one user need. |
| `Docs-as-Code according to Ralf D. Müller` | Manage documentation with the same version control, review, and automation discipline as software. |

### Meta

Ask: Should the onboarding include rules for proposing or evaluating new semantic anchors, or only for using existing ones?

| Anchor | One-sentence explainer |
| --- | --- |
| `The Spectrum of Semantic Anchors` | Distinguish strong, well-defined anchors from vague terms that do not activate a reliable knowledge frame. |

### Problem Solving

Ask: Which problem-solving style, if any, should be persistent rather than invoked only when needed?

| Anchor | One-sentence explainer |
| --- | --- |
| `Chain of Thought (CoT)` | Encourage explicit stepwise reasoning when the agent and platform support it. |
| `Devil's Advocate` | Stress-test a proposal by deliberately arguing against it. |
| `Feynman Technique` | Explain a concept simply to expose missing understanding and refine it. |
| `Five Whys (Ohno)` | Keep asking why until the likely root cause becomes visible. |
| `Morphological Box` | Explore a solution space by combining options across multiple parameters. |
| `Rubber Duck Debugging` | Explain the problem line by line to uncover hidden assumptions or mistakes. |

### Requirements Engineering

Ask: Which requirements lens should the agent use by default when shaping scope, stories, or acceptance criteria?

| Anchor | One-sentence explainer |
| --- | --- |
| `EARS-Requirements` | Write requirements using constrained sentence patterns that reduce ambiguity. |
| `MoSCoW` | Prioritize scope into must-have, should-have, could-have, and won't-have buckets. |
| `Problem Space NVC` | Frame work in terms of observations, needs, value, and constraints before jumping to solutions. |
| `User Story Mapping` | Organize work by user journey horizontally and release slices vertically. |

### Software Architecture

Ask: Which architecture and design-record conventions should the agent assume without asking each time?

| Anchor | One-sentence explainer |
| --- | --- |
| `ADR according to Nygard` | Capture architecture decisions with a lightweight record of context, decision, and consequences. |
| `arc42 Architecture Documentation` | Document software architecture using a standard twelve-part structure. |
| `ATAM` | Evaluate architecture through quality attributes, tradeoffs, risks, and scenarios. |
| `C4-Diagrams` | Explain architecture with a consistent zoom model from system context down to code. |
| `Clean Architecture` | Keep business rules central and independent from frameworks, UI, and infrastructure. |
| `Domain-Driven Design according to Evans` | Model software around bounded contexts, ubiquitous language, and domain behavior. |
| `GoM` | Create models that are correct, relevant, economical, and understandable. |
| `Hexagonal Architecture (Ports & Adapters)` | Isolate core logic behind ports so external systems stay in adapters. |
| `LASR by Toth/Zörner` | Describe systems through layered solution strategy, architecture, and rationale. |
| `MADR` | Record architecture decisions in Markdown with explicit alternatives and consequences. |

### Statistical Methods

Ask: Is the team monitoring delivery or operational behavior statistically, or should these methods stay out of startup guidance?

| Anchor | One-sentence explainer |
| --- | --- |
| `Control Chart (Shewhart)` | Plot process behavior over time against control limits to spot instability. |
| `Nelson Rules` | Detect non-random patterns in control-chart data using a standard set of signals. |
| `SPC (Statistical Process Control)` | Manage process stability using statistical evidence rather than anecdote. |

### Strategic Planning

Ask: Which strategic lens should guide product or architecture recommendations when the user gives only a broad goal?

| Anchor | One-sentence explainer |
| --- | --- |
| `Cynefin Framework` | Match the decision approach to whether the domain is clear, complicated, complex, or chaotic. |
| `Impact Mapping` | Connect a goal to actors, impacts, and deliverables through a simple cause chain. |
| `Jobs To Be Done (JTBD)` | Focus on the underlying user job rather than only requested features. |
| `Pugh-Matrix` | Compare options against weighted criteria relative to a baseline. |
| `Wardley Mapping` | Map user needs, components, and evolution stage to guide strategic choices. |

### Testing & Quality Practices

Ask: Which testing philosophy should shape design by default, and which quality lenses should always be considered?

| Anchor | One-sentence explainer |
| --- | --- |
| `IEC 61508 SIL Levels` | Choose engineering rigor according to the safety integrity level of the system. |
| `Mutation Testing` | Measure how well tests detect faults by running them against deliberate code mutations. |
| `OWASP Top 10` | Review changes against the most common and damaging web-application security risks. |
| `Property-Based Testing` | Define invariants and generate many inputs to test behavior beyond examples. |
| `TDD, Chicago School` | Drive design from state-based tests, simple objects, and minimal mocking. |
| `TDD, London School` | Drive design from object collaborations and interfaces using outside-in tests and mocks. |
| `Testing Pyramid` | Favor many fast unit tests, fewer integration tests, and the fewest end-to-end tests. |
