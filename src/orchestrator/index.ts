/**
 * Architecture Toolkit Orchestrator
 * Coordinates multiple agents to provide comprehensive architecture analysis
 */

import { SOLIDValidatorAgent } from '../agents/solid-validator/index.js';
import { ArchitectureReviewerAgent } from '../agents/architecture-reviewer/index.js';
import { CleanCodeAnalyzerAgent } from '../agents/clean-code-analyzer/index.js';
import { PatternAdvisorAgent } from '../agents/pattern-advisor/index.js';
import { TestingStrategyAgent } from '../agents/testing-strategy/index.js';
import { PackageDesignAgent } from '../agents/package-design/index.js';
import { PatternRefactoringGuideAgent } from '../agents/pattern-refactoring-guide/index.js';
import type {
  ComprehensiveReport,
  AgentReport,
  AnalysisOptions,
  PrioritizedRecommendation,
  Severity,
} from '../shared/types/index.js';

export class ArchitectureToolkit {
  private knowledgeBasePath?: string;

  constructor(knowledgeBasePath?: string) {
    this.knowledgeBasePath = knowledgeBasePath;
  }

  /**
   * Analyze files with all enabled agents
   */
  async analyze(filePaths: string[], options?: AnalysisOptions): Promise<ComprehensiveReport> {
    const reports: { [key: string]: AgentReport } = {};

    if (options?.agents?.solid !== false) {
      const solidValidator = new SOLIDValidatorAgent(this.knowledgeBasePath);
      reports.solid = await solidValidator.analyze(filePaths);
    }

    if (options?.agents?.architecture !== false) {
      const architectureReviewer = new ArchitectureReviewerAgent(this.knowledgeBasePath);
      reports.architecture = await architectureReviewer.analyze(filePaths);
    }

    if (options?.agents?.cleanCode !== false) {
      const cleanCodeAnalyzer = new CleanCodeAnalyzerAgent(this.knowledgeBasePath);
      reports.cleanCode = await cleanCodeAnalyzer.analyze(filePaths);
    }

    if (options?.agents?.patterns !== false) {
      const patternAdvisor = new PatternAdvisorAgent(this.knowledgeBasePath);
      reports.patterns = await patternAdvisor.analyze(filePaths);
    }

    if (options?.agents?.testing !== false) {
      const testingStrategy = new TestingStrategyAgent(this.knowledgeBasePath || '');
      reports.testing = await testingStrategy.analyze(filePaths);
    }

    if (options?.agents?.packageDesign !== false) {
      const packageDesign = new PackageDesignAgent(this.knowledgeBasePath || '');
      reports.packageDesign = await packageDesign.analyze(filePaths);
    }

    if (options?.agents?.refactoring !== false) {
      const refactoringGuide = new PatternRefactoringGuideAgent(this.knowledgeBasePath || '');
      reports.refactoring = await refactoringGuide.analyze(filePaths);
    }

    return this.generateComprehensiveReport(reports, filePaths);
  }

  /**
   * Generate comprehensive report from all agent reports
   */
  private generateComprehensiveReport(
    reports: { [key: string]: AgentReport },
    filePaths: string[]
  ): ComprehensiveReport {
    const allViolations = Object.values(reports).flatMap(r => r.violations);

    const criticalIssues = allViolations.filter(v => v.severity === 'critical').length;
    const highIssues = allViolations.filter(v => v.severity === 'high').length;
    const mediumIssues = allViolations.filter(v => v.severity === 'medium').length;
    const lowIssues = allViolations.filter(v => v.severity === 'low').length;

    const totalViolations = allViolations.length;
    const maxScore = Object.keys(reports).length * 100;
    const actualScore = Object.values(reports).reduce((sum, r) => sum + r.complianceScore, 0);
    const overallCompliance = maxScore > 0 ? Math.round((actualScore / maxScore) * 100) : 100;

    const allReferences = Array.from(
      new Set(Object.values(reports).flatMap(r => r.references))
    );

    const recommendations = this.generatePrioritizedRecommendations(reports, allViolations);

    return {
      summary: {
        totalFiles: filePaths.length,
        totalViolations,
        overallCompliance,
        criticalIssues,
        highIssues,
        mediumIssues,
        lowIssues,
      },
      agents: reports,
      recommendations,
      references: allReferences,
    };
  }

  /**
   * Generate prioritized recommendations across all agents
   */
  private generatePrioritizedRecommendations(
    reports: { [key: string]: AgentReport },
    allViolations: Array<{ severity: Severity; location: string; description: string }>
  ): PrioritizedRecommendation[] {
    const recommendations: PrioritizedRecommendation[] = [];

    const criticalViolations = allViolations.filter(v => v.severity === 'critical');
    if (criticalViolations.length > 0) {
      recommendations.push({
        priority: 1,
        severity: 'critical',
        category: 'Critical Issues',
        recommendation: `Fix ${criticalViolations.length} critical issue(s) immediately`,
        affectedFiles: Array.from(new Set(criticalViolations.map(v => v.location.split(':')[0]))),
        estimatedEffort: criticalViolations.length > 5 ? 'high' : 'medium',
      });
    }

    const highViolations = allViolations.filter(v => v.severity === 'high');
    if (highViolations.length > 0) {
      recommendations.push({
        priority: 2,
        severity: 'high',
        category: 'High Priority',
        recommendation: `Address ${highViolations.length} high-priority issue(s)`,
        affectedFiles: Array.from(new Set(highViolations.map(v => v.location.split(':')[0]))),
        estimatedEffort: highViolations.length > 10 ? 'high' : 'medium',
      });
    }

    if (Object.keys(reports).length === 1) {
      recommendations.push({
        priority: 3,
        severity: 'medium',
        category: 'Architecture Analysis',
        recommendation: 'Run additional agents for comprehensive architecture review',
        affectedFiles: [],
        estimatedEffort: 'low',
      });
    }

    return recommendations;
  }

  /**
   * Print comprehensive report to console
   */
  printReport(report: ComprehensiveReport): void {
    console.log('\n=== Architecture Toolkit Analysis ===\n');

    console.log('Summary:');
    console.log(`  Files Analyzed: ${report.summary.totalFiles}`);
    console.log(`  Total Violations: ${report.summary.totalViolations}`);
    console.log(`  Overall Compliance: ${report.summary.overallCompliance}%`);
    console.log(`  Critical Issues: ${report.summary.criticalIssues}`);
    console.log(`  High Issues: ${report.summary.highIssues}`);
    console.log(`  Medium Issues: ${report.summary.mediumIssues}`);
    console.log(`  Low Issues: ${report.summary.lowIssues}`);

    console.log('\nAgent Reports:');
    for (const agentReport of Object.values(report.agents)) {
      console.log(`\n  ${agentReport.agent}:`);
      console.log(`    Compliance Score: ${agentReport.complianceScore}%`);
      console.log(`    Violations Found: ${agentReport.violations.length}`);

      if (agentReport.violations.length > 0) {
        console.log('    Top Issues:');
        agentReport.violations.slice(0, 3).forEach((v, i) => {
          console.log(`      ${i + 1}. [${v.severity.toUpperCase()}] ${v.description}`);
          console.log(`         Location: ${v.location}`);
        });
      }
    }

    console.log('\nPrioritized Recommendations:');
    report.recommendations.forEach((rec, i) => {
      console.log(`  ${i + 1}. [${rec.severity.toUpperCase()}] ${rec.recommendation}`);
      if (rec.affectedFiles.length > 0) {
        console.log(`     Affected: ${rec.affectedFiles.slice(0, 3).join(', ')}${rec.affectedFiles.length > 3 ? '...' : ''}`);
      }
    });

    console.log('\nDocumentation References:');
    report.references.slice(0, 5).forEach(ref => {
      console.log(`  - ${ref}`);
    });

    console.log('\n');
  }
}
