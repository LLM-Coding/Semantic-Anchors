# Probe Battery

Four probe types. Each ends with a `SELF:` line so results can be tabled without re-reading the full output. Run each across the weak and strong tiers at least; run the decisive probes (P1 recognition, P3 action) at least twice per tier.

Prefix every prompt with: `Answer only from training knowledge; no tools; plain text.`

## P1 — Recognition & richness (decisive)

> What concepts do you associate with `<precise term>`? List them.
> End with a line: `SELF: confidence=<high/med/low>; richness=<rich/moderate/thin>; reaching=<yes/no>; recognized=<yes/no>`

Measures whether the prior exists and how rich it is. A strong anchor: `recognized=yes`, `richness=rich`, `reaching=no`, and a long list of interconnected concepts.

## P2 — Name ambiguity

> What is `<bare term>`?
> End with a line: `SELF: dominant_domain=<the field your answer is mainly about>; mentioned_<expected>=<yes/no>`

Run the *bare*, unqualified term. If the dominant domain is the wrong field (e.g. "morphological analysis" → linguistics), the catalog must use the qualified name. This sets the recommended anchor string.

## P3 — Anchor action (decisive)

> Using `<term>`, <do a small concrete task in the term's domain>.
> End with a line: `SELF: produced_<expected structure>=<yes/no>; <key sub-feature>_used=<yes/no>`

Tests the term as an *instruction*, not as a quiz. This is what an anchor is actually for. A strong anchor makes the model produce the term's characteristic structure without being told what it is. Compare against a no-anchor baseline ("do the task, any format you like") to see the lift.

## P4 — Attribution

> Who created `<term>`, and roughly when?
> End with a line: `SELF: creator=<name>; confidence=<high/med/low>`

Confirms the *Attributable* criterion and surfaces misattribution (a common failure: the popular name differs from the inventor).

## Optional — Substitution check

For a suspected weak prior, ask for the term explicitly and watch whether the model **hedges**, **invents**, or **silently substitutes** a neighbouring concept. Silent substitution under a confident heading is the signature of an absent prior and a strong reason to reject (or route to a contract).

## Tabling results

Collect the `SELF:` lines into one matrix (rows = probe, columns = model). Quote the most telling raw sentence (a hedge, a misattribution, a rich association list) — verbatim quotes are the evidence the proposal needs.
