---
name: arc42-authoring
description: Produce and maintain arc42 architecture documentation with cross-section traceability, structured quality scenarios, and decision–risk wiring. Use when scaffolding a new arc42 document, extending an existing one, or verifying traceability between chapters.
metadata:
  author: LLM-Coding
  version: "0.1"
  source: https://github.com/LLM-Coding/Semantic-Anchors
license: MIT
---

# arc42 Authoring

Procedural guidance for producing arc42 architecture documentation that goes beyond the template's built-in help text.

## On invocation

When this skill is invoked:

1. **Check whether an arc42 document already exists.** Look for `src/docs/` or `docs/arc42/` in the project. If found, work incrementally — do not re-scaffold.

2. **If no arc42 exists, scaffold first.** Use docToolchain `downloadTemplate` to create the "with-help" template into `src/docs/`. Each chapter's help text is its structural spec — fill and then replace it.

3. **Apply the traceability rules** from [references/traceability-rules.md](references/traceability-rules.md) as you produce or review each chapter. These rules are the project's value-add over plain arc42.

4. **For Chapter 10 quality scenarios**, use the six-part Quality Attribute Scenario format from [references/chapter-10-quality-scenarios.md](references/chapter-10-quality-scenarios.md).

5. **For Chapter 11 Risks and Technical Debt**, follow [references/chapter-11-structure.md](references/chapter-11-structure.md).

6. **For Chapter 8 Crosscutting Concepts**, follow [references/chapter-8-baseline.md](references/chapter-8-baseline.md).

7. **For ADR–Risk wiring**, apply the rules in [references/adr-risk-wiring.md](references/adr-risk-wiring.md).

## When to use this skill

- Scaffolding a new arc42 document for a greenfield project
- Extending an arc42 document after architecture decisions change
- Reviewing arc42 documentation for completeness and cross-section traceability
- Producing Chapter 10 quality scenarios in the six-part form
- Structuring Chapter 11 with the Risks/Technical-Debt split

## When NOT to use this skill

- For reverse-engineering existing code into documentation — use `socratic-code-theory-recovery` instead (Phase 2 of that skill produces arc42 from an answered Question Tree)
- For the vocabulary of what arc42, ADRs, C4, and QAS *are* — that is the `architecture-documentation` contract (always-on)
