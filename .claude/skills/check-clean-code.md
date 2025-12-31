# Analyze Clean Code

Run Clean Code analysis on specified files.

## Usage

Validate files against Clean Code principles (Naming, Functions, Comments, Code Smells).

## What this skill does

- Checks naming conventions (N1-N7): descriptive names, no noise words, pronounceable
- Validates function quality (F1-F4): small functions, few parameters, no side effects
- Reviews comment quality (C1-C5): removes obsolete, redundant, commented-out code
- Detects code smells (G1-G36, E1-E7): duplication, dead code, poor error handling
- Identifies magic numbers and cryptic names
- Provides clean code compliance score

## Steps

1. Run the Clean Code Analyzer on the specified files:
   ```bash
   node dist/cli.js --agents=cleanCode <file-paths>
   ```

2. Review code smells and violations by category

3. Address critical issues (empty catch blocks, error handling)

4. Improve naming, break down large functions, clean up comments

## Example

```bash
node dist/cli.js --agents=cleanCode src/**/*.ts
```
