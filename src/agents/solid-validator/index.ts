/**
 * SOLID Validator Agent
 * Validates code against the five SOLID principles
 */

import { KnowledgeBase } from '../../shared/knowledge-base/index.js';
import { SRPValidator } from './tools/srp-validator.js';
import { OCPValidator } from './tools/ocp-validator.js';
import { LSPValidator } from './tools/lsp-validator.js';
import { ISPValidator } from './tools/isp-validator.js';
import { DIPValidator } from './tools/dip-validator.js';
import type {
  SOLIDValidationResults,
  SOLIDReport,
  ValidateCodeInput,
} from './types.js';
import type { AgentReport } from '../../shared/types/index.js';

export class SOLIDValidatorAgent {
  private kb: KnowledgeBase;
  private srpValidator: SRPValidator;
  private ocpValidator: OCPValidator;
  private lspValidator: LSPValidator;
  private ispValidator: ISPValidator;
  private dipValidator: DIPValidator;

  constructor(knowledgeBasePath?: string) {
    this.kb = new KnowledgeBase(knowledgeBasePath);
    this.srpValidator = new SRPValidator(this.kb);
    this.ocpValidator = new OCPValidator(this.kb);
    this.lspValidator = new LSPValidator(this.kb);
    this.ispValidator = new ISPValidator(this.kb);
    this.dipValidator = new DIPValidator(this.kb);
  }

  /**
   * Validate a code file against all SOLID principles
   */
  async validateFile(filePath: string, className?: string): Promise<SOLIDReport> {
    const input: ValidateCodeInput = { filePath, className };

    const results: SOLIDValidationResults = {
      srp: await this.srpValidator.validate(input),
      ocp: await this.ocpValidator.validate(input),
      lsp: await this.lspValidator.validate({ filePath, baseClass: 'Base', derivedClass: className || 'Derived' }),
      isp: await this.ispValidator.validate({ filePath, interfaceName: className || 'Interface' }),
      dip: await this.dipValidator.validate(input),
    };

    return this.generateReport(results, [filePath]);
  }

  /**
   * Validate multiple files
   */
  async validateFiles(filePaths: string[]): Promise<SOLIDReport> {
    const allResults: SOLIDValidationResults[] = [];

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
    const solidReport = await this.validateFiles(filePaths);

    const allViolations = [
      ...solidReport.results.srp.violations,
      ...solidReport.results.ocp.violations,
      ...solidReport.results.lsp.violations,
      ...solidReport.results.isp.violations,
      ...solidReport.results.dip.violations,
    ];

    return {
      agent: 'SOLID Validator',
      timestamp: new Date(),
      filesAnalyzed: filePaths.length,
      violations: allViolations.map(v => ({
        severity: v.severity || 'medium',
        location: v.location,
        description: v.description,
        recommendation: v.recommendation,
        documentationReference: v.documentationReference,
        exampleCode: v.exampleCode,
        principle: 'SOLID',
      })),
      complianceScore: solidReport.summary.complianceScore,
      references: solidReport.references,
      summary: solidReport.summary,
    };
  }

  /**
   * Generate comprehensive SOLID validation report
   */
  private generateReport(results: SOLIDValidationResults, filePaths: string[]): SOLIDReport {
    const totalViolations =
      results.srp.violations.length +
      results.ocp.violations.length +
      results.lsp.violations.length +
      results.isp.violations.length +
      results.dip.violations.length;

    const criticalIssues = [
      ...results.srp.violations.filter(v => v.severity === 'critical'),
      ...results.dip.violations.filter(v => v.severity === 'critical'),
    ].length;

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
  private calculateComplianceScore(results: SOLIDValidationResults): number {
    const weights = {
      srp: 25,
      ocp: 20,
      lsp: 20,
      isp: 15,
      dip: 20,
    };

    let totalScore = 0;
    if (results.srp.compliant) totalScore += weights.srp;
    if (results.ocp.compliant) totalScore += weights.ocp;
    if (results.lsp.compliant) totalScore += weights.lsp;
    if (results.isp.compliant) totalScore += weights.isp;
    if (results.dip.compliant) totalScore += weights.dip;

    return totalScore;
  }

  /**
   * Generate prioritized recommendations
   */
  private generateRecommendations(results: SOLIDValidationResults): string[] {
    const recommendations: string[] = [];

    if (results.dip.violations.length > 0) {
      recommendations.push('🔴 CRITICAL: Fix Dependency Inversion violations');
    }
    if (results.srp.violations.length > 0) {
      recommendations.push('🔴 HIGH: Address Single Responsibility violations');
    }
    if (results.ocp.violations.length > 0) {
      recommendations.push('🟡 MEDIUM: Refactor Open/Closed violations');
    }
    if (results.lsp.violations.length > 0) {
      recommendations.push('🟡 MEDIUM: Fix Liskov Substitution violations');
    }
    if (results.isp.violations.length > 0) {
      recommendations.push('🟢 LOW: Consider splitting fat interfaces');
    }

    return recommendations;
  }

  /**
   * Generate documentation references
   */
  private generateReferences(): string[] {
    return [
      'docs/specs/principles/SOLID.md',
      'docs/specs/principles/solid-gang-of-four.md',
      'docs/specs/principles/design-principles-overview.md',
      'docs/specs/patterns/behavioral/strategy.md',
      'docs/specs/patterns/creational/factory-method.md',
    ];
  }

  /**
   * Merge results from multiple files
   */
  private mergeResults(allResults: SOLIDValidationResults[]): SOLIDValidationResults {
    const merged: SOLIDValidationResults = {
      srp: { principle: 'Single Responsibility Principle', compliant: true, confidence: 100, violations: [] },
      ocp: { principle: 'Open/Closed Principle', compliant: true, confidence: 100, violations: [] },
      lsp: { principle: 'Liskov Substitution Principle', compliant: true, confidence: 100, violations: [] },
      isp: { principle: 'Interface Segregation Principle', compliant: true, confidence: 100, violations: [] },
      dip: { principle: 'Dependency Inversion Principle', compliant: true, confidence: 100, violations: [] },
    };

    for (const results of allResults) {
      merged.srp.violations.push(...results.srp.violations);
      merged.ocp.violations.push(...results.ocp.violations);
      merged.lsp.violations.push(...results.lsp.violations);
      merged.isp.violations.push(...results.isp.violations);
      merged.dip.violations.push(...results.dip.violations);
    }

    merged.srp.compliant = merged.srp.violations.length === 0;
    merged.ocp.compliant = merged.ocp.violations.length === 0;
    merged.lsp.compliant = merged.lsp.violations.length === 0;
    merged.isp.compliant = merged.isp.violations.length === 0;
    merged.dip.compliant = merged.dip.violations.length === 0;

    return merged;
  }
}

// Export types
export * from './types.js';
