---
name: semantic-contracts-installer
description: Install Semantic Contracts (and, as a sub-mode, individual semantic anchors) into a coding agent's persistent context for Claude Code, Codex, Gemini CLI, Cursor, GitHub Copilot, and similar agents. Use when setting up project-level or user-level onboarding, generating or updating AGENTS.md / CLAUDE.md / GEMINI.md / Copilot instruction files, or choosing which contracts a project should run. A contract is the part the LLM cannot guess — a named composition of anchors plus the project's own rendered template — so installing contracts is the high-value path; installing a bare anchor list is the lightweight fallback.
metadata:
  author: LLM-Coding
  version: "0.1"
  source: https://github.com/LLM-Coding/Semantic-Anchors
license: MIT
---

# Semantic Contracts Installer

Install a small, stable set of **Semantic Contracts** so coding agents start each session with the project's shared vocabulary and rules — not just terms the model already knows, but the compositions and rendered templates it cannot guess.

## Why contracts first

A semantic *anchor* (BLUF, MECE, arc42) already works in any chat — the model knows it; installing a list of anchors adds little. A semantic *contract* is different: it pins **which** anchors apply in this project and carries a project-local **template** (e.g. the "Specification" contract = Cockburn use cases + Gherkin + EARS + activity diagrams, with the full template text). That template is information the model cannot reconstruct on its own. Installing contracts is therefore the primary mode; installing a bare anchor block is the `--anchors-only` fallback.

This is the Anchor / Contract / Skill taxonomy (ADR-007) in practice: the installer's job is to put the always-on **contracts** into the agent's instruction file.

## Workflow (contracts mode — default)

1. **Decide scope and portability.** Prefer project-local onboarding for "works across as many agents as possible"; use user-level memory only for agents that support it natively. Read [references/agent-support.md](references/agent-support.md) before writing files.

2. **Present the contract catalog.** Read [data/contracts.json](data/contracts.json) (a bundled snapshot of the published catalog) and show the user the available contracts by `title` + `description`. Keep the installed set small — usually 2 to 6 contracts that match the project's actual practice.

3. **Render the selected contracts into a block.** For each chosen contract, emit its `template` (or `templateDe` when the project works in German) under a clear heading, followed by its resolved `anchors[]` as a one-line supporting-vocabulary list. Start from `assets/templates/contracts-block.md`. Do not add the markers — the installer adds them.

4. **Run the installer instead of editing by hand.**
   - `scripts/install.sh --source /path/to/contracts-block.md --target-dir <repo> --scope project` for repository onboarding.
   - `scripts/install.sh --source /path/to/contracts-block.md --scope home` for personal onboarding.
   - It injects into the first suitable existing markdown file, else creates a minimal `AGENTS.md`, and writes an idempotent marker block (`<!-- semantic-anchors:start/end -->`) so updates replace the previous installation — including any block left by the former `semantic-anchor-onboarding` skill.

5. **Add native behavior only where needed.**
   - The marker block lives in `AGENTS.md` / `CLAUDE.md`, which Claude Code loads natively — so **do not install a SessionStart hook for `CLAUDE.md`**; it would double-load the block.
   - Only use `--claude-hook` when the block lives in a file Claude Code does *not* auto-load. The hook is registered with `matcher: "startup"` (not `resume`), so it does not re-inject on every resume.
   - For Gemini CLI / Copilot / Cursor, rely on the shared file the installer chose; mirror into the native file only when that tool's workflow needs it.

6. **Validate on a fresh session.** Start a new session and ask the agent to list the active contracts and how they will shape the next answer. If it misses them, shorten the file and make the active list more explicit.

## Sub-mode: `--anchors-only`

For projects that want only a bare anchor list (the former onboarding behavior): select 3-7 anchors, render them from `assets/templates/anchor-block.md`, force a single primary choice inside the conflict groups in [references/anchor-selection.md](references/anchor-selection.md), and run the same installer. This is a fallback — prefer contracts.

## Keeping the snapshot fresh

`data/contracts.json` is a bundled snapshot so the skill installs offline and reproducibly. Refresh it from the canonical source with `scripts/refresh-contracts.sh` (fetches the published `contracts.json`). Re-run it before installing if the project needs the very latest contract templates.

## Writing rules

- Install contracts, not essays — each rendered template is already terse; do not pad it.
- Prefer `AGENTS.md` as the cross-agent baseline; prefer project onboarding over user onboarding when the user says "all agents."
- State that explicit user instructions override the installed contracts.
- Do not make exploratory or adversarial techniques always-on unless the user asks.

## Assets, references, scripts

- `data/contracts.json` — bundled contract catalog snapshot.
- `assets/templates/` — `contracts-block.md`, `anchor-block.md`, and per-tool starter files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `copilot-instructions.md`).
- `references/agent-support.md` — agent loading rules and portability.
- `references/anchor-selection.md` — category prompts and conflict groups (for `--anchors-only`).
- `scripts/install.sh` — idempotent block injection with multi-agent file detection.
- `scripts/refresh-contracts.sh` — refresh the bundled snapshot.
- `scripts/claude-session-start.sh` — SessionStart hook for non-native targets only.

## Requirements

- **Runtime:** python3 (used by `install.sh` for settings/JSON manipulation and path resolution); `curl` for `refresh-contracts.sh`.
- **Platform:** Unix/macOS (WSL on Windows).

## Maintenance

- `skill/` is the canonical source; `scripts/sync-claude-plugin.sh` regenerates the plugin copies. Do not edit both by hand.
- The former `semantic-anchor-onboarding` skill is a deprecated alias that forwards here; it will be removed after one release.
