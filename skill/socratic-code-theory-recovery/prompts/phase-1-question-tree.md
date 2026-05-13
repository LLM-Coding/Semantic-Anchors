# Phase 1 Prompt: Build the Question Tree

Copy the block below into a session that has read access to the bounded context. Replace `[bounded context path]` with the actual path. Adapt the Q1-Q5 examples if your domain has different starting concerns, but do not change the leaf classification, Q-ID scheme, or output files.

```
You are performing Socratic Code-Theory Recovery on a brownfield bounded
context located at [bounded context path]. Phase 1 of two.

Goal: recover the program's theory (Naur, 1985) from source code through
recursive question refinement, before any documentation is written.

Process:

1. Start with five high-level questions about the bounded context:
   Q1 What problem does this bounded context solve, and for whom?
   Q2 What is the specification of this bounded context?
   Q3 What is the architecture of this bounded context?
   Q4 What quality goals drive the design?
   Q5 What risks and technical debt exist?

2. Decompose each question recursively. Use these Semantic Anchors as
   decomposition guides:
     - arc42 — 12 sub-questions for architecture (Q3 branch)
     - Cockburn Use Cases — Primary Actor, Trigger, Main Success Scenario,
       Extensions, Postconditions for specification (Q2 branch)
     - ISO/IEC 25010 — 8 quality characteristics for quality goals (Q4 branch)
     - Nygard ADRs — Context, Decision, Status, Consequences for design
       rationale (Q3.9 branch)
   Stop decomposing when a question is precise enough to be answered with a
   single piece of code evidence or a single fact from a stakeholder.

3. Assign a hierarchical Q-ID to every node (Q1, Q1.2, Q1.2.3, ...) so that
   later documentation can cite back to it.

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

5. Output two files in AsciiDoc:

   QUESTION_TREE.adoc
     - Full hierarchical tree with all nodes and Q-IDs
     - Each leaf marked [ANSWERED] (with evidence) or [OPEN] (with Category
       and Ask role)
     - Includes all reasoning, not only the leaves

   OPEN_QUESTIONS.adoc
     - Only the [OPEN] leaves, copied verbatim from QUESTION_TREE.adoc
     - Grouped by Ask role (one section per role)
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
