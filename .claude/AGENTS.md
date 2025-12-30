# Architecture Toolkit - Agent & Skill Reference

This document explains how the architecture-toolkit plugin works and how its commands, skills, and CLI agents are connected.

## Architecture Overview

```
User runs: /architecture-toolkit:quick-check
    ↓
Claude Code loads: .claude/commands/quick-check.md
    ↓
Command instructs: Use Skill tool with "architecture-toolkit:validate-solid"
    ↓
Claude invokes skill: .claude/skills/validate-solid.md
    ↓
Skill executes CLI: node dist/cli.js --agents=solid <files>
    ↓
CLI runs analysis and returns results
```

## Components

### 1. Commands (Slash Commands)

Location: `.claude/commands/*.md`

These are user-facing slash commands that can be invoked in Claude Code:

| Command | Purpose |
|---------|---------|
| `/architecture-toolkit:quick-check` | Fast validation (Critical/High issues only) |
| `/architecture-toolkit:full-analysis` | Comprehensive analysis with all 7 agents |
| `/architecture-toolkit:validate-solid` | SOLID principles validation |
| `/architecture-toolkit:review-arch` | Clean Architecture boundaries |
| `/architecture-toolkit:check-clean-code` | Code quality & smells |
| `/architecture-toolkit:suggest-patterns` | Design pattern recommendations |
| `/architecture-toolkit:analyze-tests` | Test quality & F.I.R.S.T principles |
| `/architecture-toolkit:check-packages` | Package cohesion/coupling |
| `/architecture-toolkit:get-refactoring-plan` | Step-by-step refactoring guide |
| `/architecture-toolkit:compare-compliance` | Compare quality before/after |

### 2. Skills (Executable Actions)

Location: `.claude/skills/*.md`

Skills are the actual implementations that commands invoke:

| Skill Name | CLI Agent Flag | Purpose |
|------------|----------------|---------|
| `validate-solid` | `--agents=solid` | SOLID validation |
| `review-architecture` | `--agents=architecture` | Clean Architecture |
| `analyze-clean-code` | `--agents=cleanCode` | Code quality |
| `suggest-patterns` | `--agents=patterns` | Pattern advisor |
| `analyze-testing-strategy` | `--agents=testing` | Test quality |
| `analyze-package-design` | `--agents=packageDesign` | Package metrics |
| `get-refactoring-guide` | `--agents=refactoring` | Refactoring plans |
| `comprehensive-analysis` | All agents | Full analysis |

### 3. CLI Agents (Built-in)

Location: `dist/cli.js` (your custom CLI tool)

These are the actual analysis engines:

| Agent Flag | What It Analyzes |
|------------|------------------|
| `solid` | SRP, OCP, LSP, ISP, DIP violations |
| `architecture` | Dependency Rule, layer boundaries |
| `cleanCode` | N1-N7 (naming), F1-F4 (functions), C1-C5 (comments), G1-G36 & E1-E7 (smells) |
| `patterns` | GoF pattern opportunities (Creational, Structural, Behavioral) |
| `testing` | T1-T9 test smells, F.I.R.S.T principles |
| `packageDesign` | REP/CCP/CRP cohesion, ADP/SDP/SAP coupling |
| `refactoring` | Extract Method/Class, pattern transformations |

## How Commands Invoke Skills

Commands use the Skill tool to invoke your skills:

```markdown
## Steps

1. Identify files to analyze

2. Run SOLID validation:
   - Use Skill tool with skill: "architecture-toolkit:validate-solid"
   - Pass file pattern as args
```

When Claude sees this, it:
1. Looks up the skill at `.claude/skills/validate-solid.md`
2. Executes the steps defined in that skill
3. The skill runs: `node dist/cli.js --agents=solid <files>`

## Severity Filtering

Your CLI supports severity filtering (based on command context):

- **Critical**: Empty catch blocks, framework in entities, DIP violations
- **High**: SRP violations, boundary leaks, god classes
- **Medium**: Naming issues, code duplication
- **Low**: Minor style issues

Commands can request specific severity levels:
- `quick-check`: Critical/High only (fast pre-commit check)
- `full-analysis`: All severities (comprehensive review)

## Customization Guide

### Adding a New Analysis Type

1. **Add CLI agent** (in your CLI tool source):
   ```typescript
   // Add to dist/cli.js
   case 'security':
     return runSecurityAnalysis(files);
   ```

2. **Create skill** (`.claude/skills/analyze-security.md`):
   ```markdown
   # Analyze Security

   ## Steps
   1. Run the security analyzer:
      ```bash
      node dist/cli.js --agents=security <file-paths>
      ```
   ```

3. **Create command** (`.claude/commands/check-security.md`):
   ```markdown
   # Check Security

   ## Steps
   1. Run security analysis:
      - Use Skill tool with skill: "architecture-toolkit:check-security"
   ```

4. **Rebuild CLI**:
   ```bash
   npm run build
   ```

### Updating Existing Analysis

To change how an agent works:

1. Modify the CLI source code
2. Rebuild: `npm run build`
3. No need to change commands or skills (they reference CLI agents)

## Troubleshooting

### Command Not Working

1. Check command references correct skill:
   ```markdown
   Use Skill tool with skill: "architecture-toolkit:validate-solid"
   ```

2. Verify skill exists:
   ```bash
   ls .claude/skills/validate-solid.md
   ```

3. Confirm skill calls correct CLI agent:
   ```bash
   grep "agents=" .claude/skills/validate-solid.md
   # Should show: --agents=solid
   ```

4. Test CLI directly:
   ```bash
   cd /path/to/architecture-toolkit
   node dist/cli.js --agents=solid src/**/*.ts
   ```

### Skill Not Found

If teammates get "skill not found" errors:

1. Ensure plugin is installed:
   ```bash
   ls ~/.claude/plugins/repos/architecture-toolkit/
   ```

2. Reinstall plugin:
   ```bash
   # If marketplace install:
   # Plugin should auto-update

   # If manual install:
   cd ~/.claude/plugins/repos/architecture-toolkit
   git pull origin main
   npm install
   npm run build
   ```

## Best Practices

1. **Keep skill names aligned with CLI agents**:
   - Skill: `validate-solid` → CLI: `--agents=solid` ✅
   - Skill: `solid-validator` → CLI: `--agents=solid` ❌ (confusing)

2. **Commands should invoke skills, not CLI directly**:
   - Use Skill tool ✅
   - Direct bash execution ❌ (breaks portability)

3. **Document severity levels in commands**:
   - Makes expectations clear
   - Helps users choose right command

4. **Update all three layers together**:
   - If changing analysis logic → Update CLI source
   - If changing invocation → Update skill
   - If changing UX → Update command

## Reference

- **Plugin docs**: `.claude/README.md`
- **Skill examples**: `.claude/skills/*.md`
- **Command examples**: `.claude/commands/*.md`
- **CLI source**: `src/` (TypeScript source)
- **CLI build**: `dist/cli.js` (compiled)
