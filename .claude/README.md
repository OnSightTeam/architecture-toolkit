# Architecture Toolkit - Claude Code Plugin

MCP plugin for comprehensive architecture validation with 7 specialized agents.

## Installation

### Option 1: Install from GitHub

```bash
claude plugin install https://github.com/OnSightTeam/architecture-toolkit.git
```

### Option 2: Install Locally

```bash
cd /path/to/architecture-toolkit
npm install
npm run build
claude plugin install .
```

## Available Tools

This plugin provides 8 MCP tools accessible in Claude Code:

### 1. `validate_solid`
Validates code against all five SOLID principles (SRP, OCP, LSP, ISP, DIP).

**Parameters:**
- `filePaths` (array): File paths to analyze

**Example:**
```
Use validate_solid to check src/OrderService.ts for SOLID violations
```

### 2. `review_architecture`
Reviews code for Clean Architecture compliance.

**Parameters:**
- `filePaths` (array): File paths to analyze

**Example:**
```
Use review_architecture to validate src/use-cases/CreateOrder.ts
```

### 3. `analyze_clean_code`
Analyzes code for Clean Code principles.

**Parameters:**
- `filePaths` (array): File paths to analyze

**Example:**
```
Use analyze_clean_code to check src/**/*.ts for code smells
```

### 4. `suggest_patterns`
Recommends appropriate Gang of Four design patterns.

**Parameters:**
- `filePaths` (array): File paths to analyze

**Example:**
```
Use suggest_patterns to find pattern opportunities in src/payment/
```

### 5. `analyze_testing_strategy`
Analyzes test quality and F.I.R.S.T principles.

**Parameters:**
- `filePaths` (array): File paths to analyze

**Example:**
```
Use analyze_testing_strategy to review tests in src/**/*.test.ts
```

### 6. `analyze_package_design`
Analyzes package cohesion and coupling.

**Parameters:**
- `filePaths` (array): File paths to analyze

**Example:**
```
Use analyze_package_design to validate package structure in src/
```

### 7. `get_refactoring_guide`
Provides step-by-step refactoring plans.

**Parameters:**
- `filePaths` (array): File paths to analyze

**Example:**
```
Use get_refactoring_guide to get refactoring steps for src/legacy/
```

### 8. `comprehensive_analysis`
Runs all 7 agents for complete analysis.

**Parameters:**
- `filePaths` (array): File paths to analyze

**Example:**
```
Use comprehensive_analysis to analyze all files in src/
```

## Skills

The plugin also includes 8 skills for common workflows:

- `validate-solid.md` - Quick SOLID validation
- `review-architecture.md` - Architecture review workflow
- `analyze-clean-code.md` - Clean code analysis workflow
- `suggest-patterns.md` - Pattern recommendation workflow
- `analyze-testing-strategy.md` - Testing analysis workflow
- `analyze-package-design.md` - Package design workflow
- `get-refactoring-guide.md` - Refactoring guidance workflow
- `comprehensive-analysis.md` - Full analysis workflow

## Usage in Claude Code

### Using Tools Directly

```
Please use the validate_solid tool to check src/OrderService.ts
```

### Using Skills

```
/validate-solid src/OrderService.ts
```

### Natural Language

Claude Code will automatically use the appropriate tools when you ask:

```
"Check this file for SOLID violations"
"Review my architecture"
"Suggest design patterns for this code"
"Analyze my test quality"
```

## Output Format

All tools return structured data with:
- `agent`: Name of the agent
- `complianceScore`: Percentage score (0-100)
- `violations`: Array of detected issues
- `summary`: Human-readable summary

Each violation includes:
- `severity`: critical, high, medium, or low
- `category`: Type of violation
- `description`: What's wrong
- `location`: Where it was found
- `recommendation`: How to fix it
- `principle`: Which principle/pattern applies

## Configuration

The plugin runs with default settings. To customize, create `.claude/config.json`:

```json
{
  "architecture-toolkit": {
    "knowledgeBasePath": "./docs/specs",
    "defaultAgents": ["solid", "architecture", "cleanCode"],
    "severity": ["critical", "high"]
  }
}
```

## Uninstallation

```bash
claude plugin uninstall architecture-toolkit
```

## Support

- GitHub Issues: https://github.com/yourusername/architecture-toolkit/issues
- Documentation: https://github.com/yourusername/architecture-toolkit
