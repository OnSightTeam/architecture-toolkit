/**
 * Creational Pattern Analyzer
 * Identifies opportunities for creational design patterns
 */

import { readFile } from 'fs/promises';
import type {
  CreationalPatternResult,
  PatternRecommendation,
  AnalyzeForPatternsInput,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';

export class CreationalPatternAnalyzer {
  constructor(_kb: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async analyze(input: AnalyzeForPatternsInput): Promise<CreationalPatternResult> {
    const recommendations: PatternRecommendation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      recommendations.push(...this.detectFactoryMethodOpportunity(code, input.filePath));
      recommendations.push(...this.detectBuilderOpportunity(code, input.filePath));
      recommendations.push(...this.detectSingletonMisuse(code, input.filePath));

      return {
        compliant: recommendations.filter(r => r.priority === 'high').length === 0,
        confidence: 85,
        recommendations,
      };
    } catch (error) {
      throw new Error(`Creational pattern analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private detectFactoryMethodOpportunity(code: string, filePath: string): PatternRecommendation[] {
    const recommendations: PatternRecommendation[] = [];

    // Detect switch on type followed by object creation
    const switchOnTypePattern = /switch\s*\([^)]*type[^)]*\)\s*{[^}]*new\s+/i;
    if (switchOnTypePattern.test(code)) {
      recommendations.push({
        pattern: 'Factory Method',
        category: 'creational',
        location: filePath,
        problem: 'Switch statement creates different types of objects based on a type parameter',
        solution: 'Use Factory Method pattern to encapsulate object creation logic',
        reasoning: 'Factory Method eliminates switch statements and follows Open/Closed Principle',
        confidence: 90,
        priority: 'high',
        documentationReference: 'docs/specs/patterns/creational/factory-method.md',
        exampleCode: {
          before: `switch(type) {\n  case 'A': return new TypeA();\n  case 'B': return new TypeB();\n}`,
          after: `class Factory {\n  create(type) {\n    return this.creators[type].create();\n  }\n}`,
        },
        alternatives: ['Abstract Factory (if multiple product families)', 'Strategy (if behavior varies)'],
        tradeoffs: {
          pros: ['Open/Closed compliant', 'Easy to add new types', 'Single Responsibility'],
          cons: ['More classes', 'Slight complexity increase'],
        },
      });
    }

    // Detect multiple new operators with similar constructors
    const newOperators = code.match(/new\s+\w+\([^)]*\)/g);
    if (newOperators && newOperators.length > 5) {
      const uniqueConstructors = new Set(newOperators.map(n => n.match(/new\s+(\w+)/)?.[1]));
      if (uniqueConstructors.size > 3) {
        recommendations.push({
          pattern: 'Factory Method',
          category: 'creational',
          location: filePath,
          problem: `Multiple object instantiations (${uniqueConstructors.size} different types) scattered throughout code`,
          solution: 'Centralize object creation in Factory Method',
          reasoning: 'Reduces coupling and makes code more maintainable',
          confidence: 75,
          priority: 'medium',
          documentationReference: 'docs/specs/patterns/creational/factory-method.md',
        });
      }
    }

    return recommendations;
  }

  private detectBuilderOpportunity(code: string, filePath: string): PatternRecommendation[] {
    const recommendations: PatternRecommendation[] = [];

    // Detect constructors with many parameters
    const constructorPattern = /constructor\s*\(([^)]+)\)/g;
    const matches = [...code.matchAll(constructorPattern)];

    for (const match of matches) {
      const params = match[1].split(',');
      if (params.length > 4) {
        recommendations.push({
          pattern: 'Builder',
          category: 'creational',
          location: filePath,
          problem: `Constructor has ${params.length} parameters (telescoping constructor anti-pattern)`,
          solution: 'Use Builder pattern for step-by-step object construction',
          reasoning: 'Builder provides fluent interface and handles optional parameters elegantly',
          confidence: 85,
          priority: 'high',
          documentationReference: 'docs/specs/patterns/creational/builder.md',
          exampleCode: {
            before: `new User(name, email, age, address, phone, role, dept, manager)`,
            after: `new UserBuilder()\n  .withName(name)\n  .withEmail(email)\n  .withRole(role)\n  .build()`,
          },
          tradeoffs: {
            pros: ['Clear object construction', 'Handles optional parameters', 'Immutable objects'],
            cons: ['More code', 'Additional builder class needed'],
          },
        });
      }
    }

    return recommendations;
  }

  private detectSingletonMisuse(code: string, filePath: string): PatternRecommendation[] {
    const recommendations: PatternRecommendation[] = [];

    // Detect singleton pattern implementation
    const singletonPattern = /private\s+static\s+instance|getInstance\s*\(\)/i;
    if (singletonPattern.test(code)) {
      recommendations.push({
        pattern: 'Singleton',
        category: 'creational',
        location: filePath,
        problem: 'Singleton pattern detected (often overused anti-pattern)',
        solution: 'Consider dependency injection instead of Singleton',
        reasoning: 'Singletons create hidden dependencies and make testing difficult',
        confidence: 70,
        priority: 'medium',
        documentationReference: 'docs/specs/patterns/creational/singleton.md',
        alternatives: ['Dependency Injection', 'Monostate pattern'],
        tradeoffs: {
          pros: ['Global access', 'Single instance guaranteed'],
          cons: ['Hidden dependencies', 'Hard to test', 'Violates SRP', 'Global state'],
        },
      });
    }

    return recommendations;
  }
}
