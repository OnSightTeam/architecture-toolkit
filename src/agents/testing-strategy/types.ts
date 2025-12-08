/**
 * Testing Strategy Agent Types
 * Defines test smells and F.I.R.S.T principles validation types
 */

export type TestSmellId =
  | 'T1' // Insufficient Tests
  | 'T2' // Ignored Test
  | 'T3' // Test Per Class
  | 'T4' // Untested Method
  | 'T5' // Exhaustive Testing
  | 'T6' // Long Tests
  | 'T7' // Slow Tests
  | 'T8' // Fragile Tests
  | 'T9'; // Test Code Duplication

export type FIRSTPrinciple =
  | 'Fast'
  | 'Independent'
  | 'Repeatable'
  | 'SelfValidating'
  | 'Timely';

export type TestingViolationType =
  | 'test_smell'
  | 'first_violation'
  | 'coverage_gap'
  | 'test_independence';

export interface TestingViolation {
  violationType: TestingViolationType;
  smellId?: TestSmellId;
  principle?: FIRSTPrinciple;
  location: string;
  description: string;
  recommendation: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  codeSnippet?: string;
}

export interface TestQualityResult {
  compliant: boolean;
  confidence: number;
  violations: TestingViolation[];
}

export interface FIRSTValidationResult {
  compliant: boolean;
  confidence: number;
  violations: TestingViolation[];
}

export interface TestIndependenceResult {
  compliant: boolean;
  confidence: number;
  violations: TestingViolation[];
}

export interface TestingStrategyReport {
  summary: {
    totalTests: number;
    totalViolations: number;
    complianceScore: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
  };
  results: {
    testQuality: TestQualityResult;
    firstPrinciples: FIRSTValidationResult;
    testIndependence: TestIndependenceResult;
  };
}

export interface AnalyzeTestsInput {
  filePath: string;
}
