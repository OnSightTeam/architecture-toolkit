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

1. Run Testing Strategy agent:
   ```bash
   node dist/cli.js --agents=testing <test-file-paths>
   ```

2. Review test smell violations

3. Check F.I.R.S.T principle violations

4. Verify test independence issues

5. Follow recommendations to improve test quality

## Example

```bash
node dist/cli.js --agents=testing src/**/*.test.ts
```

## Output

Reports violations in:
- Test quality (T1-T9 smells)
- F.I.R.S.T principles compliance
- Test independence issues
