#!/bin/bash

# Array of workspace patterns to check
workspace_patterns=(
    "apps/sfy-*-app/*"
    "apps/*"
    "packages/*"
)

# Array of dependencies to update
dependencies=(
    "@types/node"
    # builder.group
    "@blgc/cli"
    "@blgc/config"
    "eprel-client"
    "feature-fetch"
    "feature-form"
    "feature-logger"
    "feature-react"
    "feature-state"
    "figma-connect"
    "google-webfonts-client"
    "@blgc/openapi-router"
    "@blgc/utils"
    "validation-adapter"
    "validation-adapters"
)

# Find the absolute path to the monorepo's root directory
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
chmod +x "$DIR/find_monorepo_root.sh"
source "$DIR/find_monorepo_root.sh"
MONOREPO_ROOT=$(find_monorepo_root)
echo "👉 Monorepo root found at: $MONOREPO_ROOT"

# Function to update dependencies in a given package
update_dependencies() {
    local package_path=$1
    echo "🔄 Updating dependencies in $package_path"
    if (cd "$package_path" && pnpm update "${dependencies[@]/%/@latest}"); then
        echo "✅ Successfully updated dependencies in $package_path"
    else
        echo "❌ Failed to update dependencies in $package_path"
    fi
}

# Function to process packages based on workspace patterns
process_packages() {
    local pattern=$1
    local full_pattern="$MONOREPO_ROOT/$pattern"

    for package_path in $full_pattern; do
        if [ -d "$package_path" ] && [ -f "$package_path/package.json" ]; then
            echo "📦 Processing package: $package_path"
            update_dependencies "$package_path"
        elif [ -d "$package_path" ]; then
            echo "⚠️ No package.json found in $package_path, skipping..."
        fi
    done
}

# Loop through workspace patterns and process packages
for pattern in "${workspace_patterns[@]}"; do
    echo "🔍 Checking pattern: $pattern"
    process_packages "$pattern"
done

echo "✅ Dependency updates completed."
