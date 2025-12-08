/**
 * Test Quality Validator
 * Detects T1-T9 test smells from Clean Code
 */

import { readFile } from 'fs/promises';
import type {
  TestQualityResult,
  TestingViolation,
  AnalyzeTestsInput,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';

export class TestQualityValidator {
  constructor(_kb: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async validate(input: AnalyzeTestsInput): Promise<TestQualityResult> {
    const violations: TestingViolation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      violations.push(...this.checkInsufficientTests(code, input.filePath));
      violations.push(...this.checkIgnoredTests(code, input.filePath));
      violations.push(...this.checkTestPerClass(code, input.filePath));
      violations.push(...this.checkUntestedMethods(code, input.filePath));
      violations.push(...this.checkExhaustiveTesting(code, input.filePath));
      violations.push(...this.checkLongTests(code, input.filePath));
      violations.push(...this.checkSlowTests(code, input.filePath));
      violations.push(...this.checkFragileTests(code, input.filePath));
      violations.push(...this.checkTestCodeDuplication(code, input.filePath));

      const criticalCount = violations.filter(v => v.severity === 'critical').length;

      return {
        compliant: criticalCount === 0,
        confidence: 85,
        violations,
      };
    } catch (error) {
      throw new Error(`Test quality validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private checkInsufficientTests(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const testCount = (code.match(/\b(test|it)\s*\(/g) || []).length;
    const publicMethods = (code.match(/\bpublic\s+\w+\s*\(/g) || []).length;

    if (testCount < publicMethods * 0.5) {
      violations.push({
        violationType: 'test_smell',
        smellId: 'T1',
        location: filePath,
        description: `T1 - Insufficient Tests: Only ${testCount} tests for ${publicMethods} public methods`,
        recommendation: 'Add more tests to cover edge cases, error conditions, and happy paths.',
        severity: 'high',
      });
    }

    return violations;
  }

  private checkIgnoredTests(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const ignoredTests = code.match(/\b(xit|it\.skip|test\.skip|@Ignore)\s*\(/g);

    if (ignoredTests && ignoredTests.length > 0) {
      violations.push({
        violationType: 'test_smell',
        smellId: 'T2',
        location: filePath,
        description: `T2 - Ignored Test: ${ignoredTests.length} test(s) are being skipped`,
        recommendation: 'Either fix and enable ignored tests or remove them completely.',
        severity: 'medium',
        codeSnippet: ignoredTests[0],
      });
    }

    return violations;
  }

  private checkTestPerClass(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const describeBlocks = (code.match(/\bdescribe\s*\(/g) || []).length;
    const testCount = (code.match(/\b(test|it)\s*\(/g) || []).length;

    if (describeBlocks > 0 && testCount / describeBlocks < 3) {
      violations.push({
        violationType: 'test_smell',
        smellId: 'T3',
        location: filePath,
        description: 'T3 - Test Per Class: Very few tests per test suite (< 3 per describe)',
        recommendation: 'Add more test cases to thoroughly validate each class behavior.',
        severity: 'medium',
      });
    }

    return violations;
  }

  private checkUntestedMethods(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const exportedFunctions = code.match(/export\s+(function|const)\s+\w+/g);
    const testCount = (code.match(/\b(test|it)\s*\(/g) || []).length;

    if (exportedFunctions && exportedFunctions.length > testCount * 1.5) {
      violations.push({
        violationType: 'coverage_gap',
        smellId: 'T4',
        location: filePath,
        description: 'T4 - Untested Method: Many exported functions may lack test coverage',
        recommendation: 'Ensure all public methods have corresponding tests.',
        severity: 'high',
      });
    }

    return violations;
  }

  private checkExhaustiveTesting(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const expectCount = (code.match(/\bexpect\s*\(/g) || []).length;
    const testCount = (code.match(/\b(test|it)\s*\(/g) || []).length;

    if (testCount > 0 && expectCount / testCount > 10) {
      violations.push({
        violationType: 'test_smell',
        smellId: 'T5',
        location: filePath,
        description: `T5 - Exhaustive Testing: Average ${Math.floor(expectCount / testCount)} assertions per test`,
        recommendation: 'Break down tests with many assertions into smaller, focused tests.',
        severity: 'medium',
      });
    }

    return violations;
  }

  private checkLongTests(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const testBlocks = code.match(/\b(test|it)\s*\([^{]*{([^}]*)}/gs);

    if (testBlocks) {
      const longTests = testBlocks.filter(block => {
        const lines = block.split('\n').length;
        return lines > 30;
      });

      if (longTests.length > 0) {
        violations.push({
          violationType: 'test_smell',
          smellId: 'T6',
          location: filePath,
          description: `T6 - Long Tests: ${longTests.length} test(s) exceed 30 lines`,
          recommendation: 'Extract setup code to beforeEach or helper functions.',
          severity: 'medium',
        });
      }
    }

    return violations;
  }

  private checkSlowTests(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const slowIndicators = code.match(/\b(sleep|setTimeout|delay|wait)\s*\(/g);

    if (slowIndicators && slowIndicators.length > 2) {
      violations.push({
        violationType: 'test_smell',
        smellId: 'T7',
        location: filePath,
        description: 'T7 - Slow Tests: Tests contain sleep/wait calls that slow execution',
        recommendation: 'Use mocks and stubs instead of real delays. Tests should be fast.',
        severity: 'high',
      });
    }

    return violations;
  }

  private checkFragileTests(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const fragilePatterns = [
      /new\s+Date\s*\(/g,
      /Math\.random\s*\(/g,
      /process\.env\./g,
    ];

    let fragileCount = 0;
    for (const pattern of fragilePatterns) {
      const matches = code.match(pattern);
      if (matches) fragileCount += matches.length;
    }

    if (fragileCount > 3) {
      violations.push({
        violationType: 'test_smell',
        smellId: 'T8',
        location: filePath,
        description: 'T8 - Fragile Tests: Tests depend on time, randomness, or environment variables',
        recommendation: 'Mock Date, Random, and environment dependencies for repeatable tests.',
        severity: 'high',
      });
    }

    return violations;
  }

  private checkTestCodeDuplication(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const setupPatterns = code.match(/const\s+\w+\s*=\s*new\s+\w+/g);

    if (setupPatterns && setupPatterns.length > 5) {
      const uniqueSetup = new Set(setupPatterns);
      if (setupPatterns.length / uniqueSetup.size > 2) {
        violations.push({
          violationType: 'test_smell',
          smellId: 'T9',
          location: filePath,
          description: 'T9 - Test Code Duplication: Repeated setup code across tests',
          recommendation: 'Extract common setup to beforeEach or factory functions.',
          severity: 'medium',
        });
      }
    }

    return violations;
  }
}
