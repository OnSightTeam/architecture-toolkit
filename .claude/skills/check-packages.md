# Analyze Package Design

Run package design analysis.

## Usage

Validate package structure using cohesion and coupling principles.

## What this skill does

- Checks package cohesion (REP, CCP, CRP)
- Validates package coupling (ADP, SDP, SAP)
- Calculates stability metrics
- Identifies problem zones

## Steps

1. Identify the package directories to analyze

2. Execute Package Design analysis using Bash tool:
   - Change to the plugin directory
   - Run: `node dist/cli.js --agents=packageDesign <directory>`
   - Return the full output to the user

3. Review cohesion and coupling metrics

4. Summarize findings and restructuring recommendations
