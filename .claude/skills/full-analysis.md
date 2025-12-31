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

1. Identify the files to analyze (use args provided or default to src/)

2. Execute comprehensive analysis using Bash tool:
   - Change to the plugin directory
   - Run: `node dist/cli.js <file-paths>` (runs all agents)
   - Return the full output to the user

3. Review summary and per-agent reports

4. Summarize overall compliance and prioritized recommendations

## Output

The comprehensive report includes:
- Summary: Total files, violations, overall compliance score
- Per-agent reports: SOLID, Architecture, Clean Code, Patterns, Testing Strategy, Package Design, Refactoring Guide
- Prioritized recommendations by severity
- Documentation references for fixing violations
- Pattern suggestions with code examples
- Step-by-step refactoring guides
