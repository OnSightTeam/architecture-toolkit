/**
 * Single Responsibility Principle Validator
 * Detects classes/functions with multiple responsibilities
 */

import { readFile } from 'fs/promises';
import type { SRPResult, SRPViolation, ValidateCodeInput } from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';
import { languageDetector } from '../../../shared/language-detector/index.js';

export class SRPValidator {
  private kb: KnowledgeBase;

  constructor(knowledgeBase: KnowledgeBase) {
    this.kb = knowledgeBase;
  }

  /**
   * Validate Single Responsibility Principle compliance
   */
  async validate(input: ValidateCodeInput): Promise<SRPResult> {
    const violations: SRPViolation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      // Apply SRP heuristics
      const classViolations = await this.checkClassResponsibilities(code, input);
      violations.push(...classViolations);

      const confidence = this.calculateConfidence(violations);
      const compliant = violations.length === 0;

      return {
        principle: 'Single Responsibility Principle',
        compliant,
        confidence,
        violations,
      };
    } catch (error) {
      throw new Error(`SRP validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Check class for multiple responsibilities
   */
  private async checkClassResponsibilities(
    code: string,
    input: ValidateCodeInput
  ): Promise<SRPViolation[]> {
    const violations: SRPViolation[] = [];

    // Heuristic 1: Class with mixed concerns (data + formatting + persistence)
    const hasMixedConcerns = this.detectMixedConcerns(code);
    if (hasMixedConcerns.length > 0) {
      violations.push({
        location: `${input.filePath}:${input.className || 'class'}`,
        description: 'Class has mixed concerns (multiple responsibilities)',
        reasonsForChange: hasMixedConcerns,
        recommendation: 'Split class into separate classes, each with single responsibility',
        documentationReference: this.kb.getDocumentationReference('SRP', 'single-responsibility-principle'),
        exampleCode: {
          before: '// Mixed: data + persistence + formatting in one class',
          after: '// Separate: UserData, UserRepository, UserFormatter',
        },
        severity: 'high',
      });
    }

    // Heuristic 2: Large method count suggests multiple responsibilities
    const methodCount = this.countMethods(code, input.filePath);
    if (methodCount > 10) {
      violations.push({
        location: `${input.filePath}:${input.className || 'class'}`,
        description: `Class has ${methodCount} methods, suggesting multiple responsibilities`,
        reasonsForChange: ['Too many methods', 'Likely multiple concerns'],
        recommendation: 'Extract related methods into separate focused classes',
        documentationReference: this.kb.getDocumentationReference('SRP'),
        severity: 'medium',
      });
    }

    // Heuristic 3: Class name with "And", "Manager", "Handler" - red flags
    if (input.className) {
      const nameViolations = this.checkClassName(input.className);
      if (nameViolations) {
        violations.push({
          location: `${input.filePath}:${input.className}`,
          description: nameViolations.description,
          reasonsForChange: nameViolations.reasons,
          recommendation: nameViolations.recommendation,
          documentationReference: this.kb.getDocumentationReference('SRP'),
          severity: 'medium',
        });
      }
    }

    return violations;
  }

  /**
   * Detect mixed concerns in code
   */
  private detectMixedConcerns(code: string): string[] {
    const concerns: string[] = [];

    // Check for database/persistence operations
    if (/save|update|delete|insert|select|query|database|repository/i.test(code)) {
      concerns.push('Persistence/Database operations');
    }

    // Check for formatting/presentation
    if (/format|print|display|render|toString|toJson|toXml/i.test(code)) {
      concerns.push('Formatting/Presentation');
    }

    // Check for validation logic
    if (/validate|check|verify|isValid|hasError/i.test(code)) {
      concerns.push('Validation logic');
    }

    // Check for business logic
    if (/calculate|compute|process|business|logic/i.test(code)) {
      concerns.push('Business logic');
    }

    // Check for networking/communication
    if (/http|request|response|api|send|receive|socket/i.test(code)) {
      concerns.push('Network/Communication');
    }

    // If more than 2 different concerns, it's a violation
    return concerns.length > 2 ? concerns : [];
  }

  /**
   * Count methods in class using language-specific patterns
   */
  private countMethods(code: string, filePath: string): number {
    const language = languageDetector.detect(filePath);
    const patterns = languageDetector.getPatterns(language);

    const matches = code.match(patterns.methodDeclaration);
    return matches ? matches.length : 0;
  }

  /**
   * Check class name for SRP violations
   */
  private checkClassName(className: string): { description: string; reasons: string[]; recommendation: string } | null {
    // Check for "And" in name
    if (/And/i.test(className)) {
      return {
        description: `Class name '${className}' contains 'And', suggesting multiple responsibilities`,
        reasons: ['Class likely does two different things'],
        recommendation: 'Split into two separate classes',
      };
    }

    // Check for overly generic names
    const genericNames = ['Manager', 'Handler', 'Processor', 'Controller', 'Service', 'Util', 'Helper'];
    for (const generic of genericNames) {
      if (className.includes(generic)) {
        return {
          description: `Generic class name '${className}' may indicate multiple responsibilities`,
          reasons: ['Generic names often hide multiple concerns'],
          recommendation: 'Use more specific, focused class names that describe single purpose',
        };
      }
    }

    return null;
  }

  /**
   * Calculate confidence score for SRP validation
   */
  private calculateConfidence(violations: SRPViolation[]): number {
    if (violations.length === 0) return 100;

    // Higher confidence when multiple heuristics agree
    const severeCounts = violations.filter(v => v.severity === 'critical' || v.severity === 'high').length;

    if (severeCounts >= 2) return 95;
    if (severeCounts === 1) return 85;
    return 70;
  }
}
