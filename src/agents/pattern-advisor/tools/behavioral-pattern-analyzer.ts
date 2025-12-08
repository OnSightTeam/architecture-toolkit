/**
 * Behavioral Pattern Analyzer
 * Identifies opportunities for behavioral design patterns
 */

import { readFile } from 'fs/promises';
import type {
  BehavioralPatternResult,
  PatternRecommendation,
  AnalyzeForPatternsInput,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';

export class BehavioralPatternAnalyzer {
  constructor(_kb: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async analyze(input: AnalyzeForPatternsInput): Promise<BehavioralPatternResult> {
    const recommendations: PatternRecommendation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      recommendations.push(...this.detectStrategyOpportunity(code, input.filePath));
      recommendations.push(...this.detectObserverOpportunity(code, input.filePath));
      recommendations.push(...this.detectCommandOpportunity(code, input.filePath));
      recommendations.push(...this.detectTemplateMethodOpportunity(code, input.filePath));

      return {
        compliant: recommendations.filter(r => r.priority === 'high').length === 0,
        confidence: 85,
        recommendations,
      };
    } catch (error) {
      throw new Error(`Behavioral pattern analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private detectStrategyOpportunity(code: string, filePath: string): PatternRecommendation[] {
    const recommendations: PatternRecommendation[] = [];

    // Detect switch or if-else on behavior
    const behaviorSwitchPattern = /switch\s*\([^)]*\)\s*{[^}]*(calculate|process|execute|validate|format)/i;
    if (behaviorSwitchPattern.test(code)) {
      recommendations.push({
        pattern: 'Strategy',
        category: 'behavioral',
        location: filePath,
        problem: 'Switch statement selects different algorithms/behaviors at runtime',
        solution: 'Use Strategy pattern to encapsulate interchangeable algorithms',
        reasoning: 'Strategy allows algorithm selection at runtime while maintaining Open/Closed Principle',
        confidence: 90,
        priority: 'high',
        documentationReference: 'docs/specs/patterns/behavioral/strategy.md',
        exampleCode: {
          before: `switch(type) {\n  case 'discount': return price * 0.9;\n  case 'tax': return price * 1.1;\n}`,
          after: `interface PriceStrategy {\n  calculate(price): number;\n}\ncontext.setStrategy(new DiscountStrategy());`,
        },
        tradeoffs: {
          pros: ['Open/Closed compliant', 'Runtime algorithm selection', 'Testable strategies'],
          cons: ['More classes', 'Client must know strategies'],
        },
      });
    }

    return recommendations;
  }

  private detectObserverOpportunity(code: string, filePath: string): PatternRecommendation[] {
    const recommendations: PatternRecommendation[] = [];

    // Detect manual notification pattern
    const manualNotifyPattern = /\.(notify|update|inform|broadcast)\w*\([^)]*\)/gi;
    const matches = code.match(manualNotifyPattern);

    if (matches && matches.length > 3) {
      recommendations.push({
        pattern: 'Observer',
        category: 'behavioral',
        location: filePath,
        problem: 'Multiple manual notification calls suggest tight coupling between objects',
        solution: 'Use Observer pattern for loose coupling and automatic notifications',
        reasoning: 'Observer decouples objects and allows dynamic subscription',
        confidence: 75,
        priority: 'medium',
        documentationReference: 'docs/specs/patterns/behavioral/observer.md',
        exampleCode: {
          before: `obj1.update(data);\nobj2.update(data);\nobj3.update(data);`,
          after: `subject.attach(observer1);\nsubject.notify(); // All observers updated`,
        },
        alternatives: ['Event Bus', 'Pub/Sub'],
        tradeoffs: {
          pros: ['Loose coupling', 'Dynamic subscription', 'Broadcast capability'],
          cons: ['Potential memory leaks', 'Unexpected updates', 'Update order unclear'],
        },
      });
    }

    return recommendations;
  }

  private detectCommandOpportunity(code: string, filePath: string): PatternRecommendation[] {
    const recommendations: PatternRecommendation[] = [];

    // Detect undo/redo or queuing operations
    const undoRedoPattern = /\b(undo|redo|history|queue|execute)\b/gi;
    const matches = code.match(undoRedoPattern);

    if (matches && matches.length > 4) {
      recommendations.push({
        pattern: 'Command',
        category: 'behavioral',
        location: filePath,
        problem: 'Code suggests need for undo/redo, queuing, or operation logging',
        solution: 'Use Command pattern to encapsulate requests as objects',
        reasoning: 'Command enables undo/redo, queuing, and logging of operations',
        confidence: 80,
        priority: 'high',
        documentationReference: 'docs/specs/patterns/behavioral/command.md',
        exampleCode: {
          before: `function executeAction(action) {\n  // No undo capability\n}`,
          after: `class Command {\n  execute() { ... }\n  undo() { ... }\n}\nhistory.push(command);`,
        },
        tradeoffs: {
          pros: ['Undo/redo support', 'Macro commands', 'Queuing operations', 'Logging'],
          cons: ['Many small classes', 'Increased complexity'],
        },
      });
    }

    return recommendations;
  }

  private detectTemplateMethodOpportunity(code: string, filePath: string): PatternRecommendation[] {
    const recommendations: PatternRecommendation[] = [];

    // Detect similar algorithms with variations
    const duplicateStructure = /function\s+\w+\([^)]*\)\s*{[^}]*(initialize|process|cleanup)/gi;
    const matches = code.match(duplicateStructure);

    if (matches && matches.length > 2) {
      recommendations.push({
        pattern: 'Template Method',
        category: 'behavioral',
        location: filePath,
        problem: 'Multiple methods with similar structure but different details',
        solution: 'Use Template Method to define algorithm skeleton with customizable steps',
        reasoning: 'Template Method eliminates duplication while allowing customization',
        confidence: 70,
        priority: 'medium',
        documentationReference: 'docs/specs/patterns/behavioral/template-method.md',
        exampleCode: {
          before: `processA() { init(); doA(); cleanup(); }\nprocessB() { init(); doB(); cleanup(); }`,
          after: `abstract class Process {\n  template() { init(); doStep(); cleanup(); }\n  abstract doStep();\n}`,
        },
        tradeoffs: {
          pros: ['Reuses common code', 'Controls algorithm structure', 'Easy to extend'],
          cons: ['Inheritance-based', 'Less flexible than Strategy'],
        },
      });
    }

    return recommendations;
  }
}
