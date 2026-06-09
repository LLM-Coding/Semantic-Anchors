---
name: anchor-prior-test
description: Empirically test whether a candidate term qualifies as a semantic anchor by probing how densely it sits in LLM training data — across several model tiers in a clean room — before proposing it. Use when triaging an anchor proposal, deciding anchor vs contract, or vetting a rename. Produces a verdict against the four criteria (Precise, Rich, Consistent, Attributable), a tier rating, and a ready-to-paste proposal or rejection.
metadata:
  author: LLM-Coding
  version: "1.0"
  source: https://github.com/LLM-Coding/Semantic-Anchors
license: MIT
---

# Anchor Prior Test

Measure whether a term is a strong semantic anchor instead of guessing. This skill turns the manual litmus test in `CONTRIBUTING.adoc` ("ask the LLM what it associates") into a rigorous, multi-model, clean-room procedure with a structured verdict.

## The principle

A semantic anchor only delivers leverage if the term is already a **dense, pre-computed prior** in the model's training data. Naming it must reliably trigger the rich concept, the same way for everyone, across models you do not control. This skill measures that density empirically. The reasoning behind it is the article *An Anchor Delivers Only as Far as the Prior Reaches* (route `/training-data-vs-practice`).

Two facts drive the whole method:

- **Power tracks density, not merit.** A good, recent, niche method (e.g. "Use-Case 3.0") can be a *weak* anchor; a model will silently substitute the nearest concept it holds rather than admit the gap. Density is what you measure.
- **A weak prior is not a dead end.** It is a candidate for a **contract** (which supplies its own meaning in text) instead of an anchor. The verdict routes the term to the right home.

## When to use

- Triaging a `[Anchor Proposal]` issue before accepting it.
- Deciding **anchor vs contract** for new vocabulary.
- Vetting a **rename** — does the new name trigger the same concept the body describes?

## Procedure

1. **Frame the candidate.** Write down the exact string a user would type. List the precise/qualified form *and* any ambiguous bare form (e.g. "Morphological Box / Zwicky Box" vs bare "morphological analysis"). Note rival terms a model might confuse it with.
2. **Open a clean room.** Run a *fresh* `claude -p` process — **never a sub-agent** (sub-agents inherit this project's `CLAUDE.md` and memory and will give circular results). See `references/clean-room.md`.
3. **Run the probe battery.** Four probe types across at least two model tiers (weak + strong), with at least two runs of the decisive probe. See `references/probe-battery.md`.
4. **Score.** Map results to the four criteria, prior density, and a tier (★). See `references/scoring.md`.
5. **Emit.** A verdict plus either a ready-to-paste `propose-anchor.yml` activation-test section, or a `rejected-proposals.adoc` entry with the reason.

## Critical gotchas — do not skip

- **Sub-agents are contaminated.** They inherit the session's `CLAUDE.md` + memory snapshot. Use a fresh `claude -p` with `--setting-sources ""` from a neutral directory. A running session freezes that context at start-up, so moving files mid-session does *not* help.
- **Recall ≠ execution.** Test both "what is X?" (knowledge) *and* "use X to do Y" (the anchor as instruction). A model can fail to explain a method yet still apply its core move when the move has a dense name.
- **Name ambiguity.** Always probe the bare term too. If a strong model defaults to a different field (e.g. "morphological analysis" → linguistics), the catalog name must carry a disambiguator.
- **n=1 is not evidence.** Run the decisive probe (recognition and the action test) at least twice per model; dramatic single-run behaviour (hedging, mislabelling, substitution) must reproduce before you cite it.

## Output

A short verdict table (criteria × model), a tier (★★★ / ★★☆ / ★☆☆), a route (anchor / contract / reject), and the filled-in proposal or rejection text. See `references/worked-example.md` for a complete run (the Morphological Box).
