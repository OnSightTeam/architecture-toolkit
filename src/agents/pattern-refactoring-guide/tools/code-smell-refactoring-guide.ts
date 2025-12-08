/**
 * Code Smell Refactoring Guide
 * Provides refactoring steps for common code smells
 */

import { readFile } from 'fs/promises';
import type {
  CodeSmellRefactoringResult,
  RefactoringOpportunity,
  AnalyzeRefactoringInput,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';

export class CodeSmellRefactoringGuide {
  constructor(_kb: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async analyze(input: AnalyzeRefactoringInput): Promise<CodeSmellRefactoringResult> {
    const opportunities: RefactoringOpportunity[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      opportunities.push(...this.guideConsolidateDuplicateCode(code, input.filePath));
      opportunities.push(...this.guideDecomposeConditional(code, input.filePath));

      return {
        compliant: opportunities.filter(o => o.priority === 'critical').length === 0,
        confidence: 85,
        opportunities,
      };
    } catch (error) {
      throw new Error(`Code smell refactoring analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private guideConsolidateDuplicateCode(code: string, filePath: string): RefactoringOpportunity[] {
    const opportunities: RefactoringOpportunity[] = [];

    const lines = code.split('\n').filter(l => l.trim().length > 10);
    const duplicates = new Map<string, number>();

    for (const line of lines) {
      const trimmed = line.trim();
      duplicates.set(trimmed, (duplicates.get(trimmed) || 0) + 1);
    }

    const significantDuplication = Array.from(duplicates.entries()).filter(([_, count]) => count > 3);

    if (significantDuplication.length > 3) {
      opportunities.push({
        type: 'consolidate_duplicate_code',
        priority: 'high',
        location: filePath,
        description: `${significantDuplication.length} patterns of duplicate code detected`,
        currentIssue: 'Code duplication violates DRY principle and increases maintenance burden',
        expectedOutcome: 'Single source of truth for duplicated logic',
        estimatedEffort: 'medium',
        benefits: [
          'Reduced code size',
          'Single point of change',
          'Easier maintenance',
          'Better testability',
        ],
        risks: ['May introduce unwanted coupling', 'Abstraction may be premature'],
        steps: [
          {
            stepNumber: 1,
            action: 'Identify all instances of duplicated code',
            validation: 'List all duplicate locations',
          },
          {
            stepNumber: 2,
            action: 'Determine if duplication is accidental or intentional',
            validation: 'Confirm duplication represents same concept',
          },
          {
            stepNumber: 3,
            action: 'Extract duplicated code to shared method or class',
            code: 'function extractedLogic(params) {\n  // consolidated logic\n}',
          },
          {
            stepNumber: 4,
            action: 'Replace all duplicates with calls to extracted method',
          },
          {
            stepNumber: 5,
            action: 'Ensure parameters cover all variations',
            validation: 'All original behaviors preserved',
          },
          {
            stepNumber: 6,
            action: 'Run full test suite',
            validation: 'All tests pass',
          },
        ],
        codeExample: {
          before: 'function a() { /* same logic */ }\nfunction b() { /* same logic */ }',
          after: 'function a() { return sharedLogic(); }\nfunction b() { return sharedLogic(); }',
        },
      });
    }

    return opportunities;
  }

  private guideDecomposeConditional(code: string, filePath: string): RefactoringOpportunity[] {
    const opportunities: RefactoringOpportunity[] = [];

    const complexConditionals = code.match(/if\s*\([^)]{50,}\)/g);

    if (complexConditionals && complexConditionals.length > 2) {
      opportunities.push({
        type: 'decompose_conditional',
        priority: 'medium',
        location: filePath,
        description: `${complexConditionals.length} complex conditional expressions detected`,
        currentIssue: 'Complex conditionals are hard to read and understand',
        expectedOutcome: 'Self-documenting conditional logic with clear intent',
        estimatedEffort: 'low',
        benefits: [
          'Improved readability',
          'Self-documenting code',
          'Easier to test',
          'Clearer intent',
        ],
        risks: ['May create many small methods', 'Slight performance overhead'],
        steps: [
          {
            stepNumber: 1,
            action: 'Identify each complex conditional',
          },
          {
            stepNumber: 2,
            action: 'Extract condition to well-named method',
            code: 'private isEligibleForDiscount(customer: Customer): boolean {\n  return customer.totalPurchases > 1000 && customer.memberYears > 2;\n}',
          },
          {
            stepNumber: 3,
            action: 'Replace complex condition with method call',
            code: 'if (isEligibleForDiscount(customer)) { ... }',
          },
          {
            stepNumber: 4,
            action: 'Extract then/else blocks if they are long',
            validation: 'Main flow reads like prose',
          },
          {
            stepNumber: 5,
            action: 'Run tests',
            validation: 'All tests pass',
          },
        ],
        codeExample: {
          before: 'if (customer.totalPurchases > 1000 && customer.memberYears > 2 && !customer.hasDebt) { ... }',
          after: 'if (isEligibleForDiscount(customer)) { ... }',
        },
      });
    }

    return opportunities;
  }
}
