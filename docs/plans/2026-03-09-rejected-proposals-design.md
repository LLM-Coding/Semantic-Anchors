# Rejected Proposals Page — Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Static page listing evaluated but not qualified anchor proposals with categorized rejection reasons.

## Design Decisions

- **Format:** Static AsciiDoc (`docs/rejected-proposals.adoc` + `.de.adoc`), manually maintained
- **Placement:** Footer link + reference from Contributing page (not in main nav)
- **Rejection categories** (each links to quality criteria):
  - "Structurally unsuitable" — too vague, no defined methodology (fails: Precise, Rich)
  - "Not in training data" — good concept, LLMs don't reliably recognize it (fails: Consistent)
  - "Too niche" — too specialized for reliable activation (fails: Consistent, Rich)
- **Scope:** Only actually submitted proposals. GoF Tier-3 stays in umbrella context only.
- **Initial entries:** TLDR, ELI5, MIRRR UX Framework (#150)
- **Tech:** Same pipeline as Changelog/AgentSkill — render-docs.js, i18n, bilingual

Closes #166
