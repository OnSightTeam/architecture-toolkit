/**
 * Test Independence Validator
 * Validates that tests can run in any order without dependencies
 */

import { readFile } from 'fs/promises';
import type {
  TestIndependenceResult,
  TestingViolation,
  AnalyzeTestsInput,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';

export class TestIndependenceValidator {
  constructor(_kb: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async validate(input: AnalyzeTestsInput): Promise<TestIndependenceResult> {
    const violations: TestingViolation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      violations.push(...this.checkSharedMutableState(code, input.filePath));
      violations.push(...this.checkTestOrdering(code, input.filePath));
      violations.push(...this.checkGlobalStateModification(code, input.filePath));
      violations.push(...this.checkCrossDependencies(code, input.filePath));

      const criticalCount = violations.filter(v => v.severity === 'critical').length;

      return {
        compliant: criticalCount === 0,
        confidence: 85,
        violations,
      };
    } catch (error) {
      throw new Error(`Test independence validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private checkSharedMutableState(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const topLevelMutables = code.match(/^let\s+\w+\s*=/gm);

    if (topLevelMutables && topLevelMutables.length > 2) {
      violations.push({
        violationType: 'test_independence',
        location: filePath,
        description: `${topLevelMutables.length} top-level mutable variables detected (shared state risk)`,
        recommendation: 'Move mutable state into beforeEach() or individual tests.',
        severity: 'high',
      });
    }

    const moduleState = code.match(/let\s+\w+Cache\s*=|let\s+shared\w+\s*=/gi);
    if (moduleState && moduleState.length > 0) {
      violations.push({
        violationType: 'test_independence',
        location: filePath,
        description: 'Module-level cache or shared variables create test interdependencies',
        recommendation: 'Reset shared state in beforeEach() or use isolated instances per test.',
        severity: 'critical',
        codeSnippet: moduleState[0],
      });
    }

    return violations;
  }

  private checkTestOrdering(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const focusedTests = code.match(/\b(fdescribe|fit|test\.only|it\.only)\s*\(/g);

    if (focusedTests && focusedTests.length > 0) {
      violations.push({
        violationType: 'test_independence',
        location: filePath,
        description: `${focusedTests.length} focused test(s) detected (.only or f-prefix)`,
        recommendation: 'Remove .only/.skip to ensure all tests run. Focused tests suggest order dependency.',
        severity: 'medium',
      });
    }

    const sequentialComments = code.match(/\/\/\s*(run|execute)\s+(first|second|third|before|after)/gi);
    if (sequentialComments && sequentialComments.length > 0) {
      violations.push({
        violationType: 'test_independence',
        location: filePath,
        description: 'Comments suggest tests must run in specific order',
        recommendation: 'Make each test independent by setting up its own preconditions.',
        severity: 'high',
      });
    }

    return violations;
  }

  private checkGlobalStateModification(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const globalModifications = [
      { pattern: /global\.\w+\s*=/g, name: 'global object' },
      { pattern: /window\.\w+\s*=/g, name: 'window object' },
      { pattern: /process\.env\.\w+\s*=/g, name: 'environment variables' },
      { pattern: /Object\.prototype\.\w+\s*=/g, name: 'prototypes' },
    ];

    for (const { pattern, name } of globalModifications) {
      const matches = code.match(pattern);
      if (matches && matches.length > 0) {
        violations.push({
          violationType: 'test_independence',
          location: filePath,
          description: `Tests modify ${name}, affecting other tests`,
          recommendation: `Restore ${name} in afterEach() or avoid global state modification.`,
          severity: 'critical',
          codeSnippet: matches[0],
        });
      }
    }

    return violations;
  }

  private checkCrossDependencies(code: string, filePath: string): TestingViolation[] {
    const violations: TestingViolation[] = [];

    const beforeAllWithState = code.match(/beforeAll\s*\([^)]*\)\s*{[^}]*(let|const|var)\s+/g);

    if (beforeAllWithState && beforeAllWithState.length > 0) {
      violations.push({
        violationType: 'test_independence',
        location: filePath,
        description: 'beforeAll sets up state shared across all tests',
        recommendation: 'Use beforeEach for test setup to ensure each test starts fresh.',
        severity: 'high',
      });
    }

    const staticSetup = code.match(/describe\s*\([^{]*{\s*(const|let|var)\s+\w+\s*=/g);
    if (staticSetup && staticSetup.length > 1) {
      violations.push({
        violationType: 'test_independence',
        location: filePath,
        description: 'Variables declared at describe-block level are shared between tests',
        recommendation: 'Move setup into beforeEach() or individual test functions.',
        severity: 'medium',
      });
    }

    return violations;
  }
}
