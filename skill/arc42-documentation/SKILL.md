---
name: arc42-documentation
description: Author an arc42 architecture document with the project's cross-section traceability rules. Use when producing or extending an arc42 document — it carries the procedure the "Architecture Documentation" contract deliberately leaves out: scaffolding the with-help template, the five traceability rules arc42 does not enforce, the Chapter 11 Risks-vs-Technical-Debt structure, the ADR-to-risk-ID wiring, the Chapter 1.2-vs-10 quality-goal marking, and the six-part Quality Attribute Scenario form. The contract pins the vocabulary (arc42, C4/PlantUML, Nygard ADRs, Pugh); this skill is the how-to.
metadata:
  author: LLM-Coding
  version: "0.1"
  source: https://github.com/LLM-Coding/Semantic-Anchors
license: MIT
---

# arc42 Documentation Authoring

Produce an arc42 architecture document that holds together across sections — not twelve chapters written in isolation.

## When to use this skill

Use it when you are creating a new arc42 document, filling empty chapters, or auditing an existing one against the project's rules. The `architecture-documentation` contract names *what* the project means by architecture documentation (arc42; C4 via PlantUML; Nygard ADRs with a 3-point Pugh matrix; six-part Quality Attribute Scenarios). This skill is the *how* — the procedure and the cross-section rules arc42's own templates do not enforce. Load it on demand; it is not always-on.

If you are recovering documentation from existing code rather than authoring it forward, use the `socratic-code-theory-recovery` skill instead — its Phase 2 synthesizes an arc42 document and applies the same rules defined here.

## Step 1 — Scaffold, do not restate

Scaffold the arc42 "with-help" template into the project's `src/docs/` via docToolchain `downloadTemplate`. Each chapter's help text is its own structural spec; the process fills the help text and then replaces it. Do not paste a chapter skeleton from memory — let the template carry the structure so it stays current with arc42.

## Step 2 — Diagrams

Every context, building-block, and runtime chapter carries at least one diagram. Diagrams are PlantUML, not Mermaid. Building blocks use C4 via PlantUML's bundled C4-PlantUML standard library — the `!include <C4/...>` stdlib form (angle brackets), never the remote `https://` URL and never a vendored file copy. Diagrams are concrete components, not generic boxes.

## Step 3 — Decisions (ADRs)

Decisions are ADRs in Nygard format with a 3-point Pugh matrix (-1 / 0 / +1).

- When the rationale is unconfirmed, set ADR Status to **"Accepted (inferred)"** and mark Pugh cells that need team judgement with `?` rather than guessing a number.
- Each ADR's *Consequences* name the risks the decision creates, **referencing the Chapter 11 risk IDs (R-NNN)**. A decision that creates a risk not yet in Chapter 11 either adds it there or records the consequence as explicitly accepted without a tracked risk.
- Conversely, every Chapter 8 crosscutting concept back-references the ADR that decided it.

Chapter 9 carries an in-document ADR index (ADR | Title | Status) even when the ADRs live in a separate register.

## Step 4 — Cross-section traceability (the five rules)

arc42 templates do not enforce these, so this skill does. Check all five before calling a document done:

1. Every Chapter 1.2 quality goal maps to a named approach in Chapter 4.
2. The external systems in Chapter 3 (context) and the Chapter 5 Level-1 building-block view are the **same set** — one system boundary in both.
3. Every Chapter 5 building block appears in at least one Chapter 6 runtime scenario; Chapter 6 includes at least one **error/recovery** scenario, not only the happy path.
4. Chapter 9 carries the in-document ADR index (see Step 3).
5. Each Chapter 5 building block states responsibility, interface, and source location.

## Step 5 — Quality goals: Chapter 1.2 vs Chapter 10

Chapter 1.2 lists only the **top 3-5** quality goals — the ones that drive architecture decisions. Chapter 10 may elaborate further characteristics; that is correct arc42, not a defect.

- The Chapter 10 quality tree marks each characteristic as either *concretising* a Chapter 1.2 top goal or as a *derived* quality requirement.
- Each Chapter 10 scenario cross-links back to the Chapter 1.2 goal it concretises (or is marked "derived").
- Each Chapter 10 scenario is written in the **six-part Quality Attribute Scenario** form: Source, Stimulus, Artifact, Environment, Response, Response Measure. The Response Measure carries a **literal figure**, so the requirement is testable rather than an adjective.

## Step 6 — Chapter 11: Risks and Technical Debt are two subsections

Separate them.

- Each **Risk** carries probability, impact, a derived priority, and a mitigation/action cross-referencing an existing mitigation in Chapter 8 or a quality scenario where one exists. Order risks by priority.
- Each **Technical Debt** item references the specific Chapter 5 building block it burdens.

## Definition of done

A document is done when all five traceability rules in Step 4 hold, every Chapter 1.2 goal has a Chapter 4 approach and at least one six-part Chapter 10 scenario, every ADR's consequences reference an R-NNN (or an explicitly accepted no-risk note), and Chapter 11 separates ordered Risks from building-block-attributed Technical Debt. See [references/chapter-checklist.md](references/chapter-checklist.md) for a chapter-by-chapter pass.

## Further reading

- arc42: https://arc42.org
- C4-PlantUML: https://github.com/plantuml-stdlib/C4-PlantUML
- Nygard, *Documenting Architecture Decisions* (2011)
