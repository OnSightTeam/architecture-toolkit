/**
 * Dependency Inversion Principle Validator
 * Detects high-level modules depending on low-level modules
 */

import { readFile } from 'fs/promises';
import type { DIPResult, DIPViolation, ValidateCodeInput } from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';
import { languageDetector } from '../../../shared/language-detector/index.js';

export class DIPValidator {
  private kb: KnowledgeBase;

  // Low-level module indicators (infrastructure concerns)
  private readonly lowLevelIndicators = [
    'Database', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
    'File', 'FileSystem', 'Stream',
    'Http', 'Socket', 'Network',
    'Email', 'SMTP',
    'Logger', 'Console',
  ];

  constructor(knowledgeBase: KnowledgeBase) {
    this.kb = knowledgeBase;
  }

  /**
   * Validate Dependency Inversion Principle compliance
   */
  async validate(input: ValidateCodeInput): Promise<DIPResult> {
    const violations: DIPViolation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      // Check for concrete dependencies
      const concreteDeps = await this.checkConcreteDependencies(code, input);
      violations.push(...concreteDeps);

      // Check for new keyword usage with infrastructure classes
      const newViolations = await this.checkNewKeywordUsage(code, input);
      violations.push(...newViolations);

      const confidence = this.calculateConfidence(violations);
      const compliant = violations.length === 0;

      return {
        principle: 'Dependency Inversion Principle',
        compliant,
        confidence,
        violations,
      };
    } catch (error) {
      throw new Error(`DIP validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Check for concrete low-level dependencies
   */
  private async checkConcreteDependencies(
    code: string,
    input: ValidateCodeInput
  ): Promise<DIPViolation[]> {
    const violations: DIPViolation[] = [];
    const language = languageDetector.detect(input.filePath);
    const patterns = languageDetector.getPatterns(language);

    for (const lowLevel of this.lowLevelIndicators) {
      const imports = code.match(patterns.importStatement) || [];
      const hasLowLevelImport = imports.some(imp => imp.includes(lowLevel));
      const dependencyRegex = new RegExp(`:\\s*${lowLevel}\\b`, 'i');

      if (hasLowLevelImport || dependencyRegex.test(code)) {
        // Check if it's likely a business logic class (high-level)
        const isBusinessLogic = this.isBusinessLogicClass(code);

        if (isBusinessLogic) {
          violations.push({
            location: `${input.filePath}:${input.className || 'class'}`,
            description: `High-level business logic depends on low-level ${lowLevel} implementation`,
            violationType: 'concrete_dependency',
            highLevelModule: input.className || 'BusinessLogic',
            lowLevelDependency: lowLevel,
            currentDependency: `Direct dependency on ${lowLevel}`,
            suggestedAbstraction: `I${lowLevel}Repository or ${lowLevel.replace(/Database|MySQL|File/, '')}Service`,
            refactoringSteps: [
              '1. Create abstraction interface for data operations',
              '2. Make business logic depend on interface',
              `3. Implement interface with ${lowLevel} adapter`,
              '4. Inject implementation through constructor/DI',
            ],
            patternReference: 'Dependency Injection',
            documentationReference: this.kb.getDocumentationReference('DIP', 'dependency-inversion-principle'),
            recommendation: 'Introduce abstraction layer between business logic and infrastructure',
            severity: 'critical',
            exampleCode: {
              before: `class OrderService {\n  private db = new MySQL();\n  processOrder() { this.db.save(); }\n}`,
              after: `interface OrderRepository {\n  save(order): void;\n}\n\nclass OrderService {\n  constructor(private repo: OrderRepository) {}\n  processOrder() { this.repo.save(); }\n}`,
            },
          });
        }
      }
    }

    return violations;
  }

  /**
   * Check for new keyword with infrastructure classes
   */
  private async checkNewKeywordUsage(
    code: string,
    input: ValidateCodeInput
  ): Promise<DIPViolation[]> {
    const violations: DIPViolation[] = [];

    // Find all 'new' instantiations
    const newRegex = /new\s+(\w+)/g;
    const matches = [...code.matchAll(newRegex)];

    for (const match of matches) {
      const className = match[1];

      // Check if this is a low-level infrastructure class
      const isLowLevel = this.lowLevelIndicators.some(indicator =>
        className.includes(indicator)
      );

      if (isLowLevel && this.isBusinessLogicClass(code)) {
        violations.push({
          location: `${input.filePath}:${input.className || 'class'}`,
          description: `Business logic directly instantiates infrastructure class '${className}'`,
          violationType: 'concrete_dependency',
          highLevelModule: input.className || 'BusinessLogic',
          lowLevelDependency: className,
          currentDependency: `new ${className}()`,
          suggestedAbstraction: `I${className}`,
          refactoringSteps: [
            '1. Define interface for required operations',
            '2. Remove direct instantiation',
            '3. Accept interface in constructor',
            '4. Use dependency injection framework or factory',
          ],
          patternReference: 'Dependency Injection',
          documentationReference: this.kb.getDocumentationReference('DIP'),
          recommendation: 'Use constructor injection instead of direct instantiation',
          severity: 'high',
          exampleCode: {
            before: `private db = new MySQLDatabase();`,
            after: `constructor(private db: IDatabaseConnection) {}`,
          },
        });
      }
    }

    return violations;
  }

  /**
   * Determine if class is likely business logic (high-level)
   */
  private isBusinessLogicClass(code: string): boolean {
    const businessIndicators = [
      'Order', 'Customer', 'Product', 'Invoice', 'Payment',
      'User', 'Account', 'Transaction', 'Cart',
      'Service', 'Manager', 'Controller', 'Handler',
      'calculate', 'process', 'validate', 'execute',
    ];

    return businessIndicators.some(indicator =>
      new RegExp(indicator, 'i').test(code)
    );
  }

  /**
   * Calculate confidence score for DIP validation
   */
  private calculateConfidence(violations: DIPViolation[]): number {
    if (violations.length === 0) return 100;

    // High confidence when we detect clear infrastructure dependencies
    const criticalViolations = violations.filter(v => v.severity === 'critical').length;

    if (criticalViolations >= 2) return 95;
    if (criticalViolations === 1) return 90;
    return 80;
  }
}
