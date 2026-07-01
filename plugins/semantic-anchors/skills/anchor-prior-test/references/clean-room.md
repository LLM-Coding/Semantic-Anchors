# Clean Room

The probes must run in a process that holds **none** of this project's context — otherwise the catalog's own `CLAUDE.md` (which already defines terms like "Cockburn's Fully Dressed format") makes the result circular.

## The command

```sh
mkdir -p /tmp/anchor-probe && cd /tmp/anchor-probe
claude -p "<prompt>" --model <haiku|sonnet|opus> \
    --strict-mcp-config --setting-sources ""
```

- `--setting-sources ""` drops user/project/local config — including the global `~/.claude/CLAUDE.md` **and** auto-memory.
- A **neutral working directory** (`/tmp/anchor-probe`, never a repo subdir) drops the project `CLAUDE.md`, which is discovered by walking up the tree.
- `--strict-mcp-config` disables MCP tools, so the model answers from training only.

Verify once per session that it is clean:

```sh
cd /tmp/anchor-probe
claude -p "Do you have any custom instructions loaded (CLAUDE.md, contracts, memory)? Name them or say 'none'." \
    --model haiku --strict-mcp-config --setting-sources ""
# Expect: "none"
```

## Why not sub-agents

Sub-agents spawned inside the session inherit the parent's context, which is **frozen at session start-up**. A weak sub-agent will quote the project's own contracts back at you ("…as named in the Semantic Anchors CLAUDE.md contract"). Renaming files mid-session does not fix this, because the snapshot is already taken. Only a *freshly started* process reads the (now absent) files from disk. This is the whole reason the skill uses `claude -p` rather than the Agent tool.

## Models

Use the alias tiers `haiku` (weak), `sonnet` (mid), `opus` (strong). The weak tier is the most informative: a strong anchor survives even there. Older generations (Claude 3.x) are usually not reachable via the Code OAuth path — and you do not need them. If a concept is thin on the *latest* models, it is thinner on older ones; report the gap as a lower bound.

## Cost and fallback

Each probe is a full model call. A typical battery is 4 probe types × 3 tiers ≈ 10–14 calls; run them in the background. If only one model tier is available, the test still runs but states reduced confidence in the verdict — note this explicitly rather than implying a full sweep.
