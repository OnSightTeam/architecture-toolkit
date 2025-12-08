# Analyze Testing Strategy

Review test quality, F.I.R.S.T principles, and test independence.

## Usage
```
/analyze-tests [test-file-pattern]
```

If no pattern is provided, analyze all test files (**/*.test.ts, **/*.spec.ts).

## What this does

Validates testing best practices:

**Test Smell Detection (T1-T9)**
- **T1**: Insufficient Tests - Coverage gaps
- **T2**: Ignored Test - Skipped tests (skip, xit)
- **T3**: Test Per Class - Too few tests per suite
- **T4**: Untested Method - Functions lacking coverage
- **T5**: Exhaustive Testing - Too many assertions
- **T6**: Long Tests - Tests exceeding 30 lines
- **T7**: Slow Tests - Delays, sleeps, timeouts
- **T8**: Fragile Tests - Time/randomness dependencies
- **T9**: Test Code Duplication - Repeated setup

**F.I.R.S.T Principles Validation**
- **Fast**: Detects slow operations (HTTP, file I/O, setTimeout)
- **Independent**: Identifies shared state, test dependencies
- **Repeatable**: Finds non-deterministic elements (Date.now, Math.random)
- **Self-validating**: Checks for manual verification needs
- **Timely**: Validates tests written with production code

**Test Independence Analysis**
- Shared mutable state detection
- Test ordering dependencies
- Global state modifications
- Cross-test dependencies

## Steps

1. Identify test files to analyze
2. Run the Testing Strategy agent
3. Check for test smells (T1-T9)
4. Validate F.I.R.S.T principles
5. Analyze test independence
6. Calculate test quality score
7. Provide improvement recommendations

## Expected Output

- Test quality score (0-100%)
- Test smells by category
- F.I.R.S.T principle violations
- Test independence issues
- Specific examples with line numbers
- Recommended fixes and patterns
