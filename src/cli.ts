#!/usr/bin/env node

/**
 * Architecture Toolkit CLI
 * Command-line interface for architecture analysis
 */

import { ArchitectureToolkit } from './orchestrator/index.js';
import type { AnalysisOptions } from './shared/types/index.js';

function printHelp(): void {
  console.log(`
Architecture Toolkit - Comprehensive Architecture Analysis

Usage:
  arch-toolkit [OPTIONS] <files...>

Options:
  --help              Show this help message
  --kb=<path>         Path to knowledge base documentation
  --agents=<list>     Comma-separated list of agents to run (default: all)
                      Available: solid,architecture,cleanCode,patterns
  --format=<format>   Output format: console|json|markdown (default: console)
  --severity=<list>   Filter by severity: critical,high,medium,low

Examples:
  arch-toolkit src/**/*.ts
  arch-toolkit --agents=solid src/services/*.ts
  arch-toolkit --kb=../docs/specs src/**/*.ts
  arch-toolkit --severity=critical,high src/**/*.ts

Documentation:
  https://github.com/yourusername/architecture-toolkit
`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    printHelp();
    process.exit(0);
  }

  const options: AnalysisOptions = {
    agents: {},
  };

  const filePaths: string[] = [];

  for (const arg of args) {
    if (arg.startsWith('--kb=')) {
      options.knowledgeBasePath = arg.substring(5);
    } else if (arg.startsWith('--agents=')) {
      const agentList = arg.substring(9).split(',');
      options.agents = {
        solid: agentList.includes('solid'),
        architecture: agentList.includes('architecture'),
        cleanCode: agentList.includes('cleanCode'),
        patterns: agentList.includes('patterns'),
      };
    } else if (arg.startsWith('--format=')) {
      options.outputFormat = arg.substring(9) as 'console' | 'json' | 'markdown';
    } else if (arg.startsWith('--severity=')) {
      options.severity = arg.substring(11).split(',') as Array<'critical' | 'high' | 'medium' | 'low'>;
    } else if (!arg.startsWith('--')) {
      filePaths.push(arg);
    }
  }

  if (filePaths.length === 0) {
    console.error('Error: No files specified for analysis');
    process.exit(1);
  }

  try {
    const toolkit = new ArchitectureToolkit(options.knowledgeBasePath);
    const report = await toolkit.analyze(filePaths, options);

    if (options.outputFormat === 'json') {
      console.log(JSON.stringify(report, null, 2));
    } else if (options.outputFormat === 'markdown') {
      console.log('# Architecture Analysis Report\n');
      console.log(`**Files Analyzed:** ${report.summary.totalFiles}\n`);
      console.log(`**Overall Compliance:** ${report.summary.overallCompliance}%\n`);
      console.log(`**Total Violations:** ${report.summary.totalViolations}\n`);
    } else {
      toolkit.printReport(report);
    }

    const exitCode = report.summary.criticalIssues > 0 ? 1 : 0;
    process.exit(exitCode);
  } catch (error) {
    console.error('Error during analysis:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
