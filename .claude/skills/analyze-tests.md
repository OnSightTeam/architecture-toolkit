# Analyze Testing Strategy

Run testing strategy analysis on test files.

## Usage

Validate test files against F.I.R.S.T principles and detect test smells.

## What this skill does

- Detects test smells (T1-T9)
- Validates F.I.R.S.T principles
- Checks test independence
- Provides testing quality score

## Steps

1. Identify the test files to analyze (use args provided or default to **/*.test.ts)

2. Execute Testing Strategy analysis using Bash tool:
   - Change to the plugin directory
   - Run: `node dist/cli.js --agents=testing <test-file-paths>`
   - Return the full output to the user

3. Review test smells and F.I.R.S.T violations

4. Summarize findings and testing recommendations
