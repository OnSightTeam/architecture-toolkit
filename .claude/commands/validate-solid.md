# Validate SOLID Principles

Run comprehensive SOLID principles validation on the specified files or current project.

## Usage
```
/validate-solid [file-pattern]
```

If no file pattern is provided, analyze all TypeScript/JavaScript files in src/.

## What this does

Analyzes code against all five SOLID principles:
- **SRP** (Single Responsibility): Detects mixed concerns, god classes, generic names
- **OCP** (Open/Closed): Finds switch statements on types, instanceof checks
- **LSP** (Liskov Substitution): Identifies contract violations, type checking
- **ISP** (Interface Segregation): Detects fat interfaces, forced implementations
- **DIP** (Dependency Inversion): Finds dependencies on concretions

## Steps

1. Identify the files to analyze
2. Run the SOLID validator from the architecture-toolkit
3. Review violations by severity (Critical, High, Medium, Low)
4. Provide actionable recommendations with code examples
5. Calculate compliance score

## Expected Output

- Compliance score (0-100%)
- Violations grouped by principle
- Severity-based prioritization
- Specific line numbers and code snippets
- Refactoring recommendations
