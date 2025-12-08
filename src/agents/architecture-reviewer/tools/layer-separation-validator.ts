/**
 * Layer Separation Validator
 * Validates proper separation between architectural layers
 */

import { readFile } from 'fs/promises';
import type {
  LayerSeparationResult,
  ArchitectureViolation,
  ValidateArchitectureInput,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';

export class LayerSeparationValidator {
  private readonly infrastructureConcerns = [
    'database', 'http', 'file', 'cache', 'queue', 'email',
    'logger', 'metrics', 'config', 'environment',
  ];

  private readonly businessRuleIndicators = [
    'validate', 'calculate', 'process', 'execute', 'apply',
    'business', 'rule', 'policy', 'workflow',
  ];

  constructor(_knowledgeBase: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async validate(input: ValidateArchitectureInput): Promise<LayerSeparationResult> {
    const violations: ArchitectureViolation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      const mixedConcerns = this.checkMixedConcerns(code, input.filePath);
      violations.push(...mixedConcerns);

      const directDbAccess = this.checkDirectDatabaseAccess(code, input.filePath);
      violations.push(...directDbAccess);

      const uiLogicMixing = this.checkUIBusinessLogicMixing(code, input.filePath);
      violations.push(...uiLogicMixing);

      return {
        compliant: violations.length === 0,
        confidence: violations.length === 0 ? 100 : 85,
        violations,
      };
    } catch (error) {
      throw new Error(`Layer separation validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private checkMixedConcerns(code: string, filePath: string): ArchitectureViolation[] {
    const violations: ArchitectureViolation[] = [];

    const hasBusinessLogic = this.businessRuleIndicators.some(indicator =>
      new RegExp(`\\b${indicator}\\w*\\b`, 'i').test(code)
    );

    const hasInfrastructure = this.infrastructureConcerns.some(concern =>
      new RegExp(`\\b${concern}\\w*\\b`, 'i').test(code)
    );

    if (hasBusinessLogic && hasInfrastructure) {
      violations.push({
        violationType: 'layer_separation',
        location: filePath,
        description: 'Business logic mixed with infrastructure concerns in same file',
        recommendation: 'Separate business rules (Use Cases) from infrastructure (Frameworks). Use ports and adapters pattern.',
        documentationReference: 'docs/specs/architecture/boundaries.md',
        severity: 'high',
        exampleCode: {
          before: `class OrderService {\n  processOrder() {\n    // business logic\n    db.save(); // infrastructure\n  }\n}`,
          after: `// Use Case (business logic)\nclass ProcessOrder {\n  execute(repo: OrderRepository) { ... }\n}\n// Framework (infrastructure)\nclass DbOrderRepository implements OrderRepository { ... }`,
        },
      });
    }

    return violations;
  }

  private checkDirectDatabaseAccess(code: string, filePath: string): ArchitectureViolation[] {
    const violations: ArchitectureViolation[] = [];

    const dbPatterns = [
      /\bdb\./i,
      /\bdatabase\./i,
      /\bmongodb\./i,
      /\bprisma\./i,
      /SELECT\s+.*\s+FROM/i,
      /INSERT\s+INTO/i,
      /UPDATE\s+.*\s+SET/i,
    ];

    const hasDbAccess = dbPatterns.some(pattern => pattern.test(code));
    const hasUseCasePattern = /class\s+\w+(UseCase|Interactor|Service)/i.test(code);

    if (hasDbAccess && hasUseCasePattern) {
      violations.push({
        violationType: 'layer_separation',
        location: filePath,
        description: 'Use Case directly accesses database (violates layer separation)',
        recommendation: 'Use Repository pattern. Define repository interface in Use Cases layer, implement in Frameworks layer.',
        documentationReference: 'docs/specs/architecture/boundaries.md',
        severity: 'critical',
        exampleCode: {
          before: `class CreateUserUseCase {\n  execute() {\n    db.users.insert(user); // Direct DB access\n  }\n}`,
          after: `// Use Case with interface\nclass CreateUserUseCase {\n  constructor(private repo: UserRepository) {}\n  execute() {\n    this.repo.save(user); // Through interface\n  }\n}`,
        },
      });
    }

    return violations;
  }

  private checkUIBusinessLogicMixing(code: string, filePath: string): ArchitectureViolation[] {
    const violations: ArchitectureViolation[] = [];

    const uiIndicators = ['component', 'render', 'jsx', 'tsx', 'props', 'state', 'onclick'];
    const hasUI = uiIndicators.some(indicator =>
      new RegExp(`\\b${indicator}\\b`, 'i').test(code)
    );

    const complexBusinessLogic = /\b(calculate|validate|process)\w*\([^)]*\)\s*{[^}]{100,}/i.test(code);

    if (hasUI && complexBusinessLogic) {
      violations.push({
        violationType: 'layer_separation',
        location: filePath,
        description: 'Complex business logic embedded in UI component',
        recommendation: 'Extract business logic to Use Case layer. Keep UI components thin, focused on presentation.',
        documentationReference: 'docs/specs/architecture/clean-architecture-principles.md',
        severity: 'medium',
        exampleCode: {
          before: `function OrderComponent() {\n  const handleSubmit = () => {\n    // 50 lines of business logic\n    if (complex validation) { ... }\n  }\n}`,
          after: `// UI Component\nfunction OrderComponent() {\n  const handleSubmit = () => {\n    processOrderUseCase.execute(order);\n  }\n}\n// Use Case\nclass ProcessOrder { ... }`,
        },
      });
    }

    return violations;
  }
}
