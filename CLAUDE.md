# CLAUDE.md

This file provides guidance to Claude Code when working with the architecture-toolkit plugin repository.

## Repository Overview

This is a Claude Code plugin that provides comprehensive architecture validation tools for TypeScript, JavaScript, Python, Swift, and Objective-C. It validates SOLID principles, Clean Architecture, design patterns, and code quality.

## Version Update Protocol

**CRITICAL**: When releasing a new version of this plugin, you MUST update ALL FOUR locations listed below. Missing any step will cause version mismatches for users.

### Automated Version Update Procedure

When updating the plugin version (either manually requested or as part of a release):

1. **Update `.claude/plugin.json`**
   - Change `"version": "X.Y.Z"` to the new version
   - Commit: `git commit -m "Bump version to vX.Y.Z"`
   - Push: `git push origin main`

2. **Create Git Tag**
   ```bash
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

3. **Update Marketplace Submodule**
   ```bash
   cd /tmp
   git clone https://github.com/OnSightTeam/claude-plugins.git
   cd claude-plugins
   git submodule update --init --remote plugins/architecture-toolkit
   git add plugins/architecture-toolkit
   git commit -m "Update architecture-toolkit to vX.Y.Z (commit <hash>)"
   git push origin main
   cd -
   rm -rf /tmp/claude-plugins
   ```

4. **Update Marketplace Version (CRITICAL)**
   ```bash
   cd ~/.claude/plugins/marketplaces/onsight-team
   git pull origin main
   # Edit .claude-plugin/marketplace.json
   # Change "version": "X.Y.Z" in the architecture-toolkit plugin entry
   git add .claude-plugin/marketplace.json
   git commit -m "Bump architecture-toolkit version to X.Y.Z"
   git push origin main
   ```

### Why All Four Steps Are Required

| Location | Purpose | What Happens If Skipped |
|----------|---------|-------------------------|
| `.claude/plugin.json` | Plugin metadata | Version inconsistency in codebase |
| Git tag | Version tracking | Can't reference specific versions |
| Marketplace submodule | Code reference | Users get old code |
| `marketplace.json` | **Claude Code version** | **Users get wrong version (CRITICAL)** |

**Remember**: Claude Code determines plugin versions from `marketplace.json`, NOT from git tags!

### Version Update Trigger

Execute this procedure when:
- User requests a version bump
- Preparing a release
- After significant feature additions
- After critical bug fixes

DO NOT ask for permission - execute all four steps automatically whenever a version update is needed.

## Code Development Guidelines

- Follow SOLID principles (we validate others' code, ours should be exemplary)
- Use TypeScript strict mode
- Write self-documenting code (avoid comments)
- Test changes with the example files in `examples/`
- Ensure language-specific patterns work for all supported languages (TS, JS, Python, Swift, Objective-C)

## Testing Changes

```bash
# Build the project
npm run build

# Test with example files
node dist/cli.js examples/BadOrderService.ts
node dist/cli.js examples/BadOrderService.py
node dist/cli.js examples/BadOrderService.swift
node dist/cli.js examples/BadOrderService.m

# Test specific agents
node dist/cli.js --agents=solid examples/BadOrderService.ts
```

## Plugin Structure

- `/src/agents/` - Individual validation agents (SOLID, Architecture, CleanCode, etc.)
- `/src/orchestrator/` - Coordinates multiple agents
- `/src/cli.ts` - Command-line interface
- `/src/mcp-server.ts` - MCP server for Claude Code integration
- `/commands/` - Slash commands for Claude Code
- `/.claude/` - Plugin configuration

## Important Files

- `.claude/plugin.json` - Plugin metadata and version
- `package.json` - Node package configuration
- `tsconfig.json` - TypeScript configuration

## DO NOT

- Create documentation files unless requested
- Add comments inside code (make code self-documenting)
- Commit without running type checks: `npm run typecheck`
- Create PRs without user approval
- Update version without following the 4-step protocol above
