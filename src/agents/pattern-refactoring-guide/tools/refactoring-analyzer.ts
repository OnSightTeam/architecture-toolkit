/**
 * Refactoring Analyzer
 * Identifies common refactoring opportunities
 */

import { readFile } from 'fs/promises';
import type {
  RefactoringAnalysisResult,
  RefactoringOpportunity,
  AnalyzeRefactoringInput,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';

export class RefactoringAnalyzer {
  constructor(_kb: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async analyze(input: AnalyzeRefactoringInput): Promise<RefactoringAnalysisResult> {
    const opportunities: RefactoringOpportunity[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      opportunities.push(...this.detectExtractMethod(code, input.filePath));
      opportunities.push(...this.detectExtractClass(code, input.filePath));
      opportunities.push(...this.detectParameterObject(code, input.filePath));
      opportunities.push(...this.detectMagicNumbers(code, input.filePath));

      return {
        compliant: opportunities.filter(o => o.priority === 'critical').length === 0,
        confidence: 85,
        opportunities,
      };
    } catch (error) {
      throw new Error(`Refactoring analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private detectExtractMethod(code: string, filePath: string): RefactoringOpportunity[] {
    const opportunities: RefactoringOpportunity[] = [];

    const methodMatches = code.match(/function\s+\w+\s*\([^)]*\)\s*{([^}]*)}/gs);

    if (methodMatches) {
      for (const method of methodMatches) {
        const lines = method.split('\n').filter(l => l.trim().length > 0);

        if (lines.length > 25) {
          opportunities.push({
            type: 'extract_method',
            priority: 'high',
            location: filePath,
            description: 'Long method detected (>25 lines) - candidate for Extract Method refactoring',
            currentIssue: 'Method is too long and likely doing multiple things',
            expectedOutcome: 'Multiple smaller, focused methods with clear responsibilities',
            estimatedEffort: 'medium',
            benefits: [
              'Improved readability',
              'Better testability',
              'Reusable extracted logic',
              'Clearer intent',
            ],
            risks: ['May need to pass many parameters', 'Could over-fragment code'],
            steps: [
              {
                stepNumber: 1,
                action: 'Identify logical sections within the method',
                validation: 'Each section should have single responsibility',
              },
              {
                stepNumber: 2,
                action: 'Extract each section into a separate method with descriptive name',
                code: 'private extractedMethod(params) { /* section code */ }',
              },
              {
                stepNumber: 3,
                action: 'Replace original code with calls to extracted methods',
                validation: 'Original method should read like table of contents',
              },
              {
                stepNumber: 4,
                action: 'Run tests to ensure behavior unchanged',
                validation: 'All existing tests pass',
              },
            ],
            codeExample: {
              before: 'function processOrder() {\n  // 30 lines of mixed logic\n}',
              after: 'function processOrder() {\n  validateOrder();\n  calculateTotal();\n  applyDiscounts();\n  submitPayment();\n}',
            },
          });
        }
      }
    }

    return opportunities;
  }

  private detectExtractClass(code: string, filePath: string): RefactoringOpportunity[] {
    const opportunities: RefactoringOpportunity[] = [];

    const classMatches = code.match(/class\s+\w+\s*{([^}]*)}/gs);

    if (classMatches) {
      for (const classCode of classMatches) {
        const methods = (classCode.match(/\s+(public|private|protected)?\s*\w+\s*\([^)]*\)/g) || []).length;

        if (methods > 15) {
          opportunities.push({
            type: 'extract_class',
            priority: 'high',
            location: filePath,
            description: `Large class detected (${methods} methods) - violates Single Responsibility`,
            currentIssue: 'Class has too many responsibilities',
            expectedOutcome: 'Multiple smaller classes with focused responsibilities',
            estimatedEffort: 'high',
            benefits: [
              'Single Responsibility compliance',
              'Easier to understand and maintain',
              'Better testability',
              'Reduced coupling',
            ],
            risks: ['Requires careful dependency management', 'May introduce extra complexity'],
            steps: [
              {
                stepNumber: 1,
                action: 'Identify groups of related methods and fields',
                validation: 'Each group should have cohesive responsibility',
              },
              {
                stepNumber: 2,
                action: 'Create new class for each responsibility group',
                code: 'class ExtractedResponsibility { /* related methods */ }',
              },
              {
                stepNumber: 3,
                action: 'Move methods and fields to new classes',
              },
              {
                stepNumber: 4,
                action: 'Update original class to delegate to new classes',
                validation: 'Original class coordinates extracted classes',
              },
              {
                stepNumber: 5,
                action: 'Run full test suite',
                validation: 'All tests pass',
              },
            ],
            codeExample: {
              before: 'class UserManager {\n  // 20 methods for users, auth, email, notifications\n}',
              after: 'class UserManager {\n  constructor(\n    private auth: AuthService,\n    private email: EmailService\n  ) {}\n}',
            },
          });
        }
      }
    }

    return opportunities;
  }

  private detectParameterObject(code: string, filePath: string): RefactoringOpportunity[] {
    const opportunities: RefactoringOpportunity[] = [];

    const functionParams = code.match(/function\s+\w+\s*\(([^)]+)\)/g);

    if (functionParams) {
      for (const func of functionParams) {
        const params = func.match(/\(([^)]+)\)/)?.[1].split(',') || [];

        if (params.length > 4) {
          opportunities.push({
            type: 'introduce_parameter_object',
            priority: 'medium',
            location: filePath,
            description: `Function has ${params.length} parameters - introduce Parameter Object`,
            currentIssue: 'Too many parameters make function hard to call and maintain',
            expectedOutcome: 'Single parameter object encapsulating related data',
            estimatedEffort: 'low',
            benefits: [
              'Easier to add new parameters',
              'Clearer intent',
              'Reduced coupling',
              'Can add validation to parameter object',
            ],
            risks: ['Slight indirection', 'May hide parameter relationships'],
            steps: [
              {
                stepNumber: 1,
                action: 'Create parameter object class/interface',
                code: 'interface ProcessParams {\n  param1: string;\n  param2: number;\n  ...\n}',
              },
              {
                stepNumber: 2,
                action: 'Replace individual parameters with parameter object',
                code: 'function process(params: ProcessParams) { ... }',
              },
              {
                stepNumber: 3,
                action: 'Update all call sites',
                validation: 'All callers pass parameter object',
              },
              {
                stepNumber: 4,
                action: 'Run tests',
                validation: 'All tests pass',
              },
            ],
            codeExample: {
              before: 'function createUser(name, email, age, address, phone) { ... }',
              after: 'function createUser(userData: UserData) { ... }',
            },
          });
        }
      }
    }

    return opportunities;
  }

  private detectMagicNumbers(code: string, filePath: string): RefactoringOpportunity[] {
    const opportunities: RefactoringOpportunity[] = [];

    const magicNumbers = code.match(/\b\d{2,}\b/g);

    if (magicNumbers && magicNumbers.length > 5) {
      opportunities.push({
        type: 'replace_magic_number',
        priority: 'medium',
        location: filePath,
        description: `${magicNumbers.length} magic numbers detected - replace with named constants`,
        currentIssue: 'Magic numbers reduce code readability and maintainability',
        expectedOutcome: 'Self-documenting named constants',
        estimatedEffort: 'low',
        benefits: [
          'Self-documenting code',
          'Single point of change',
          'Type safety',
          'Better searchability',
        ],
        risks: ['May create too many constants'],
        steps: [
          {
            stepNumber: 1,
            action: 'Identify each magic number and its meaning',
          },
          {
            stepNumber: 2,
            action: 'Create descriptive constant for each number',
            code: 'const MAX_RETRY_ATTEMPTS = 3;\nconst TIMEOUT_MS = 5000;',
          },
          {
            stepNumber: 3,
            action: 'Replace magic numbers with constants',
          },
          {
            stepNumber: 4,
            action: 'Run tests',
            validation: 'All tests pass',
          },
        ],
        codeExample: {
          before: 'if (retries > 3) { ... }\nsetTimeout(callback, 5000);',
          after: 'if (retries > MAX_RETRY_ATTEMPTS) { ... }\nsetTimeout(callback, TIMEOUT_MS);',
        },
      });
    }

    return opportunities;
  }
}
