# Compare Architecture Compliance

Compare architecture compliance scores before and after changes.

## Usage
```
/compare-compliance [branch-name]
```

Compares current branch against specified branch (defaults to main/master).

## What this does

Generates comparative analysis:
- Compliance score delta (before vs after)
- New violations introduced
- Violations resolved
- Quality trend (improving/declining)
- Impact assessment by severity

## Steps

1. Run full analysis on current branch:
   - Use Skill tool with skill: "architecture-toolkit:full-analysis"
   - Save results for current branch

2. Checkout comparison branch (defaults to main/master)

3. Run full analysis on comparison branch:
   - Use Skill tool with skill: "architecture-toolkit:full-analysis"
   - Save results for comparison branch

4. Calculate deltas across all metrics

5. Identify regression vs improvements

6. Generate trend report

## Expected Output

**Compliance Score Comparison**
- Overall: 75% → 82% (+7%) ✅
- SOLID: 70% → 85% (+15%) ✅
- Architecture: 80% → 78% (-2%) ⚠️
- Clean Code: 65% → 75% (+10%) ✅
- Testing: 85% → 90% (+5%) ✅

**Violations Delta**
- Critical: 2 → 0 (-2) ✅
- High: 8 → 5 (-3) ✅
- Medium: 15 → 18 (+3) ⚠️
- Low: 20 → 20 (0) ➡️

**New Issues Introduced**
- List of new violations
- Severity breakdown
- Affected files

**Issues Resolved**
- List of fixed violations
- Impact assessment
- Files improved

**Trend Analysis**
- Overall quality direction
- Risk assessment
- Recommended actions

**Use this for:**
- Pre-merge PR validation
- Release quality gates
- Technical debt tracking
- Team performance metrics
