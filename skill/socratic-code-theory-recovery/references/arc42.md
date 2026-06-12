# arc42 — Decomposition Guide for Q3 (Architecture)

arc42 is a 12-chapter template for documenting software architecture (Gernot Starke, Peter Hruschka). In this skill, the 12 chapters are the **fixed second level** of the Q3 branch — Q3.1 through Q3.12, in arc42 order. Every chapter is emitted as a node on every run, even when its only leaf is `[OPEN]`. Free decomposition happens only *below* these fixed nodes.

## The 12 sections as Q3 sub-questions

| Q-ID | Section | Sub-question(s) |
|------|---------|-----------------|
| Q3.1 | Introduction and Goals | What does the system do at the highest level? Which 3-5 quality goals drive design? Who are the most important stakeholders? |
| Q3.2 | Architecture Constraints | Which technical (Q3.2.1), organizational/process (Q3.2.2), conventional (Q3.2.3) constraints restrict design choices? Fixed third level — look beyond code: CLAUDE.md/AGENTS.md, CONTRIBUTING, CI config, linter rules are valid evidence. |
| Q3.3 | Context and Scope | What are the system's external interfaces — neighbours, channels, protocols? Business context vs technical context? |
| Q3.4 | Solution Strategy | Which fundamental decisions and patterns shape the architecture? Technology choices, top-level decomposition, quality-goal approaches, organizational decisions? |
| Q3.5 | Building Block View | How is the system decomposed into containers, components, classes? Static structure at multiple levels of zoom. |
| Q3.6 | Runtime View | How do components interact for the most important scenarios — startup, user-visible flows, error handling? |
| Q3.7 | Deployment View | Which hardware/infrastructure runs the system? Deployment topology, environments, mapping building blocks to infrastructure. |
| Q3.8 | Crosscutting Concepts | Domain models, architecture/design patterns used, persistence, UI, communication, plausibility checks, exception/error handling, logging, security, internationalisation, configurability? |
| Q3.9 | Architecture Decisions | Why was each significant decision made? Each becomes a Nygard ADR — see [nygard-adrs.md](nygard-adrs.md). |
| Q3.10 | Quality Requirements | Quality tree and quality scenarios. Synthesized from the `[ANSWERED]` Q4 scenarios plus the `Q4.9` ranking — never just an `[OPEN]` pointer. The Q4 branch derives the scenarios; see [iso-25010.md](iso-25010.md). |
| Q3.11 | Risks and Technical Debt | Known technical risks, debt items, and their mitigation status. Overlaps with Q5. |
| Q3.12 | Glossary | Domain terminology — terms the team uses with project-specific meaning. |

## Decomposition hints

- **Q3.1 Quality Goals** is *almost always* `[OPEN]` — priorities live in stakeholder heads, not code. Don't fake a ranking from package structure.
- **Q3.4 Solution Strategy** and **Q3.9 Architecture Decisions** are the *why* of the system. Code shows *what* was decided; the *why* is `[OPEN]` unless ADRs or commit messages explain it.
- **Q3.5 Building Block View** is the most code-derivable section. Walk packages/modules and trace dependencies.
- **Q3.6 Runtime View** is partially derivable — entry points, request flows. Error scenarios are often `[OPEN]` because the team's *intent* differs from what happens to compile.
- **Q3.11 Risks/Tech Debt** is `[OPEN]` unless TODO/FIXME comments are systematically maintained. Recent bug fixes and reverts often hint at debt the team already knows about.

## When to stop decomposing

A Q3 sub-question is fine-grained enough to be a leaf when:

- It can be answered with a single file:line reference, or
- It cannot be answered at all from code (mark `[OPEN]` with category and role).

Avoid making sub-questions like "How does the system handle errors?" — too broad. Prefer "What happens when `OrderService.create()` is called with a duplicate idempotency key?" — answerable.

## Reference

- Project: https://arc42.org/
- Anchor in the catalog: https://llm-coding.github.io/Semantic-Anchors/anchor/arc42
