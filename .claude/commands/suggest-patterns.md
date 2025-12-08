# Suggest Design Patterns

Recommend appropriate Gang of Four design patterns based on code structure.

## Usage
```
/suggest-patterns [file-pattern]
```

If no file pattern is provided, analyze all files in src/.

## What this does

Analyzes code and recommends GoF design patterns:

**Creational Patterns**
- **Factory Method**: When switch statements create objects
- **Builder**: For constructors with >4 parameters (telescoping)
- **Singleton**: Warns about misuse, suggests DI alternatives
- **Abstract Factory**: For families of related objects
- **Prototype**: For object cloning scenarios

**Structural Patterns**
- **Decorator**: For conditionally adding features
- **Adapter**: For interface conversion
- **Facade**: For simplifying complex subsystems
- **Proxy**: For access control or lazy initialization
- **Composite**: For tree structures

**Behavioral Patterns**
- **Strategy**: For switch/if-else selecting algorithms
- **Observer**: For manual notification patterns
- **Command**: For undo/redo or operation queuing
- **Template Method**: For similar algorithms with variations
- **State**: For state-dependent behavior

## Steps

1. Identify files to analyze
2. Run the Pattern Advisor agent
3. Detect pattern opportunities in code
4. Calculate confidence scores (70-90%)
5. Provide before/after code examples
6. Explain trade-offs (pros/cons)
7. Suggest alternative patterns

## Expected Output

- Pattern recommendations with confidence scores
- Problem description and reasoning
- Priority level (high, medium, low)
- Complete code examples (before/after)
- Trade-offs analysis
- Alternative pattern suggestions
- Documentation references
