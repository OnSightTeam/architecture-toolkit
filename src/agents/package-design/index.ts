/**
 * Package Design Agent
 * Analyzes package cohesion, coupling, and stability metrics
 */

import { KnowledgeBase } from '../../shared/knowledge-base/index.js';
import { PackageCohesionAnalyzer } from './tools/package-cohesion-analyzer.js';
import { PackageCouplingAnalyzer } from './tools/package-coupling-analyzer.js';
import { StabilityMetricsCalculator } from './tools/stability-metrics-calculator.js';
import type {
  PackageDesignReport,
  AnalyzePackageInput,
} from './types.js';
import type { AgentReport } from '../../shared/types/index.js';

export class PackageDesignAgent {
  private knowledgeBase: KnowledgeBase;
  private cohesionAnalyzer: PackageCohesionAnalyzer;
  private couplingAnalyzer: PackageCouplingAnalyzer;
  private stabilityCalculator: StabilityMetricsCalculator;

  constructor(knowledgeBasePath: string) {
    this.knowledgeBase = new KnowledgeBase(knowledgeBasePath);
    this.cohesionAnalyzer = new PackageCohesionAnalyzer(this.knowledgeBase);
    this.couplingAnalyzer = new PackageCouplingAnalyzer(this.knowledgeBase);
    this.stabilityCalculator = new StabilityMetricsCalculator(this.knowledgeBase);
  }

  async analyze(filePaths: string[]): Promise<AgentReport> {
    const report = await this.validatePackages(filePaths);

    const allViolations = [
      ...report.results.cohesion.violations,
      ...report.results.coupling.violations,
      ...report.results.stability.violations,
    ];

    return {
      agent: 'Package Design',
      timestamp: new Date(),
      filesAnalyzed: filePaths.length,
      violations: allViolations.map(v => ({
        severity: v.severity,
        category: v.violationType,
        description: v.description,
        location: v.location,
        recommendation: v.recommendation,
        documentationReference: '',
        principle: v.principle || 'Package Design',
      })),
      complianceScore: report.summary.complianceScore,
      references: [],
    };
  }

  private async validatePackages(filePaths: string[]): Promise<PackageDesignReport> {
    const cohesionResults = [];
    const couplingResults = [];
    const stabilityResults = [];

    for (const filePath of filePaths) {
      const input: AnalyzePackageInput = { filePath, allFiles: filePaths };

      cohesionResults.push(await this.cohesionAnalyzer.analyze(input));
      couplingResults.push(await this.couplingAnalyzer.analyze(input));
      stabilityResults.push(await this.stabilityCalculator.analyze(input));
    }

    const allViolations = [
      ...cohesionResults.flatMap(r => r.violations),
      ...couplingResults.flatMap(r => r.violations),
      ...stabilityResults.flatMap(r => r.violations),
    ];

    const allMetrics = stabilityResults.reduce((acc, r) => ({ ...acc, ...r.metrics }), {});

    const severityCounts = this.countSeverities(allViolations);
    const complianceScore = this.calculateCompliance(allViolations, filePaths.length);

    return {
      summary: {
        totalPackages: new Set(filePaths.map(f => this.getPackageName(f))).size,
        totalViolations: allViolations.length,
        complianceScore,
        criticalIssues: severityCounts.critical,
        highIssues: severityCounts.high,
        mediumIssues: severityCounts.medium,
        lowIssues: severityCounts.low,
      },
      results: {
        cohesion: this.mergeResults(cohesionResults),
        coupling: this.mergeResults(couplingResults),
        stability: {
          compliant: stabilityResults.every(r => r.compliant),
          confidence: Math.round(
            stabilityResults.reduce((sum, r) => sum + r.confidence, 0) / stabilityResults.length
          ),
          violations: stabilityResults.flatMap(r => r.violations),
          metrics: allMetrics,
        },
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
    const totalPossibleViolations = fileCount * 10;
    const violationCount = violations.length;
    const compliance = Math.max(0, Math.round(((totalPossibleViolations - violationCount) / totalPossibleViolations) * 100));
    return compliance;
  }

  private getPackageName(filePath: string): string {
    const parts = filePath.split('/');
    return parts.slice(0, -1).join('/') || 'root';
  }
}
