/**
 * Dependency Rule Validator
 * Validates that dependencies point inward (toward higher-level policies)
 */

import { readFile } from 'fs/promises';
import type {
  DependencyRuleResult,
  ArchitectureViolation,
  ValidateArchitectureInput,
  ArchitectureLayer,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';

export class DependencyRuleValidator {
  private readonly layerHierarchy: Record<ArchitectureLayer, number> = {
    Entities: 4,
    UseCases: 3,
    InterfaceAdapters: 2,
    Frameworks: 1,
  };

  private readonly frameworkIndicators = [
    'express', 'fastify', 'nest', 'react', 'vue', 'angular',
    'axios', 'fetch', 'http', 'request',
    'mongoose', 'typeorm', 'prisma', 'sequelize',
    'winston', 'pino', 'morgan',
  ];

  constructor(_knowledgeBase: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async validate(input: ValidateArchitectureInput): Promise<DependencyRuleResult> {
    const violations: ArchitectureViolation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');
      const currentLayer = input.layer || this.detectLayer(input.filePath, code);

      const dependencyViolations = await this.checkDependencyDirection(
        code,
        input.filePath,
        currentLayer
      );
      violations.push(...dependencyViolations);

      const circularViolations = this.checkCircularDependencies(code, input.filePath);
      violations.push(...circularViolations);

      return {
        compliant: violations.length === 0,
        confidence: this.calculateConfidence(violations, currentLayer),
        violations,
      };
    } catch (error) {
      throw new Error(`Dependency rule validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async checkDependencyDirection(
    code: string,
    filePath: string,
    currentLayer: ArchitectureLayer
  ): Promise<ArchitectureViolation[]> {
    const violations: ArchitectureViolation[] = [];
    const currentLayerLevel = this.layerHierarchy[currentLayer];

    const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
    const imports = [...code.matchAll(importRegex)];

    for (const match of imports) {
      const importPath = match[1];
      const targetLayer = this.detectLayerFromImport(importPath);

      if (targetLayer) {
        const targetLayerLevel = this.layerHierarchy[targetLayer];

        if (targetLayerLevel < currentLayerLevel) {
          violations.push({
            violationType: 'dependency_rule',
            location: filePath,
            description: `${currentLayer} layer depends on outer ${targetLayer} layer (violates Dependency Rule)`,
            recommendation: 'Invert dependency using interfaces/abstractions. Inner layers should not know about outer layers.',
            documentationReference: 'docs/specs/architecture/clean-architecture-principles.md',
            severity: 'critical',
            sourceLayer: currentLayer,
            targetLayer,
            dependency: importPath,
            exampleCode: {
              before: `// UseCase depending on Framework\nimport { Express } from 'express';\nclass UseCase { app: Express; }`,
              after: `// UseCase depending on abstraction\ninterface HttpServer { listen(): void; }\nclass UseCase { server: HttpServer; }`,
            },
          });
        }
      }

      if (this.isFrameworkDependency(importPath) && currentLayer !== 'Frameworks') {
        violations.push({
          violationType: 'framework_coupling',
          location: filePath,
          description: `${currentLayer} layer directly imports framework: ${importPath}`,
          recommendation: 'Isolate framework dependencies in Frameworks layer. Use abstractions in inner layers.',
          documentationReference: 'docs/specs/architecture/boundaries.md',
          severity: currentLayer === 'Entities' ? 'critical' : 'high',
          sourceLayer: currentLayer,
          dependency: importPath,
          exampleCode: {
            before: `import express from 'express';`,
            after: `// Define interface in inner layer\ninterface HttpServer { ... }\n// Implement in frameworks layer\nclass ExpressAdapter implements HttpServer { ... }`,
          },
        });
      }
    }

    return violations;
  }

  private checkCircularDependencies(code: string, filePath: string): ArchitectureViolation[] {
    const violations: ArchitectureViolation[] = [];

    const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
    const imports = [...code.matchAll(importRegex)].map(m => m[1]);

    const relativeSelfImports = imports.filter(imp =>
      imp.includes('..') && imp.split('/').filter(p => p === '..').length > 2
    );

    if (relativeSelfImports.length > 0) {
      violations.push({
        violationType: 'circular_dependency',
        location: filePath,
        description: 'Potential circular dependency detected through deep relative imports',
        recommendation: 'Refactor to use dependency inversion. Create abstractions to break cycles.',
        documentationReference: 'docs/specs/architecture/clean-architecture-principles.md',
        severity: 'high',
        dependency: relativeSelfImports[0],
        exampleCode: {
          before: `import { A } from '../../../moduleA';\n// Creates cycle: A -> B -> C -> A`,
          after: `// Break cycle with interface\ninterface IService { ... }\n// Both depend on abstraction`,
        },
      });
    }

    return violations;
  }

  private detectLayer(filePath: string, code: string): ArchitectureLayer {
    const pathLower = filePath.toLowerCase();

    if (pathLower.includes('entity') || pathLower.includes('entities') || pathLower.includes('domain')) {
      return 'Entities';
    }
    if (pathLower.includes('usecase') || pathLower.includes('use-case') || pathLower.includes('application')) {
      return 'UseCases';
    }
    if (pathLower.includes('controller') || pathLower.includes('presenter') || pathLower.includes('gateway') || pathLower.includes('adapter')) {
      return 'InterfaceAdapters';
    }
    if (pathLower.includes('framework') || pathLower.includes('infrastructure') || pathLower.includes('config')) {
      return 'Frameworks';
    }

    if (/class\s+\w+Entity|interface\s+\w+Entity/i.test(code)) {
      return 'Entities';
    }
    if (/class\s+\w+UseCase|class\s+\w+Interactor/i.test(code)) {
      return 'UseCases';
    }
    if (/class\s+\w+Controller|class\s+\w+Presenter/i.test(code)) {
      return 'InterfaceAdapters';
    }

    return 'Frameworks';
  }

  private detectLayerFromImport(importPath: string): ArchitectureLayer | null {
    const pathLower = importPath.toLowerCase();

    if (pathLower.includes('entity') || pathLower.includes('entities') || pathLower.includes('domain')) {
      return 'Entities';
    }
    if (pathLower.includes('usecase') || pathLower.includes('use-case') || pathLower.includes('application')) {
      return 'UseCases';
    }
    if (pathLower.includes('controller') || pathLower.includes('presenter') || pathLower.includes('gateway') || pathLower.includes('adapter')) {
      return 'InterfaceAdapters';
    }
    if (pathLower.includes('framework') || pathLower.includes('infrastructure') || pathLower.includes('config')) {
      return 'Frameworks';
    }

    return null;
  }

  private isFrameworkDependency(importPath: string): boolean {
    return this.frameworkIndicators.some(indicator =>
      importPath.toLowerCase().includes(indicator)
    );
  }

  private calculateConfidence(violations: ArchitectureViolation[], layer: ArchitectureLayer): number {
    if (violations.length === 0) return 100;

    if (layer === 'Frameworks') return 60;

    const criticalCount = violations.filter(v => v.severity === 'critical').length;
    if (criticalCount >= 2) return 95;
    if (criticalCount === 1) return 90;
    return 80;
  }
}
