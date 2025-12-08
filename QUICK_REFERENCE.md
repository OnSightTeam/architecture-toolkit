# Architecture Toolkit - Quick Reference

## Installation (One-Time Setup)

```bash
# Method 1: Install from marketplace (recommended)
claude plugin marketplace add onsight-team https://github.com/OnSightTeam/claude-plugins.git
claude plugin install architecture-toolkit@onsight-team

# Method 2: Automated script
curl -fsSL https://raw.githubusercontent.com/OnSightTeam/architecture-toolkit/main/install-plugin.sh | bash
```

## Using the Tools

### Option 1: Ask Claude Code Naturally

```
"Check this file for SOLID violations"
"Review my architecture"
"Suggest design patterns for this code"
"Analyze my test quality"
"Check my Python code for violations"
"Review this TypeScript module"
```

### Option 2: Use Tools Explicitly

```
# TypeScript/JavaScript examples
Please use validate_solid to check src/OrderService.ts
Please use review_architecture to validate src/use-cases/
Please use analyze_clean_code on src/**/*.ts

# Python examples
Please use validate_solid to check src/order_service.py
Please use comprehensive_analysis on src/**/*.py

# Mixed codebase
Please use analyze_testing_strategy on src/**/*.{ts,py}
Please use analyze_package_design for src/
Please use get_refactoring_guide on src/legacy/
```

### Option 3: Use Slash Commands (Skills)

```
# TypeScript examples
/validate-solid src/OrderService.ts
/review-architecture src/use-cases/
/analyze-clean-code src/**/*.ts

# Python examples
/validate-solid src/order_service.py
/comprehensive-analysis src/**/*.py

# Mixed codebase
/suggest-patterns src/**/*.{ts,py}
```

## Language Support

✅ **TypeScript** (`.ts`, `.tsx`) - Full support
✅ **JavaScript** (`.js`, `.jsx`, `.mjs`, `.cjs`) - Full support
✅ **Python** (`.py`, `.pyw`) - Full support

The toolkit automatically detects your language from file extensions and uses language-appropriate patterns. Works seamlessly with mixed TypeScript/JavaScript/Python codebases.

## Available Tools

| Tool | What It Does | When to Use |
|------|-------------|-------------|
| `validate_solid` | Checks SOLID principles (SRP, OCP, LSP, ISP, DIP) | New features, refactoring |
| `review_architecture` | Validates Clean Architecture layers | Architecture changes |
| `analyze_clean_code` | Checks naming, functions, code smells | Code reviews, cleanup |
| `suggest_patterns` | Recommends design patterns | Design decisions |
| `analyze_testing_strategy` | Reviews test quality & F.I.R.S.T | Writing tests |
| `analyze_package_design` | Checks package cohesion/coupling | Package restructuring |
| `get_refactoring_guide` | Step-by-step refactoring plans | Legacy code improvement |
| `comprehensive_analysis` | Runs all 7 agents | Pre-commit, PR reviews |

## Common Workflows

### Pre-Commit Check
```
Please use comprehensive_analysis on the files I just modified
```

### Code Review
```
Please use validate_solid and analyze_clean_code on src/NewFeature.ts
```

### Architecture Review
```
Please use review_architecture and analyze_package_design on src/
```

### Legacy Code Cleanup
```
Please use get_refactoring_guide on src/legacy/OldService.ts
```

### Test Quality Check
```
Please use analyze_testing_strategy on src/**/*.test.ts
```

## Understanding the Output

Each tool returns:
- **Compliance Score**: 0-100% (higher is better)
- **Violations**: List of issues found
- **Severity**: Critical, High, Medium, Low
- **Recommendations**: How to fix each issue

### Example Output:
```json
{
  "agent": "SOLID Validator",
  "complianceScore": 65,
  "violations": [
    {
      "severity": "high",
      "category": "SRP",
      "description": "Class has multiple responsibilities",
      "location": "src/OrderService.ts:15",
      "recommendation": "Extract email functionality to EmailService"
    }
  ],
  "summary": "Found 5 violations with 65% compliance"
}
```

## Severity Levels

- **Critical** 🔴 - Fix immediately (security, architecture violations)
- **High** 🟠 - Fix before merge (SOLID violations, code smells)
- **Medium** 🟡 - Fix when refactoring (naming, patterns)
- **Low** 🟢 - Nice to have (minor improvements)

## Integration Examples

### In Pull Request Reviews
```
Please analyze the changes in this PR using comprehensive_analysis
```

### Before Committing
```
/comprehensive-analysis src/NewFeature.ts
```

### During Refactoring
```
Please use get_refactoring_guide on src/legacy/PaymentProcessor.ts
Then use validate_solid to verify the refactored code
```

### Test-Driven Development
```
Please use analyze_testing_strategy on src/OrderService.test.ts
Then suggest improvements for test quality
```

## Tips & Best Practices

1. **Start with comprehensive_analysis** for new code
2. **Use specific agents** when focusing on one area
3. **Fix critical issues first** before addressing others
4. **Run before committing** to catch issues early
5. **Use in CI/CD** to enforce quality standards

## Troubleshooting

### Plugin not working?
```bash
claude plugin list              # Check if installed
claude plugin update architecture-toolkit  # Update to latest
```

### Tool not found?
```bash
echo '{"method":"tools/list"}' | node ~/.claude/plugins/architecture-toolkit/dist/mcp-server.js
```

### Need help?
See [INSTALL.md](INSTALL.md) for detailed troubleshooting.

## Update Plugin

```bash
# If installed from marketplace
claude plugin update architecture-toolkit

# If installed via script, re-run it
curl -fsSL https://raw.githubusercontent.com/OnSightTeam/architecture-toolkit/main/install-plugin.sh | bash
```

## Uninstall

```bash
claude plugin uninstall architecture-toolkit
```

## Support

- 📚 Full Documentation: [README.md](README.md)
- 🔧 Installation Help: [INSTALL.md](INSTALL.md)
- 🐛 Report Issues: https://github.com/OnSightTeam/architecture-toolkit/issues
