# Comprehensive Architecture Analysis

Run all toolkit agents for complete code analysis.

## Usage

Validate files with SOLID Validator, Architecture Reviewer, and Clean Code Analyzer simultaneously.

## What this skill does

- Runs all seven agents in parallel for comprehensive analysis
- **SOLID**: Validates all five SOLID principles
- **Architecture**: Checks Clean Architecture boundaries and dependencies
- **Clean Code**: Analyzes naming, functions, comments, and code smells
- **Patterns**: Recommends appropriate design patterns
- **Testing Strategy**: Reviews test quality and F.I.R.S.T principles
- **Package Design**: Analyzes package cohesion, coupling, and stability
- **Refactoring Guide**: Provides step-by-step refactoring plans
- Combines results into unified report with overall compliance score
- Prioritizes violations by severity across all agents

## Steps

1. Run comprehensive analysis (all agents):
   ```bash
   node dist/cli.js <file-paths>
   ```

2. Review summary showing total violations and overall compliance

3. Check each agent's report for specific issues

4. Follow prioritized recommendations starting with critical issues

## Example

```bash
# Analyze all source files
node dist/cli.js src/**/*.ts

# JSON output for CI/CD
node dist/cli.js --format=json src/**/*.ts > report.json

# Filter by severity
node dist/cli.js --severity=critical,high src/**/*.ts
```

## Output

The comprehensive report includes:
- Summary: Total files, violations, overall compliance score
- Per-agent reports: SOLID, Architecture, Clean Code, Patterns, Testing Strategy, Package Design, Refactoring Guide
- Prioritized recommendations by severity
- Documentation references for fixing violations
- Pattern suggestions with code examples
- Step-by-step refactoring guides
