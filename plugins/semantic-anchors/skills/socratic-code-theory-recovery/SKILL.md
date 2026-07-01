---
name: socratic-code-theory-recovery
description: Recover the "theory" (Naur 1985) of an existing codebase through recursive question refinement before writing documentation. Use on brownfield projects where the spec is missing — produces a Question Tree separating what is answerable from code (with evidence) from what must be asked of the team (routed by role). Phase 1 builds the tree; team answers the OPEN leaves; Phase 2 synthesizes PRD, Cockburn use cases, arc42 architecture, and Nygard ADRs from the answered tree.
metadata:
  author: LLM-Coding
  version: "0.3"
  source: https://github.com/LLM-Coding/Semantic-Anchors
license: MIT
---

# Socratic Code-Theory Recovery

Reverse-engineer a bounded context into documentation without hallucinating the parts the code cannot tell you.

## On invocation

When this skill is invoked:

1. **Check whether the user named a bounded context.** Look at the same message that invoked the skill and at the immediately preceding messages. A valid bounded-context pointer is a path (relative or absolute) to a directory, plus a short human-readable name for what the context is (e.g. `src/auth`, "Authentication"). If both are present, proceed to Phase 1.

2. **If no bounded context is named, ask for it before doing anything else.** Do not start Phase 1 against the current working directory by default — Phase 1 produces files (`QUESTION_TREE-<context-name>.adoc`, `OPEN_QUESTIONS-<context-name>.adoc`) and running it on the wrong directory wastes work. Ask exactly:

   > Which bounded context should I apply Socratic Code-Theory Recovery to? Give me a directory path (the bounded context's code root) and a short human-readable name. If you want the whole current repo treated as one bounded context, say so explicitly.

3. **Once you have the pointer, run Phase 1.** Use [prompts/phase-1-question-tree.md](prompts/phase-1-question-tree.md) — substitute `[bounded context path]` with the user's path and `[context-name]` with the kebab-cased human-readable name. Do not change the leaf classification, Q-ID scheme, or the output-file naming scheme.

4. **Stop after Phase 1.** Tell the user that Phase 1 is complete, where the two output files are, and that the next step is routing `OPEN_QUESTIONS-<context-name>.adoc` to the team. Phase 2 is gated on the file, not on being asked: before starting Phase 2 — even when the user explicitly requests it — check that every `[OPEN]` leaf in `OPEN_QUESTIONS-<context-name>.adoc` has either a team answer or an explicit `(deferred)` marker. If any leaf has neither, do not run Phase 2; list the unanswered leaves instead.

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
   Between        │  OPEN_QUESTIONS-<context>.adoc │
                  │  ──► team (routed by role)     │
                  │  ──► answers fill in OPENs     │
                  └────────────────┬───────────────┘
                                   ▼
                  ┌────────────────────────────────┐
   Phase 2        │  Answered tree ──► Docs         │
                  │  PRD · Cockburn UCs · arc42 ·   │
                  │  Nygard ADRs (claims cite code) │
                  └────────────────────────────────┘
```

### Phase 1: Build the Question Tree

Use [prompts/phase-1-question-tree.md](prompts/phase-1-question-tree.md). Adapt the bounded-context path and the Q1-Q5 wording; do not change the fixed second level, the leaf classification, the Q-ID scheme, or the output-file naming scheme.

Outputs (named after the context so sequential runs on different bounded contexts never overwrite each other):

- `QUESTION_TREE-<context-name>.adoc` — the full hierarchical reasoning trace
- `OPEN_QUESTIONS-<context-name>.adoc` — only the `[OPEN]` leaves, grouped by Ask role

The five root questions decompose into a **fixed second level** — the same enumerated node set on every run, so Q-IDs are stable and trees from different runs can be diffed node-by-node. Adaptive, code-driven decomposition applies only *below* the fixed level. The fixed nodes:

- **Q1.1–Q1.6** — product identity, primary users, channels, why-built, success metrics, segment priority.
- **Q2.1–Q2.6** — actors, use-case catalog, per-interface system specs, data/entity model, acceptance criteria, cross-cutting business rules. See [references/cockburn-use-cases.md](references/cockburn-use-cases.md).
- **Q3.1–Q3.12** — the twelve arc42 chapters, in arc42 order. See [references/arc42.md](references/arc42.md). Design rationale lives in the Q3.9 chapter — see [references/nygard-adrs.md](references/nygard-adrs.md). **Q3.2 (Architecture Constraints) additionally carries a fixed third level** — Q3.2.1 technical, Q3.2.2 organizational/process, Q3.2.3 conventional constraints — because these rarely live in dense code; for this branch, `CLAUDE.md`/`AGENTS.md`, CONTRIBUTING files, CI workflows, and linter configs are valid evidence sources.
- **Q4.1–Q4.8** — the eight ISO/IEC 25010 characteristics; **Q4.9** — which characteristic has priority. See [references/iso-25010.md](references/iso-25010.md).
- **Q5.1–Q5.5** — technical debt, security risks, operational risks, dependency/supply-chain risks, scaling/performance risks.

Every fixed node is emitted even when its only leaf is `[OPEN]` or `[ANSWERED: not applicable]`.

**Depth below the fixed level is adaptive, not fixed.** A node is a leaf only when its question can be answered with specific `file:line` evidence or definitively marked `[OPEN]`. If the honest answer would still be coarse — a whole directory as evidence, one paragraph for an entire arc42 chapter — the node decomposes further (under a four-level cap below each fixed node). Tree depth therefore tracks code density: a small bounded context yields a shallow tree, a large one a deep tree. The fixed skeleton stays diffable; only the depth varies. This prevents the thin-documentation failure where a large context produces one leaf per arc42 chapter and Phase 2 cannot synthesize a substantial chapter without inventing detail.

Leaf classification rules and Q-ID scheme: [references/output-schema.md](references/output-schema.md).

Worked examples — one `[ANSWERED]` and one `[OPEN]` leaf for each major branch: [references/examples.md](references/examples.md).

### Between Phases: Team answers the OPEN leaves

Route `OPEN_QUESTIONS-<context-name>.adoc` to the people whose role appears in each section: Product Owner, Architect, Developer, Domain Expert, Operations. In one controlled experiment with a 13,000-line Go codebase, 11 targeted OPEN questions were enough to close the gap to the original documentation.

Team answers are written **directly into `OPEN_QUESTIONS-<context-name>.adoc`** under each question, marked clearly. Do not call Phase 2 until every OPEN leaf has either an answer or an explicit `(deferred)` marker.

### Phase 2: Synthesize documentation

Use [prompts/phase-2-synthesize.md](prompts/phase-2-synthesize.md). The Phase 2 LLM reads the answered tree and produces:

- **PRD** from the Q1 branch (problem, users, goals, success criteria)
- **Specification** from the Q2 branch (Cockburn use cases at User Goal level, system use cases for each technical interface, supplementary specifications)
- **arc42** with all 12 chapters from the Q3 branch
- **Nygard ADRs** with Pugh Matrix from the Q3.9 branch

Code-derived claims cite the `file:line` evidence from their `[ANSWERED]` leaf — a reference to the code, the only durable, canonical artifact. Team-supplied information is marked `(team answer)`. The Question Tree is temporary scaffolding, so its Q-IDs are not written into the final documents; during synthesis every claim is still traced back to a leaf as a build-time check. This dual traceability — code evidence plus team input — is the difference from a simple reverse-engineering prompt that fills in gaps silently.

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
