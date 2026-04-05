#!/bin/sh
# Sync generic skills into the Claude plugin package.

set -eu

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE_DIR="$REPO_ROOT/skill"
PLUGIN_SKILLS_DIR="$REPO_ROOT/plugins/semantic-anchors/skills"

# Safety: validate paths before destructive operations
case "$PLUGIN_SKILLS_DIR" in
  */plugins/semantic-anchors/skills) ;;
  *) echo "ERROR: unexpected PLUGIN_SKILLS_DIR: $PLUGIN_SKILLS_DIR" >&2; exit 1 ;;
esac

if [ ! -d "$SOURCE_DIR" ]; then
  echo "WARN: source directory does not exist: $SOURCE_DIR (sync skipped)" >&2
  exit 0
fi

mkdir -p "$PLUGIN_SKILLS_DIR"

# Remove all existing skill subdirectories so deletions in skill/ are reflected
find "$PLUGIN_SKILLS_DIR" -mindepth 1 -maxdepth 1 -type d -exec rm -rf {} +

for skill_dir in "$SOURCE_DIR"/*; do
  [ -d "$skill_dir" ] || continue
  skill_name="$(basename "${skill_dir:?}")"
  cp -R "$skill_dir" "${PLUGIN_SKILLS_DIR:?}/$skill_name"
done

echo "Synced skills into $PLUGIN_SKILLS_DIR"
