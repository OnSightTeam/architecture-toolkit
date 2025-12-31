# Validate SOLID Principles

Run SOLID principle validation on specified files.

## Usage

Validate files against all five SOLID principles (SRP, OCP, LSP, ISP, DIP).

## What this skill does

- Analyzes TypeScript/JavaScript files for SOLID violations
- Detects Single Responsibility violations (mixed concerns, god classes)
- Finds Open/Closed violations (switch on types, instanceof checks)
- Identifies Liskov Substitution violations (contract breaks)
- Detects Interface Segregation violations (fat interfaces)
- Finds Dependency Inversion violations (depending on concretions)
- Provides compliance score and prioritized recommendations

## Steps

1. Identify the files to analyze (use args provided or default to src/)

2. Execute SOLID validation using Bash tool:
   - Change to the plugin directory
   - Run: `node dist/cli.js --agents=solid <file-paths>`
   - Return the full output to the user

3. Review the violations report and compliance score

4. Summarize findings and provide actionable recommendations
