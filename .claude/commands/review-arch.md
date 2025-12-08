# Review Clean Architecture

Validate Clean Architecture principles and layer boundaries in your codebase.

## Usage
```
/review-arch [file-pattern]
```

If no file pattern is provided, analyze all files in src/.

## What this does

Validates Clean Architecture principles:
- **Dependency Rule**: Ensures dependencies point inward (high-level → low-level)
- **Layer Separation**: Validates separation of concerns across architectural layers
- **Boundary Interfaces**: Checks for proper ports/adapters pattern
- **Entity Layer**: Validates business entities have no framework dependencies
- **Use Case Layer**: Ensures use cases don't depend on infrastructure
- **Interface Adapters**: Validates controllers/presenters don't leak to business logic
- **Frameworks Layer**: Checks external frameworks stay in outer layer

## Steps

1. Identify the codebase structure and layers
2. Run the Architecture Reviewer agent
3. Validate the Dependency Rule across layers
4. Check for framework coupling in business logic
5. Identify circular dependencies
6. Detect data structure leaks across boundaries
7. Provide layer-by-layer violation report

## Expected Output

- Dependency violations (Critical: framework in entities/use cases)
- Layer boundary violations (High: business logic in controllers)
- Missing abstractions at boundaries (Medium)
- Architecture compliance score
- Recommended refactorings with Clean Architecture patterns
