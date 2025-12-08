/**
 * Liskov Substitution Principle Validator
 * Detects derived classes that break base class contracts
 */

import { readFile } from 'fs/promises';
import type { LSPResult, LSPViolation, ValidateInheritanceInput } from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';
import { languageDetector } from '../../../shared/language-detector/index.js';

export class LSPValidator {
  private kb: KnowledgeBase;

  constructor(knowledgeBase: KnowledgeBase) {
    this.kb = knowledgeBase;
  }

  async validate(input: ValidateInheritanceInput): Promise<LSPResult> {
    const violations: LSPViolation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      // Check for type checking (indicates LSP violation)
      if (this.hasTypeChecking(code, input.derivedClass, input.filePath)) {
        violations.push({
          location: `${input.filePath}`,
          violationType: 'type_checking',
          description: 'Code checks for specific derived type instead of using polymorphism',
          baseContract: input.baseClass,
          derivedContract: input.derivedClass,
          substitutabilityIssue: 'Derived class not truly substitutable',
          documentationReference: this.kb.getDocumentationReference('LSP'),
          recommendation: 'Ensure derived classes can be used wherever base class is expected',
          exampleCode: {
            before: 'if (shape instanceof Square) { special handling }',
            after: 'shape.draw(); // works for all shapes',
          },
        });
      }

      // Check for exception changes
      if (/throw\s+new\s+\w+Error/i.test(code)) {
        violations.push({
          location: `${input.filePath}`,
          violationType: 'exception_mismatch',
          description: 'Derived class may throw new exceptions not in base contract',
          baseContract: input.baseClass,
          derivedContract: input.derivedClass,
          substitutabilityIssue: 'Exception contract violated',
          documentationReference: this.kb.getDocumentationReference('LSP'),
          recommendation: 'Only throw exceptions defined in base class contract',
          exampleCode: {
            before: 'override method() { throw new SpecificError(); }',
            after: 'override method() { // handle without new exceptions }',
          },
        });
      }

      return {
        principle: 'Liskov Substitution Principle',
        compliant: violations.length === 0,
        confidence: 80,
        violations,
      };
    } catch (error) {
      throw new Error(`LSP validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private hasTypeChecking(code: string, derivedClass: string, filePath: string): boolean {
    const language = languageDetector.detect(filePath);
    const patterns = languageDetector.getPatterns(language);

    const instanceChecks = code.match(patterns.instanceOfCheck);
    return instanceChecks ? instanceChecks.some(check => check.includes(derivedClass)) : false;
  }
}
