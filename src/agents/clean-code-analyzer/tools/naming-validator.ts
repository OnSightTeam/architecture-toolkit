/**
 * Naming Conventions Validator
 * Validates naming against Clean Code principles (N1-N7)
 */

import { readFile } from 'fs/promises';
import type {
  NamingResult,
  CleanCodeViolation,
  ValidateCleanCodeInput,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';

export class NamingValidator {
  constructor(_kb: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async validate(input: ValidateCleanCodeInput): Promise<NamingResult> {
    const violations: CleanCodeViolation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      violations.push(...this.checkDescriptiveNames(code, input.filePath));
      violations.push(...this.checkMeaningfulDistinctions(code, input.filePath));
      violations.push(...this.checkPronounceableNames(code, input.filePath));
      violations.push(...this.checkSearchableNames(code, input.filePath));
      violations.push(...this.checkMemberPrefixes(code, input.filePath));
      violations.push(...this.checkInterfaceEncoding(code, input.filePath));
      violations.push(...this.checkClassNaming(code, input.filePath));

      return {
        compliant: violations.length === 0,
        confidence: violations.length === 0 ? 100 : 90,
        violations,
      };
    } catch (error) {
      throw new Error(`Naming validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private checkDescriptiveNames(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];

    const singleLetterVars = code.match(/\b[a-z]\s*=/g);
    if (singleLetterVars && singleLetterVars.length > 3) {
      violations.push({
        smellId: 'N1',
        category: 'naming',
        location: filePath,
        description: 'N1 - Single letter variable names (not descriptive)',
        recommendation: 'Use descriptive names that reveal intent. Single letters only for loop counters.',
        documentationReference: 'docs/specs/practices/naming-conventions.md',
        severity: 'medium',
        exampleCode: {
          before: 'const d = new Date();\nconst e = employees;',
          after: 'const currentDate = new Date();\nconst activeEmployees = employees;',
        },
      });
    }

    const twoLetterVars = code.match(/\b[a-z]{2}\s*=/g);
    if (twoLetterVars && twoLetterVars.length > 5) {
      violations.push({
        smellId: 'N1',
        category: 'naming',
        location: filePath,
        description: 'N1 - Two-letter variable names (insufficient context)',
        recommendation: 'Use full words that communicate meaning clearly.',
        documentationReference: 'docs/specs/practices/naming-conventions.md',
        severity: 'low',
      });
    }

    return violations;
  }

  private checkMeaningfulDistinctions(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];

    if (/\bdata\b.*\binfo\b|\binfo\b.*\bdata\b/i.test(code)) {
      violations.push({
        smellId: 'N2',
        category: 'naming',
        location: filePath,
        description: 'N2 - Noise words (data, info) used without meaningful distinction',
        recommendation: 'Avoid generic noise words. Use specific, meaningful names.',
        documentationReference: 'docs/specs/practices/naming-conventions.md',
        severity: 'low',
        exampleCode: {
          before: 'const userData = ...\nconst userInfo = ...\nconst userObject = ...',
          after: 'const user = ...\nconst userProfile = ...\nconst userPreferences = ...',
        },
      });
    }

    const numberSuffixes = code.match(/\w+\d+\s*=/g);
    if (numberSuffixes && numberSuffixes.length > 2) {
      violations.push({
        smellId: 'N2',
        category: 'naming',
        location: filePath,
        description: 'N2 - Number series naming (e.g., var1, var2) lacks meaningful distinction',
        recommendation: 'Name variables by their role/purpose, not arbitrary numbers.',
        documentationReference: 'docs/specs/practices/naming-conventions.md',
        severity: 'medium',
        exampleCode: {
          before: 'const name1 = ...;\nconst name2 = ...;',
          after: 'const firstName = ...;\nconst lastName = ...;',
        },
      });
    }

    return violations;
  }

  private checkPronounceableNames(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];

    const unpronounceable = [
      /genymdhms/i,
      /\b[a-z]{2}[0-9]{2}[a-z]{2}\b/i,
      /\b[bcdfghjklmnpqrstvwxyz]{4,}\b/i,
    ];

    for (const pattern of unpronounceable) {
      if (pattern.test(code)) {
        violations.push({
          smellId: 'N3',
          category: 'naming',
          location: filePath,
          description: 'N3 - Unpronounceable names found',
          recommendation: 'Use pronounceable names to facilitate discussion and understanding.',
          documentationReference: 'docs/specs/practices/naming-conventions.md',
          severity: 'low',
          exampleCode: {
            before: 'const genymdhms = new Date();',
            after: 'const generationTimestamp = new Date();',
          },
        });
        break;
      }
    }

    return violations;
  }

  private checkSearchableNames(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];

    const magicNumbers = code.match(/\b\d{2,}\b/g);
    if (magicNumbers && magicNumbers.length > 3) {
      violations.push({
        smellId: 'N4',
        category: 'naming',
        location: filePath,
        description: 'N4 - Magic numbers (unsearchable numeric literals)',
        recommendation: 'Replace magic numbers with named constants.',
        documentationReference: 'docs/specs/practices/naming-conventions.md',
        severity: 'medium',
        exampleCode: {
          before: 'if (age > 18) { ... }\nsetTimeout(fn, 86400);',
          after: 'const LEGAL_AGE = 18;\nconst DAY_IN_MILLISECONDS = 86400;\nif (age > LEGAL_AGE) { ... }',
        },
      });
    }

    return violations;
  }

  private checkMemberPrefixes(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];

    if (/\bm_\w+|_\w+/.test(code)) {
      violations.push({
        smellId: 'N5',
        category: 'naming',
        location: filePath,
        description: 'N5 - Member prefixes (m_, _) are unnecessary in modern code',
        recommendation: 'Remove member prefixes. Modern IDEs highlight member variables.',
        documentationReference: 'docs/specs/practices/naming-conventions.md',
        severity: 'low',
        exampleCode: {
          before: 'class User {\n  private m_name: string;\n}',
          after: 'class User {\n  private name: string;\n}',
        },
      });
    }

    return violations;
  }

  private checkInterfaceEncoding(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];

    if (/interface\s+I[A-Z]\w+/.test(code)) {
      violations.push({
        smellId: 'N6',
        category: 'naming',
        location: filePath,
        description: 'N6 - Interface prefix "I" is Hungarian notation (avoid encoding)',
        recommendation: 'Name interfaces clearly without "I" prefix. Suffix implementations instead.',
        documentationReference: 'docs/specs/practices/naming-conventions.md',
        severity: 'low',
        exampleCode: {
          before: 'interface IUserRepository { ... }\nclass UserRepository implements IUserRepository { ... }',
          after: 'interface UserRepository { ... }\nclass DbUserRepository implements UserRepository { ... }',
        },
      });
    }

    return violations;
  }

  private checkClassNaming(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];

    if (/class\s+(Manager|Processor|Data|Info)\b/.test(code)) {
      violations.push({
        smellId: 'N7',
        category: 'naming',
        location: filePath,
        description: 'N7 - Generic class names (Manager, Processor) lack specificity',
        recommendation: 'Use specific nouns or noun phrases for class names.',
        documentationReference: 'docs/specs/practices/naming-conventions.md',
        severity: 'medium',
        exampleCode: {
          before: 'class DataManager { ... }',
          after: 'class UserRepository { ... }\nclass OrderProcessor { ... }',
        },
      });
    }

    return violations;
  }
}
