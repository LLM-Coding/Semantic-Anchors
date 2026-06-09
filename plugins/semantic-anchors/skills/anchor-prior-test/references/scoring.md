# Scoring

Map the probe results to the catalog's four quality criteria, a prior-density judgement, and a tier. The criteria are defined in `CONTRIBUTING.adoc`.

## The four criteria → which probe answers it

| Criterion | Met when | Evidence from |
|---|---|---|
| **Precise** | the term names one bounded body of knowledge | P1 (focused, not scattered) + P2 (unambiguous, or qualified) |
| **Rich** | it activates many interconnected concepts | P1 (`richness=rich`, long list) |
| **Consistent** | different users/models get the same activation | P1 + P3 agree across tiers; P2 not split across fields |
| **Attributable** | it traces to a proponent / publication | P4 (`creator` named, `confidence=high`) |

Add a fifth, decisive judgement:

- **Prior density** — recognized + rich + *acts as an instruction* (P3) across **all** tiers, including the weak one. This is what separates an anchor from a merely real concept. If the weak tier fails recognition or action, the prior is thin.

## Tier rating (from the proposal template)

- **★★★ Self-standing** — the bare (or single recommended) name reliably triggers the behaviour on all tiers. P3 produces the structure without explanation.
- **★★☆ Needs qualification** — known, but requires a qualifier for reliable results (P2 shows ambiguity, or the weak tier needs the explicit form). Record the recommended qualified string.
- **★☆☆ Descriptive only** — names a concept but gives no actionable instruction; P3 does not produce a characteristic structure. **Reject** unless a concrete prompt pattern is demonstrated.

## Route the term

- **Strong prior + matches intended use → anchor.** Emit the `propose-anchor.yml` activation-test section, pre-filled with the matrix and verbatim quotes.
- **Weak prior but the team uses the vocabulary → contract.** A contract supplies meaning in text and does not depend on the prior. Note this in the verdict.
- **Weak prior and not used → reject.** Emit a `rejected-proposals.adoc` entry naming the failed criterion and the substitution observed.

## Honesty rules

- Cite only what reproduced (n ≥ 2 for decisive probes). Label single-run anecdotes as such.
- Separate **recall** (P1/P4) from **execution** (P3): a model may apply a move it cannot define.
- State the model set and that older generations were not tested; frame any gap as a lower bound, not a ceiling.
- If only one tier was available, lower the stated confidence and say so.
