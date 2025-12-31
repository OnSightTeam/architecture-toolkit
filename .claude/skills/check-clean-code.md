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

1. Identify the files to analyze (use args provided or default to src/)

2. Execute Clean Code analysis using Bash tool:
   - Change to the plugin directory
   - Run: `node dist/cli.js --agents=cleanCode <file-paths>`
   - Return the full output to the user

3. Review code smells and violations by category

4. Summarize findings and provide refactoring recommendations
