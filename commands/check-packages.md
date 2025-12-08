# Check Package Design

Validate package structure using cohesion and coupling principles.

## Usage
```
/check-packages [package-directory]
```

If no directory is provided, analyze the entire src/ directory structure.

## What this does

Validates package design principles:

**Package Cohesion Principles (REP, CCP, CRP)**
- **REP** (Reuse/Release Equivalence): Classes released together should be reusable together
- **CCP** (Common Closure): Classes that change together belong together
- **CRP** (Common Reuse): Classes reused together belong together

**Package Coupling Principles (ADP, SDP, SAP)**
- **ADP** (Acyclic Dependencies): Detects circular dependencies between packages
- **SDP** (Stable Dependencies): Dependencies should point toward stability
- **SAP** (Stable Abstractions): Stable packages should be abstract

**Stability Metrics**
- **Instability (I)**: Measure of package stability (0 = stable, 1 = unstable)
- **Abstractness (A)**: Ratio of abstract to concrete classes (0 = concrete, 1 = abstract)
- **Distance from Main Sequence (D)**: Measures balance between stability and abstractness

**Problem Detection**
- **Zone of Pain**: Rigid packages (stable + concrete, hard to change)
- **Zone of Uselessness**: Abstract packages with no implementations
- **Circular Dependencies**: Packages that depend on each other

## Steps

1. Analyze package directory structure
2. Calculate stability metrics for each package
3. Detect circular dependencies (ADP violations)
4. Check stability direction (SDP violations)
5. Validate abstractness alignment (SAP violations)
6. Identify packages in Zone of Pain/Uselessness
7. Provide restructuring recommendations

## Expected Output

- Package structure visualization
- Stability metrics per package (I, A, D scores)
- Circular dependency detection
- Zone of Pain/Uselessness identification
- Cohesion and coupling violations
- Recommended package reorganization
- Dependency direction fixes
