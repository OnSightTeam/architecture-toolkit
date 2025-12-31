# Analyze Package Design

Validate package cohesion, coupling, and stability metrics.

## Usage

Analyze package structure for cohesion/coupling principles and stability.

## What this skill does

- **Package Cohesion Analysis** (REP, CCP, CRP)
  - **REP** (Reuse/Release Equivalence): Classes released together should be reusable together
  - **CCP** (Common Closure Principle): Classes that change together should be packaged together
  - **CRP** (Common Reuse Principle): Classes that are reused together should be packaged together

- **Package Coupling Analysis** (ADP, SDP, SAP)
  - **ADP** (Acyclic Dependencies Principle): No circular dependencies between packages
  - **SDP** (Stable Dependencies Principle): Depend in direction of stability
  - **SAP** (Stable Abstractions Principle): Stable packages should be abstract

- **Stability Metrics**
  - Calculates stability, abstractness, and distance from main sequence
  - Identifies packages in "Zone of Pain" (rigid, hard to change)
  - Identifies packages in "Zone of Uselessness" (too abstract, no use)

## Steps

1. Identify the package directories to analyze

2. Execute Package Design analysis using Bash tool:
   - Change to the plugin directory
   - Run: `node dist/cli.js --agents=packageDesign <file-paths>`
   - Return the full output to the user

3. Review package cohesion violations (REP, CCP, CRP)

4. Check package coupling issues (ADP, SDP, SAP)

5. Analyze stability metrics for each package

6. Summarize findings and provide package restructuring recommendations

## Example

```bash
node dist/cli.js --agents=packageDesign src/**/*.ts
```

## Output

Reports:
- Cohesion violations (too many responsibilities, poor boundaries)
- Coupling violations (circular dependencies, wrong stability direction)
- Stability metrics (packages in Zone of Pain or Zone of Uselessness)
