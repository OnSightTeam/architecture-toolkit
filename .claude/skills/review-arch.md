# Review Architecture

Run Clean Architecture validation on specified files.

## Usage

Validate files against Clean Architecture principles (Dependency Rule, Layer Separation, Boundaries).

## What this skill does

- Validates dependency direction (dependencies point inward)
- Checks layer separation (Entities, Use Cases, Adapters, Frameworks)
- Identifies boundary violations (data leaks, missing interfaces)
- Detects framework coupling in business logic
- Finds circular dependencies
- Provides architecture compliance score

## Steps

1. Identify the files to analyze (use args provided or default to src/)

2. Execute Architecture review using Bash tool:
   - Change to the plugin directory
   - Run: `node dist/cli.js --agents=architecture <file-paths>`
   - Return the full output to the user

3. Review architectural violations and layer separation issues

4. Summarize findings and provide architectural recommendations
