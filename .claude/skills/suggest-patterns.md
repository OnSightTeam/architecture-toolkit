# Suggest Design Patterns

Analyze code and recommend appropriate design patterns.

## Usage

Identify opportunities to apply Gang of Four design patterns based on code structure and problems.

## What this skill does

- Analyzes code for pattern opportunities across three categories:
  - **Creational**: Factory Method, Builder, Singleton
  - **Structural**: Decorator, Adapter, Facade
  - **Behavioral**: Strategy, Observer, Command, Template Method
- Provides pattern recommendations with reasoning and confidence scores
- Shows before/after code examples
- Explains trade-offs (pros/cons) for each pattern
- Suggests alternative patterns when applicable

## Steps

1. Run the Pattern Advisor on the specified files:
   ```bash
   node dist/cli.js --agents=patterns <file-paths>
   ```

2. Review pattern recommendations by priority (high, medium, low)

3. Check reasoning and confidence scores for each recommendation

4. Review code examples showing how to apply the pattern

5. Consider trade-offs before implementing

## Example

```bash
node dist/cli.js --agents=patterns src/**/*.ts
```

## Pattern Detection

The advisor detects:
- **Factory Method**: Switch statements creating objects, multiple new operators
- **Builder**: Constructors with >4 parameters (telescoping constructor)
- **Singleton**: getInstance patterns (often warns about misuse)
- **Strategy**: Switch/if-else selecting algorithms
- **Observer**: Manual notification patterns
- **Command**: Undo/redo or queuing operations
- **Decorator**: Conditional feature addition
- **Adapter**: Interface conversion/wrapping
- **Facade**: Complex subsystem interactions
