/**
 * Comment Quality Validator
 * Validates comments against Clean Code principles (C1-C5)
 */

import { readFile } from 'fs/promises';
import type {
  CommentQualityResult,
  CleanCodeViolation,
  ValidateCleanCodeInput,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';
import { languageDetector } from '../../../shared/language-detector/index.js';

export class CommentValidator {
  constructor(_kb: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async validate(input: ValidateCleanCodeInput): Promise<CommentQualityResult> {
    const violations: CleanCodeViolation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      violations.push(...this.checkInappropriateComments(code, input.filePath));
      violations.push(...this.checkObsoleteComments(code, input.filePath));
      violations.push(...this.checkRedundantComments(code, input.filePath));
      violations.push(...this.checkCommentedOutCode(code, input.filePath));

      return {
        compliant: violations.length === 0,
        confidence: violations.length === 0 ? 100 : 80,
        violations,
      };
    } catch (error) {
      throw new Error(`Comment validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private checkInappropriateComments(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];
    const language = languageDetector.detect(filePath);
    const patterns = languageDetector.getPatterns(language);

    const todoMatches = code.match(patterns.todoComment) || [];
    const todoCount = todoMatches.length;

    const singleLineComments = code.match(patterns.singleLineComment) || [];
    const fixmeCount = singleLineComments.filter(c => /FIXME/i.test(c)).length;

    if (todoCount > 5 || fixmeCount > 3) {
      violations.push({
        smellId: 'C1',
        category: 'comment',
        location: filePath,
        description: `C1 - Excessive TODO/FIXME comments (${todoCount + fixmeCount} found)`,
        recommendation: 'TODOs should be tracked in issue system, not left in code.',
        documentationReference: 'docs/specs/practices/comments-and-documentation.md',
        severity: 'low',
        exampleCode: {
          before: '// TODO: fix this later\n// FIXME: handle edge case',
          after: '// Create tickets and implement properly',
        },
      });
    }

    return violations;
  }

  private checkObsoleteComments(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];

    if (/\/\/.*\b(old|obsolete|deprecated|legacy|2019|2020|2021)\b/i.test(code)) {
      violations.push({
        smellId: 'C2',
        category: 'comment',
        location: filePath,
        description: 'C2 - Obsolete comments found (references old implementation or dates)',
        recommendation: 'Remove obsolete comments. Use version control for history.',
        documentationReference: 'docs/specs/practices/comments-and-documentation.md',
        severity: 'low',
      });
    }

    return violations;
  }

  private checkRedundantComments(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];

    const redundantPatterns = [
      /\/\/\s*increment\s*i.*i\+\+/i,
      /\/\/\s*get\s+\w+.*function\s+get\w+/i,
      /\/\/\s*set\s+\w+.*function\s+set\w+/i,
      /\/\/\s*return.*return/i,
    ];

    for (const pattern of redundantPatterns) {
      if (pattern.test(code)) {
        violations.push({
          smellId: 'C3',
          category: 'comment',
          location: filePath,
          description: 'C3 - Redundant comment (states the obvious)',
          recommendation: 'Remove comments that just restate the code. Make code self-explanatory.',
          documentationReference: 'docs/specs/practices/comments-and-documentation.md',
          severity: 'low',
          exampleCode: {
            before: '// Increment i\ni++;',
            after: 'i++; // No comment needed',
          },
        });
        break;
      }
    }

    return violations;
  }

  private checkCommentedOutCode(code: string, filePath: string): CleanCodeViolation[] {
    const violations: CleanCodeViolation[] = [];
    const language = languageDetector.detect(filePath);
    const patterns = languageDetector.getPatterns(language);
    const keywords = languageDetector.getSyntaxKeywords(language);

    const singleLineComments = code.match(patterns.singleLineComment) || [];
    const codeKeywords = [keywords.class, keywords.function, 'if', 'for', 'while', 'const', 'let', 'var', 'def', 'return'];
    const commentedCodeLines = singleLineComments.filter(comment =>
      codeKeywords.some(kw => kw && comment.includes(kw))
    );

    if (commentedCodeLines.length > 3) {
      violations.push({
        smellId: 'C4',
        category: 'comment',
        location: filePath,
        description: `C4 - Commented-out code found (${commentedCodeLines.length} lines)`,
        recommendation: 'Delete commented-out code. Use version control to retrieve old code if needed.',
        documentationReference: 'docs/specs/practices/comments-and-documentation.md',
        severity: 'medium',
        exampleCode: {
          before: '// const oldVersion = ...\n// function obsoleteMethod() { ... }',
          after: '// Remove entirely. Git remembers.',
        },
      });
    }

    return violations;
  }
}
