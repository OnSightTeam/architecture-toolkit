# Full Architecture Analysis

Run comprehensive analysis using all agents for complete architecture validation.

## Usage
```
/full-analysis [directory]
```

If no directory is provided, analyze the entire src/ directory with all agents.

## What this does

Runs all 7 architecture toolkit agents for comprehensive validation:

**Tier 1: Core Quality Skills (architecture-toolkit)**
1. `validate-solid` - All five SOLID principles (SRP, OCP, LSP, ISP, DIP)
2. `review-arch` - Clean Architecture boundaries and dependency rules
3. `check-clean-code` - Naming, functions, comments, code smells
4. `suggest-patterns` - Gang of Four design pattern recommendations

**Tier 2: Advanced Analysis Skills (architecture-toolkit)**
5. `analyze-tests` - F.I.R.S.T principles, test smells, independence
6. `check-packages` - Cohesion (REP/CCP/CRP), Coupling (ADP/SDP/SAP)
7. `get-refactoring-plan` - Step-by-step refactoring plans with examples

## Steps

1. Identify codebase structure and files to analyze

2. Run all 7 skills using Skill tool:
   - Skill: "architecture-toolkit:validate-solid"
   - Skill: "architecture-toolkit:review-arch"
   - Skill: "architecture-toolkit:check-clean-code"
   - Skill: "architecture-toolkit:suggest-patterns"
   - Skill: "architecture-toolkit:analyze-tests"
   - Skill: "architecture-toolkit:check-packages"
   - Skill: "architecture-toolkit:get-refactoring-plan"

3. Aggregate findings by severity (Critical, High, Medium, Low)

4. Calculate overall compliance score across all dimensions

5. Prioritize issues across all dimensions

6. Generate executive summary with metrics

7. Provide comprehensive remediation roadmap

## Expected Output

**Executive Summary**
- Overall compliance score (0-100%)
- Total violations by severity (Critical, High, Medium, Low)
- Files analyzed count
- Top 10 priority issues

**Agent-Specific Reports**
- SOLID compliance with violations
- Architecture boundary violations
- Clean Code quality metrics
- Pattern recommendations
- Test quality assessment
- Package design metrics
- Refactoring opportunities

**Prioritized Action Plan**
- Critical issues requiring immediate attention
- High-priority architectural improvements
- Medium-priority code quality enhancements
- Low-priority optimizations
- Estimated effort for each category
- Suggested implementation order

**Metrics Dashboard**
- Compliance trends
- Quality indicators
- Technical debt estimation
- Risk assessment
