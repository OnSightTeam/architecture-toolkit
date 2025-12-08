# Architecture Toolkit Commands

Slash commands for the Architecture Toolkit plugin. These commands provide quick access to architecture validation, code quality analysis, and refactoring guidance.

## Quick Reference

### Core Analysis Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/validate-solid` | Validate SOLID principles | `/validate-solid src/**/*.ts` |
| `/review-arch` | Review Clean Architecture | `/review-arch src/` |
| `/check-clean-code` | Check Clean Code quality | `/check-clean-code src/` |
| `/suggest-patterns` | Suggest design patterns | `/suggest-patterns src/services/` |

### Advanced Analysis Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/analyze-tests` | Analyze test quality | `/analyze-tests **/*.test.ts` |
| `/check-packages` | Check package design | `/check-packages src/` |
| `/get-refactoring-plan` | Get refactoring guidance | `/get-refactoring-plan src/OrderService.ts` |

### Comprehensive Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/full-analysis` | Run all agents | `/full-analysis src/` |
| `/quick-check` | Fast critical issues check | `/quick-check` |
| `/compare-compliance` | Compare before/after | `/compare-compliance main` |

## Command Details

### /validate-solid
Validates code against all five SOLID principles:
- Single Responsibility Principle (SRP)
- Open/Closed Principle (OCP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)

**Example:**
```
/validate-solid src/services/OrderService.ts
```

### /review-arch
Reviews Clean Architecture principles and boundaries:
- Dependency Rule validation
- Layer separation analysis
- Boundary interface checking
- Framework coupling detection

**Example:**
```
/review-arch src/
```

### /check-clean-code
Analyzes code quality using Clean Code principles:
- Naming conventions (N1-N7)
- Function quality (F1-F4)
- Comment quality (C1-C5)
- Code smells (G1-G36, E1-E7)

**Example:**
```
/check-clean-code src/**/*.ts
```

### /suggest-patterns
Recommends Gang of Four design patterns:
- Creational patterns (Factory, Builder, Singleton)
- Structural patterns (Decorator, Adapter, Facade)
- Behavioral patterns (Strategy, Observer, Command)

**Example:**
```
/suggest-patterns src/services/
```

### /analyze-tests
Reviews test quality and best practices:
- Test smells detection (T1-T9)
- F.I.R.S.T principles validation
- Test independence analysis

**Example:**
```
/analyze-tests **/*.test.ts
```

### /check-packages
Validates package structure and design:
- Package cohesion (REP, CCP, CRP)
- Package coupling (ADP, SDP, SAP)
- Stability metrics and main sequence

**Example:**
```
/check-packages src/
```

### /get-refactoring-plan
Generates step-by-step refactoring plans:
- Refactoring opportunities detection
- Pattern transformation guides
- Code smell refactoring
- Before/after examples

**Example:**
```
/get-refactoring-plan src/services/OrderService.ts
```

### /full-analysis
Runs all 7 agents for comprehensive validation:
- Complete architecture assessment
- Prioritized action plan
- Executive summary
- Metrics dashboard

**Example:**
```
/full-analysis src/
```

### /quick-check
Fast validation focusing on critical issues:
- Critical SOLID violations
- Critical architecture violations
- Critical security issues
- Pass/fail status

**Example:**
```
/quick-check src/
```

### /compare-compliance
Compares architecture compliance across branches:
- Compliance score deltas
- New violations vs resolved
- Quality trend analysis
- Impact assessment

**Example:**
```
/compare-compliance main
```

## Usage Patterns

### Pre-commit Workflow
```bash
/quick-check
```

### Pull Request Review
```bash
/compare-compliance main
```

### Deep Dive Analysis
```bash
/full-analysis src/
```

### Targeted Refactoring
```bash
/validate-solid src/OrderService.ts
/get-refactoring-plan src/OrderService.ts
```

### Test Quality Check
```bash
/analyze-tests
```

## Integration with Architecture Toolkit

These commands leverage the underlying architecture-toolkit MCP server and CLI:
- All commands use the same agents and validators
- Results are consistent with CLI usage
- Knowledge base from `../docs/specs` is automatically used

## Tips

1. **Start with /quick-check** for rapid feedback
2. **Use /full-analysis** for comprehensive reviews
3. **Target specific files** for focused analysis
4. **Use /compare-compliance** before merging
5. **Follow up with /get-refactoring-plan** for guidance

## Restart Required

After adding or modifying commands, restart Claude Code to apply changes:
```bash
# Commands are automatically loaded on restart
```
