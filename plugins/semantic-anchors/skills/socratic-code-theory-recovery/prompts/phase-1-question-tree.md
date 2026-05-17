# Phase 1 Prompt: Build the Question Tree

Copy the block below into a session that has read access to the bounded context. Replace `[bounded context path]` with the actual path. Adapt the Q1-Q5 wording if your domain has different starting concerns, but do not change the fixed second level, the leaf classification, the Q-ID scheme, or the output files.

```
You are performing Socratic Code-Theory Recovery on a brownfield bounded
context located at [bounded context path]. Phase 1 of two.

Goal: recover the program's theory (Naur, 1985) from source code through
recursive question refinement, before any documentation is written.

Process:

1. Start with five root questions about the bounded context:
   Q1 What problem does this bounded context solve, and for whom?
   Q2 What is the specification of this bounded context?
   Q3 What is the architecture of this bounded context?
   Q4 What quality goals drive the design?
   Q5 What risks and technical debt exist?

2. The second level of the tree is FIXED, not free. Emit exactly these
   nodes, in this order, even when a node's only leaf is [OPEN] or
   [ANSWERED: not applicable]:
     Q1.1-Q1.6  product identity, primary users, channels, why-built,
                success metrics, segment priority
     Q2.1-Q2.6  actors, use-case catalog, per-interface system specs,
                data/entity model, acceptance criteria, cross-cutting
                business rules
     Q3.1-Q3.12 the twelve arc42 chapters, in arc42 order
     Q4.1-Q4.8  the eight ISO/IEC 25010 characteristics;
     Q4.9       which characteristic has priority
     Q5.1-Q5.5  technical debt, security risks, operational risks,
                dependency/supply-chain risks, scaling/performance risks

3. Below the fixed second level, decompose freely and code-driven. Stop
   when a leaf is small enough to answer from a single piece of code
   evidence, or to pose as a single precise question to a stakeholder.
   Third-level depth varies between runs
   — that is expected. Q-IDs are stable: Q3.7 is always the Deployment
   View, in every run, so trees from different runs can be diffed
   node-by-node.

4. For each leaf, classify it:

   [ANSWERED]
     - You found the answer in the code.
     - Cite the evidence as <file>:<line> or <file>::<function>.
     - Be exact. No "see X for details."

   [OPEN]
     - The answer is not derivable from code alone.
     - Category: business-context | design-rationale | quality-goals |
                 stakeholder-context | future-direction
     - Ask role: Product Owner | Architect | Developer | Domain Expert |
                 Operations
     - State precisely what cannot be answered, and why.

   Quality (the Q4 branch) is not wholly team knowledge. Where the code
   shows measurable behaviour — a timeout, a truncation limit, a budget,
   a retry policy, the threats and test concept from Q3.8 — write it as
   an [ANSWERED] quality scenario with file:line. Never invent a target
   number. Only the quality-goal ranking (Q4.9) is [OPEN].

5. Output two files in AsciiDoc:

   QUESTION_TREE.adoc
     - Full hierarchical tree with all nodes and Q-IDs
     - Each leaf marked [ANSWERED] (with evidence) or [OPEN] (with Category
       and Ask role)
     - Includes all reasoning, not only the leaves

   OPEN_QUESTIONS.adoc
     - Only the [OPEN] leaves, copied verbatim from QUESTION_TREE.adoc
     - Always one section per Ask role (Product Owner, Architect,
       Developer, Domain Expert, Operations) — emit every section even
       when it is empty ("No open questions for this role")
     - Each question short enough to be answered in 1-3 sentences

Do not write any other documentation in this phase. Phase 2 will synthesize
the answered tree into PRD, specification, arc42, and ADRs — only after the
team has filled in the [OPEN] leaves.
```

## What to do after the prompt completes

1. **Sanity-check `QUESTION_TREE.adoc`.** Pick three `[ANSWERED]` leaves at random and verify the cited file:line actually contains the claim. If any cite is wrong, the LLM is hallucinating evidence — re-run with a smaller bounded context.

2. **Route `OPEN_QUESTIONS.adoc` to the team.** One section per Ask role. Typically 10-15 questions for a small bounded context; if you see 50+, the bounded context is too large.

3. **Team writes answers directly into `OPEN_QUESTIONS.adoc`** under each question. Mark deferrals explicitly as `(deferred)` so Phase 2 can decide whether to leave them as gaps in the documentation.

4. Only after every leaf has an answer or an explicit deferral, run Phase 2.
