# Check Clean Code Quality

Analyze code quality using Clean Code principles and identify code smells.

## Usage
```
/check-clean-code [file-pattern]
```

If no file pattern is provided, analyze all files in src/.

## What this does

Validates Clean Code principles:

**Naming Conventions (N1-N7)**
- Single-letter and cryptic variables
- Meaningless distinctions (data1, data2)
- Unpronounceable names
- Magic numbers
- Unnecessary prefixes (m_, _)
- Interface encoding (IInterface)
- Generic class names (Manager, Handler)

**Function Quality (F1-F4)**
- Long methods (>20 lines)
- Too many parameters (>3)
- Hidden side effects
- Command-Query Separation violations

**Comment Quality (C1-C5)**
- Excessive TODO/FIXME
- Obsolete comments
- Redundant comments explaining what
- Commented-out code

**Code Smells (G1-G36, E1-E7)**
- Code duplication (DRY violations)
- Dead code
- Feature envy (excessive chaining)
- Complex boolean expressions
- Empty catch blocks (Critical)
- Improper error handling

## Steps

1. Identify files to analyze
2. Run the Clean Code Analyzer
3. Categorize violations by type (Naming, Functions, Comments, Smells)
4. Prioritize by severity
5. Provide specific examples and fixes

## Expected Output

- Clean Code compliance score
- Violations grouped by category
- Specific line numbers with context
- Before/after refactoring examples
- Priority recommendations
