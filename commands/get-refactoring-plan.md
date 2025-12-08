# Get Refactoring Plan

Generate step-by-step refactoring plans with detailed instructions and code examples.

## Usage
```
/get-refactoring-plan [file-pattern]
```

If no file pattern is provided, analyze all files in src/ for refactoring opportunities.

## What this does

Provides comprehensive refactoring guidance:

**Refactoring Opportunities**
- **Extract Method**: Long methods (>25 lines) with multiple responsibilities
- **Extract Class**: Large classes (>15 methods) violating SRP
- **Introduce Parameter Object**: Functions with >4 parameters
- **Replace Magic Numbers**: Literal numbers needing constants
- **Extract Interface**: For dependency inversion

**Pattern Transformation Guides**
- **Strategy Pattern**: Switch statements on behavior → Polymorphic strategies
- **Factory Method**: Switch creating objects → Factory encapsulation
- **Null Object**: Excessive null checks → Default behavior objects
- **Template Method**: Duplicate algorithm variations → Abstract template
- **Decorator**: Conditional feature addition → Composable decorators

**Code Smell Refactoring**
- **Consolidate Duplicate Code**: DRY violations → Shared methods
- **Decompose Conditional**: Complex conditions → Named methods
- **Replace Conditional with Polymorphism**: Type switching → Subclasses
- **Introduce Explaining Variable**: Complex expressions → Named variables
- **Remove Dead Code**: Unused code → Deletion

## Steps

1. Identify files to analyze
2. Detect refactoring opportunities
3. Prioritize by impact and risk
4. Generate step-by-step refactoring plans
5. Provide before/after code examples
6. Estimate effort (low, medium, high)
7. Include validation checkpoints

## Expected Output

- Prioritized refactoring opportunities
- Step-by-step instructions (numbered)
- Complete code examples (before/after)
- Expected benefits
- Risks and mitigation strategies
- Effort estimation
- Test strategy for each refactoring
- Validation checkpoints
