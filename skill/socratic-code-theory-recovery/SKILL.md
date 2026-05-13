---
name: socratic-code-theory-recovery
description: Recover the "theory" (Naur 1985) of an existing codebase through recursive question refinement before writing documentation. Use on brownfield projects where the spec is missing — produces a Question Tree separating what is answerable from code (with evidence) from what must be asked of the team (routed by role). Phase 1 builds the tree; team answers the OPEN leaves; Phase 2 synthesizes PRD, Cockburn use cases, arc42 architecture, and Nygard ADRs from the answered tree.
metadata:
  author: LLM-Coding
  version: "0.1"
  source: https://github.com/LLM-Coding/Semantic-Anchors
license: MIT
---

# Socratic Code-Theory Recovery

Reverse-engineer a bounded context into documentation without hallucinating the parts the code cannot tell you.

## When to use this skill

Use this skill on a brownfield codebase when:

- Documentation is missing, outdated, or untrusted.
- A change is about to be made and you need a spec before you can change safely.
- You want documentation that distinguishes code-derived facts from team-supplied context — auditable, not generated prose.
- You want to surface the *open questions* in the system, not just synthesize an answer the team has not seen.

Do **not** use this skill when:

- You are doing greenfield development — use the spec-driven workflow instead.
- The whole system needs to be documented at once — work one bounded context at a time.
- The code is not runnable — fix that first.

## The contract

This skill implements the *Socratic Code-Theory Recovery* contract from the Semantic Anchors project. The methodology rests on Peter Naur's 1985 paper *Programming as Theory Building*: a program's theory lives in the heads of its developers and cannot be fully captured in code alone. A documentation-recovery process that ignores this produces confident-looking prose that fills in the gaps with invention.

The fix: model the gaps explicitly. Every question about the system is either `[ANSWERED]` from code (with file:line evidence) or `[OPEN]` (with a category and the role that must answer it). The OPEN leaves are the handoff to humans.

## Two-phase workflow

```
                  ┌────────────────────────────────┐
   Phase 1        │  CODE  ──►  Question Tree       │
                  │             ├─ [ANSWERED] leaves│
                  │             └─ [OPEN] leaves    │
                  └────────────────┬───────────────┘
                                   ▼
                  ┌────────────────────────────────┐
   Between        │  OPEN_QUESTIONS.adoc           │
                  │  ──► team (routed by role)     │
                  │  ──► answers fill in OPENs     │
                  └────────────────┬───────────────┘
                                   ▼
                  ┌────────────────────────────────┐
   Phase 2        │  Answered tree ──► Docs         │
                  │  PRD · Cockburn UCs · arc42 ·   │
                  │  Nygard ADRs (every claim Q-ID) │
                  └────────────────────────────────┘
```

### Phase 1: Build the Question Tree

Use [prompts/phase-1-question-tree.md](prompts/phase-1-question-tree.md). Adapt the bounded-context path and any domain-specific Q1 examples; do not change the leaf classification, Q-ID scheme, or output files.

Outputs:

- `QUESTION_TREE.adoc` — the full hierarchical reasoning trace
- `OPEN_QUESTIONS.adoc` — only the `[OPEN]` leaves, grouped by Ask role

Decomposition heuristics — use these Semantic Anchors as guides, not as rigid templates:

- **arc42** — 12 architecture sub-questions (Q3 branch). See [references/arc42.md](references/arc42.md).
- **Cockburn Use Cases** — specification structure (Q2 branch). See [references/cockburn-use-cases.md](references/cockburn-use-cases.md).
- **ISO/IEC 25010** — 8 quality characteristics (Q4 branch). See [references/iso-25010.md](references/iso-25010.md).
- **Nygard ADRs** — design-rationale capture (Q3.9 branch). See [references/nygard-adrs.md](references/nygard-adrs.md).

Leaf classification rules and Q-ID scheme: [references/output-schema.md](references/output-schema.md).

Worked examples — one `[ANSWERED]` and one `[OPEN]` leaf for each major branch: [references/examples.md](references/examples.md).

### Between Phases: Team answers the OPEN leaves

Route `OPEN_QUESTIONS.adoc` to the people whose role appears in each section: Product Owner, Architect, Developer, Domain Expert, Operations. In one controlled experiment with a 13,000-line Go codebase, 11 targeted OPEN questions were enough to close the gap to the original documentation.

Team answers are written **directly into `OPEN_QUESTIONS.adoc`** under each question, marked clearly. Do not call Phase 2 until every OPEN leaf has either an answer or an explicit `(deferred)` marker.

### Phase 2: Synthesize documentation

Use [prompts/phase-2-synthesize.md](prompts/phase-2-synthesize.md). The Phase 2 LLM reads the answered tree and produces:

- **PRD** from the Q1 branch (problem, users, goals, success criteria)
- **Specification** from the Q2 branch (Cockburn use cases at User Goal level, system use cases for each technical interface, supplementary specifications)
- **arc42** with all 12 chapters from the Q3 branch
- **Nygard ADRs** with Pugh Matrix from the Q3.9 branch

Every claim references a Q-ID. Team-supplied information is marked `(team answer)`. This dual traceability — code evidence plus team input — is the difference from a simple reverse-engineering prompt that fills in gaps silently.

## What the LLM can and cannot recover

A controlled experiment (deleting documentation from a greenfield project and regenerating it from code) showed:

**Derivable from code**: functional requirements, acceptance criteria, building-block views, glossary, security mechanisms, crosscutting concepts.

**NOT derivable from code**: business context, design rationale (the ADR "why"), quality-goal *priorities*, stakeholder concerns, aspirational features, performance budgets, tutorials, review results.

If your synthesized documentation contains a claim from the second list without a `(team answer)` marker, the LLM hallucinated it. Mark it `[OPEN]` and ask the team.

## Spec drift and reconciliation

After this skill produces documentation, the implementation LLM will add security hardening, validation rules, and edge cases that are not in the spec. This is structural, not a discipline problem. Re-run Phase 1 against the current code periodically — before a release, after a security review, before onboarding — and diff against the existing spec. The diff reveals NEW (in code, not in spec), CHANGED (diverged), and DEAD (in spec, not in code).

## Further reading

- Peter Naur, *Programming as Theory Building* (1985). https://pages.cs.wisc.edu/~remzi/Naur.pdf
- Brownfield Workflow (Semantic Anchors). https://llm-coding.github.io/Semantic-Anchors/brownfield
- Brownfield Experiment Report. https://llm-coding.github.io/Semantic-Anchors/brownfield-experiment-report
- Fair Comparison Report (three recovery approaches). https://llm-coding.github.io/Semantic-Anchors/brownfield-fair-comparison
