/**
 * Pattern Refactoring Guide Agent
 * Provides step-by-step refactoring plans for code improvements
 */

import { KnowledgeBase } from '../../shared/knowledge-base/index.js';
import { RefactoringAnalyzer } from './tools/refactoring-analyzer.js';
import { PatternTransformationGuide } from './tools/pattern-transformation-guide.js';
import { CodeSmellRefactoringGuide } from './tools/code-smell-refactoring-guide.js';
import type {
  PatternRefactoringReport,
  AnalyzeRefactoringInput,
} from './types.js';
import type { AgentReport } from '../../shared/types/index.js';

export class PatternRefactoringGuideAgent {
  private knowledgeBase: KnowledgeBase;
  private refactoringAnalyzer: RefactoringAnalyzer;
  private patternTransformationGuide: PatternTransformationGuide;
  private codeSmellRefactoringGuide: CodeSmellRefactoringGuide;

  constructor(knowledgeBasePath: string) {
    this.knowledgeBase = new KnowledgeBase(knowledgeBasePath);
    this.refactoringAnalyzer = new RefactoringAnalyzer(this.knowledgeBase);
    this.patternTransformationGuide = new PatternTransformationGuide(this.knowledgeBase);
    this.codeSmellRefactoringGuide = new CodeSmellRefactoringGuide(this.knowledgeBase);
  }

  async analyze(filePaths: string[]): Promise<AgentReport> {
    const report = await this.analyzeRefactorings(filePaths);

    const allOpportunities = [
      ...report.results.refactoringAnalysis.opportunities,
      ...report.results.patternTransformation.opportunities,
      ...report.results.codeSmellRefactoring.opportunities,
    ];

    return {
      agent: 'Pattern Refactoring Guide',
      timestamp: new Date(),
      filesAnalyzed: filePaths.length,
      violations: allOpportunities.map(o => ({
        severity: this.mapPriorityToSeverity(o.priority),
        category: o.type,
        description: o.description,
        location: o.location,
        recommendation: `${o.expectedOutcome}\n\nSteps:\n${o.steps.map(s => `${s.stepNumber}. ${s.action}`).join('\n')}`,
        documentationReference: '',
        principle: 'Refactoring',
      })),
      complianceScore: this.calculateComplianceScore(allOpportunities),
      references: [],
    };
  }

  private async analyzeRefactorings(filePaths: string[]): Promise<PatternRefactoringReport> {
    const refactoringResults = [];
    const patternResults = [];
    const codeSmellResults = [];

    for (const filePath of filePaths) {
      const input: AnalyzeRefactoringInput = { filePath };

      refactoringResults.push(await this.refactoringAnalyzer.analyze(input));
      patternResults.push(await this.patternTransformationGuide.analyze(input));
      codeSmellResults.push(await this.codeSmellRefactoringGuide.analyze(input));
    }

    const allOpportunities = [
      ...refactoringResults.flatMap(r => r.opportunities),
      ...patternResults.flatMap(r => r.opportunities),
      ...codeSmellResults.flatMap(r => r.opportunities),
    ];

    const priorityCounts = this.countPriorities(allOpportunities);
    const totalEffort = this.estimateTotalEffort(allOpportunities);

    return {
      summary: {
        totalOpportunities: allOpportunities.length,
        criticalRefactorings: priorityCounts.critical,
        highPriorityRefactorings: priorityCounts.high,
        mediumPriorityRefactorings: priorityCounts.medium,
        lowPriorityRefactorings: priorityCounts.low,
        estimatedTotalEffort: totalEffort,
      },
      results: {
        refactoringAnalysis: this.mergeResults(refactoringResults),
        patternTransformation: this.mergeResults(patternResults),
        codeSmellRefactoring: this.mergeResults(codeSmellResults),
      },
    };
  }

  private mergeResults<T extends { opportunities: any[]; compliant: boolean; confidence: number }>(
    results: T[]
  ): T {
    return {
      compliant: results.every(r => r.compliant),
      confidence: Math.round(results.reduce((sum, r) => sum + r.confidence, 0) / results.length),
      opportunities: results.flatMap(r => r.opportunities),
    } as T;
  }

  private countPriorities(opportunities: any[]) {
    return {
      critical: opportunities.filter(o => o.priority === 'critical').length,
      high: opportunities.filter(o => o.priority === 'high').length,
      medium: opportunities.filter(o => o.priority === 'medium').length,
      low: opportunities.filter(o => o.priority === 'low').length,
    };
  }

  private estimateTotalEffort(opportunities: any[]): string {
    const effortMap: { [key: string]: number } = { low: 1, medium: 3, high: 8 };
    const totalPoints = opportunities.reduce((sum, o) => sum + (effortMap[o.estimatedEffort] || 0), 0);

    if (totalPoints < 5) return 'Low (< 1 day)';
    if (totalPoints < 15) return 'Medium (1-3 days)';
    if (totalPoints < 40) return 'High (1-2 weeks)';
    return 'Very High (> 2 weeks)';
  }

  private calculateComplianceScore(opportunities: any[]): number {
    const weights: { [key: string]: number } = { critical: 10, high: 5, medium: 2, low: 1 };
    const totalWeight = opportunities.reduce((sum, o) => sum + (weights[o.priority] || 0), 0);
    const maxPossibleWeight = opportunities.length * 10;

    return maxPossibleWeight === 0 ? 100 : Math.max(0, Math.round((1 - totalWeight / maxPossibleWeight) * 100));
  }

  private mapPriorityToSeverity(priority: string): 'critical' | 'high' | 'medium' | 'low' {
    return priority as 'critical' | 'high' | 'medium' | 'low';
  }
}
