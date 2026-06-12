# Chapter 10 — Quality Scenarios

## Format: Six-Part Quality Attribute Scenario (Bass/Clements/Kazman)

Every Chapter 10 quality scenario is written in this form:

| Part | Description | Example |
|------|-------------|---------|
| **Source** | Who or what triggers the stimulus | End user, CI pipeline, attacker |
| **Stimulus** | The event or condition | 1000 concurrent requests, node failure, SQL injection attempt |
| **Artifact** | What is affected | Order Service, API Gateway, Database |
| **Environment** | Under what conditions | Normal operation, peak load, degraded mode |
| **Response** | What the system does | Queues excess requests, fails over, rejects input |
| **Response Measure** | Literal, testable figure | p99 < 200ms, failover < 30s, zero data exposure |

The **Response Measure** carries a literal figure, so the requirement is testable rather than an adjective ("fast", "secure", "available").

## Chapter 1.2 vs. Chapter 10

- **Chapter 1.2** lists only the top 3–5 quality goals — the ones that drive architecture decisions.
- **Chapter 10** may elaborate further quality characteristics beyond those top goals.
- Each Chapter 10 scenario is marked as either:
  - **Concretising** a Chapter 1.2 top goal (cross-link which one), or
  - **Derived** — a quality requirement that does not trace to a top goal but matters for the system.

## Deriving scenarios from code

When evidence exists in code (timeouts, budgets, SLOs, test thresholds), derive scenarios as `[ANSWERED]` with `file:line` evidence. Never invent target numbers — only the quality-goal *ranking* is a team decision.
