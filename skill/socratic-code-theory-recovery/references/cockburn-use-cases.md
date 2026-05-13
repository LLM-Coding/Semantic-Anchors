# Cockburn Use Cases — Decomposition Guide for Q2 (Specification)

Alistair Cockburn's *Fully Dressed* use-case format gives the Q2 branch a precise structure. Each user-goal-level use case becomes a sub-tree of Q2; the format's mandatory fields are the leaves.

## The fields as Q2 sub-questions

For each use case the LLM identifies in the code (from controller methods, CLI commands, API endpoints):

| Field | Sub-question | Code source |
|-------|--------------|-------------|
| **Primary Actor** | Who triggers this use case? | Authentication, role guards, API consumers |
| **Stakeholders & Interests** | Who else cares about the outcome, and what do they want? | Often `[OPEN]` — code doesn't show interests |
| **Preconditions** | What must be true before the use case can start? | Input validation, guards, state checks |
| **Trigger** | What event starts the use case? | Endpoint match, CLI invocation, event handler |
| **Main Success Scenario** | What is the numbered sequence of steps on the happy path? | The function body, controller flow |
| **Extensions** | What alternative or exceptional flows exist, branching from which step? | Error branches, edge-case `if` blocks, catch clauses |
| **Postconditions** | What must be true when the use case completes successfully? | Persisted state, emitted events, response shape |
| **Business Rules** | What domain invariants does the use case enforce? | Often `[OPEN]` — the rule is in the code, the *reason* for the rule is in the team's head |

## Goal levels

Cockburn distinguishes three goal levels:

- **Summary / Cloud** — multiple user goals in a larger flow ("complete a purchase")
- **User Goal / Sea Level** — one sitting, one user, one outcome ("place an order")
- **Subfunction / Fish** — smaller actions reused by user-goal use cases ("validate address")

The Q2 branch should contain *one sub-tree per User-Goal-level use case*. Subfunctions appear inline in the Extensions or in Supplementary Specifications. Summary-level flows are usually `[OPEN]` because they describe business processes, not technical flows.

## System use cases vs persona use cases

Persona use cases describe user-visible behaviour. System use cases describe technical interfaces (API endpoint contracts, CLI argument grammars, event payloads, file formats). Both belong in Q2 but in separate sub-branches:

- `Q2.PUC.*` — persona use cases (user goal level)
- `Q2.SUC.*` — system use cases (one per technical interface)

System use cases are *more* code-derivable than persona use cases because the interface contract is the code. Persona use cases require domain knowledge that is often `[OPEN]`.

## What is typically [OPEN]

- *Why* a business rule exists (the rule itself is code-derivable)
- Stakeholder interests beyond the obvious primary actor
- Preconditions that depend on prior workflow steps not modelled in the bounded context
- Postconditions that involve external systems
- Quality requirements per use case (latency, throughput) — Q4 territory

## When to stop decomposing

A Q2 leaf is fine-grained enough when it asks about one field of one use case:

- "What is the Main Success Scenario of `Q2.PUC.PlaceOrder`?" → leaf
- "What does the system do when an order is placed?" → still needs decomposition

## Reference

- Cockburn, *Writing Effective Use Cases* (Addison-Wesley, 2001).
- Anchor in the catalog: https://llm-coding.github.io/Semantic-Anchors/anchor/cockburn-use-cases
