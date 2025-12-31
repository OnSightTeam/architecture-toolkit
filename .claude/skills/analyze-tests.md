# Analyze Testing Strategy

Review test quality, F.I.R.S.T principles, and test independence.

## Usage

Validate test files for quality and best practices.

## What this skill does

- Detects T1-T9 test smells from Clean Code
  - T1: Insufficient Tests
  - T2: Ignored Test
  - T3: Test Per Class
  - T4: Untested Method
  - T5: Exhaustive Testing
  - T6: Long Tests
  - T7: Slow Tests
  - T8: Fragile Tests
  - T9: Test Code Duplication
- Validates F.I.R.S.T principles
  - **Fast**: No slow operations (HTTP, file I/O, delays)
  - **Independent**: No shared state or test dependencies
  - **Repeatable**: No reliance on dates, randomness, environment
  - **Self-validating**: Automatic pass/fail with assertions
  - **Timely**: Tests written alongside production code
- Checks test independence (no shared mutable state, no test ordering)

## Steps

1. Identify the test files to analyze (use args provided or default to **/*.test.ts)

2. Execute Testing Strategy analysis using Bash tool:
   - Change to the plugin directory
   - Run: `node dist/cli.js --agents=testing <test-file-paths>`
   - Return the full output to the user

3. Review test smell violations

4. Check F.I.R.S.T principle violations

5. Verify test independence issues

6. Summarize findings and provide testing improvement recommendations

## Example

```bash
node dist/cli.js --agents=testing src/**/*.test.ts
```

## Output

Reports violations in:
- Test quality (T1-T9 smells)
- F.I.R.S.T principles compliance
- Test independence issues
