/**
 * Architecture Reviewer Agent
 * Validates Clean Architecture principles and boundaries
 */

import { KnowledgeBase } from '../../shared/knowledge-base/index.js';
import { DependencyRuleValidator } from './tools/dependency-rule-validator.js';
import { LayerSeparationValidator } from './tools/layer-separation-validator.js';
import { BoundaryAnalysisValidator } from './tools/boundary-analysis-validator.js';
import type {
  ArchitectureValidationResults,
  ArchitectureReport,
  ValidateArchitectureInput,
} from './types.js';
import type { AgentReport } from '../../shared/types/index.js';

export class ArchitectureReviewerAgent {
  private kb: KnowledgeBase;
  private dependencyRuleValidator: DependencyRuleValidator;
  private layerSeparationValidator: LayerSeparationValidator;
  private boundaryAnalysisValidator: BoundaryAnalysisValidator;

  constructor(knowledgeBasePath?: string) {
    this.kb = new KnowledgeBase(knowledgeBasePath);
    this.dependencyRuleValidator = new DependencyRuleValidator(this.kb);
    this.layerSeparationValidator = new LayerSeparationValidator(this.kb);
    this.boundaryAnalysisValidator = new BoundaryAnalysisValidator(this.kb);
  }

  /**
   * Validate a single file
   */
  async validateFile(filePath: string): Promise<ArchitectureReport> {
    const input: ValidateArchitectureInput = { filePath };

    const results: ArchitectureValidationResults = {
      dependencyRule: await this.dependencyRuleValidator.validate(input),
      layerSeparation: await this.layerSeparationValidator.validate(input),
      boundaryAnalysis: await this.boundaryAnalysisValidator.validate(input),
    };

    return this.generateReport(results, [filePath]);
  }

  /**
   * Validate multiple files
   */
  async validateFiles(filePaths: string[]): Promise<ArchitectureReport> {
    const allResults: ArchitectureValidationResults[] = [];

    for (const filePath of filePaths) {
      const report = await this.validateFile(filePath);
      allResults.push(report.results);
    }

    const mergedResults = this.mergeResults(allResults);
    return this.generateReport(mergedResults, filePaths);
  }

  /**
   * Convert to standard AgentReport format for toolkit orchestrator
   */
  async analyze(filePaths: string[]): Promise<AgentReport> {
    const archReport = await this.validateFiles(filePaths);

    const allViolations = [
      ...archReport.results.dependencyRule.violations,
      ...archReport.results.layerSeparation.violations,
      ...archReport.results.boundaryAnalysis.violations,
    ];

    return {
      agent: 'Architecture Reviewer',
      timestamp: new Date(),
      filesAnalyzed: filePaths.length,
      violations: allViolations.map(v => ({
        severity: v.severity,
        location: v.location,
        description: v.description,
        recommendation: v.recommendation,
        documentationReference: v.documentationReference,
        exampleCode: v.exampleCode,
        category: v.violationType,
        principle: 'Clean Architecture',
      })),
      complianceScore: archReport.summary.complianceScore,
      references: archReport.references,
      summary: archReport.summary,
    };
  }

  /**
   * Generate comprehensive architecture report
   */
  private generateReport(
    results: ArchitectureValidationResults,
    filePaths: string[]
  ): ArchitectureReport {
    const totalViolations =
      results.dependencyRule.violations.length +
      results.layerSeparation.violations.length +
      results.boundaryAnalysis.violations.length;

    const allViolations = [
      ...results.dependencyRule.violations,
      ...results.layerSeparation.violations,
      ...results.boundaryAnalysis.violations,
    ];

    const criticalIssues = allViolations.filter(v => v.severity === 'critical').length;

    const complianceScore = this.calculateComplianceScore(results);

    return {
      summary: {
        filesAnalyzed: filePaths.length,
        totalViolations,
        complianceScore,
        criticalIssues,
      },
      results,
      recommendations: this.generateRecommendations(results),
      references: this.generateReferences(),
    };
  }

  /**
   * Calculate overall compliance score
   */
  private calculateComplianceScore(results: ArchitectureValidationResults): number {
    const weights = {
      dependencyRule: 40,
      layerSeparation: 35,
      boundaryAnalysis: 25,
    };

    let totalScore = 0;
    if (results.dependencyRule.compliant) totalScore += weights.dependencyRule;
    if (results.layerSeparation.compliant) totalScore += weights.layerSeparation;
    if (results.boundaryAnalysis.compliant) totalScore += weights.boundaryAnalysis;

    return totalScore;
  }

  /**
   * Generate prioritized recommendations
   */
  private generateRecommendations(results: ArchitectureValidationResults): string[] {
    const recommendations: string[] = [];

    if (results.dependencyRule.violations.length > 0) {
      const critical = results.dependencyRule.violations.filter(v => v.severity === 'critical');
      if (critical.length > 0) {
        recommendations.push('🔴 CRITICAL: Fix Dependency Rule violations - dependencies must point inward');
      } else {
        recommendations.push('🟡 HIGH: Address dependency direction issues');
      }
    }

    if (results.layerSeparation.violations.length > 0) {
      recommendations.push('🟡 HIGH: Separate business logic from infrastructure concerns');
    }

    if (results.boundaryAnalysis.violations.length > 0) {
      const dataLeaks = results.boundaryAnalysis.violations.filter(v =>
        v.description.includes('leaked') || v.description.includes('exposed')
      );
      if (dataLeaks.length > 0) {
        recommendations.push('🔴 CRITICAL: Fix data structure leaks across boundaries');
      } else {
        recommendations.push('🟢 MEDIUM: Improve boundary definitions with proper interfaces');
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Architecture follows Clean Architecture principles');
    }

    return recommendations;
  }

  /**
   * Generate documentation references
   */
  private generateReferences(): string[] {
    return [
      'docs/specs/architecture/clean-architecture-principles.md',
      'docs/specs/architecture/boundaries.md',
      'docs/specs/architecture/business-rules.md',
      'docs/specs/architecture/policy-and-level.md',
    ];
  }

  /**
   * Merge results from multiple files
   */
  private mergeResults(allResults: ArchitectureValidationResults[]): ArchitectureValidationResults {
    const merged: ArchitectureValidationResults = {
      dependencyRule: { compliant: true, confidence: 100, violations: [] },
      layerSeparation: { compliant: true, confidence: 100, violations: [] },
      boundaryAnalysis: { compliant: true, confidence: 100, violations: [] },
    };

    for (const results of allResults) {
      merged.dependencyRule.violations.push(...results.dependencyRule.violations);
      merged.layerSeparation.violations.push(...results.layerSeparation.violations);
      merged.boundaryAnalysis.violations.push(...results.boundaryAnalysis.violations);
    }

    merged.dependencyRule.compliant = merged.dependencyRule.violations.length === 0;
    merged.layerSeparation.compliant = merged.layerSeparation.violations.length === 0;
    merged.boundaryAnalysis.compliant = merged.boundaryAnalysis.violations.length === 0;

    return merged;
  }
}

export * from './types.js';
