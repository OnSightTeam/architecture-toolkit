/**
 * Stability Metrics Calculator
 * Calculates package stability, abstractness, and distance from main sequence
 */

import { readFile } from 'fs/promises';
import type {
  StabilityMetricsResult,
  PackageViolation,
  AnalyzePackageInput,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';

export class StabilityMetricsCalculator {
  constructor(_kb: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async analyze(input: AnalyzePackageInput): Promise<StabilityMetricsResult> {
    const violations: PackageViolation[] = [];
    const metrics: { [packageName: string]: { stability: number; abstractness: number; distance: number } } = {};

    try {
      const code = await readFile(input.filePath, 'utf-8');
      const packageName = this.getPackageName(input.filePath);

      const stability = this.calculateStability(code, input.allFiles, packageName);
      const abstractness = this.calculateAbstractness(code);
      const distance = Math.abs(abstractness + stability - 1);

      metrics[packageName] = { stability, abstractness, distance };

      violations.push(...this.analyzeMetrics(packageName, stability, abstractness, distance, input.filePath));

      return {
        compliant: violations.filter(v => v.severity === 'critical').length === 0,
        confidence: 85,
        violations,
        metrics,
      };
    } catch (error) {
      throw new Error(`Stability metrics calculation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private calculateStability(code: string, allFiles: string[], currentPackage: string): number {
    const efferent = this.countEfferentCoupling(code);
    const afferent = this.countAfferentCoupling(currentPackage, allFiles);

    const total = efferent + afferent;
    return total === 0 ? 0 : efferent / total;
  }

  private countEfferentCoupling(code: string): number {
    const imports = code.match(/import\s+.*from\s+['"][^'"]+['"]/g) || [];
    const internalImports = imports.filter(imp => /from\s+['"][.\/]/.test(imp));
    return internalImports.length;
  }

  private countAfferentCoupling(packageName: string, allFiles: string[]): number {
    let count = 0;

    for (const file of allFiles) {
      if (file.includes(packageName)) continue;

      try {
        const dependsOnPackage = file.includes(packageName);
        if (dependsOnPackage) count++;
      } catch {
        // Skip files that can't be read
      }
    }

    return count;
  }

  private calculateAbstractness(code: string): number {
    const abstractTypes = (code.match(/\b(abstract\s+class|interface)\s+/g) || []).length;
    const concreteTypes = (code.match(/\bclass\s+(?!.*abstract)/g) || []).length;

    const total = abstractTypes + concreteTypes;
    return total === 0 ? 0 : abstractTypes / total;
  }

  private analyzeMetrics(
    packageName: string,
    stability: number,
    abstractness: number,
    distance: number,
    filePath: string
  ): PackageViolation[] {
    const violations: PackageViolation[] = [];

    if (distance > 0.7) {
      const isZoneOfPain = stability < 0.5 && abstractness < 0.5;
      const zone = isZoneOfPain ? 'Zone of Pain' : 'Zone of Uselessness';

      violations.push({
        violationType: 'stability_violation',
        location: filePath,
        description: `Package "${packageName}" is in ${zone} (D=${distance.toFixed(2)})`,
        recommendation: isZoneOfPain
          ? 'Too stable and concrete. Add abstractions (interfaces) to improve flexibility.'
          : 'Too unstable and abstract. Add concrete implementations or reduce abstractions.',
        severity: 'high',
        metrics: { stability, abstractness, distance },
      });
    }

    if (stability > 0.8 && abstractness < 0.2) {
      violations.push({
        violationType: 'stability_violation',
        location: filePath,
        description: `Package "${packageName}" is highly stable (${stability.toFixed(2)}) but not abstract (${abstractness.toFixed(2)})`,
        recommendation: 'Stable packages should be abstract. Introduce interfaces to allow flexibility.',
        severity: 'medium',
        metrics: { stability, abstractness, distance },
      });
    }

    if (stability < 0.2 && abstractness > 0.8) {
      violations.push({
        violationType: 'stability_violation',
        location: filePath,
        description: `Package "${packageName}" is highly unstable (${(1 - stability).toFixed(2)}) but very abstract (${abstractness.toFixed(2)})`,
        recommendation: 'Abstract packages should be stable. Add concrete implementations or reduce abstractions.',
        severity: 'medium',
        metrics: { stability, abstractness, distance },
      });
    }

    return violations;
  }

  private getPackageName(filePath: string): string {
    const parts = filePath.split('/');
    const packageParts = parts.slice(0, -1);
    return packageParts[packageParts.length - 1] || 'root';
  }
}
