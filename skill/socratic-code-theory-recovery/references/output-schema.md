# Output Schema — QUESTION_TREE.adoc and OPEN_QUESTIONS.adoc

Two AsciiDoc files. The schema is rigid enough to be machine-checkable but written in plain prose so a team member can read it.

## QUESTION_TREE.adoc

Hierarchical tree, top-down. Each node has a Q-ID, the question, and (for leaves) either an `[ANSWERED]` or `[OPEN]` marker.

```asciidoc
= Question Tree — [Context Name]
:doctype: book

== Q1: What problem does this bounded context solve, and for whom?

=== Q1.1: Who is the primary user?
[ANSWERED]
Evidence: src/auth/User.java:42 (role enum), src/api/OrderController.java:18 (@PreAuthorize)
Sales-team users with role MANAGER place orders on behalf of customers.

=== Q1.2: What outcome does the user want?
[OPEN]
Category: business-context
Ask role: Product Owner
The code shows order creation succeeds when validation passes, but does not
reveal what success means for the user (revenue? margin? cycle time?). Need
explicit goal statement.

== Q2: What is the specification of this bounded context?

=== Q2.PUC.PlaceOrder: Persona use case — Place an order
==== Q2.PUC.PlaceOrder.Actor
[ANSWERED]
Evidence: src/api/OrderController.java:18-25
Primary Actor: Sales Manager (role MANAGER)

==== Q2.PUC.PlaceOrder.Trigger
[ANSWERED]
Evidence: src/api/OrderController.java:18 (POST /orders)
Sales Manager submits POST /orders with order payload.

==== Q2.PUC.PlaceOrder.MainSuccess
[ANSWERED]
Evidence: src/service/OrderService.java::create (lines 45-92)
1. System validates payload (Q2.PUC.PlaceOrder.Validation).
2. System reserves inventory via InventoryClient.
3. System persists Order with status PENDING.
4. System publishes OrderCreated event.
5. System returns 201 Created with order id.

==== Q2.PUC.PlaceOrder.Postconditions
[OPEN]
Category: business-context
Ask role: Product Owner, Domain Expert
Code persists status=PENDING but never transitions it. Is PENDING a final
state for this bounded context, or is downstream fulfilment expected to
move it forward? Affects what counts as success.

(...continues for Q3, Q4, Q5...)
```

### Q-ID scheme

- `Q1`, `Q2`, ... — the five top-level questions
- `Q1.1`, `Q1.2`, ... — direct decompositions
- `Q3.5.2` — arbitrary depth
- Within named sub-trees, use a stable label between dots so cites are stable across reruns:
  - `Q2.PUC.PlaceOrder.Trigger` — persona use case PlaceOrder, field Trigger
  - `Q2.SUC.CreateOrderEndpoint.ErrorResponses` — system use case for the create endpoint, ErrorResponses field
  - `Q3.9.HexagonalArchitecture.Context` — ADR HexagonalArchitecture, Context field

### `[ANSWERED]` block format

```
[ANSWERED]
Evidence: <file>:<line>[, <file>:<line> ...]
<one to three sentences describing the answer>
```

- **Evidence is mandatory.** No exception. A claim without evidence is `[OPEN]`, not `[ANSWERED]`.
- File paths are relative to the bounded context root.
- Use `file:line` for a specific line, `file::function` for a function regardless of line drift, `file` for a whole-file claim.
- Keep the prose factual. The answer is the *what*; the *why* belongs in a separate `[OPEN]` leaf if it isn't in the code.

### `[OPEN]` block format

```
[OPEN]
Category: <one of: business-context | design-rationale | quality-goals | stakeholder-context | future-direction>
Ask role: <one or more of: Product Owner | Architect | Developer | Domain Expert | Operations>
<one to three sentences stating precisely what cannot be answered, and why the code is silent on it>
```

- **Category** classifies the type of knowledge needed. Used to route questions and to detect bias in the gap distribution.
- **Ask role** is the role-class of person who can answer, not a named individual. Multiple roles are fine — list them in order of best to ask.
- The body of the leaf must explain *why* the code can't answer it. If the body says "the code doesn't say", widen it: "the code persists status=PENDING but never transitions it" is a real reason; "we don't know" is not.

## OPEN_QUESTIONS.adoc

A flat, role-grouped projection of every `[OPEN]` leaf. This is the handoff document — the team sees only their section.

```asciidoc
= Open Questions — [Context Name]
:doctype: book

== For Product Owner

=== Q1.2: What outcome does the user want?
Category: business-context

The code shows order creation succeeds when validation passes, but does not
reveal what success means for the user (revenue? margin? cycle time?).

*Your answer:*
_(write here)_

=== Q2.PUC.PlaceOrder.Postconditions
Category: business-context

Code persists status=PENDING but never transitions it. Is PENDING a final
state for this bounded context, or is downstream fulfilment expected to
move it forward?

*Your answer:*
_(write here)_

== For Architect

(...)

== For Domain Expert

(...)
```

### Rules

- One section per Ask role.
- A leaf with multiple Ask roles is duplicated under each role's section — make it explicit to whichever role reads first.
- The `*Your answer:*` block is mandatory. Team members write directly into the file. Phase 2 reads this file together with `QUESTION_TREE.adoc`.
- A deferred question gets `(deferred — <reason>)` instead of an answer. Phase 2 treats deferred questions as explicit gaps, not as filled-in answers.

## Phase 2 traceability

After Phase 2, every paragraph in the synthesized documentation cites at least one Q-ID:

```
The system uses Hexagonal Architecture [Q3.9.HexagonalArchitecture]. Sessions
expire after 24 hours (team answer, Q3.8.Security.SessionLifetime).
Quality-goal priorities are deferred (Q4.0.deferred) and must be resolved
before the next release.
```

This is the auditable trace from documentation back to either code evidence or a team answer. Anything without a Q-ID is invention.
