---
name: semantic-anchor-onboarding
description: DEPRECATED alias of semantic-contracts-installer. Renamed because the skill's high-value job is installing Semantic Contracts (compositions the LLM cannot guess), not bare anchor lists. Use semantic-contracts-installer instead; this alias forwards to it and will be removed after one release.
metadata:
  author: LLM-Coding
  version: "0.4"
  source: https://github.com/LLM-Coding/Semantic-Anchors
  deprecated: true
  supersededBy: semantic-contracts-installer
license: MIT
---

# Semantic Anchor Onboarding (deprecated)

This skill has been **renamed to `semantic-contracts-installer`**. The repositioning reflects the project's Anchor/Contract/Skill taxonomy (ADR-007): a bare list of anchors is something the model already knows, while a *contract* (a named composition of anchors plus a project-local template) is the part it cannot guess — so installing contracts is the high-value job.

## What to do

Use the **`semantic-contracts-installer`** skill instead. It:

- installs Semantic Contracts (renders their templates into the project's instruction file) as the default mode,
- keeps the former anchor-block behavior as a `--anchors-only` sub-mode,
- recognises and idempotently overwrites any block this old skill left (same `<!-- semantic-anchors:start/end -->` markers),
- only installs a Claude SessionStart hook for files Claude Code does not load natively (no hook for `CLAUDE.md`), with matcher `startup`.

No migration step is required: point your workflow at `semantic-contracts-installer` and run it; it replaces the existing marker block in place.

This alias will be removed after one release.
