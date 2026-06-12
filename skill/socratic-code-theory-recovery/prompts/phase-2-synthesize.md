# Phase 2 Prompt: Synthesize Documentation

Run this prompt only after every `[OPEN]` leaf in `OPEN_QUESTIONS-[context-name].adoc` has either a team answer or an explicit `(deferred)` marker. Replace `[context-name]` with the same kebab-case context name Phase 1 used.

```
You are performing Phase 2 of Socratic Code-Theory Recovery.

Inputs:
- QUESTION_TREE-[context-name].adoc — the answered Question Tree from
  Phase 1.
- OPEN_QUESTIONS-[context-name].adoc — same OPEN leaves, now with team
  answers (or (deferred) markers) written under each question.

Goal: synthesize documentation from the answered tree. Every claim must
trace back to a tree leaf — this is a build-time check, not a Q-ID stamped
into the text; Q-IDs do NOT appear in the final documents (see Rules for
traceability below). Team-supplied facts must be marked (team answer).
Anything still marked (deferred) must remain an explicit gap in the output,
not be filled with invention.

Produce four artifacts:

1. docs/specs/prd-[context-name].adoc — Product Requirements Document
   - Problem statement, target users, goals, success criteria, scope
     boundaries, constraints, open questions
   - Source: Q1 branch of QUESTION_TREE-[context-name].adoc
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
   - Source: Q2 branch of QUESTION_TREE-[context-name].adoc
   - Anchor: Cockburn Use Cases

3. docs/arc42/arc42-[context-name].adoc — Architecture
   - All 12 arc42 chapters. Mark chapters with no content as
     "No information from Phase 1" rather than fabricating content.
   - Chapter 10 (Quality Requirements) is an exception: synthesize it
     from the [ANSWERED] Q4 quality scenarios plus the Q4.9 ranking. It
     is never just an [OPEN] pointer. Reuse evidence already in Q3.8 —
     Security scenarios cite the STRIDE T-IDs, Maintainability scenarios
     the test concept. Only the goal ranking stays [OPEN]; "No
     information" is legitimate here only if Q4 produced no answered
     scenario at all.
   - Source: Q3 branch of QUESTION_TREE-[context-name].adoc
   - Anchor: arc42 (Starke / Hruschka)

4. docs/specs/adrs/[context-name]-adr-NNN-*.adoc — one ADR per
   significant design decision. The context-name prefix keeps ADRs from
   different bounded contexts from colliding in the shared adrs/ folder.
   - Nygard format: Title, Status, Context, Decision, Consequences.
   - Include a Pugh Matrix listing the alternatives considered with a
     3-point scale (-1, 0, +1) against the quality goals from Q4.
   - Source: Q3.9 branch of QUESTION_TREE-[context-name].adoc
   - Anchor: ADR according to Nygard

Rules for traceability:
- The synthesized documentation must be self-contained. The Question Tree
  is a temporary intermediate artifact — its fixed second level is stable,
  but third-level Q-IDs are run-specific and the tree is not shipped — so
  Q-IDs must NOT appear in the output. While synthesizing, trace every
  claim back to a leaf: each claim must come from an [ANSWERED] leaf or an
  answered [OPEN] leaf. This tracing is a build-time check, not something
  written into the documents.
- A claim backed by an [ANSWERED] leaf cites the code evidence from that
  leaf — the reference to the code, the only durable, canonical artifact:
  "The system uses Hexagonal Architecture [src/app/Ports.java,
  src/adapter/JpaOrderRepository.java:30]."
  Copy the Evidence line verbatim from the leaf; do not invent, shorten,
  or re-derive file paths. A leaf with no Evidence line is not [ANSWERED]
  and must not be cited as fact.
- Team-supplied facts have no code evidence — mark them (team answer):
  "Sessions expire after 24 hours (team answer)."
- Deferred questions stay as explicit gaps: "Quality-goal priorities are
  deferred and must be resolved before the next release."
- Do not introduce facts that do not appear in
  QUESTION_TREE-[context-name].adoc or OPEN_QUESTIONS-[context-name].adoc.
  If a Section feels under-specified, leave it
  under-specified — that is signal, not a defect.
```

## After Phase 2

- **Spec drift starts immediately.** Re-run Phase 1 against the current code before each release; diff the new Question Tree against the existing documentation to surface NEW (in code, not in spec), CHANGED (diverged), and DEAD (in spec, not in code) findings.

- **Extend bounded contexts incrementally.** Don't reverse-engineer the whole system in one pass. Pick the next bounded context only when the first one's documentation is being actively used.
