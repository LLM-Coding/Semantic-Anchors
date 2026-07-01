# Output Schema — QUESTION_TREE-<context-name>.adoc and OPEN_QUESTIONS-<context-name>.adoc

Two AsciiDoc files, each suffixed with the kebab-cased bounded-context name so sequential runs on different contexts never overwrite each other. The schema is rigid enough to be machine-checkable but written in plain prose so a team member can read it.

## QUESTION_TREE-<context-name>.adoc

Hierarchical tree, top-down. Each node has a Q-ID, the question, and (for leaves) either an `[ANSWERED]` or `[OPEN]` marker.

```asciidoc
= Question Tree — [Context Name]
:doctype: book

== Q1: What problem does this bounded context solve, and for whom?

=== Q1.1: Product identity — what is this bounded context?
[ANSWERED]
Evidence: src/api/OrderController.java:18, src/service/OrderService.java::create
An order-placement context: sales staff create customer orders via a REST API.

=== Q1.2: Who are the primary users?
[ANSWERED]
Evidence: src/auth/User.java:42 (role enum), src/api/OrderController.java:18 (@PreAuthorize)
Sales-team users with role MANAGER place orders on behalf of customers.

(Q1.3-Q1.6 omitted here for brevity — every fixed node is still emitted.)

== Q2: What is the specification of this bounded context?

=== Q2.2: Use-case catalog
==== Q2.2.PUC.PlaceOrder: Persona use case — Place an order
===== Q2.2.PUC.PlaceOrder.Actor
[ANSWERED]
Evidence: src/api/OrderController.java:18-25
Primary Actor: Sales Manager (role MANAGER)

===== Q2.2.PUC.PlaceOrder.Trigger
[ANSWERED]
Evidence: src/api/OrderController.java:18 (POST /orders)
Sales Manager submits POST /orders with order payload.

===== Q2.2.PUC.PlaceOrder.MainSuccess
[ANSWERED]
Evidence: src/service/OrderService.java::create (lines 45-92)
1. System validates payload (Q2.2.PUC.PlaceOrder.Validation).
2. System reserves inventory via InventoryClient.
3. System persists Order with status PENDING.
4. System publishes OrderCreated event.
5. System returns 201 Created with order id.

===== Q2.2.PUC.PlaceOrder.Postconditions
[OPEN]
Category: business-context
Ask role: Product Owner, Domain Expert
Code persists status=PENDING but never transitions it. Is PENDING a final
state for this bounded context, or is downstream fulfilment expected to
move it forward? Affects what counts as success.

(...continues for the remaining fixed nodes — Q2.x, Q3, Q4, Q5...)
```

### Q-ID scheme

- `Q1`, `Q2`, ... — the five root questions
- `Q1.1` ... `Q5.5` — the **fixed second level**: the same enumerated node set on every run (Q1.1–Q1.6, Q2.1–Q2.6, Q3.1–Q3.12, Q4.1–Q4.9, Q5.1–Q5.5). A given Q-ID always means the same node — `Q3.7` is always the Deployment View — so trees from different runs diff node-by-node. Emit every fixed node even when its only leaf is `[OPEN]` or `[ANSWERED: not applicable]`.
- `Q3.5.2`, `Q3.5.2.1`, ... — adaptive depth *below* the fixed second level. Depth is code-driven and tracks code density: a node keeps decomposing until each leaf maps to one specific, citable piece of code, so a large bounded context produces a deep sub-tree and a small one a shallow sub-tree. Depth therefore varies between runs. Backstop: do not decompose more than four levels below a fixed node.
- Within named sub-trees, use a stable label between dots so cites are stable across reruns:
  - `Q2.2.PUC.PlaceOrder.Trigger` — persona use case PlaceOrder (under Q2.2, the use-case catalog), field Trigger
  - `Q2.3.SUC.CreateOrderEndpoint.ErrorResponses` — system use case (under Q2.3, per-interface system specs) for the create endpoint, ErrorResponses field
  - `Q3.9.HexagonalArchitecture.Context` — ADR HexagonalArchitecture (under Q3.9, the arc42 Architecture Decisions chapter), Context field

### `[ANSWERED]` block format

```
[ANSWERED]
Evidence: <file>:<line>[, <file>:<line> ...]
<one to three sentences describing the answer>
```

- **Evidence is mandatory.** No exception. A claim without evidence is `[OPEN]`, not `[ANSWERED]`.
- File paths are relative to the bounded context root.
- Use `file:line` for a specific line, `file::function` for a function regardless of line drift, `file` for a genuinely file-scoped claim (e.g. "this file is the context's entry point").
- **A directory is not valid evidence.** If a leaf can only cite a folder (`src/core/`, `vibe/cli/`), it still covers too much — it has not been decomposed far enough. Split it into child nodes until each leaf cites a specific `file:line` or `file::function`. Coarse evidence is the schema-level signal that Phase 1 stopped too shallow.
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

## OPEN_QUESTIONS-<context-name>.adoc

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

=== Q2.2.PUC.PlaceOrder.Postconditions
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
- The `*Your answer:*` block is mandatory. Team members write directly into the file. Phase 2 reads this file together with `QUESTION_TREE-<context-name>.adoc`.
- A deferred question gets `(deferred — <reason>)` instead of an answer. Phase 2 treats deferred questions as explicit gaps, not as filled-in answers.

## Phase 2 traceability

The synthesized documentation must be self-contained. The Question Tree is a temporary intermediate artifact: its fixed second level (Q1.1–Q5.5) is stable, but third-level Q-IDs are run-specific, and the tree itself is not shipped alongside the docs. So Q-IDs are NOT carried into the final documents. During Phase 2, every claim is traced back to a leaf as a build-time check; what gets *written* is the durable reference only:

```
The system uses Hexagonal Architecture [src/app/Ports.java,
src/adapter/JpaOrderRepository.java:30]. Sessions expire after 24 hours
(team answer). Quality-goal priorities are deferred and must be resolved
before the next release.
```

The three forms are deliberate:

- `[file:line, ...]` — code-derived fact. Copied verbatim from the `Evidence` line of the `[ANSWERED]` leaf; it points at the code, the only canonical, persistent artifact.
- `(team answer)` — team-supplied fact. No code evidence exists; the marker tells the reader a human asserted this and it must be re-verified with a human, not derived from code.
- `deferred` — a known gap, stated explicitly, not a fact.

This is the auditable trace: a code-derived claim without its `file:line` evidence is incomplete; a fact that is neither code-evidenced nor marked `(team answer)` is invention.
