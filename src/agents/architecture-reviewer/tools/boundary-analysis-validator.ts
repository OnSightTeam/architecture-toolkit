/**
 * Boundary Analysis Validator
 * Validates architectural boundaries and interfaces
 */

import { readFile } from 'fs/promises';
import type {
  BoundaryAnalysisResult,
  ArchitectureViolation,
  ValidateArchitectureInput,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';

export class BoundaryAnalysisValidator {
  constructor(_knowledgeBase: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async validate(input: ValidateArchitectureInput): Promise<BoundaryAnalysisResult> {
    const violations: ArchitectureViolation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      const missingInterfaces = this.checkMissingBoundaryInterfaces(code, input.filePath);
      violations.push(...missingInterfaces);

      const dataStructureLeaks = this.checkDataStructureLeaks(code, input.filePath);
      violations.push(...dataStructureLeaks);

      const boundaryCrossing = this.checkImproperBoundaryCrossing(code, input.filePath);
      violations.push(...boundaryCrossing);

      return {
        compliant: violations.length === 0,
        confidence: violations.length === 0 ? 100 : 80,
        violations,
      };
    } catch (error) {
      throw new Error(`Boundary analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private checkMissingBoundaryInterfaces(code: string, filePath: string): ArchitectureViolation[] {
    const violations: ArchitectureViolation[] = [];

    const hasUseCaseClass = /class\s+\w+(UseCase|Interactor)/i.test(code);
    const hasConcreteRepository = /new\s+\w+(Repository|Gateway|DataSource)/i.test(code);

    if (hasUseCaseClass && hasConcreteRepository) {
      violations.push({
        violationType: 'boundary_crossing',
        location: filePath,
        description: 'Use Case directly instantiates concrete repository (missing boundary interface)',
        recommendation: 'Define repository interface at boundary. Inject implementation through constructor.',
        documentationReference: 'docs/specs/architecture/boundaries.md',
        severity: 'high',
        exampleCode: {
          before: `class CreateUserUseCase {\n  repo = new UserRepository(); // Concrete\n}`,
          after: `interface UserRepository { save(user): void; }\n\nclass CreateUserUseCase {\n  constructor(private repo: UserRepository) {}\n}`,
        },
      });
    }

    const hasControllerWithoutPort = /class\s+\w+Controller/i.test(code) &&
      !/interface\s+\w+(UseCase|Port|Input)/i.test(code) &&
      /new\s+\w+UseCase/i.test(code);

    if (hasControllerWithoutPort) {
      violations.push({
        violationType: 'boundary_crossing',
        location: filePath,
        description: 'Controller directly instantiates Use Case (missing input port interface)',
        recommendation: 'Define input port interface. Controller should depend on interface, not concrete Use Case.',
        documentationReference: 'docs/specs/architecture/boundaries.md',
        severity: 'medium',
        exampleCode: {
          before: `class UserController {\n  useCase = new CreateUserUseCase();\n}`,
          after: `interface CreateUserPort { execute(dto): Result; }\n\nclass UserController {\n  constructor(private useCase: CreateUserPort) {}\n}`,
        },
      });
    }

    return violations;
  }

  private checkDataStructureLeaks(code: string, filePath: string): ArchitectureViolation[] {
    const violations: ArchitectureViolation[] = [];

    const ormEntityExposed = /return\s+.*Entity|:\s+.*Entity\[|Promise<.*Entity>/i.test(code);
    const isController = /class\s+\w+Controller/i.test(code);

    if (ormEntityExposed && isController) {
      violations.push({
        violationType: 'boundary_crossing',
        location: filePath,
        description: 'Database entity leaked through boundary to controller (data structure exposure)',
        recommendation: 'Use DTOs to cross boundaries. Map entities to DTOs at boundary. Never expose internal data structures.',
        documentationReference: 'docs/specs/architecture/boundaries.md',
        severity: 'critical',
        exampleCode: {
          before: `class UserController {\n  getUser(): UserEntity { // DB entity exposed\n    return db.users.find(id);\n  }\n}`,
          after: `class UserController {\n  getUser(): UserDTO { // DTO exposed\n    const entity = useCase.execute();\n    return mapper.toDTO(entity);\n  }\n}`,
        },
      });
    }

    const httpRequestLeaked = /request\.|req\./i.test(code);
    const isUseCase = /class\s+\w+(UseCase|Interactor)/i.test(code);

    if (httpRequestLeaked && isUseCase) {
      violations.push({
        violationType: 'boundary_crossing',
        location: filePath,
        description: 'HTTP request object leaked into Use Case layer (framework detail exposure)',
        recommendation: 'Extract only needed data from request. Pass primitive values or simple DTOs to Use Case.',
        documentationReference: 'docs/specs/architecture/boundaries.md',
        severity: 'critical',
        exampleCode: {
          before: `class CreateUserUseCase {\n  execute(request: Request) { // Framework type\n    const name = request.body.name;\n  }\n}`,
          after: `interface CreateUserDTO { name: string; email: string; }\n\nclass CreateUserUseCase {\n  execute(dto: CreateUserDTO) { // Clean DTO\n    // ...\n  }\n}`,
        },
      });
    }

    return violations;
  }

  private checkImproperBoundaryCrossing(code: string, filePath: string): ArchitectureViolation[] {
    const violations: ArchitectureViolation[] = [];

    const multipleLayerImports = this.countLayerImports(code);

    if (multipleLayerImports >= 3) {
      violations.push({
        violationType: 'boundary_crossing',
        location: filePath,
        description: `File imports from ${multipleLayerImports} different architectural layers (tight coupling)`,
        recommendation: 'Files should primarily interact with adjacent layers. Refactor to respect layer boundaries.',
        documentationReference: 'docs/specs/architecture/clean-architecture-principles.md',
        severity: 'medium',
        exampleCode: {
          before: `// Controller imports from entities, use-cases, AND frameworks\nimport { Entity } from '../entities';\nimport { UseCase } from '../use-cases';\nimport { Express } from 'express';`,
          after: `// Controller only imports from use-cases layer\nimport { CreateUserPort } from '../use-cases';`,
        },
      });
    }

    return violations;
  }

  private countLayerImports(code: string): number {
    const layers = ['entities', 'entity', 'domain', 'use-case', 'usecase', 'application', 'controller', 'adapter', 'framework', 'infrastructure'];
    const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
    const imports = [...code.matchAll(importRegex)].map(m => m[1].toLowerCase());

    const layersFound = new Set<string>();
    for (const imp of imports) {
      for (const layer of layers) {
        if (imp.includes(layer)) {
          layersFound.add(layer);
        }
      }
    }

    return layersFound.size;
  }
}
