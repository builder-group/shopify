#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

DIR="$(dirname "$0")"

# Find the absolute path to the monorepo's root directory
chmod +x "$DIR/find_monorepo_root.sh"
source "$DIR/find_monorepo_root.sh"
MONOREPO_ROOT=$(find_monorepo_root)
echo "👉 Monorepo root found at: $MONOREPO_ROOT"

# Get the absolute path to the CLI's bin directory
CLI_BIN_PATH="$MONOREPO_ROOT/node_modules/@blgc/cli/bin"

# Making sure the run.sh script is executable
chmod +x "$CLI_BIN_PATH/run.sh"

# Execute the run.sh script with passed arguments
"$CLI_BIN_PATH/run.sh" "$@"
