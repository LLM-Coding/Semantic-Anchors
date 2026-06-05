# Chapter 8 — Crosscutting Concepts Baseline

## Required baseline concepts

arc42 leaves Chapter 8 open. This skill requires five baseline crosscutting concepts, in this order:

| Section | Concept | Key rule |
|---------|---------|----------|
| 8.1 | **Threat Model** | STRIDE; threats get IDs (T-001…) |
| 8.2 | **Security** | Every mitigation references the T-IDs it closes |
| 8.3 | **Test** | Testing pyramid; tests trace to Use Cases and Business Rules |
| 8.4 | **Observability** | Logs, metrics, traces, audit trails |
| 8.5 | **Error Handling** | Retry, circuit breaker, fallback, recovery |

## Extension rule

Add further Chapter 8.x concepts (persistence, i18n, accessibility, configuration, performance) **only when the system actually has that concern**. Do not add empty sections.

## Back-referencing

Chapter 8 concepts back-reference the Chapter 9 ADR that decided them. If no ADR exists for a concept, either create one or note the concept as "established practice, no decision required."
