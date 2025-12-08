#!/usr/bin/env node
/**
 * MCP Server for Architecture Toolkit Plugin
 * Exposes all 7 agents as MCP tools for Claude Code
 */

import { ArchitectureToolkit } from './index.js';

interface MCPRequest {
  method: string;
  params?: {
    name?: string;
    arguments?: {
      filePaths?: string[];
    };
  };
}

interface MCPResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

// Tool definitions
const tools = [
  {
    name: 'validate_solid',
    description: 'Validates code against all five SOLID principles (SRP, OCP, LSP, ISP, DIP). Detects violations like god classes, mixed concerns, switch statements on types, contract violations, fat interfaces, and dependency inversions.',
    inputSchema: {
      type: 'object',
      properties: {
        filePaths: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of file paths to analyze',
        },
      },
      required: ['filePaths'],
    },
  },
  {
    name: 'review_architecture',
    description: 'Reviews code for Clean Architecture compliance. Validates dependency rule (dependencies point inward), layer separation, and boundary analysis. Detects framework coupling, data leaks across boundaries, and architectural violations.',
    inputSchema: {
      type: 'object',
      properties: {
        filePaths: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of file paths to analyze',
        },
      },
      required: ['filePaths'],
    },
  },
  {
    name: 'analyze_clean_code',
    description: 'Analyzes code for Clean Code principles. Checks naming conventions (N1-N7), function quality (F1-F4), comment quality (C1-C5), and code smells (G1-G36, E1-E7). Detects issues like magic numbers, long methods, code duplication, and error handling problems.',
    inputSchema: {
      type: 'object',
      properties: {
        filePaths: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of file paths to analyze',
        },
      },
      required: ['filePaths'],
    },
  },
  {
    name: 'suggest_patterns',
    description: 'Recommends appropriate Gang of Four design patterns. Analyzes code for opportunities to apply Creational (Factory Method, Builder, Singleton), Structural (Decorator, Adapter, Facade), and Behavioral (Strategy, Observer, Command, Template Method) patterns. Provides reasoning, confidence scores, and code examples.',
    inputSchema: {
      type: 'object',
      properties: {
        filePaths: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of file paths to analyze',
        },
      },
      required: ['filePaths'],
    },
  },
  {
    name: 'analyze_testing_strategy',
    description: 'Analyzes test quality and best practices. Detects T1-T9 test smells (insufficient tests, ignored tests, long tests, slow tests, fragile tests). Validates F.I.R.S.T principles (Fast, Independent, Repeatable, Self-validating, Timely). Checks test independence and shared state issues.',
    inputSchema: {
      type: 'object',
      properties: {
        filePaths: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of file paths to analyze',
        },
      },
      required: ['filePaths'],
    },
  },
  {
    name: 'analyze_package_design',
    description: 'Analyzes package structure for cohesion and coupling. Validates cohesion principles (REP - Reuse/Release Equivalence, CCP - Common Closure, CRP - Common Reuse) and coupling principles (ADP - Acyclic Dependencies, SDP - Stable Dependencies, SAP - Stable Abstractions). Calculates stability metrics and identifies packages in Zone of Pain or Zone of Uselessness.',
    inputSchema: {
      type: 'object',
      properties: {
        filePaths: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of file paths to analyze',
        },
      },
      required: ['filePaths'],
    },
  },
  {
    name: 'get_refactoring_guide',
    description: 'Provides step-by-step refactoring plans. Identifies opportunities for Extract Method, Extract Class, Introduce Parameter Object, Replace Magic Numbers. Guides pattern transformations (Strategy, Factory Method, Null Object). Provides detailed steps, code examples (before/after), benefits/risks, and effort estimates.',
    inputSchema: {
      type: 'object',
      properties: {
        filePaths: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of file paths to analyze',
        },
      },
      required: ['filePaths'],
    },
  },
  {
    name: 'comprehensive_analysis',
    description: 'Runs all 7 agents for complete code analysis. Includes SOLID validation, architecture review, clean code analysis, pattern recommendations, testing strategy, package design, and refactoring guidance. Provides overall compliance score and prioritized recommendations across all dimensions.',
    inputSchema: {
      type: 'object',
      properties: {
        filePaths: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of file paths to analyze',
        },
      },
      required: ['filePaths'],
    },
  },
];

// Tool handlers
const handlers: Record<string, (filePaths: string[]) => Promise<any>> = {
  validate_solid: async (filePaths: string[]) => {
    const toolkit = new ArchitectureToolkit();
    const report = await toolkit.analyze(filePaths, {
      agents: {
        solid: true,
        architecture: false,
        cleanCode: false,
        patterns: false,
        testing: false,
        packageDesign: false,
        refactoring: false,
      },
    });

    return {
      agent: 'SOLID Validator',
      complianceScore: report.agents.solid?.complianceScore || 0,
      violations: report.agents.solid?.violations || [],
      summary: `Found ${report.agents.solid?.violations.length || 0} SOLID violations with ${report.agents.solid?.complianceScore || 0}% compliance`,
    };
  },

  review_architecture: async (filePaths: string[]) => {
    const toolkit = new ArchitectureToolkit();
    const report = await toolkit.analyze(filePaths, {
      agents: {
        solid: false,
        architecture: true,
        cleanCode: false,
        patterns: false,
        testing: false,
        packageDesign: false,
        refactoring: false,
      },
    });

    return {
      agent: 'Architecture Reviewer',
      complianceScore: report.agents.architecture?.complianceScore || 0,
      violations: report.agents.architecture?.violations || [],
      summary: `Found ${report.agents.architecture?.violations.length || 0} architecture violations with ${report.agents.architecture?.complianceScore || 0}% compliance`,
    };
  },

  analyze_clean_code: async (filePaths: string[]) => {
    const toolkit = new ArchitectureToolkit();
    const report = await toolkit.analyze(filePaths, {
      agents: {
        solid: false,
        architecture: false,
        cleanCode: true,
        patterns: false,
        testing: false,
        packageDesign: false,
        refactoring: false,
      },
    });

    return {
      agent: 'Clean Code Analyzer',
      complianceScore: report.agents.cleanCode?.complianceScore || 0,
      violations: report.agents.cleanCode?.violations || [],
      summary: `Found ${report.agents.cleanCode?.violations.length || 0} clean code violations with ${report.agents.cleanCode?.complianceScore || 0}% compliance`,
    };
  },

  suggest_patterns: async (filePaths: string[]) => {
    const toolkit = new ArchitectureToolkit();
    const report = await toolkit.analyze(filePaths, {
      agents: {
        solid: false,
        architecture: false,
        cleanCode: false,
        patterns: true,
        testing: false,
        packageDesign: false,
        refactoring: false,
      },
    });

    return {
      agent: 'Pattern Advisor',
      complianceScore: report.agents.patterns?.complianceScore || 0,
      violations: report.agents.patterns?.violations || [],
      summary: `Found ${report.agents.patterns?.violations.length || 0} pattern opportunities with ${report.agents.patterns?.complianceScore || 0}% compliance`,
    };
  },

  analyze_testing_strategy: async (filePaths: string[]) => {
    const toolkit = new ArchitectureToolkit();
    const report = await toolkit.analyze(filePaths, {
      agents: {
        solid: false,
        architecture: false,
        cleanCode: false,
        patterns: false,
        testing: true,
        packageDesign: false,
        refactoring: false,
      },
    });

    return {
      agent: 'Testing Strategy',
      complianceScore: report.agents.testing?.complianceScore || 0,
      violations: report.agents.testing?.violations || [],
      summary: `Found ${report.agents.testing?.violations.length || 0} testing issues with ${report.agents.testing?.complianceScore || 0}% compliance`,
    };
  },

  analyze_package_design: async (filePaths: string[]) => {
    const toolkit = new ArchitectureToolkit();
    const report = await toolkit.analyze(filePaths, {
      agents: {
        solid: false,
        architecture: false,
        cleanCode: false,
        patterns: false,
        testing: false,
        packageDesign: true,
        refactoring: false,
      },
    });

    return {
      agent: 'Package Design',
      complianceScore: report.agents.packageDesign?.complianceScore || 0,
      violations: report.agents.packageDesign?.violations || [],
      summary: `Found ${report.agents.packageDesign?.violations.length || 0} package design issues with ${report.agents.packageDesign?.complianceScore || 0}% compliance`,
    };
  },

  get_refactoring_guide: async (filePaths: string[]) => {
    const toolkit = new ArchitectureToolkit();
    const report = await toolkit.analyze(filePaths, {
      agents: {
        solid: false,
        architecture: false,
        cleanCode: false,
        patterns: false,
        testing: false,
        packageDesign: false,
        refactoring: true,
      },
    });

    return {
      agent: 'Pattern Refactoring Guide',
      complianceScore: report.agents.refactoring?.complianceScore || 0,
      violations: report.agents.refactoring?.violations || [],
      summary: `Found ${report.agents.refactoring?.violations.length || 0} refactoring opportunities with ${report.agents.refactoring?.complianceScore || 0}% compliance`,
    };
  },

  comprehensive_analysis: async (filePaths: string[]) => {
    const toolkit = new ArchitectureToolkit();
    const report = await toolkit.analyze(filePaths);

    return {
      summary: report.summary,
      agents: {
        solid: report.agents.solid,
        architecture: report.agents.architecture,
        cleanCode: report.agents.cleanCode,
        patterns: report.agents.patterns,
        testing: report.agents.testing,
        packageDesign: report.agents.packageDesign,
        refactoring: report.agents.refactoring,
      },
      recommendations: report.recommendations,
    };
  },
};

// Simple MCP server implementation
async function handleRequest(request: MCPRequest): Promise<MCPResponse> {
  const { method, params } = request;

  if (method === 'tools/list') {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ tools }),
      }],
    };
  }

  if (method === 'tools/call' && params?.name) {
    const handler = handlers[params.name];
    if (handler && params.arguments?.filePaths) {
      try {
        const result = await handler(params.arguments.filePaths);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(result, null, 2),
          }],
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
            }),
          }],
        };
      }
    }
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ error: 'Unknown method or missing parameters' }),
    }],
  };
}

// Start server on stdio
process.stdin.setEncoding('utf8');

let buffer = '';

process.stdin.on('data', async (chunk) => {
  buffer += chunk;

  const lines = buffer.split('\n');
  buffer = lines.pop() || '';

  for (const line of lines) {
    if (line.trim()) {
      try {
        const request = JSON.parse(line) as MCPRequest;
        const response = await handleRequest(request);
        process.stdout.write(JSON.stringify(response) + '\n');
      } catch (error) {
        process.stdout.write(JSON.stringify({
          content: [{
            type: 'text',
            text: JSON.stringify({ error: 'Invalid JSON' }),
          }],
        }) + '\n');
      }
    }
  }
});

process.stdin.on('end', () => {
  process.exit(0);
});

console.error('Architecture Toolkit MCP Server started');
