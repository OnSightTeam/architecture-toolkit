# Architecture Toolkit

Comprehensive toolkit for validating software architecture, SOLID principles, design patterns, and clean code practices.

**Supports TypeScript, JavaScript, and Python** with language-specific pattern detection.

## Quick Start

### As Claude Code Plugin (Recommended for Teams)

```bash
claude plugin install https://github.com/OxidBurn/architecture-toolkit.git
```

Then use in Claude Code:
```
Please use validate_solid to check src/OrderService.ts
```

See [INSTALL.md](INSTALL.md) for detailed installation instructions.

### As CLI Tool

```bash
npm install -g architecture-toolkit
arch-toolkit src/**/*.ts
```

## Features

### Tier 1: Core Quality Agents ✅
- **SOLID Validator** ✅ - Detects violations of all five SOLID principles
- **Architecture Reviewer** ✅ - Validates Clean Architecture boundaries and dependencies
- **Clean Code Analyzer** ✅ - Checks naming, functions, comments, and code smells
- **Pattern Advisor** ✅ - Recommends Gang of Four design patterns

### Tier 2: Advanced Analysis Agents ✅
- **Testing Strategy** ✅ - Reviews test quality, F.I.R.S.T principles, and test independence
- **Package Design** ✅ - Analyzes package cohesion (REP/CCP/CRP) and coupling (ADP/SDP/SAP)
- **Pattern Refactoring Guide** ✅ - Provides step-by-step refactoring plans with code examples

## Installation

### Global Installation

```bash
npm install -g git+https://github.com/OxidBurn/architecture-toolkit.git
arch-toolkit src/**/*.ts
```

### Local Project Installation

```bash
npm install --save-dev git+https://github.com/OxidBurn/architecture-toolkit.git
npx arch-toolkit src/**/*.ts
```

### From Source

```bash
git clone https://github.com/OxidBurn/architecture-toolkit.git
cd architecture-toolkit
npm install
npm run build
npm link
```

## Usage

### Basic Usage

```bash
# Analyze TypeScript/JavaScript files
arch-toolkit src/**/*.ts

# Analyze Python files
arch-toolkit src/**/*.py

# Analyze mixed codebase
arch-toolkit src/**/*.{ts,py}
```

### Select Specific Agents

```bash
# Run only SOLID validator
arch-toolkit --agents=solid src/**/*.ts

# Run multiple agents
arch-toolkit --agents=solid,architecture,cleanCode src/**/*.ts

# Run Tier 2 agents
arch-toolkit --agents=testing,packageDesign,refactoring src/**/*.ts
```

### Custom Knowledge Base

```bash
arch-toolkit --kb=../docs/specs src/**/*.ts
```

### Filter by Severity

```bash
arch-toolkit --severity=critical,high src/**/*.ts
```

### JSON Output

```bash
arch-toolkit --format=json src/**/*.ts > report.json
```

## CLI Options

| Option | Description | Example |
|--------|-------------|---------|
| `--help` | Show help message | `arch-toolkit --help` |
| `--kb=<path>` | Path to knowledge base | `--kb=../docs/specs` |
| `--agents=<list>` | Agents to run (solid, architecture, cleanCode, patterns, testing, packageDesign, refactoring) | `--agents=solid,cleanCode,testing` |
| `--format=<format>` | Output format (console\|json\|markdown) | `--format=json` |
| `--severity=<list>` | Filter by severity | `--severity=critical,high` |

## Programmatic Usage

```typescript
import { ArchitectureToolkit } from 'architecture-toolkit';

const toolkit = new ArchitectureToolkit('./docs/specs');
const report = await toolkit.analyze(['src/**/*.ts'], {
  agents: {
    solid: true,
    architecture: true,
    cleanCode: true,
    patterns: true,
    testing: true,
    packageDesign: true,
    refactoring: true,
  }
});

console.log(`Compliance Score: ${report.summary.overallCompliance}%`);
```

## Language Support

The toolkit automatically detects and analyzes code in:

- **TypeScript** (`.ts`, `.tsx`) - Full support with TypeScript-specific patterns
- **JavaScript** (`.js`, `.jsx`, `.mjs`, `.cjs`) - Full support
- **Python** (`.py`, `.pyw`) - Full support with Python-specific patterns
  - Detects `def` for methods, `isinstance()` for type checks
  - Recognizes `match` statements (Python 3.10+)
  - Understands `Protocol` for interfaces, `ABC` for abstract classes
  - Identifies Python naming conventions (`_private` methods)
  - Recognizes `#` comments and `"""` docstrings

Language detection is automatic based on file extension. All agents and validators use language-appropriate patterns for accurate analysis.

## Current Status

### Phase 1: Foundation ✅ Complete
- [x] SOLID Validator fully implemented and tested
- [x] Architecture Reviewer fully implemented and tested
- [x] Clean Code Analyzer fully implemented and tested
- [x] Pattern Advisor fully implemented and tested
- [x] Knowledge base integration
- [x] Orchestrator framework
- [x] CLI interface
- [x] Shared types and infrastructure

### Tier 1: Core Agents ✅ COMPLETE
- [x] SOLID Validator ✅
- [x] Architecture Reviewer ✅
- [x] Clean Code Analyzer ✅
- [x] Pattern Advisor ✅

### Tier 2: Advanced Analysis Agents ✅ COMPLETE
- [x] Testing Strategy Agent ✅
- [x] Package Design Agent ✅
- [x] Pattern Refactoring Guide Agent ✅

## Agent Details

### SOLID Validator ✅

Validates code against all five SOLID principles:

**Single Responsibility Principle (SRP)**
- Detects mixed concerns (data + persistence + formatting)
- Identifies god classes with too many methods
- Flags generic class names (Manager, Handler, etc.)

**Open/Closed Principle (OCP)**
- Finds switch statements on types
- Detects instanceof checks
- Suggests Strategy, Factory, or Template Method patterns

**Liskov Substitution Principle (LSP)**
- Identifies contract violations
- Detects type checking of derived classes
- Finds exception mismatches

**Interface Segregation Principle (ISP)**
- Detects fat interfaces (>10 methods)
- Identifies forced empty implementations
- Suggests interface splitting

**Dependency Inversion Principle (DIP)**
- Finds high-level modules depending on low-level modules
- Detects direct instantiation of infrastructure classes
- Suggests dependency injection patterns

### Architecture Reviewer ✅

Validates Clean Architecture principles and boundaries:

**Dependency Rule Validation**
- Ensures dependencies point inward (toward higher-level policies)
- Detects outer layer dependencies from inner layers
- Identifies framework coupling in business logic
- Finds circular dependencies

**Layer Separation Analysis**
- Validates separation of concerns across layers
- Detects business logic mixed with infrastructure
- Identifies direct database access in use cases
- Finds UI components with embedded business logic

**Boundary Analysis**
- Checks for proper boundary interfaces (ports/adapters)
- Detects data structure leaks across boundaries
- Identifies missing abstractions at boundaries
- Validates DTO usage vs internal entities

**Detected Violations:**
- Framework imports in Entity/UseCase layers (Critical)
- HTTP Request objects in Use Cases (Critical)
- Direct database access in Use Cases (Critical)
- Business logic in Controllers/UI (High)
- Missing repository interfaces (High)
- Mixed architectural layers in single file (Medium)

### Clean Code Analyzer ✅

Validates Clean Code principles and identifies code smells:

**Naming Conventions (N1-N7)**
- N1: Single-letter and cryptic variable names
- N2: Meaningless distinctions and noise words
- N3: Unpronounceable names
- N4: Magic numbers and unsearchable names
- N5: Unnecessary member prefixes (m_, _)
- N6: Interface encoding (I prefix)
- N7: Generic class names (Manager, Processor)

**Methods Quality (F1-F4)**
- F1: Long methods (>20 lines)
- F2: Too many parameters (>3)
- F3: Hidden side effects
- F4: Command-Query Separation violations

**Comment Quality (C1-C5)**
- C1: Excessive TODO/FIXME comments
- C2: Obsolete comments
- C3: Redundant comments
- C4: Commented-out code

**Code Smells (G1-G36, E1-E7)**
- G5: Code duplication (DRY violations)
- G9: Dead code
- G14: Feature envy (excessive chaining)
- G16: Obscured intent (nested ternaries)
- G28: Complex boolean expressions
- E1: Empty catch blocks (Critical)
- E2: Improper error handling

### Pattern Advisor ✅

Recommends appropriate Gang of Four design patterns:

**Creational Patterns**
- **Factory Method**: Detected when switch statements create objects, multiple new operators
- **Builder**: Recommended for constructors with >4 parameters (telescoping constructor)
- **Singleton**: Warns about misuse and suggests Dependency Injection alternatives

**Structural Patterns**
- **Decorator**: Suggested when conditionally adding features/responsibilities
- **Adapter**: Recommended for interface conversion and wrapping
- **Facade**: Proposed for simplifying complex subsystem interactions

**Behavioral Patterns**
- **Strategy**: Detected when switch/if-else selects algorithms at runtime
- **Observer**: Recommended for manual notification patterns
- **Command**: Suggested when undo/redo or operation queuing is needed
- **Template Method**: Proposed for similar algorithms with variations

**Pattern Recommendations Include:**
- Problem description and reasoning
- Confidence score (70-90%)
- Priority level (high, medium, low)
- Before/after code examples
- Trade-offs analysis (pros and cons)
- Alternative pattern suggestions
- Documentation references

### Testing Strategy ✅

Analyzes test quality, F.I.R.S.T principles, and test independence:

**Test Smell Detection (T1-T9)**
- **T1**: Insufficient Tests - Not enough tests for coverage
- **T2**: Ignored Test - Tests being skipped
- **T3**: Test Per Class - Too few tests per suite
- **T4**: Untested Method - Functions lacking test coverage
- **T5**: Exhaustive Testing - Too many assertions per test
- **T6**: Long Tests - Tests exceeding 30 lines
- **T7**: Slow Tests - Tests with delays/waits
- **T8**: Fragile Tests - Tests depending on time/randomness/environment
- **T9**: Test Code Duplication - Repeated setup code

**F.I.R.S.T Principles Validation**
- **Fast**: Detects slow operations (HTTP, file I/O, delays)
- **Independent**: Identifies shared state and test dependencies
- **Repeatable**: Finds non-deterministic elements (dates, random, env vars)
- **Self-validating**: Checks for manual verification requirements
- **Timely**: Validates tests written alongside production code

**Test Independence Analysis**
- Shared mutable state detection
- Test ordering dependencies
- Global state modifications
- Cross-test dependencies

### Package Design ✅

Validates package structure using cohesion and coupling principles:

**Package Cohesion (REP, CCP, CRP)**
- **REP** (Reuse/Release Equivalence): Classes released together should be reusable together
- **CCP** (Common Closure): Classes that change together belong together
- **CRP** (Common Reuse): Classes reused together belong together

**Package Coupling (ADP, SDP, SAP)**
- **ADP** (Acyclic Dependencies): Detects circular dependencies between packages
- **SDP** (Stable Dependencies): Validates dependencies point toward stability
- **SAP** (Stable Abstractions): Stable packages should be abstract

**Stability Metrics**
- Calculates stability, abstractness, and distance from main sequence
- Identifies packages in "Zone of Pain" (rigid, hard to change)
- Identifies packages in "Zone of Uselessness" (too abstract, no use)
- Provides concrete metrics for package quality assessment

### Pattern Refactoring Guide ✅

Provides step-by-step refactoring plans with detailed instructions:

**Refactoring Opportunities**
- **Extract Method**: Long methods (>25 lines) with multiple responsibilities
- **Extract Class**: Large classes (>15 methods) violating SRP
- **Introduce Parameter Object**: Functions with >4 parameters
- **Replace Magic Numbers**: Literal numbers needing named constants

**Pattern Transformation Guides**
- **Strategy Pattern**: Switch statements on behavior → Polymorphic strategies
- **Factory Method**: Switch creating objects → Factory encapsulation
- **Null Object**: Excessive null checks → Default behavior objects

**Code Smell Refactoring**
- **Consolidate Duplicate Code**: DRY violations → Shared methods
- **Decompose Conditional**: Complex conditions → Well-named methods

**Refactoring Plan Details**
- Step-by-step instructions (numbered steps)
- Code examples (before/after)
- Expected outcomes
- Benefits and risks analysis
- Effort estimation (low, medium, high)
- Validation checkpoints

## Example Output

```
=== Architecture Toolkit Analysis ===

Summary:
  Files Analyzed: 1
  Total Violations: 5
  Overall Compliance: 35%
  Critical Issues: 1
  High Issues: 2
  Medium Issues: 2
  Low Issues: 0

Agent Reports:

  SOLID Validator:
    Compliance Score: 35%
    Violations Found: 5
    Top Issues:
      1. [HIGH] Class has mixed concerns (multiple responsibilities)
         Location: examples/BadOrderService.ts:class
      2. [MEDIUM] Switch statement on type requires modification
         Location: examples/BadOrderService.ts
      3. [CRITICAL] Business logic directly instantiates Email class
         Location: examples/BadOrderService.ts:class

Prioritized Recommendations:
  1. [CRITICAL] Fix 1 critical issue(s) immediately
     Affected: examples/BadOrderService.ts
  2. [HIGH] Address 2 high-priority issue(s)
     Affected: examples/BadOrderService.ts
```

## Integration

### Pre-commit Hook

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "arch-toolkit --severity=critical,high src/**/*.ts"
    }
  }
}
```

### CI/CD Pipeline

```yaml
- name: Architecture Validation
  run: |
    npm install -g git+https://github.com/OxidBurn/architecture-toolkit.git
    arch-toolkit --format=json src/**/*.ts > report.json
    arch-toolkit --severity=critical src/**/*.ts
```

## Knowledge Base

The toolkit uses markdown documentation from `../docs/specs` containing:
- SOLID principles documentation
- Design patterns (Gang of Four)
- Clean code best practices
- Clean architecture principles

You can customize the knowledge base path using the `--kb` option.

## Development

### Build

```bash
npm run build
```

### Type Check

```bash
npm run typecheck
```

### Test

```bash
node dist/cli.js examples/BadOrderService.ts
```

## Contributing

Contributions are welcome! Please see the development roadmap in `docs/specs/agents/architecture-toolkit-plan.md`.

## License

MIT

## Credits

Built with [Claude Agent SDK](https://github.com/anthropics/agent-sdk)
