# Nygard ADRs — Decomposition Guide for Q3.9 (Design Rationale)

Michael Nygard's Architecture Decision Records (ADRs) capture *why* a design choice was made. In this skill ADRs form the Q3.9 branch — one sub-tree per architecturally significant decision.

## The Nygard format as Q3.9 sub-questions

| Field | Sub-question | Code derivability |
|-------|--------------|-------------------|
| **Title** | What is the decision in one short noun phrase? | `[ANSWERED]` — what was chosen is in the code |
| **Status** | Proposed / Accepted / Deprecated / Superseded by? | `[ANSWERED]` if the code reflects an active choice |
| **Context** | What forces led to the decision? | Usually `[OPEN]` — context is in stakeholders' heads, ticket history, or off-list discussions |
| **Decision** | What is the chosen approach? | `[ANSWERED]` — visible in code structure |
| **Consequences** | What follows from the decision — positive and negative? | Partially `[ANSWERED]` (visible coupling, complexity), partially `[OPEN]` (long-term implications) |

## How to identify "architecturally significant" decisions

A decision belongs in Q3.9 when at least one of these holds:

- It is structurally hard to reverse (would require rewriting more than one module).
- It directly trades off two or more quality goals from Q4.
- It commits the project to an external dependency, vendor, or paradigm.

If a decision is *easy to reverse* (a function-level pattern, a variable name), it does not belong in an ADR.

Typical candidates the LLM can spot from code:

- Language and framework choices
- Persistence approach (SQL vs document, ORM choice, schema migration tooling)
- Communication style (sync REST vs async events vs RPC)
- Authentication and authorisation approach
- Build and packaging strategy (mono vs poly repo, deployment unit shape)
- Top-level decomposition pattern (layered, hexagonal, clean, modular monolith, microservices)

## Pugh Matrix for alternatives

For each ADR, include a Pugh Matrix listing the alternatives considered. Use a 3-point scale (-1, 0, +1) and score each alternative against the quality goals from Q4. The chosen alternative is the column with the highest sum; alternatives with similar scores should produce an explicit explanation in the Decision field.

When code does not show what alternatives were considered (almost always), mark the alternative rows `[OPEN]` with Ask role *Architect*. Even partial answers are valuable — "we considered X but rejected it because Y" is the single most useful piece of an ADR.

## What is typically [OPEN]

The Context and the alternatives are almost always `[OPEN]`:

- *Why* was this approach chosen, not the alternative?
- What constraints (legal, organisational, timeline) shaped the decision?
- Who made the decision, and is it still binding?
- Is the decision being revisited, deprecated, or superseded?

Status sometimes becomes `[OPEN]` for older systems where the decision was never reaffirmed but the code still reflects it.

## When to stop decomposing

Each ADR is a Q3.9 sub-tree with five leaves (one per Nygard field). Don't decompose further; if a field is too broad for one leaf, the decision itself is too broad and should be split into multiple ADRs.

## Reference

- Michael Nygard, *Documenting Architecture Decisions* (2011). https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions
- Anchor in the catalog: https://llm-coding.github.io/Semantic-Anchors/anchor/adr-according-to-nygard
