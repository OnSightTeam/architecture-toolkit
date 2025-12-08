# Installation Instructions for Teammates

## Prerequisites

Before installing the Architecture Toolkit plugin, ensure you have:

1. **Node.js 18.0.0 or higher**
   ```bash
   node --version  # Should show v18.0.0 or higher
   ```

2. **Claude Code CLI installed**
   ```bash
   claude --version
   ```

   If not installed, follow the [Claude Code installation guide](https://claude.ai/code).

## Installation Methods

### Option 1: Install from OnSight Team Marketplace (Recommended)

```bash
# Add the OnSight Team marketplace (one-time setup)
claude plugin marketplace add https://github.com/OnSightTeam/claude-plugins.git

# Install the plugin
claude plugin install architecture-toolkit@onsight-team
```

This is the cleanest method - Claude Code will handle everything automatically:
- Automatically clones and builds the plugin
- Manages dependencies
- Easy updates with `claude plugin update architecture-toolkit`

### Option 2: Automated Installation Script

If you prefer a direct installation without marketplace configuration:

```bash
# Download and run the installation script
curl -fsSL https://raw.githubusercontent.com/OnSightTeam/architecture-toolkit/main/install-plugin.sh | bash
```

Or clone first and run locally:
```bash
git clone https://github.com/OnSightTeam/architecture-toolkit.git
cd architecture-toolkit
./install-plugin.sh
```

This will automatically:
- Clone the repository
- Install dependencies
- Build the project
- Register the plugin with Claude Code
- No marketplace configuration required!

### Option 3: Clone and Install Locally

If you need to install from a local copy or private repository:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/OnSightTeam/architecture-toolkit.git
   cd architecture-toolkit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Install the plugin:**
   ```bash
   claude plugin install .
   ```

### Option 3: Install Specific Version

To install a specific version or branch, clone first and run the install script:

```bash
# Clone specific version
git clone --branch v1.0.0 https://github.com/OnSightTeam/architecture-toolkit.git
cd architecture-toolkit
./install-plugin.sh

# Or clone specific branch
git clone --branch develop https://github.com/OnSightTeam/architecture-toolkit.git
cd architecture-toolkit
./install-plugin.sh
```

## Verifying Installation

After installation, verify the plugin is working:

1. **List installed plugins:**
   ```bash
   claude plugin list
   ```

   You should see `architecture-toolkit` in the list.

2. **Test a tool:**
   ```bash
   echo '{"method":"tools/list"}' | node ~/.claude/plugins/architecture-toolkit/dist/mcp-server.js
   ```

   This should return a JSON list of available tools.

3. **Use in Claude Code:**

   Open Claude Code and try:
   ```
   # TypeScript example
   Please use the validate_solid tool to check examples/BadOrderService.ts

   # Python example
   Please use the validate_solid tool to check examples/BadOrderService.py

   # Swift example
   Please use the validate_solid tool to check examples/BadOrderService.swift

   # Objective-C example
   Please use the validate_solid tool to check examples/BadOrderService.m
   ```

   Or use a skill:
   ```
   /validate-solid examples/BadOrderService.ts
   /validate-solid examples/BadOrderService.py
   /validate-solid examples/BadOrderService.swift
   /validate-solid examples/BadOrderService.m
   ```

## Updating the Plugin

To update to the latest version:

```bash
# Uninstall current version
claude plugin uninstall architecture-toolkit

# Reinstall from repository
claude plugin install https://github.com/OnSightTeam/architecture-toolkit.git
```

Or if installed locally:

```bash
cd architecture-toolkit
git pull
npm install
npm run build
claude plugin update architecture-toolkit
```

## Troubleshooting

### Issue: "Plugin not found"

**Solution:** Ensure you're using the correct repository URL and have access to it.

```bash
# Test repository access
git clone https://github.com/OnSightTeam/architecture-toolkit.git test-clone
cd test-clone
npm install
npm run build
```

If this works, then:
```bash
claude plugin install .
```

### Issue: "Node version too old"

**Solution:** Upgrade Node.js to version 18 or higher:

```bash
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### Issue: "Build fails"

**Solution:** Check TypeScript compilation:

```bash
npm run typecheck  # Check for type errors
npm run clean      # Clean build artifacts
npm run build      # Rebuild
```

### Issue: "Plugin installed but tools not working"

**Solution:** Verify MCP server is executable:

```bash
ls -l ~/.claude/plugins/architecture-toolkit/dist/mcp-server.js
chmod +x ~/.claude/plugins/architecture-toolkit/dist/mcp-server.js
```

### Issue: "Permission denied during installation"

**Solution:** You may need to use proper permissions:

```bash
# On macOS/Linux
sudo npm install -g @anthropic-ai/claude-code

# Then retry plugin installation
claude plugin install https://github.com/OnSightTeam/architecture-toolkit.git
```

## Uninstallation

To remove the plugin:

```bash
claude plugin uninstall architecture-toolkit
```

## Getting Help

If you encounter issues:

1. **Check the plugin README:** `.claude/README.md` in the repository
2. **View plugin logs:** `claude plugin logs architecture-toolkit`
3. **GitHub Issues:** https://github.com/OnSightTeam/architecture-toolkit/issues

## What's Available After Installation

Once installed, you'll have access to:

### 8 MCP Tools:
- `validate_solid` - SOLID principles validation
- `review_architecture` - Clean Architecture review
- `analyze_clean_code` - Clean Code analysis
- `suggest_patterns` - Design pattern recommendations
- `analyze_testing_strategy` - Test quality analysis
- `analyze_package_design` - Package cohesion/coupling
- `get_refactoring_guide` - Refactoring guidance
- `comprehensive_analysis` - All agents combined

### 8 Skills (Slash Commands):
- `/validate-solid`
- `/review-architecture`
- `/analyze-clean-code`
- `/suggest-patterns`
- `/analyze-testing-strategy`
- `/analyze-package-design`
- `/get-refactoring-guide`
- `/comprehensive-analysis`

## Quick Start Guide

After installation, try these examples:

```
# TypeScript/JavaScript examples
Please use validate_solid to analyze src/OrderService.ts
Please use review_architecture to check src/use-cases/
Please use get_refactoring_guide for src/legacy/PaymentProcessor.ts

# Python examples
Please use validate_solid to analyze src/order_service.py
Please use comprehensive_analysis on src/**/*.py

# Swift examples
Please use validate_solid to analyze src/OrderService.swift
Please use comprehensive_analysis on src/**/*.swift

# Objective-C examples
Please use validate_solid to analyze src/OrderService.m
Please use comprehensive_analysis on src/**/*.m

# Mixed codebase
Please use comprehensive_analysis on src/**/*.{ts,py,swift,m}
```

## System Requirements

- **OS:** macOS, Linux, or Windows (WSL)
- **Node.js:** 18.0.0 or higher
- **RAM:** 512MB minimum
- **Disk Space:** ~50MB for plugin and dependencies
- **Claude Code:** Latest version

## Supported Languages

The Architecture Toolkit automatically detects and analyzes:
- **TypeScript** (`.ts`, `.tsx`)
- **JavaScript** (`.js`, `.jsx`, `.mjs`, `.cjs`)
- **Python** (`.py`, `.pyw`)
- **Swift** (`.swift`)
- **Objective-C** (`.m`, `.mm`, `.h`)

Language detection is automatic based on file extension. All agents use language-appropriate patterns for accurate analysis.

## Privacy & Security

This plugin:
- ✅ Runs locally on your machine
- ✅ Does not send code to external servers
- ✅ Only analyzes files you explicitly specify
- ✅ Open source - inspect the code anytime

## Support

For questions or issues:
- 🐛 Issues: https://github.com/OnSightTeam/architecture-toolkit/issues
- 📚 Documentation: https://github.com/OnSightTeam/architecture-toolkit
