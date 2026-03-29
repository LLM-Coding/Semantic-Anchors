#!/bin/bash
# Claude SessionStart hook for semantic-anchor onboarding.
# Usage: ./claude-session-start.sh /path/to/markdown-file

set -euo pipefail

TARGET_FILE="${1:-}"
MARKER_START="<!-- semantic-anchors:start -->"
MARKER_END="<!-- semantic-anchors:end -->"

if [ -z "$TARGET_FILE" ] || [ ! -f "$TARGET_FILE" ]; then
  exit 0
fi

python3 - "$TARGET_FILE" "$MARKER_START" "$MARKER_END" <<'PY'
import json
import pathlib
import sys

path = pathlib.Path(sys.argv[1])
start = sys.argv[2]
end = sys.argv[3]

content = path.read_text(encoding="utf-8")
lines = content.splitlines()
capturing = False
found_end = False
captured = []

for line in lines:
    if start in line:
        capturing = True
        continue
    if end in line:
        found_end = True
        capturing = False
        break
    if capturing:
        captured.append(line)

if capturing and not found_end:
    # Start marker found but end marker missing — broken state, bail out
    raise SystemExit(0)

block = "\n".join(captured).strip()
if not block:
    raise SystemExit(0)

payload = {
    "hookSpecificOutput": {
        "hookEventName": "SessionStart",
        "additionalContext": block,
    }
}
print(json.dumps(payload))
PY
