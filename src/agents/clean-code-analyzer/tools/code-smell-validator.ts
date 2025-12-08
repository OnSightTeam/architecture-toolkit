/**
 * Code Smell Validator
 * Detects common code smells (G1-G36, E1-E7)
 */

import { readFile } from 'fs/promises';
import type {
  CodeSmellResult,
  CleanCodeViolation,
  ValidateCleanCodeInput,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';

export class CodeSmellValidator {
  constructor(_kb: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async validate(input: ValidateCleanCodeInput): Promise<CodeSmellResult> {
    const violations: CleanCodeViolation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      violations.push(...this.checkDuplication(code, input.filePath));
      violations.push(...this.checkObscuredIntent(code, input.filePath));
      violations.push(...this.checkDeadCode(code, input.filePath));
      violations.push(...this.checkFeatureEnvy(code, input.filePath));
      violations.push(...this.checkErrorHandling(code, input.filePath));

      return {
        compliant: violations.length === 0,
        confidence: violations.length === 0 ? 100 : 75,
        violations,
      };
    } catch (error) {
      throw new Error(`Code smell validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private checkDuplication(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];

    const lines = code.split('\n').filter(l => l.trim().length > 10);
    const duplicates = new Map<string, number>();

    for (const line of lines) {
      const trimmed = line.trim();
      duplicates.set(trimmed, (duplicates.get(trimmed) || 0) + 1);
    }

    const highDuplication = Array.from(duplicates.entries()).filter(([_, count]) => count > 3);

    if (highDuplication.length > 0) {
      violations.push({
        smellId: 'G5',
        category: 'general',
        location: filePath,
        description: `G5 - Code duplication detected (${highDuplication.length} duplicate patterns)`,
        recommendation: 'Extract duplicate code into reusable functions. Follow DRY principle.',
        documentationReference: 'docs/specs/practices/code-smells.md',
        severity: 'high',
        exampleCode: {
          before: 'validateEmail(user1.email);\nvalidateEmail(user2.email);\nvalidateEmail(user3.email);',
          after: 'users.forEach(u => validateEmail(u.email));',
        },
      });
    }

    return violations;
  }

  private checkObscuredIntent(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];

    if (/[a-z]\s*\?\s*[a-z]\s*:\s*[a-z]\s*\?\s*[a-z]\s*:/.test(code)) {
      violations.push({
        smellId: 'G16',
        category: 'general',
        location: filePath,
        description: 'G16 - Nested ternaries obscure intent',
        recommendation: 'Replace nested ternaries with if-else or extract to named function.',
        documentationReference: 'docs/specs/practices/code-smells.md',
        severity: 'medium',
        exampleCode: {
          before: 'const x = a ? b : c ? d : e ? f : g;',
          after: 'const x = determineValue(a, b, c, d, e, f, g);',
        },
      });
    }

    const complexBoolean = /if\s*\([^)]*&&[^)]*&&[^)]*\|\|/;
    if (complexBoolean.test(code)) {
      violations.push({
        smellId: 'G28',
        category: 'general',
        location: filePath,
        description: 'G28 - Complex boolean expressions obscure intent',
        recommendation: 'Extract boolean logic to well-named functions.',
        documentationReference: 'docs/specs/practices/code-smells.md',
        severity: 'medium',
        exampleCode: {
          before: 'if (user.age > 18 && user.hasLicense && !user.isSuspended || user.isAdmin)',
          after: 'if (canDrive(user) || user.isAdmin)',
        },
      });
    }

    return violations;
  }

  private checkDeadCode(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];

    if (/if\s*\(\s*false\s*\)|if\s*\(\s*true\s*\)/.test(code)) {
      violations.push({
        smellId: 'G9',
        category: 'general',
        location: filePath,
        description: 'G9 - Dead code (unreachable due to constant conditionals)',
        recommendation: 'Remove dead code. Keep codebase clean and maintainable.',
        documentationReference: 'docs/specs/practices/code-smells.md',
        severity: 'medium',
        exampleCode: {
          before: 'if (false) {\n  // This never runs\n}',
          after: '// Remove entirely',
        },
      });
    }

    return violations;
  }

  private checkFeatureEnvy(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];

    const chainedCalls = code.match(/\w+\.\w+\.\w+\.\w+\.\w+/g);
    if (chainedCalls && chainedCalls.length > 2) {
      violations.push({
        smellId: 'G14',
        category: 'general',
        location: filePath,
        description: 'G14 - Feature Envy (excessive chaining suggests misplaced behavior)',
        recommendation: 'Move behavior closer to the data. Follow Law of Demeter.',
        documentationReference: 'docs/specs/practices/code-smells.md',
        severity: 'medium',
        exampleCode: {
          before: 'order.getCustomer().getAddress().getZipCode()',
          after: 'order.getCustomerZipCode() // Encapsulate chain',
        },
      });
    }

    return violations;
  }

  private checkErrorHandling(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];

    if (/catch\s*\([^)]+\)\s*{\s*}/i.test(code)) {
      violations.push({
        smellId: 'E1',
        category: 'error-handling',
        location: filePath,
        description: 'E1 - Empty catch block (swallowing exceptions)',
        recommendation: 'Handle errors appropriately. Never silently swallow exceptions.',
        documentationReference: 'docs/specs/practices/error-handling.md',
        severity: 'critical',
        exampleCode: {
          before: 'try { ... } catch(e) { }',
          after: 'try { ... } catch(e) { logger.error(e); throw e; }',
        },
      });
    }

    if (/catch\s*\([^)]+\)\s*{\s*console\.log/.test(code)) {
      violations.push({
        smellId: 'E2',
        category: 'error-handling',
        location: filePath,
        description: 'E2 - Errors only logged to console (improper error handling)',
        recommendation: 'Use proper logging framework and handle errors appropriately.',
        documentationReference: 'docs/specs/practices/error-handling.md',
        severity: 'high',
      });
    }

    return violations;
  }
}
