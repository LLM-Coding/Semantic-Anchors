#!/bin/sh
# Refresh the bundled Semantic Contracts snapshot from the published catalog.
#
# data/contracts.json ships as a snapshot so the installer works offline and
# reproducibly. Run this to pull the latest published contracts before an
# install that needs the very newest templates.
#
# Usage: ./refresh-contracts.sh
# Requires: curl

set -eu

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DATA_DIR="$SCRIPT_DIR/../data"
DEST="$DATA_DIR/contracts.json"
SOURCE_URL="https://llm-coding.github.io/Semantic-Anchors/data/contracts.json"

mkdir -p "$DATA_DIR"

# Create the temp file inside DATA_DIR so the final `mv` is an atomic,
# same-filesystem rename (mktemp's default /tmp could be a different filesystem,
# making mv a non-atomic copy that can leave a partial snapshot on failure).
tmp="$(mktemp "$DATA_DIR/.contracts.json.XXXXXX")"
trap 'rm -f "$tmp"' EXIT

echo "Fetching $SOURCE_URL ..."
if ! curl -fsSL "$SOURCE_URL" -o "$tmp"; then
  echo "ERROR: could not fetch the contracts catalog from $SOURCE_URL" >&2
  echo "Keeping the existing snapshot at $DEST." >&2
  exit 1
fi

# Validate it is JSON before overwriting the snapshot.
if command -v python3 >/dev/null 2>&1; then
  python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$tmp" || {
    echo "ERROR: fetched file is not valid JSON; keeping existing snapshot." >&2
    exit 1
  }
fi

mv "$tmp"  "$DEST"
trap - EXIT
echo "Updated $DEST"
