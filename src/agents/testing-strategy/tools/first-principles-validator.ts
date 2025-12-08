/**
 * F.I.R.S.T Principles Validator
 * Validates Fast, Independent, Repeatable, Self-validating, Timely principles
 */

import { readFile } from 'fs/promises';
import type {
  FIRSTValidationResult,
  TestingViolation,
  AnalyzeTestsInput,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';

export class FIRSTPrinciplesValidator {
  constructor(_kb: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async validate(input: AnalyzeTestsInput): Promise<FIRSTValidationResult> {
    const violations: TestingViolation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      violations.push(...this.checkFast(code, input.filePath));
      violations.push(...this.checkIndependent(code, input.filePath));
      violations.push(...this.checkRepeatable(code, input.filePath));
      violations.push(...this.checkSelfValidating(code, input.filePath));
      violations.push(...this.checkTimely(code, input.filePath));

      const criticalCount = violations.filter(v => v.severity === 'critical').length;

      return {
        compliant: criticalCount === 0,
        confidence: 80,
        violations,
      };
    } catch (error) {
      throw new Error(`F.I.R.S.T validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private checkFast(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const slowOperations = [
      { pattern: /\b(fetch|axios|http\.get|http\.post)\s*\(/g, name: 'HTTP calls' },
      { pattern: /\b(fs\.read|fs\.write|readFile|writeFile)\s*\(/g, name: 'File I/O' },
      { pattern: /\b(setTimeout|sleep|delay)\s*\(/g, name: 'Delays' },
      { pattern: /\b(connect|createConnection|Pool)\s*\(/g, name: 'Database connections' },
    ];

    for (const { pattern, name } of slowOperations) {
      const matches = code.match(pattern);
      if (matches && matches.length > 0) {
        violations.push({
          violationType: 'first_violation',
          principle: 'Fast',
          location: filePath,
          description: `Fast principle violated: Tests contain ${name} that slow execution`,
          recommendation: `Mock ${name} to keep tests fast. Unit tests should run in milliseconds.`,
          severity: 'high',
          codeSnippet: matches[0],
        });
      }
    }

    return violations;
  }

  private checkIndependent(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const sharedState = [
      { pattern: /let\s+\w+\s*=.*;\s*\/\/\s*shared/gi, name: 'Shared mutable variables' },
      { pattern: /beforeAll\s*\([^)]*\)\s*{[^}]*(const|let)\s+/g, name: 'State in beforeAll' },
      { pattern: /global\.\w+\s*=/g, name: 'Global state modifications' },
    ];

    for (const { pattern, name } of sharedState) {
      const matches = code.match(pattern);
      if (matches && matches.length > 0) {
        violations.push({
          violationType: 'first_violation',
          principle: 'Independent',
          location: filePath,
          description: `Independent principle violated: ${name} detected`,
          recommendation: 'Tests should not depend on each other. Each test should set up its own state.',
          severity: 'critical',
        });
      }
    }

    const testOrder = code.match(/test\.only|it\.only|fdescribe|fit/g);
    if (testOrder && testOrder.length > 0) {
      violations.push({
        violationType: 'first_violation',
        principle: 'Independent',
        location: filePath,
        description: 'Independent principle violated: Tests use .only which suggests order dependency',
        recommendation: 'Remove .only and ensure tests can run in any order.',
        severity: 'high',
      });
    }

    return violations;
  }

  private checkRepeatable(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const nonRepeatablePatterns = [
      { pattern: /\bnew\s+Date\s*\(\s*\)/g, name: 'Current date/time usage' },
      { pattern: /Math\.random\s*\(/g, name: 'Random number generation' },
      { pattern: /process\.env\.\w+/g, name: 'Environment variable dependencies' },
      { pattern: /\bnetwork|external|api|third-party/gi, name: 'External dependencies' },
    ];

    for (const { pattern, name } of nonRepeatablePatterns) {
      const matches = code.match(pattern);
      if (matches && matches.length > 1) {
        violations.push({
          violationType: 'first_violation',
          principle: 'Repeatable',
          location: filePath,
          description: `Repeatable principle violated: ${name} makes tests non-deterministic`,
          recommendation: `Mock or stub ${name} to ensure tests produce same results every time.`,
          severity: 'high',
        });
      }
    }

    return violations;
  }

  private checkSelfValidating(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const manualValidation = [
      { pattern: /console\.log\s*\(/g, name: 'Manual console inspection' },
      { pattern: /debugger;/g, name: 'Debugger statements' },
      { pattern: /\/\/\s*TODO:\s*verify/gi, name: 'Manual verification comments' },
    ];

    for (const { pattern, name } of manualValidation) {
      const matches = code.match(pattern);
      if (matches && matches.length > 2) {
        violations.push({
          violationType: 'first_violation',
          principle: 'SelfValidating',
          location: filePath,
          description: `Self-validating principle violated: ${name} requires manual verification`,
          recommendation: 'Tests should pass or fail automatically without manual inspection.',
          severity: 'medium',
        });
      }
    }

    const hasAssertions = /\b(expect|assert|should)\s*\(/g.test(code);
    const hasTests = /\b(test|it)\s*\(/g.test(code);

    if (hasTests && !hasAssertions) {
      violations.push({
        violationType: 'first_violation',
        principle: 'SelfValidating',
        location: filePath,
        description: 'Self-validating principle violated: Tests lack assertions',
        recommendation: 'Every test must have assertions that automatically validate results.',
        severity: 'critical',
      });
    }

    return violations;
  }

  private checkTimely(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const missingTests = !code.includes('describe') && !code.includes('test') && !code.includes('it');
    const isTestFile = filePath.includes('.test.') || filePath.includes('.spec.');

    if (!isTestFile && !missingTests) {
      return violations;
    }

    if (!isTestFile && code.includes('export')) {
      const productionCode = code.match(/export\s+(class|function|const)/g);
      if (productionCode && productionCode.length > 0) {
        violations.push({
          violationType: 'first_violation',
          principle: 'Timely',
          location: filePath,
          description: 'Timely principle: Production code lacks corresponding test file',
          recommendation: 'Write tests right after (or before with TDD) writing production code.',
          severity: 'low',
        });
      }
    }

    return violations;
  }
}
