# ADR–Risk Wiring

## Rule

Each ADR's **Consequences** section names the risks the decision creates:

- If the risk is already tracked in Chapter 11: reference its ID (e.g., "introduces R-003").
- If the risk is new: either add it to Chapter 11 with a new R-NNN ID, or record the consequence as "explicitly accepted without a tracked risk" (for trivial consequences).

## Inverse direction

Conversely, Chapter 11 risks that are *caused by* a decision reference the ADR that introduced them.

## Unconfirmed decisions

When the rationale behind a decision is inferred (not confirmed by the team):

- ADR Status: **"Accepted (inferred)"**
- Pugh Matrix cells needing team judgment: marked `?` rather than guessed

This preserves honesty — the documentation records what is known vs. what is assumed.

## Scaffolding

When creating a new ADR, use this template:

```
# ADR-NNN: <Title>

## Status
Accepted | Accepted (inferred) | Proposed | Superseded by ADR-NNN

## Context
<Why this decision is needed>

## Decision
<What was decided>

## Pugh Matrix
| Criterion | Option A | Option B (Baseline) | Option C |
|-----------|----------|---------------------|----------|
| ...       | +1       | 0                   | -1       |

## Consequences
- <Positive consequence>
- <Negative consequence → R-NNN>
```
