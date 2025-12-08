/**
 * Clean Code Analyzer Agent
 * Validates code against Clean Code principles
 */

import { KnowledgeBase } from '../../shared/knowledge-base/index.js';
import { NamingValidator } from './tools/naming-validator.js';
import { FunctionValidator } from './tools/function-validator.js';
import { CommentValidator } from './tools/comment-validator.js';
import { CodeSmellValidator } from './tools/code-smell-validator.js';
import type {
  CleanCodeValidationResults,
  CleanCodeReport,
  ValidateCleanCodeInput,
  CodeSmellCategory,
} from './types.js';
import type { AgentReport } from '../../shared/types/index.js';

export class CleanCodeAnalyzerAgent {
  private kb: KnowledgeBase;
  private namingValidator: NamingValidator;
  private functionValidator: FunctionValidator;
  private commentValidator: CommentValidator;
  private codeSmellValidator: CodeSmellValidator;

  constructor(knowledgeBasePath?: string) {
    this.kb = new KnowledgeBase(knowledgeBasePath);
    this.namingValidator = new NamingValidator(this.kb);
    this.functionValidator = new FunctionValidator(this.kb);
    this.commentValidator = new CommentValidator(this.kb);
    this.codeSmellValidator = new CodeSmellValidator(this.kb);
  }

  async validateFile(filePath: string): Promise<CleanCodeReport> {
    const input: ValidateCleanCodeInput = { filePath };

    const results: CleanCodeValidationResults = {
      naming: await this.namingValidator.validate(input),
      functionQuality: await this.functionValidator.validate(input),
      commentQuality: await this.commentValidator.validate(input),
      codeSmells: await this.codeSmellValidator.validate(input),
    };

    return this.generateReport(results, [filePath]);
  }

  async validateFiles(filePaths: string[]): Promise<CleanCodeReport> {
    const allResults: CleanCodeValidationResults[] = [];

    for (const filePath of filePaths) {
      const report = await this.validateFile(filePath);
      allResults.push(report.results);
    }

    const mergedResults = this.mergeResults(allResults);
    return this.generateReport(mergedResults, filePaths);
  }

  async analyze(filePaths: string[]): Promise<AgentReport> {
    const cleanCodeReport = await this.validateFiles(filePaths);

    const allViolations = [
      ...cleanCodeReport.results.naming.violations,
      ...cleanCodeReport.results.functionQuality.violations,
      ...cleanCodeReport.results.commentQuality.violations,
      ...cleanCodeReport.results.codeSmells.violations,
    ];

    return {
      agent: 'Clean Code Analyzer',
      timestamp: new Date(),
      filesAnalyzed: filePaths.length,
      violations: allViolations.map(v => ({
        severity: v.severity,
        location: v.location,
        description: v.description,
        recommendation: v.recommendation,
        documentationReference: v.documentationReference,
        exampleCode: v.exampleCode,
        category: v.smellId,
        principle: 'Clean Code',
      })),
      complianceScore: cleanCodeReport.summary.complianceScore,
      references: cleanCodeReport.references,
      summary: cleanCodeReport.summary,
    };
  }

  private generateReport(
    results: CleanCodeValidationResults,
    filePaths: string[]
  ): CleanCodeReport {
    const allViolations = [
      ...results.naming.violations,
      ...results.functionQuality.violations,
      ...results.commentQuality.violations,
      ...results.codeSmells.violations,
    ];

    const totalViolations = allViolations.length;
    const criticalIssues = allViolations.filter(v => v.severity === 'critical').length;

    const smellsByCategory: Record<CodeSmellCategory, number> = {
      naming: results.naming.violations.length,
      function: results.functionQuality.violations.length,
      comment: results.commentQuality.violations.length,
      general: results.codeSmells.violations.filter(v => v.category === 'general').length,
      'error-handling': results.codeSmells.violations.filter(v => v.category === 'error-handling').length,
    };

    const complianceScore = this.calculateComplianceScore(results);

    return {
      summary: {
        filesAnalyzed: filePaths.length,
        totalViolations,
        complianceScore,
        criticalIssues,
        smellsByCategory,
      },
      results,
      recommendations: this.generateRecommendations(results, smellsByCategory),
      references: this.generateReferences(),
    };
  }

  private calculateComplianceScore(results: CleanCodeValidationResults): number {
    const weights = {
      naming: 25,
      functionQuality: 30,
      commentQuality: 15,
      codeSmells: 30,
    };

    let totalScore = 0;
    if (results.naming.compliant) totalScore += weights.naming;
    if (results.functionQuality.compliant) totalScore += weights.functionQuality;
    if (results.commentQuality.compliant) totalScore += weights.commentQuality;
    if (results.codeSmells.compliant) totalScore += weights.codeSmells;

    return totalScore;
  }

  private generateRecommendations(
    results: CleanCodeValidationResults,
    smellsByCategory: Record<CodeSmellCategory, number>
  ): string[] {
    const recommendations: string[] = [];

    if (smellsByCategory['error-handling'] > 0) {
      recommendations.push('🔴 CRITICAL: Fix error handling issues (empty catch blocks, swallowed exceptions)');
    }

    if (results.functionQuality.violations.some(v => v.smellId === 'F2')) {
      recommendations.push('🟡 HIGH: Reduce parameter counts (max 3 parameters)');
    }

    if (smellsByCategory.general > 0) {
      const duplication = results.codeSmells.violations.filter(v => v.smellId === 'G5');
      if (duplication.length > 0) {
        recommendations.push('🟡 HIGH: Eliminate code duplication (DRY principle)');
      }
    }

    if (smellsByCategory.naming > 5) {
      recommendations.push('🟡 MEDIUM: Improve naming conventions across codebase');
    }

    if (smellsByCategory.function > 3) {
      recommendations.push('🟢 MEDIUM: Break down large methods into smaller units');
    }

    if (smellsByCategory.comment > 5) {
      recommendations.push('🟢 LOW: Clean up comments (remove obsolete, redundant, commented-out code)');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Code follows Clean Code principles');
    }

    return recommendations;
  }

  private generateReferences(): string[] {
    return [
      'docs/specs/practices/clean-code-principles.md',
      'docs/specs/practices/naming-conventions.md',
      'docs/specs/practices/functions-and-methods.md',
      'docs/specs/practices/comments-and-documentation.md',
      'docs/specs/practices/code-smells.md',
      'docs/specs/practices/error-handling.md',
    ];
  }

  private mergeResults(allResults: CleanCodeValidationResults[]): CleanCodeValidationResults {
    const merged: CleanCodeValidationResults = {
      naming: { compliant: true, confidence: 100, violations: [] },
      functionQuality: { compliant: true, confidence: 100, violations: [] },
      commentQuality: { compliant: true, confidence: 100, violations: [] },
      codeSmells: { compliant: true, confidence: 100, violations: [] },
    };

    for (const results of allResults) {
      merged.naming.violations.push(...results.naming.violations);
      merged.functionQuality.violations.push(...results.functionQuality.violations);
      merged.commentQuality.violations.push(...results.commentQuality.violations);
      merged.codeSmells.violations.push(...results.codeSmells.violations);
    }

    merged.naming.compliant = merged.naming.violations.length === 0;
    merged.functionQuality.compliant = merged.functionQuality.violations.length === 0;
    merged.commentQuality.compliant = merged.commentQuality.violations.length === 0;
    merged.codeSmells.compliant = merged.codeSmells.violations.length === 0;

    return merged;
  }
}

export * from './types.js';
