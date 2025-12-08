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

1. Run the SOLID validator on the specified files:
   ```bash
   node dist/cli.js --agents=solid <file-paths>
   ```

2. Review the violations report and compliance score

3. Address critical and high-priority violations first

## Example

```bash
node dist/cli.js --agents=solid src/services/*.ts
```
