/**
 * Structural Pattern Analyzer
 * Identifies opportunities for structural design patterns
 */

import { readFile } from 'fs/promises';
import type {
  StructuralPatternResult,
  PatternRecommendation,
  AnalyzeForPatternsInput,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';

export class StructuralPatternAnalyzer {
  constructor(_kb: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async analyze(input: AnalyzeForPatternsInput): Promise<StructuralPatternResult> {
    const recommendations: PatternRecommendation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      recommendations.push(...this.detectDecoratorOpportunity(code, input.filePath));
      recommendations.push(...this.detectAdapterOpportunity(code, input.filePath));
      recommendations.push(...this.detectFacadeOpportunity(code, input.filePath));

      return {
        compliant: recommendations.filter(r => r.priority === 'high').length === 0,
        confidence: 80,
        recommendations,
      };
    } catch (error) {
      throw new Error(`Structural pattern analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private detectDecoratorOpportunity(code: string, filePath: string): PatternRecommendation[] {
    const recommendations: PatternRecommendation[] = [];

    // Detect functionality being added conditionally
    const conditionalFeatures = /if\s*\([^)]*\)\s*{[^}]*(wrap|add|extend|enhance)/i;
    if (conditionalFeatures.test(code)) {
      recommendations.push({
        pattern: 'Decorator',
        category: 'structural',
        location: filePath,
        problem: 'Conditional logic adds features/responsibilities dynamically',
        solution: 'Use Decorator pattern to add responsibilities without inheritance',
        reasoning: 'Decorator provides flexible alternative to subclassing for extending functionality',
        confidence: 75,
        priority: 'medium',
        documentationReference: 'docs/specs/patterns/structural/decorator.md',
        exampleCode: {
          before: `if (encrypt) data = encryptData(data);\nif (compress) data = compressData(data);`,
          after: `let stream = new FileStream();\nstream = new EncryptDecorator(stream);\nstream = new CompressDecorator(stream);`,
        },
        alternatives: ['Chain of Responsibility'],
        tradeoffs: {
          pros: ['Flexible composition', 'Open/Closed compliant', 'Single Responsibility'],
          cons: ['Many small objects', 'Complexity in configuration'],
        },
      });
    }

    return recommendations;
  }

  private detectAdapterOpportunity(code: string, filePath: string): PatternRecommendation[] {
    const recommendations: PatternRecommendation[] = [];

    // Detect interface conversion/wrapping
    const conversionPattern = /convert|transform|adapt|wrap.*interface/i;
    if (conversionPattern.test(code)) {
      recommendations.push({
        pattern: 'Adapter',
        category: 'structural',
        location: filePath,
        problem: 'Code converts between incompatible interfaces',
        solution: 'Use Adapter pattern to make interfaces compatible',
        reasoning: 'Adapter allows collaboration between classes with incompatible interfaces',
        confidence: 80,
        priority: 'medium',
        documentationReference: 'docs/specs/patterns/structural/adapter.md',
        exampleCode: {
          before: `const legacyData = legacy.getData();\nconst newData = convertFormat(legacyData);`,
          after: `class LegacyAdapter implements NewInterface {\n  constructor(private legacy: LegacySystem) {}\n  getData() { return adapt(legacy.getData()); }\n}`,
        },
        tradeoffs: {
          pros: ['Reuses existing code', 'Single Responsibility', 'Open/Closed'],
          cons: ['Additional class', 'Potential performance overhead'],
        },
      });
    }

    return recommendations;
  }

  private detectFacadeOpportunity(code: string, filePath: string): PatternRecommendation[] {
    const recommendations: PatternRecommendation[] = [];

    // Detect complex subsystem usage
    const complexCalls = code.match(/\w+\.\w+\.\w+\(/g);
    if (complexCalls && complexCalls.length > 5) {
      recommendations.push({
        pattern: 'Facade',
        category: 'structural',
        location: filePath,
        problem: 'Complex interactions with multiple subsystem classes',
        solution: 'Use Facade pattern to provide simplified interface to complex subsystem',
        reasoning: 'Facade reduces coupling and provides easier-to-use interface',
        confidence: 70,
        priority: 'medium',
        documentationReference: 'docs/specs/patterns/structural/facade.md',
        exampleCode: {
          before: `subsystem1.init();\nsubsystem2.configure();\nsubsystem3.start();\nsubsystem1.process();`,
          after: `class SystemFacade {\n  initialize() {\n    // Handles all subsystem complexity\n  }\n}`,
        },
        tradeoffs: {
          pros: ['Simplified interface', 'Loose coupling', 'Easier to use'],
          cons: ['May hide useful subsystem features', 'Additional layer'],
        },
      });
    }

    return recommendations;
  }
}
