/**
 * Package Cohesion Analyzer
 * Validates REP, CCP, and CRP principles
 */

import { readFile } from 'fs/promises';
import type {
  CohesionAnalysisResult,
  PackageViolation,
  AnalyzePackageInput,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';

export class PackageCohesionAnalyzer {
  constructor(_kb: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async analyze(input: AnalyzePackageInput): Promise<CohesionAnalysisResult> {
    const violations: PackageViolation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      violations.push(...this.checkREP(code, input.filePath));
      violations.push(...this.checkCCP(code, input.filePath, input.allFiles));
      violations.push(...this.checkCRP(code, input.filePath));

      const criticalCount = violations.filter(v => v.severity === 'critical').length;

      return {
        compliant: criticalCount === 0,
        confidence: 75,
        violations,
      };
    } catch (error) {
      throw new Error(`Package cohesion analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private checkREP(code: string, filePath: string): PackageViolation[] {
    const violations: PackageViolation[] = [];

    const hasVersioning = /version|changelog|release/gi.test(code);
    const hasMultipleUnrelatedClasses = (code.match(/export\s+class\s+\w+/g) || []).length > 5;

    if (hasMultipleUnrelatedClasses && !hasVersioning) {
      violations.push({
        violationType: 'cohesion_violation',
        principle: 'REP',
        location: filePath,
        description: 'REP - Reuse/Release Equivalence: Package contains many unrelated classes',
        recommendation: 'Group classes that are released together. Classes in a package should form a cohesive unit.',
        severity: 'medium',
      });
    }

    const internalDependencies = code.match(/from\s+['"]\.\.\//g);
    if (internalDependencies && internalDependencies.length > 10) {
      violations.push({
        violationType: 'cohesion_violation',
        principle: 'REP',
        location: filePath,
        description: 'REP violation: Excessive internal dependencies suggest poor package boundaries',
        recommendation: 'Define clear package boundaries. Classes should be reusable as a cohesive group.',
        severity: 'medium',
      });
    }

    return violations;
  }

  private checkCCP(code: string, filePath: string, allFiles: string[]): PackageViolation[] {
    const violations: PackageViolation[] = [];

    const packageDir = filePath.split('/').slice(0, -1).join('/');
    const packageFiles = allFiles.filter(f => f.startsWith(packageDir));

    const reasons = new Map<string, number>();
    const reasonPatterns = [
      /authentication|auth/gi,
      /validation|validate/gi,
      /formatting|format/gi,
      /logging|log/gi,
      /persistence|database|db/gi,
    ];

    for (const pattern of reasonPatterns) {
      const matchingFiles = packageFiles.filter(() => {
        try {
          const content = code;
          return pattern.test(content);
        } catch {
          return false;
        }
      });

      if (matchingFiles.length > 0) {
        reasons.set(pattern.source, matchingFiles.length);
      }
    }

    if (reasons.size > 3) {
      violations.push({
        violationType: 'cohesion_violation',
        principle: 'CCP',
        location: filePath,
        description: `CCP - Common Closure: Package contains ${reasons.size} different reasons to change`,
        recommendation: 'Group classes that change together. Classes affected by same changes should be in same package.',
        severity: 'high',
      });
    }

    return violations;
  }

  private checkCRP(code: string, filePath: string): PackageViolation[] {
    const violations: PackageViolation[] = [];

    const imports = code.match(/import\s+{([^}]+)}\s+from/g) || [];

    let totalImports = 0;
    let usedImports = 0;

    for (const importStatement of imports) {
      const importedItems = importStatement.match(/{([^}]+)}/)?.[1].split(',') || [];
      totalImports += importedItems.length;

      for (const item of importedItems) {
        const itemName = item.trim().split(/\s+as\s+/)[0].trim();
        const usagePattern = new RegExp(`\\b${itemName}\\b`, 'g');
        const usageCount = (code.match(usagePattern) || []).length;

        if (usageCount > 1) {
          usedImports++;
        }
      }
    }

    if (totalImports > 0) {
      const usageRatio = usedImports / totalImports;

      if (usageRatio < 0.5 && totalImports > 5) {
        violations.push({
          violationType: 'cohesion_violation',
          principle: 'CRP',
          location: filePath,
          description: `CRP - Common Reuse: Only ${Math.round(usageRatio * 100)}% of imported items are actually used`,
          recommendation: 'Split packages so clients only depend on what they actually use. Avoid fat interfaces.',
          severity: 'medium',
        });
      }
    }

    return violations;
  }
}
