# Get Refactoring Guide

Get step-by-step refactoring plans for code improvements.

## Usage

Receive detailed refactoring recommendations with actionable steps.

## What this skill does

- **Identifies Refactoring Opportunities**
  - Extract Method (long methods >25 lines)
  - Extract Class (large classes >15 methods)
  - Introduce Parameter Object (>4 parameters)
  - Replace Magic Numbers with constants

- **Pattern Transformation Guides**
  - Strategy Pattern (switch on behavior)
  - Factory Method (switch creating objects)
  - Null Object Pattern (excessive null checks)

- **Code Smell Refactoring**
  - Consolidate Duplicate Code
  - Decompose Complex Conditionals

- **Provides Detailed Steps**
  - Step-by-step refactoring instructions
  - Before/after code examples
  - Benefits and risks analysis
  - Effort estimation (low, medium, high)

## Steps

1. Identify the files needing refactoring

2. Execute Refactoring Guide using Bash tool:
   - Change to the plugin directory
   - Run: `node dist/cli.js --agents=refactoring <file-paths>`
   - Return the full output to the user

3. Review refactoring opportunities by priority

4. Check step-by-step refactoring plans

5. Review code examples (before/after)

6. Summarize refactoring recommendations and implementation steps

## Example

```bash
node dist/cli.js --agents=refactoring src/**/*.ts
```

## Output

For each refactoring opportunity:
- Problem description and current issue
- Expected outcome
- Priority (critical, high, medium, low)
- Detailed step-by-step instructions
- Code examples showing transformation
- Benefits and risks
- Effort estimate
