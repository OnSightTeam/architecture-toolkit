# Review Architecture

Run Clean Architecture validation on specified files.

## Usage

Validate files against Clean Architecture principles (Dependency Rule, Layer Separation, Boundaries).

## What this skill does

- Validates dependency direction (dependencies point inward)
- Checks layer separation (Entities, Use Cases, Adapters, Frameworks)
- Identifies boundary violations (data leaks, missing interfaces)
- Detects framework coupling in business logic
- Finds circular dependencies
- Provides architecture compliance score

## Steps

1. Run the Architecture Reviewer on the specified files:
   ```bash
   node dist/cli.js --agents=architecture <file-paths>
   ```

2. Review architectural violations and layer separation issues

3. Fix critical boundary violations and dependency rule breaks

## Example

```bash
node dist/cli.js --agents=architecture src/**/*.ts
```
