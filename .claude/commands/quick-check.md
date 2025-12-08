# Quick Architecture Check

Run fast validation focusing only on critical and high-severity issues.

## Usage
```
/quick-check [file-pattern]
```

If no file pattern is provided, analyze changed files or src/ directory.

## What this does

Performs rapid validation focusing on:
- Critical SOLID violations (DIP, SRP violations)
- Critical Clean Architecture violations (framework in entities)
- Critical security issues (empty catch blocks)
- High-priority code smells
- Missing abstractions at boundaries

**Fast Agents (Priority Focus)**
- SOLID Validator (Critical/High only)
- Architecture Reviewer (Critical/High only)
- Clean Code Analyzer (Critical/High only)

## Steps

1. Identify files to check (changed files preferred)
2. Run fast validation with severity filter
3. Report only Critical and High issues
4. Provide quick-fix recommendations
5. Calculate pass/fail based on Critical issues

## Expected Output

- Pass/Fail status (fails if any Critical issues)
- Critical issues count
- High issues count
- Top 3 most urgent fixes
- Quick remediation steps
- Estimated fix time

**Use this for:**
- Pre-commit checks
- Quick PR reviews
- CI/CD pipeline gates
- Daily development checks
