# Agent Support

## Recommended Strategy

Use `AGENTS.md` as the portable baseline when the user wants semantic anchors to work across multiple coding agents. Then add native mirror files only for agents whose startup context is centered on their own filename or settings.

Project-local onboarding is the strongest cross-agent answer. Home-directory onboarding is useful for personal defaults, but it is not universally portable across all coding agents.

When installing into a live repository, follow the ToonDex pattern: inject a marked `Semantic Anchors` block into the first suitable existing markdown file, and create a minimal `AGENTS.md` only when no suitable file exists.

If the repository also ships a Claude marketplace plugin, keep `skill/` as the source of truth and sync the plugin copy from it. Do not hand-maintain duplicate skill trees.

## Support Matrix

| Agent | Project-level startup context | User or home-level startup context | Hooks or dynamic injection | Guidance |
| --- | --- | --- | --- | --- |
| Codex | `AGENTS.md` in the repo; repository and parent-directory instruction files can be layered | `$CODEX_HOME/AGENTS.md` (commonly `~/.codex/AGENTS.md`) | None needed for static anchors | Use `AGENTS.md` as the primary file. This is the best baseline for portable semantic-anchor onboarding. |
| Claude Code | `CLAUDE.md` in the project root (plus project and user memory layers) | `~/.claude/CLAUDE.md` | Hooks in settings, especially `SessionStart` and `UserPromptSubmit` | Use `CLAUDE.md` for native Claude startup context. The optional `SessionStart` hook is useful only when you need reinjection or automation. |
| Gemini CLI | `GEMINI.md` by default; optionally configure Gemini to load `AGENTS.md` via `context.fileName` | `~/.gemini/GEMINI.md` | Extensions and hooks exist, but are not required for static anchors | Prefer `AGENTS.md` plus Gemini `context.fileName` when standardizing across agents; otherwise mirror into `GEMINI.md`. |
| Cursor | `AGENTS.md` or `.cursor/rules/*.mdc` | User Rules in Cursor settings | None needed for this use case | Use `AGENTS.md` unless path-scoped behavior is required, in which case use `.cursor/rules`. |
| GitHub Copilot | `AGENTS.md` for coding-agent behavior; `.github/copilot-instructions.md` for repository-wide chat and review guidance | IDE-specific personal or global instructions, not one portable path | Agent modes exist, but are not required for default anchor onboarding | Use both `AGENTS.md` and `.github/copilot-instructions.md` when you want broad coverage across coding agent, chat, and review workflows. |
| Windsurf | `AGENTS.md` or `.windsurf/rules/*.md` | Global Rules in Windsurf settings | Workflow automation exists, but is not required for static anchors | Use `AGENTS.md` for portable shared context; use Windsurf Rules only when you need editor-specific or scoped behavior. |

## Scope Rules

- Choose project scope when the user wants team-wide behavior or maximum portability.
- Choose home scope when the user wants personal defaults across many repositories.
- If the user wants both, split responsibilities: personal style in home memory, team or repo conventions in project files.

## Portable Defaults

For the widest practical coverage, create these files in this order:

1. `AGENTS.md`
2. `CLAUDE.md` only if Claude Code is a target
3. `GEMINI.md` or Gemini `context.fileName` settings only if Gemini CLI is a target
4. `.github/copilot-instructions.md` only if Copilot chat or review behavior also needs the same defaults
5. `.cursor/rules` or `.windsurf/rules` only when agent-specific scoping is required

The bundled installer automates only the shared-file step plus optional Claude hook installation. Use that as the default path before adding mirrors.

For this repository, keep the generic skill definitions in `skill/` and regenerate the Claude plugin copies with `scripts/sync-claude-plugin.sh`.

## When to Use Hooks

Use hooks only when static files are insufficient.

Examples:

- The active anchor set depends on the branch, directory, or file type.
- The team wants to inject recent ADRs, issue metadata, or generated summaries at session start.
- The team wants enforcement, blocking, or validation, not just startup guidance.

For static, always-on semantic anchors, plain instruction files are simpler, safer, and easier to debug.

## Practical Conclusions

- `AGENTS.md` is the right canonical project artifact.
- `CLAUDE.md` and `GEMINI.md` are compatibility mirrors, not the first file to author.
- Cursor Rules and Windsurf Rules are agent-specific overlays, not the portable baseline.
- Home-directory onboarding cannot be guaranteed for every coding agent, so avoid claiming a single universal global install path.
- If the user says "all coding agents," interpret that as "all agents that can reliably consume repository instructions," and prefer project-local files.
