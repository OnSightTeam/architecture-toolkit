/**
 * Interface Segregation Principle Validator
 * Detects fat interfaces and forced implementations
 */

import { readFile } from 'fs/promises';
import type { ISPResult, ISPViolation, ValidateInterfaceInput } from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';
import { languageDetector } from '../../../shared/language-detector/index.js';

export class ISPValidator {
  private kb: KnowledgeBase;

  constructor(knowledgeBase: KnowledgeBase) {
    this.kb = knowledgeBase;
  }

  async validate(input: ValidateInterfaceInput): Promise<ISPResult> {
    const violations: ISPViolation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      // Count methods in interface
      const methodCount = this.countInterfaceMethods(code, input.interfaceName, input.filePath);

      if (methodCount > 10) {
        violations.push({
          location: `${input.filePath}:${input.interfaceName}`,
          violationType: 'fat_interface',
          description: `Interface has ${methodCount} methods, likely too many responsibilities`,
          interfaceName: input.interfaceName,
          methodCount,
          unusedMethods: [],
          clients: [],
          suggestedSplit: {
            interface1: ['Core methods'],
            interface2: ['Optional methods'],
          },
          documentationReference: this.kb.getDocumentationReference('ISP'),
          recommendation: 'Split into smaller, client-specific interfaces',
          exampleCode: {
            before: 'interface Worker { work(); eat(); sleep(); code(); }',
            after: 'interface Worker { work(); }\ninterface Human { eat(); sleep(); }',
          },
        });
      }

      // Check for empty implementations
      if (/\/\/\s*empty|\/\*\s*not\s+implemented/i.test(code)) {
        violations.push({
          location: `${input.filePath}`,
          violationType: 'forced_implementation',
          description: 'Empty method implementations suggest interface too broad',
          interfaceName: input.interfaceName,
          methodCount,
          unusedMethods: ['empty methods'],
          clients: [],
          suggestedSplit: {
            interface1: ['Required methods'],
            interface2: ['Optional methods'],
          },
          documentationReference: this.kb.getDocumentationReference('ISP'),
          recommendation: 'Split interface so clients only implement what they need',
          exampleCode: {
            before: 'class Robot implements Worker { eat() { /* empty */ } }',
            after: 'class Robot implements Workable { work() { ... } }',
          },
        });
      }

      return {
        principle: 'Interface Segregation Principle',
        compliant: violations.length === 0,
        confidence: 75,
        violations,
      };
    } catch (error) {
      throw new Error(`ISP validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private countInterfaceMethods(code: string, interfaceName: string, filePath: string): number {
    const language = languageDetector.detect(filePath);
    const patterns = languageDetector.getPatterns(language);
    const keywords = languageDetector.getSyntaxKeywords(language);

    const interfaceKeyword = keywords.interface || 'interface';
    const interfaceRegex = new RegExp(`${interfaceKeyword}\\s+${interfaceName}[^}]*}`, 's');
    const match = code.match(interfaceRegex);

    if (match) {
      const methods = match[0].match(patterns.methodDeclaration);
      return methods ? methods.length : 0;
    }

    return 0;
  }
}
