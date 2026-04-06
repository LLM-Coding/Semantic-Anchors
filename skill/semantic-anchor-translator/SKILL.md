---
name: semantic-anchor-translator
description: Bi-directional translator between verbose descriptions and established terminology (semantic anchors). Use when (1) user describes a concept verbosely and you want to identify the precise term, or (2) user asks for methodology/approach and you want to suggest relevant anchors. Covers 120+ terms across testing, architecture, design principles, problem-solving, requirements, documentation, communication, development workflow, statistical methods, strategic planning, and creative writing.
metadata:
  author: LLM-Coding
  version: "1.0"
  source: https://github.com/LLM-Coding/Semantic-Anchors
license: MIT
---

# Semantic Anchor Translator

Translate between natural language and established terminology that activates rich knowledge domains.

## What are Semantic Anchors?

Semantic anchors are well-defined terms, methodologies, and frameworks that serve as reference points when communicating. They act as shared vocabulary that triggers specific, contextually rich knowledge.

**Example:** Instead of "write tests first, mock dependencies, work from outside-in" → say **"TDD, London School"**

## Two Modes

### Recognition Mode (verbose → anchor)

When user describes something like:
- "I want to categorize things so they don't overlap and cover everything"
- "I need to structure docs into tutorials, how-tos, explanations, and reference"
- "Start with the conclusion, then give supporting details"

Respond with the anchor term + brief validation:
> You're describing **MECE Principle** (Mutually Exclusive, Collectively Exhaustive).

### Guidance Mode (question → anchors)

When user asks for direction:
- "How should I document architecture decisions?"
- "What's a good way to prioritize requirements?"
- "How do I debug this systematically?"

Suggest relevant anchors:
> For architecture decisions: **ADR according to Nygard** or **MADR**. Both provide lightweight templates for capturing context, decision, and consequences.

## Response Pattern

1. Identify the anchor (or 2-3 if ambiguous)
2. One-sentence explanation of why it matches
3. Optional: related anchors they might also find useful
4. If unsure: ask clarifying question

Keep responses concise — the value is precision, not explanation.

## Catalog Reference

Full catalog with categories, roles, and core concepts: [references/catalog.md](references/catalog.md)

Browse online: https://llm-coding.github.io/Semantic-Anchors/

## Quick Category Index

| Category | Key Anchors |
|----------|-------------|
| Testing & Quality | TDD Chicago/London, BDD, Gherkin, Test Double (Meszaros + 5 subtypes), Testing Pyramid, Mutation Testing, Property-Based Testing, Fagan Inspection, STRIDE, LINDDUN, LLM-Evaluations |
| Software Architecture | Clean Architecture, Hexagonal, DDD, EDA, CQRS, VSA, arc42, C4, ADR, MADR, ATAM, LASR, ISO 25010, OWASP Top 10 |
| Design Principles | SOLID (+ 5 individual), GRASP, CRC-Cards, GoF Patterns (23 patterns), Fowler PEAA, DRY, KISS, SPOT, SSOT, YAGNI |
| Problem-Solving | Five Whys, Feynman Technique, Rubber Duck, Devil's Advocate, Morphological Box, Chain of Thought, Cynefin |
| Requirements | INVEST, PRD, MoSCoW, EARS, User Story Mapping, JTBD, Impact Mapping, Problem Space NVC |
| Communication | BLUF, Pyramid Principle, MECE, Gutes Deutsch, Plain English, Chatham House Rule, Socratic Method, MBTI |
| Documentation | P.A.R.A., Diátaxis, Docs-as-Code |
| Development Workflow | GTD, Definition of Done, GitHub Flow, Conventional Commits, Effective Go, SemVer, BEM, Mikado Method, Hemingway Bridge |
| Statistical Methods | SPC, Control Chart, Nelson Rules |
| Strategic Planning | Wardley Mapping, Pugh Matrix, SWOT, PERT |
| Creative Writing | Three-Act Structure, Hero's Journey, Save the Cat!, Fichtean Curve, Freytag's Pyramid, Story Circle, Kishōtenketsu |
