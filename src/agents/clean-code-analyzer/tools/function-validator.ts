/**
 * Function Quality Validator
 * Validates functions against Clean Code principles (F1-F4)
 */

import { readFile } from 'fs/promises';
import type {
  FunctionQualityResult,
  CleanCodeViolation,
  ValidateCleanCodeInput,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';
import { languageDetector } from '../../../shared/language-detector/index.js';

export class FunctionValidator {
  constructor(_kb: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async validate(input: ValidateCleanCodeInput): Promise<FunctionQualityResult> {
    const violations: CleanCodeViolation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      violations.push(...this.checkFunctionSize(code, input.filePath));
      violations.push(...this.checkParameterCount(code, input.filePath));
      violations.push(...this.checkSideEffects(code, input.filePath));
      violations.push(...this.checkCommandQuerySeparation(code, input.filePath));

      return {
        compliant: violations.length === 0,
        confidence: violations.length === 0 ? 100 : 85,
        violations,
      };
    } catch (error) {
      throw new Error(`Function validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private checkFunctionSize(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];
    const language = languageDetector.detect(filePath);
    const patterns = languageDetector.getPatterns(language);

    const functions = code.match(patterns.functionDeclaration) || [];

    if (functions.length > 0) {
      const codeLines = code.split('\n');
      const avgLinesPerFunction = codeLines.length / functions.length;

      if (avgLinesPerFunction > 20) {
        violations.push({
          smellId: 'F1',
          category: 'function',
          location: filePath,
          description: `F1 - Functions averaging ${Math.round(avgLinesPerFunction)} lines. Functions should be small.`,
          recommendation: 'Extract smaller functions. Each function should do one thing well.',
          documentationReference: 'docs/specs/practices/functions-and-methods.md',
          severity: 'medium',
          exampleCode: {
            before: 'function processOrder() {\n  // 50 lines of code\n  // validation\n  // calculation\n  // persistence\n}',
            after: 'function processOrder() {\n  validateOrder();\n  calculateTotal();\n  saveOrder();\n}',
          },
        });
      }
    }

    return violations;
  }

  private checkParameterCount(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];
    const language = languageDetector.detect(filePath);
    const patterns = languageDetector.getPatterns(language);

    const functions = code.match(patterns.functionDeclaration) || [];
    for (const fn of functions) {
      const params = fn.match(/\(([^)]+)\)/)?.[1];
      if (params) {
        const paramCount = params.split(',').length;
        if (paramCount > 3) {
          violations.push({
            smellId: 'F2',
            category: 'function',
            location: filePath,
            description: `F2 - Function has ${paramCount} parameters (too many)`,
            recommendation: 'Limit to 3 parameters max. Use parameter objects for more complexity.',
            documentationReference: 'docs/specs/practices/functions-and-methods.md',
            severity: 'high',
            codeSnippet: fn,
            exampleCode: {
              before: 'function createUser(name, email, age, address, phone) { ... }',
              after: 'function createUser(userData: UserData) { ... }',
            },
          });
        }
      }
    }

    return violations;
  }

  private checkSideEffects(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];

    const sideEffectPatterns = [
      /function\s+is\w+.*{[^}]*(=|\+=|-=|\*=)/,
      /function\s+get\w+.*{[^}]*(=|\+=|-=|\*=)/,
      /function\s+check\w+.*{[^}]*(\.save|\.update|\.delete|\.insert)/,
    ];

    for (const pattern of sideEffectPatterns) {
      if (pattern.test(code)) {
        violations.push({
          smellId: 'F3',
          category: 'function',
          location: filePath,
          description: 'F3 - Function has hidden side effects (name suggests query, but performs command)',
          recommendation: 'Functions should do what their name suggests. Separate commands from queries.',
          documentationReference: 'docs/specs/practices/functions-and-methods.md',
          severity: 'high',
          exampleCode: {
            before: 'function checkPassword(password) {\n  this.attempts++; // Side effect!\n  return password === stored;\n}',
            after: 'function isPasswordValid(password) {\n  return password === stored;\n}\nfunction incrementAttempts() {\n  this.attempts++;\n}',
          },
        });
        break;
      }
    }

    return violations;
  }

  private checkCommandQuerySeparation(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];

    const violatingPattern = /function\s+set\w+.*{[^}]*return\s+[^;]+;/;
    if (violatingPattern.test(code)) {
      violations.push({
        smellId: 'F4',
        category: 'function',
        location: filePath,
        description: 'F4 - Command-Query Separation violated (setter returns value)',
        recommendation: 'Functions should either change state OR return value, not both.',
        documentationReference: 'docs/specs/practices/functions-and-methods.md',
        severity: 'medium',
        exampleCode: {
          before: 'function setAttribute(name, value) {\n  this.attributes[name] = value;\n  return value; // Violates CQS\n}',
          after: 'function setAttribute(name, value) {\n  this.attributes[name] = value;\n}\nfunction getAttribute(name) {\n  return this.attributes[name];\n}',
        },
      });
    }

    return violations;
  }
}
