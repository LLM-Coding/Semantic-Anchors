#!/bin/bash
# Install semantic-anchor onboarding into the best available markdown file.
# Usage: ./install.sh --source /path/to/block.md [--target-dir DIR] [--scope project|home] [--claude-hook]

set -euo pipefail

SOURCE_FILE=""
TARGET_DIR="."
SCOPE="project"
INSTALL_CLAUDE_HOOK=0
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

usage() {
  cat <<USAGE
Usage: $0 --source /path/to/block.md [--target-dir DIR] [--scope project|home] [--claude-hook]

Options:
  --source PATH       Markdown file containing the semantic-anchor block to inject
  --target-dir DIR    Target project directory for project scope (default: .)
  --scope SCOPE       project or home (default: project)
  --claude-hook       Install/update a Claude SessionStart hook that re-injects the block
  -h, --help          Show this help text
USAGE
}

require_arg() {
  if [ "$#" -lt 2 ] || [ -z "$2" ] || case "$2" in --*) true;; *) false;; esac; then
    echo "Option $1 requires a value" >&2
    usage >&2
    exit 1
  fi
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --source)
      require_arg "$@"
      SOURCE_FILE="$2"
      shift 2
      ;;
    --target-dir)
      require_arg "$@"
      TARGET_DIR="$2"
      shift 2
      ;;
    --scope)
      require_arg "$@"
      SCOPE="$2"
      shift 2
      ;;
    --claude-hook)
      INSTALL_CLAUDE_HOOK=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [ -z "$SOURCE_FILE" ]; then
  echo "--source is required" >&2
  usage >&2
  exit 1
fi

if [ ! -f "$SOURCE_FILE" ]; then
  echo "Source file not found: $SOURCE_FILE" >&2
  exit 1
fi

if [ "$SCOPE" != "project" ] && [ "$SCOPE" != "home" ]; then
  echo "--scope must be project or home" >&2
  exit 1
fi

TARGET_DIR="$(cd "$TARGET_DIR" && pwd)"
SOURCE_FILE="$(cd "$(dirname "$SOURCE_FILE")" && pwd)/$(basename "$SOURCE_FILE")"
CODEX_HOME_DIR="${CODEX_HOME:-$HOME/.codex}"

MARKER_START="<!-- semantic-anchors:start -->"
MARKER_END="<!-- semantic-anchors:end -->"
SECTION_HEADER="## Semantic Anchors"
INJECTED_FILE="$TMP_DIR/injected.md"
REPLACED_FILE="$TMP_DIR/replaced.md"
COMBINED_FILE="$TMP_DIR/combined.md"

select_target_file() {
  if [ "$SCOPE" = "project" ]; then
    local candidates=(
      "$TARGET_DIR/AGENTS.md"
      "$TARGET_DIR/CLAUDE.md"
      "$TARGET_DIR/GEMINI.md"
      "$TARGET_DIR/.github/copilot-instructions.md"
      "$TARGET_DIR/.claude/AGENTS.md"
    )
    local candidate
    for candidate in "${candidates[@]}"; do
      if [ -f "$candidate" ]; then
        printf '%s\n' "$candidate"
        return 0
      fi
    done
    printf '%s\n' "$TARGET_DIR/AGENTS.md"
    return 0
  fi

  local candidates=(
    "$CODEX_HOME_DIR/AGENTS.md"
    "$HOME/.claude/CLAUDE.md"
    "$HOME/.gemini/GEMINI.md"
  )
  local candidate
  for candidate in "${candidates[@]}"; do
    if [ -f "$candidate" ]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done
  printf '%s\n' "$CODEX_HOME_DIR/AGENTS.md"
}

build_injected_block() {
  {
    printf '%s\n' "$MARKER_START"
    cat "$SOURCE_FILE"
    printf '\n%s\n' "$MARKER_END"
  } > "$INJECTED_FILE"
}

inject_block() {
  local target_file="$1"

  mkdir -p "$(dirname "$target_file")"

  if [ ! -f "$target_file" ] || [ ! -s "$target_file" ]; then
    cat > "$target_file" <<EOF
# Semantic Anchors

$(cat "$INJECTED_FILE")
EOF
    return 0
  fi

  if grep -qF "$MARKER_START" "$target_file"; then
    if ! grep -qF "$MARKER_END" "$target_file"; then
      echo "ERROR: Found $MARKER_START but missing $MARKER_END in $target_file" >&2
      echo "Refusing to replace — would truncate the file. Add the end marker and retry." >&2
      exit 1
    fi
    awk -v start="$MARKER_START" -v end="$MARKER_END" -v repl="$INJECTED_FILE" '
      BEGIN {
        while ((getline line < repl) > 0) replacement = replacement line "\n"
        close(repl)
        in_block = 0
      }
      index($0, start) { if (!in_block) printf "%s", replacement; in_block = 1; next }
      index($0, end) { in_block = 0; next }
      !in_block { print }
    ' "$target_file" > "$REPLACED_FILE"
    mv "$REPLACED_FILE" "$target_file"
    return 0
  fi

  {
    cat "$target_file"
    printf '\n'
    if ! grep -qF "$SECTION_HEADER" "$target_file"; then
      printf '%s\n' "$SECTION_HEADER"
    fi
    cat "$INJECTED_FILE"
  } > "$COMBINED_FILE"
  mv "$COMBINED_FILE" "$target_file"
}

relative_to_target() {
  local path="$1"
  python3 - "$TARGET_DIR" "$path" <<'PY'
import os
import sys

base = os.path.abspath(sys.argv[1])
path = os.path.abspath(sys.argv[2])
print(os.path.relpath(path, base))
PY
}

install_claude_hook() {
  local target_file="$1"
  local hook_root hook_script settings_file hook_command relative_target

  if [ "$SCOPE" = "project" ]; then
    hook_root="$TARGET_DIR/.claude/semantic-anchor-onboarding"
    hook_script="$hook_root/session-start.sh"
    settings_file="$TARGET_DIR/.claude/settings.json"
    relative_target="$(relative_to_target "$target_file")"
    hook_command="\"\$CLAUDE_PROJECT_DIR\"/.claude/semantic-anchor-onboarding/session-start.sh \"\$CLAUDE_PROJECT_DIR/$relative_target\""
  else
    hook_root="$HOME/.claude/semantic-anchor-onboarding"
    hook_script="$hook_root/session-start.sh"
    settings_file="$HOME/.claude/settings.json"
    hook_command="\"$hook_script\" \"$target_file\""
  fi

  mkdir -p "$hook_root"
  mkdir -p "$(dirname "$settings_file")"
  cp "$SCRIPT_DIR/claude-session-start.sh" "$hook_script"
  chmod +x "$hook_script"

  if [ -f "$settings_file" ]; then
    cp "$settings_file" "$settings_file.bak"
  fi

  python3 - "$settings_file" "$hook_command" <<'PY'
import json
import os
import sys

settings_path, command = sys.argv[1], sys.argv[2]

if os.path.exists(settings_path):
    with open(settings_path, "r", encoding="utf-8") as handle:
        settings = json.load(handle)
else:
    settings = {"$schema": "https://json.schemastore.org/claude-code-settings.json"}

hooks = settings.setdefault("hooks", {})
session_start = hooks.setdefault("SessionStart", [])

existing_index = None
for i, entry in enumerate(session_start):
    if not isinstance(entry, dict):
        continue
    for hook in entry.get("hooks", []):
        if isinstance(hook, dict) and "semantic-anchor" in hook.get("command", ""):
            existing_index = i
            break
    if existing_index is not None:
        break

new_entry = {
    "matcher": "startup|resume",
    "hooks": [
        {
            "type": "command",
            "command": command,
        }
    ],
}

if existing_index is not None:
    session_start[existing_index] = new_entry
else:
    session_start.append(new_entry)

with open(settings_path, "w", encoding="utf-8") as handle:
    json.dump(settings, handle, indent=2)
    handle.write("\n")
PY
}

build_injected_block
TARGET_FILE="$(select_target_file)"
inject_block "$TARGET_FILE"

if [ "$INSTALL_CLAUDE_HOOK" -eq 1 ]; then
  install_claude_hook "$TARGET_FILE"
fi

echo "Semantic anchors installed into: $TARGET_FILE"
if [ "$INSTALL_CLAUDE_HOOK" -eq 1 ]; then
  echo "Claude SessionStart hook installed or updated."
fi
