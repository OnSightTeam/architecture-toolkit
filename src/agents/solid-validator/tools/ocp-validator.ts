/**
 * Open/Closed Principle Validator
 * Detects code that requires modification for extension
 */

import { readFile } from 'fs/promises';
import type { OCPResult, OCPViolation, ValidateCodeInput } from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';
import { languageDetector } from '../../../shared/language-detector/index.js';

export class OCPValidator {
  private kb: KnowledgeBase;

  constructor(knowledgeBase: KnowledgeBase) {
    this.kb = knowledgeBase;
  }

  async validate(input: ValidateCodeInput): Promise<OCPResult> {
    const violations: OCPViolation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      // Check for switch statements on types
      const switchViolations = this.checkSwitchStatements(code, input);
      violations.push(...switchViolations);

      // Check for instanceof/type checking
      const typeCheckViolations = this.checkTypeChecking(code, input);
      violations.push(...typeCheckViolations);

      return {
        principle: 'Open/Closed Principle',
        compliant: violations.length === 0,
        confidence: violations.length === 0 ? 100 : 85,
        violations,
      };
    } catch (error) {
      throw new Error(`OCP validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private checkSwitchStatements(code: string, input: ValidateCodeInput): OCPViolation[] {
    const violations: OCPViolation[] = [];
    const language = languageDetector.detect(input.filePath);
    const patterns = languageDetector.getPatterns(language);

    const switchMatches = code.match(patterns.switchStatement);
    const hasTypeSwitch = switchMatches && /type|kind/i.test(code);

    if (hasTypeSwitch) {
      violations.push({
        location: `${input.filePath}`,
        violationType: 'switch_statement',
        description: 'Switch statement on type requires modification when adding new types',
        currentCode: 'switch(type) { case A:... case B:... }',
        suggestedPattern: 'Strategy',
        refactoringSteps: [
          '1. Create strategy interface',
          '2. Implement strategy for each case',
          '3. Replace switch with strategy.execute()',
        ],
        patternReference: 'docs/specs/patterns/behavioral/strategy.md',
        documentationReference: this.kb.getDocumentationReference('OCP'),
        recommendation: 'Replace switch with Strategy pattern',
        exampleCode: {
          before: 'switch(type) { case "A": return calcA(); }',
          after: 'return strategy.calculate();',
        },
      });
    }

    return violations;
  }

  private checkTypeChecking(code: string, input: ValidateCodeInput): OCPViolation[] {
    const violations: OCPViolation[] = [];
    const language = languageDetector.detect(input.filePath);
    const patterns = languageDetector.getPatterns(language);

    const instanceCheckMatches = code.match(patterns.instanceOfCheck);
    if (instanceCheckMatches && instanceCheckMatches.length > 0) {
      violations.push({
        location: `${input.filePath}`,
        violationType: 'type_checking',
        description: 'instanceof checks violate polymorphism and OCP',
        currentCode: 'if (obj instanceof SpecificType)',
        suggestedPattern: 'Strategy',
        refactoringSteps: [
          '1. Use polymorphism instead of type checking',
          '2. Move behavior into classes',
          '3. Call through common interface',
        ],
        patternReference: 'docs/specs/patterns/behavioral/strategy.md',
        documentationReference: this.kb.getDocumentationReference('OCP'),
        recommendation: 'Use polymorphism instead of type checking',
        exampleCode: {
          before: 'if (shape instanceof Circle) { ... }',
          after: 'shape.draw(); // polymorphic call',
        },
      });
    }

    return violations;
  }
}
