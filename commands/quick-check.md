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

**Skills Used (from architecture-toolkit):**
- `validate-solid` - SOLID principles validation (Critical/High only)
- `review-arch` - Clean Architecture boundaries (Critical/High only)
- `check-clean-code` - Code quality & smells (Critical/High only)

## Steps

1. Identify files to check:
   - Prefer changed files (git diff)
   - Fallback to src/ directory if no changes

2. Run SOLID validation:
   - Use Skill tool with skill: "architecture-toolkit:validate-solid"
   - Pass file pattern as args
   - Focus on Critical/High severity DIP, SRP, OCP violations

3. Run Clean Architecture review:
   - Use Skill tool with skill: "architecture-toolkit:review-arch"
   - Pass file pattern as args
   - Focus on Critical/High severity boundary violations

4. Run Clean Code analysis:
   - Use Skill tool with skill: "architecture-toolkit:check-clean-code"
   - Pass file pattern as args
   - Focus on Critical/High severity code smells

5. Aggregate results:
   - Calculate pass/fail (fails if any Critical issues)
   - Count Critical and High issues
   - List top 3 most urgent fixes
   - Provide quick remediation steps

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
