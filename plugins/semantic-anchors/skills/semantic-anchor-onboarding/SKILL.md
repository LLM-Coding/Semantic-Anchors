---
name: semantic-anchor-onboarding
description: Install semantic anchors into persistent coding-agent context for Codex, Claude Code, Gemini CLI, Cursor, GitHub Copilot, and similar agents. Use when setting up project-level or user-level onboarding, generating or updating AGENTS.md, CLAUDE.md, GEMINI.md, or Copilot instruction files, choosing anchors by category, or resolving overlapping or mutually exclusive anchors before making them always-on.
---

# Semantic Anchor Onboarding

Install a small, stable set of semantic anchors so coding agents start each session with the same working vocabulary. Prefer project-local onboarding for portability; add user-level memory only when the user wants personal defaults across repositories.

## Workflow

1. Decide scope and portability.
- Prefer project-local onboarding when the goal is "works across as many agents as possible."
- Use user-level memory only for agents that support it natively. Do not promise universal home-directory onboarding across all tools.
- Read [references/agent-support.md](references/agent-support.md) before writing files.

2. Select anchors.
- Keep the always-on set small: usually 3 to 7 anchors.
- Ask for zero or more anchors per category, but force a single primary choice inside the conflict groups listed in [references/anchor-selection.md](references/anchor-selection.md).
- Separate always-on defaults from task-local anchors. Put stable team conventions in startup files; keep exploratory methods task-local unless the user explicitly wants them always on.

3. Render the selected anchor block.
- Start from `assets/templates/anchor-block.md`.
- Fill in the selected anchors as a concise markdown block without markers; the installer adds markers automatically.
- Name each selected anchor explicitly and add one sentence on how it should influence behavior.
- Add precedence rules when two selected anchors might pull in different directions.
- State that explicit user instructions override the default anchors.

4. Run the installer instead of editing by hand.
- Use `scripts/install.sh --source /path/to/anchor-block.md --target-dir <repo> --scope project` for repository onboarding.
- Use `scripts/install.sh --source /path/to/anchor-block.md --scope home` for personal onboarding.
- The installer follows the same pattern as ToonDex: inject into the first suitable existing markdown file, otherwise create a minimal `AGENTS.md`.
- The installer writes an idempotent marker block so future updates replace the old anchor section instead of appending duplicates.

5. Add native behavior only where needed.
- For Claude Code, add `--claude-hook` if the user wants a SessionStart hook that re-injects the selected block at the beginning of each session.
- The Claude marketplace plugin can also ship a separate first-start `SessionStart` hook that asks whether onboarding should run when no semantic-anchor block exists yet.
- For Gemini CLI, either rely on the shared file chosen by the installer or mirror the same block into `GEMINI.md` if the team wants native Gemini memory.
- For GitHub Copilot, mirror the same block into `.github/copilot-instructions.md` only when chat or review workflows also need it.
- For Cursor, the shared file is usually enough; use `.cursor/rules` only when path-scoped behavior is required.

6. Validate on a fresh session.
- Start a new session in each target agent.
- Ask the agent to list the active semantic anchors and explain how they will affect the next answer.
- If the agent misses anchors, shorten the file, move prose out, and make the active list more explicit.

## Writing Rules

- Prefer `AGENTS.md` as the cross-agent baseline.
- Prefer project onboarding over user onboarding when the user says "all agents."
- Prefer one primary anchor in each mutually exclusive cluster.
- Keep anchor text concrete. Name the anchor and expected behavior; avoid essays.
- Do not make `Chain of Thought` an always-on requirement unless the user explicitly asks for it; reasoning visibility differs across agents.
- Treat architecture, documentation, testing, and communication anchors as safer always-on defaults than adversarial or exploratory techniques.
- If the user wants both home and project setup, put personal style in home-level memory and team or process anchors in project-level files.

## References

- Agent loading rules and portability: [references/agent-support.md](references/agent-support.md)
- Category prompts, overlap rules, and one-line explainers: [references/anchor-selection.md](references/anchor-selection.md)

## Assets

Reusable starter templates live in `assets/templates/`:

- `anchor-block.md`
- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
- `copilot-instructions.md`

## Scripts

- `scripts/install.sh`
- `scripts/claude-session-start.sh`

Use the installer first. Mirror into native files only when a target agent requires it.

## Requirements

- **Runtime:** python3 (used by `install.sh` and `claude-session-start.sh` for JSON manipulation and path resolution)
- **Platform:** Unix/macOS (WSL on Windows). Shell scripts use Unix paths (`$HOME/.claude/`, `$HOME/.codex/`) and are not Windows-native.

## Maintenance

- Treat `skill/` as the canonical source for generic skills.
- Regenerate the Claude plugin skill copies with `scripts/sync-claude-plugin.sh`.
- Do not edit both `skill/` and `plugins/semantic-anchors/skills/` by hand.
