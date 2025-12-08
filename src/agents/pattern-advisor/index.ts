/**
 * Pattern Advisor Agent
 * Recommends design patterns based on code analysis
 */

import { KnowledgeBase } from '../../shared/knowledge-base/index.js';
import { CreationalPatternAnalyzer } from './tools/creational-pattern-analyzer.js';
import { StructuralPatternAnalyzer } from './tools/structural-pattern-analyzer.js';
import { BehavioralPatternAnalyzer } from './tools/behavioral-pattern-analyzer.js';
import type {
  PatternAnalysisResults,
  PatternAdvisorReport,
  AnalyzeForPatternsInput,
  PatternCategory,
} from './types.js';
import type { AgentReport } from '../../shared/types/index.js';

export class PatternAdvisorAgent {
  private kb: KnowledgeBase;
  private creationalAnalyzer: CreationalPatternAnalyzer;
  private structuralAnalyzer: StructuralPatternAnalyzer;
  private behavioralAnalyzer: BehavioralPatternAnalyzer;

  constructor(knowledgeBasePath?: string) {
    this.kb = new KnowledgeBase(knowledgeBasePath);
    this.creationalAnalyzer = new CreationalPatternAnalyzer(this.kb);
    this.structuralAnalyzer = new StructuralPatternAnalyzer(this.kb);
    this.behavioralAnalyzer = new BehavioralPatternAnalyzer(this.kb);
  }

  async analyzeFile(filePath: string): Promise<PatternAdvisorReport> {
    const input: AnalyzeForPatternsInput = { filePath };

    const results: PatternAnalysisResults = {
      creational: await this.creationalAnalyzer.analyze(input),
      structural: await this.structuralAnalyzer.analyze(input),
      behavioral: await this.behavioralAnalyzer.analyze(input),
    };

    return this.generateReport(results, [filePath]);
  }

  async analyzeFiles(filePaths: string[]): Promise<PatternAdvisorReport> {
    const allResults: PatternAnalysisResults[] = [];

    for (const filePath of filePaths) {
      const report = await this.analyzeFile(filePath);
      allResults.push(report.results);
    }

    const mergedResults = this.mergeResults(allResults);
    return this.generateReport(mergedResults, filePaths);
  }

  async analyze(filePaths: string[]): Promise<AgentReport> {
    const patternReport = await this.analyzeFiles(filePaths);

    const allRecommendations = [
      ...patternReport.results.creational.recommendations,
      ...patternReport.results.structural.recommendations,
      ...patternReport.results.behavioral.recommendations,
    ];

    return {
      agent: 'Pattern Advisor',
      timestamp: new Date(),
      filesAnalyzed: filePaths.length,
      violations: allRecommendations.map(r => ({
        severity: r.priority === 'high' ? 'high' : r.priority === 'medium' ? 'medium' : 'low',
        location: r.location,
        description: `${r.pattern} pattern recommended: ${r.problem}`,
        recommendation: r.solution,
        documentationReference: r.documentationReference,
        exampleCode: r.exampleCode,
        category: r.pattern,
        principle: 'Design Patterns',
      })),
      complianceScore: this.calculateComplianceScore(patternReport),
      references: patternReport.references,
      summary: patternReport.summary,
    };
  }

  private generateReport(
    results: PatternAnalysisResults,
    filePaths: string[]
  ): PatternAdvisorReport {
    const allRecommendations = [
      ...results.creational.recommendations,
      ...results.structural.recommendations,
      ...results.behavioral.recommendations,
    ];

    const totalRecommendations = allRecommendations.length;
    const highPriorityRecommendations = allRecommendations.filter(r => r.priority === 'high').length;

    const patternsByCategory: Record<PatternCategory, number> = {
      creational: results.creational.recommendations.length,
      structural: results.structural.recommendations.length,
      behavioral: results.behavioral.recommendations.length,
    };

    const topRecommendations = allRecommendations
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] - priorityOrder[a.priority]) || (b.confidence - a.confidence);
      })
      .slice(0, 5);

    return {
      summary: {
        filesAnalyzed: filePaths.length,
        totalRecommendations,
        highPriorityRecommendations,
        patternsByCategory,
      },
      results,
      topRecommendations,
      references: this.generateReferences(),
    };
  }

  private calculateComplianceScore(report: PatternAdvisorReport): number {
    const highPriorityCount = report.summary.highPriorityRecommendations;
    
    if (highPriorityCount === 0) return 100;
    if (highPriorityCount === 1) return 85;
    if (highPriorityCount === 2) return 70;
    if (highPriorityCount === 3) return 55;
    return 40;
  }

  private generateReferences(): string[] {
    return [
      'docs/specs/patterns/gang-of-four-quick-reference.md',
      'docs/specs/patterns/creational/factory-method.md',
      'docs/specs/patterns/behavioral/strategy.md',
      'docs/specs/patterns/behavioral/observer.md',
      'docs/specs/patterns/structural/decorator.md',
    ];
  }

  private mergeResults(allResults: PatternAnalysisResults[]): PatternAnalysisResults {
    const merged: PatternAnalysisResults = {
      creational: { compliant: true, confidence: 100, recommendations: [] },
      structural: { compliant: true, confidence: 100, recommendations: [] },
      behavioral: { compliant: true, confidence: 100, recommendations: [] },
    };

    for (const results of allResults) {
      merged.creational.recommendations.push(...results.creational.recommendations);
      merged.structural.recommendations.push(...results.structural.recommendations);
      merged.behavioral.recommendations.push(...results.behavioral.recommendations);
    }

    merged.creational.compliant = merged.creational.recommendations.filter(r => r.priority === 'high').length === 0;
    merged.structural.compliant = merged.structural.recommendations.filter(r => r.priority === 'high').length === 0;
    merged.behavioral.compliant = merged.behavioral.recommendations.filter(r => r.priority === 'high').length === 0;

    return merged;
  }
}

export * from './types.js';
