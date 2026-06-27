# arc42 chapter-by-chapter checklist

A final pass over the twelve chapters. Each line is a check the `arc42-documentation` skill enforces beyond plain arc42.

| Ch | Chapter | Checks |
|----|---------|--------|
| 1  | Introduction and Goals | 1.2 lists only the top 3-5 quality goals; each maps to a Chapter 4 approach (rule 1). |
| 2  | Constraints | Technical, organizational/process, and conventional constraints are distinguished. |
| 3  | Context and Scope | At least one diagram. External systems here = the Chapter 5 Level-1 set (rule 2). |
| 4  | Solution Strategy | Names an approach for every Chapter 1.2 quality goal (rule 1). |
| 5  | Building Block View | At least one diagram (C4 via PlantUML stdlib). Each block states responsibility, interface, source location (rule 5). Level-1 set = Chapter 3 external systems (rule 2). |
| 6  | Runtime View | At least one diagram. Every Chapter 5 block appears in ≥1 scenario; ≥1 error/recovery scenario, not only the happy path (rule 3). |
| 7  | Deployment View | At least one diagram. |
| 8  | Crosscutting Concepts | Each concept back-references the ADR that decided it. (Baseline 8.1-8.5 live in the `crosscutting-concepts` contract.) |
| 9  | Architecture Decisions | In-document ADR index (ADR \| Title \| Status), even when ADRs live in a register (rule 4). |
| 10 | Quality Requirements | Quality tree marks each characteristic as concretising a 1.2 goal or "derived"; each scenario in six-part form (Source, Stimulus, Artifact, Environment, Response, Response Measure) with a literal Response Measure; each cross-links its 1.2 goal or is marked derived. |
| 11 | Risks and Technical Debt | Two subsections. Risks: probability, impact, derived priority, mitigation cross-ref (Chapter 8 or a quality scenario), ordered by priority. Technical Debt: each item references the Chapter 5 building block it burdens. |
| 12 | Glossary | Ubiquitous-language terms shared with the specification. |

## ADR consequences ↔ Chapter 11

Every ADR's *Consequences* reference the Chapter 11 risk IDs (R-NNN) the decision creates. A new risk either gets added to Chapter 11 or is recorded as explicitly accepted without a tracked risk. Unconfirmed rationale → Status "Accepted (inferred)", Pugh `?` for cells needing team judgement.
