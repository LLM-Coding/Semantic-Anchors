# Phase 2 Prompt: Synthesize Documentation

Run this prompt only after every `[OPEN]` leaf in `OPEN_QUESTIONS.adoc` has either a team answer or an explicit `(deferred)` marker.

```
You are performing Phase 2 of Socratic Code-Theory Recovery.

Inputs:
- QUESTION_TREE.adoc — the answered Question Tree from Phase 1.
- OPEN_QUESTIONS.adoc — same OPEN leaves, now with team answers (or
  (deferred) markers) written under each question.

Goal: synthesize documentation from the answered tree. Every claim must be
traceable to a Q-ID. Team-supplied facts must be marked (team answer).
Anything still marked (deferred) must remain an explicit gap in the output,
not be filled with invention.

Produce four artifacts:

1. docs/specs/prd-[context-name].adoc — Product Requirements Document
   - Problem statement, target users, goals, success criteria, scope
     boundaries, constraints, open questions
   - Source: Q1 branch of QUESTION_TREE.adoc
   - Anchor: PRD (Cagan / Pichler)

2. docs/specs/use-cases-[context-name].adoc — Specification
   - Persona Use Cases in Cockburn Fully Dressed format at User Goal level:
     Primary Actor, Trigger, Stakeholders & Interests, Preconditions,
     Main Success Scenario, Extensions, Postconditions, Business Rules.
   - System Use Cases for each technical interface (API endpoint, CLI
     command, event, file format): input + validation, processing,
     output + status codes, error responses.
   - Supplementary Specifications: Entity Model, State Machines, Interface
     Contracts, Validation Rules.
   - Gherkin acceptance criteria where applicable.
   - Source: Q2 branch of QUESTION_TREE.adoc
   - Anchor: Cockburn Use Cases

3. docs/arc42/arc42-[context-name].adoc — Architecture
   - All 12 arc42 chapters. Mark chapters with no content as
     "No information from Phase 1" rather than fabricating content.
   - Source: Q3 branch of QUESTION_TREE.adoc
   - Anchor: arc42 (Starke / Hruschka)

4. docs/specs/adrs/*.adoc — one ADR per significant design decision
   - Nygard format: Title, Status, Context, Decision, Consequences.
   - Include a Pugh Matrix listing the alternatives considered with a
     3-point scale (-1, 0, +1) against the quality goals from Q4.
   - Source: Q3.9 branch of QUESTION_TREE.adoc
   - Anchor: ADR according to Nygard

Rules for traceability:
- Every paragraph references the Q-IDs that support it, in square brackets:
  "The system uses Hexagonal Architecture [Q3.5]."
- Team-supplied facts get an inline marker: "Sessions expire after 24 hours
  (team answer, Q3.4.2)."
- Deferred questions stay as explicit gaps: "Quality-goal priorities are
  deferred (Q4.1.deferred) and must be resolved before the next release."
- Do not introduce facts that do not appear in QUESTION_TREE.adoc or
  OPEN_QUESTIONS.adoc. If a Section feels under-specified, leave it
  under-specified — that is signal, not a defect.
```

## After Phase 2

- **Spec drift starts immediately.** Re-run Phase 1 against the current code before each release; diff the new Question Tree against the existing documentation to surface NEW (in code, not in spec), CHANGED (diverged), and DEAD (in spec, not in code) findings.

- **Extend bounded contexts incrementally.** Don't reverse-engineer the whole system in one pass. Pick the next bounded context only when the first one's documentation is being actively used.
