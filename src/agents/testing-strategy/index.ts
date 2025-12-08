/**
 * Testing Strategy Agent
 * Analyzes test quality, F.I.R.S.T principles, and test independence
 */

import { KnowledgeBase } from '../../shared/knowledge-base/index.js';
import { TestQualityValidator } from './tools/test-quality-validator.js';
import { FIRSTPrinciplesValidator } from './tools/first-principles-validator.js';
import { TestIndependenceValidator } from './tools/test-independence-validator.js';
import type {
  TestingStrategyReport,
  AnalyzeTestsInput,
} from './types.js';
import type { AgentReport } from '../../shared/types/index.js';

export class TestingStrategyAgent {
  private knowledgeBase: KnowledgeBase;
  private testQualityValidator: TestQualityValidator;
  private firstPrinciplesValidator: FIRSTPrinciplesValidator;
  private testIndependenceValidator: TestIndependenceValidator;

  constructor(knowledgeBasePath: string) {
    this.knowledgeBase = new KnowledgeBase(knowledgeBasePath);
    this.testQualityValidator = new TestQualityValidator(this.knowledgeBase);
    this.firstPrinciplesValidator = new FIRSTPrinciplesValidator(this.knowledgeBase);
    this.testIndependenceValidator = new TestIndependenceValidator(this.knowledgeBase);
  }

  async analyze(filePaths: string[]): Promise<AgentReport> {
    const report = await this.validateFiles(filePaths);

    const allViolations = [
      ...report.results.testQuality.violations,
      ...report.results.firstPrinciples.violations,
      ...report.results.testIndependence.violations,
    ];

    return {
      agent: 'Testing Strategy',
      timestamp: new Date(),
      filesAnalyzed: filePaths.length,
      violations: allViolations.map(v => ({
        severity: v.severity,
        category: v.violationType,
        description: v.description,
        location: v.location,
        recommendation: v.recommendation,
        documentationReference: '',
        principle: v.smellId || v.principle || 'Testing',
      })),
      complianceScore: report.summary.complianceScore,
      references: [],
    };
  }

  private async validateFiles(filePaths: string[]): Promise<TestingStrategyReport> {
    const testQualityResults = [];
    const firstPrinciplesResults = [];
    const testIndependenceResults = [];

    for (const filePath of filePaths) {
      const input: AnalyzeTestsInput = { filePath };

      testQualityResults.push(await this.testQualityValidator.validate(input));
      firstPrinciplesResults.push(await this.firstPrinciplesValidator.validate(input));
      testIndependenceResults.push(await this.testIndependenceValidator.validate(input));
    }

    const allViolations = [
      ...testQualityResults.flatMap(r => r.violations),
      ...firstPrinciplesResults.flatMap(r => r.violations),
      ...testIndependenceResults.flatMap(r => r.violations),
    ];

    const severityCounts = this.countSeverities(allViolations);
    const complianceScore = this.calculateCompliance(allViolations, filePaths.length);

    return {
      summary: {
        totalTests: filePaths.length,
        totalViolations: allViolations.length,
        complianceScore,
        criticalIssues: severityCounts.critical,
        highIssues: severityCounts.high,
        mediumIssues: severityCounts.medium,
        lowIssues: severityCounts.low,
      },
      results: {
        testQuality: this.mergeResults(testQualityResults),
        firstPrinciples: this.mergeResults(firstPrinciplesResults),
        testIndependence: this.mergeResults(testIndependenceResults),
      },
    };
  }

  private mergeResults<T extends { violations: any[]; compliant: boolean; confidence: number }>(
    results: T[]
  ): T {
    return {
      compliant: results.every(r => r.compliant),
      confidence: Math.round(results.reduce((sum, r) => sum + r.confidence, 0) / results.length),
      violations: results.flatMap(r => r.violations),
    } as T;
  }

  private countSeverities(violations: any[]) {
    return {
      critical: violations.filter(v => v.severity === 'critical').length,
      high: violations.filter(v => v.severity === 'high').length,
      medium: violations.filter(v => v.severity === 'medium').length,
      low: violations.filter(v => v.severity === 'low').length,
    };
  }

  private calculateCompliance(violations: any[], fileCount: number): number {
    const totalPossibleViolations = fileCount * 15;
    const violationCount = violations.length;
    const compliance = Math.max(0, Math.round(((totalPossibleViolations - violationCount) / totalPossibleViolations) * 100));
    return compliance;
  }
}
