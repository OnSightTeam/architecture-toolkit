#!/bin/bash
# Architecture Toolkit - Local Installation Script
# This script installs the plugin directly without requiring a marketplace

set -e

echo "🚀 Installing Architecture Toolkit Plugin..."

# Clone the repository to a temp location
TEMP_DIR=$(mktemp -d)
echo "📦 Cloning repository..."
git clone https://github.com/OnSightTeam/architecture-toolkit.git "$TEMP_DIR"

# Build the plugin
echo "🔨 Building plugin..."
cd "$TEMP_DIR"
npm install
npm run build

# Create plugin directory
PLUGIN_DIR="$HOME/.claude/plugins/repos/architecture-toolkit"
echo "📁 Installing to $PLUGIN_DIR..."
mkdir -p "$PLUGIN_DIR"
cp -r "$TEMP_DIR/"* "$PLUGIN_DIR/"

# Register the plugin
echo "📝 Registering plugin..."
INSTALLED_PLUGINS="$HOME/.claude/plugins/installed_plugins.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

# Get the latest commit SHA
cd "$PLUGIN_DIR"
COMMIT_SHA=$(git rev-parse HEAD)

# Update installed_plugins.json
if [ -f "$INSTALLED_PLUGINS" ]; then
  jq --arg timestamp "$TIMESTAMP" --arg sha "$COMMIT_SHA" --arg path "$PLUGIN_DIR" \
    '.plugins["architecture-toolkit"] = {
      "version": "1.0.0",
      "installedAt": $timestamp,
      "lastUpdated": $timestamp,
      "installPath": $path,
      "gitCommitSha": $sha,
      "isLocal": true
    }' "$INSTALLED_PLUGINS" > "$INSTALLED_PLUGINS.tmp"
  mv "$INSTALLED_PLUGINS.tmp" "$INSTALLED_PLUGINS"
else
  echo "❌ Error: Claude plugins configuration not found at $INSTALLED_PLUGINS"
  echo "Please ensure Claude Code is installed."
  exit 1
fi

# Clean up temp directory
rm -rf "$TEMP_DIR"

echo ""
echo "✅ Architecture Toolkit installed successfully!"
echo ""
echo "Available tools:"
echo "  • validate_solid - SOLID principles validation"
echo "  • review_architecture - Clean Architecture review"
echo "  • analyze_clean_code - Clean Code analysis"
echo "  • suggest_patterns - Design pattern recommendations"
echo "  • analyze_testing_strategy - Test quality analysis"
echo "  • analyze_package_design - Package design analysis"
echo "  • get_refactoring_guide - Refactoring guidance"
echo "  • comprehensive_analysis - Complete analysis"
echo ""
echo "Usage in Claude Code:"
echo '  "Check this file for SOLID violations"'
echo "  /validate-solid src/OrderService.ts"
echo "  Please use comprehensive_analysis on src/**/*.py"
echo ""
echo "🎉 Ready to use!"
