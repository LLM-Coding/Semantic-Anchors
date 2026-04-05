#!/bin/bash
# Claude SessionStart hook that prompts for semantic-anchor onboarding
# when no managed anchor block is present yet.

set -euo pipefail

command -v python3 >/dev/null 2>&1 || { echo "Error: python3 is required but not found" >&2; exit 1; }

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$PWD}"
CODEX_HOME_DIR="${CODEX_HOME:-$HOME/.codex}"
STATE_DIR="$HOME/.claude/semantic-anchor-onboarding"
STATE_FILE="$STATE_DIR/state.json"
MARKER_START="<!-- semantic-anchors:start -->"
MARKER_END="<!-- semantic-anchors:end -->"
COOLDOWN_HOURS=24

has_marker() {
  local file
  for file in "$@"; do
    if [ -f "$file" ] &&
       grep -qF "$MARKER_START" "$file" &&
       grep -qF "$MARKER_END" "$file"; then
      return 0
    fi
  done
  return 1
}

if has_marker \
  "$PROJECT_DIR/AGENTS.md" \
  "$PROJECT_DIR/CLAUDE.md" \
  "$PROJECT_DIR/GEMINI.md" \
  "$PROJECT_DIR/.github/copilot-instructions.md" \
  "$PROJECT_DIR/.claude/AGENTS.md" \
  "$HOME/.claude/CLAUDE.md" \
  "$CODEX_HOME_DIR/AGENTS.md" \
  "$HOME/.gemini/GEMINI.md"; then
  exit 0
fi

mkdir -p "$STATE_DIR" 2>/dev/null || true

python3 - "$STATE_FILE" "$PROJECT_DIR" "$COOLDOWN_HOURS" <<'PY'
import json
import os
import sys
import tempfile
from datetime import datetime, timedelta, timezone

state_path, project_dir, cooldown_hours = sys.argv[1], sys.argv[2], int(sys.argv[3])
now = datetime.now(timezone.utc)

try:
    with open(state_path, "r", encoding="utf-8") as handle:
        state = json.load(handle)
except (FileNotFoundError, json.JSONDecodeError, OSError):
    state = {}

projects = state.setdefault("projects", {})
entry = projects.setdefault(project_dir, {})
last_prompt_raw = entry.get("last_prompt")

if last_prompt_raw:
    try:
        last_prompt = datetime.fromisoformat(last_prompt_raw.replace("Z", "+00:00"))
    except (ValueError, TypeError):
        last_prompt = None
    if last_prompt and now - last_prompt < timedelta(hours=cooldown_hours):
        raise SystemExit(0)

entry["last_prompt"] = now.isoformat().replace("+00:00", "Z")

tmp_path = None
try:
    state_dir = os.path.dirname(state_path)
    fd, tmp_path = tempfile.mkstemp(dir=state_dir, suffix=".tmp")
    with os.fdopen(fd, "w", encoding="utf-8") as handle:
        json.dump(state, handle, indent=2)
        handle.write("\n")
    os.replace(tmp_path, state_path)
except OSError:
    # Best-effort: if write fails, skip silently rather than breaking the hook
    if tmp_path and os.path.exists(tmp_path):
        os.unlink(tmp_path)

message = (
    "Semantic anchors are not configured for this workspace. "
    "On your next response, ask one short onboarding question: "
    "whether the user wants to onboard semantic anchors now for this project "
    "or for their home directory. If they agree and the semantic-anchor-onboarding "
    "skill is available, use it; otherwise guide them to the installation instructions "
    "in the repository README."
)

payload = {
    "hookSpecificOutput": {
        "hookEventName": "SessionStart",
        "additionalContext": message,
    }
}
print(json.dumps(payload))
PY
