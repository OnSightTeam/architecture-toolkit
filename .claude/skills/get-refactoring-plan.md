# Get Refactoring Guide

Get step-by-step refactoring plans.

## Usage

Analyze code and provide refactoring guidance with code examples.

## What this skill does

- Detects refactoring opportunities
- Provides step-by-step plans
- Shows before/after code examples
- Estimates effort and risks

## Steps

1. Identify the files needing refactoring

2. Execute Refactoring Guide using Bash tool:
   - Change to the plugin directory
   - Run: `node dist/cli.js --agents=refactoring <file-paths>`
   - Return the full output to the user

3. Review refactoring opportunities

4. Summarize step-by-step refactoring plans
