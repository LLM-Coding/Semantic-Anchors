# Chapter 11 — Risks and Technical Debt

## Structure

Chapter 11 separates into two subsections:

### 11.1 Risks

Each risk carries:

| Column | Description |
|--------|-------------|
| **ID** | R-NNN (stable identifier for cross-referencing from ADRs) |
| **Risk** | What could go wrong |
| **Probability** | Low / Medium / High |
| **Impact** | Low / Medium / High |
| **Priority** | Derived from probability × impact |
| **Mitigation** | Cross-reference to Chapter 8 concept or quality scenario that mitigates it |

Risks are ordered by priority (highest first).

### 11.2 Technical Debt

Each debt item:

| Column | Description |
|--------|-------------|
| **ID** | TD-NNN |
| **Debt** | What the shortcut is |
| **Building Block** | Cross-reference to specific Chapter 5 building block it burdens |
| **Impact** | What happens if not addressed |
| **Effort** | Estimated effort to resolve |

## ADR ↔ Risk wiring

See [adr-risk-wiring.md](adr-risk-wiring.md) for how ADR Consequences connect to Risk IDs.
