/**
 * Package Coupling Analyzer
 * Validates ADP, SDP, and SAP principles
 */

import { readFile } from 'fs/promises';
import type {
  CouplingAnalysisResult,
  PackageViolation,
  AnalyzePackageInput,
} from '../types.js';
import { KnowledgeBase } from '../../../shared/knowledge-base/index.js';

export class PackageCouplingAnalyzer {
  constructor(_kb: KnowledgeBase) {
    // Knowledge base reserved for future use
  }

  async analyze(input: AnalyzePackageInput): Promise<CouplingAnalysisResult> {
    const violations: PackageViolation[] = [];

    try {
      const code = await readFile(input.filePath, 'utf-8');

      violations.push(...this.checkADP(code, input.filePath, input.allFiles));
      violations.push(...this.checkSDP(code, input.filePath, input.allFiles));
      violations.push(...this.checkSAP(code, input.filePath));

      const criticalCount = violations.filter(v => v.severity === 'critical').length;

      return {
        compliant: criticalCount === 0,
        confidence: 80,
        violations,
      };
    } catch (error) {
      throw new Error(`Package coupling analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private checkADP(code: string, filePath: string, allFiles: string[]): PackageViolation[] {
    const violations: PackageViolation[] = [];

    const currentPackage = this.getPackageName(filePath);
    const dependencies = this.extractDependencies(code, allFiles);

    const visited = new Set<string>();
    const stack = new Set<string>();

    const hasCycle = (pkg: string): boolean => {
      if (stack.has(pkg)) return true;
      if (visited.has(pkg)) return false;

      visited.add(pkg);
      stack.add(pkg);

      const pkgDeps = dependencies.get(pkg) || [];
      for (const dep of pkgDeps) {
        if (hasCycle(dep)) return true;
      }

      stack.delete(pkg);
      return false;
    };

    if (hasCycle(currentPackage)) {
      violations.push({
        violationType: 'cyclic_dependency',
        principle: 'ADP',
        location: filePath,
        description: 'ADP - Acyclic Dependencies: Circular dependency detected between packages',
        recommendation: 'Break dependency cycles using Dependency Inversion (interfaces) or package restructuring.',
        severity: 'critical',
        affectedPackages: Array.from(stack),
      });
    }

    return violations;
  }

  private checkSDP(code: string, filePath: string, allFiles: string[]): PackageViolation[] {
    const violations: PackageViolation[] = [];

    const currentPackage = this.getPackageName(filePath);
    const dependencies = this.extractDependencies(code, allFiles);
    const stability = this.calculateStability(currentPackage, dependencies, allFiles);

    const currentStability = stability.get(currentPackage) || 0;
    const deps = dependencies.get(currentPackage) || [];

    for (const dep of deps) {
      const depStability = stability.get(dep) || 0;

      if (currentStability < depStability) {
        violations.push({
          violationType: 'stability_violation',
          principle: 'SDP',
          location: filePath,
          description: `SDP - Stable Dependencies: Depends on less stable package "${dep}" (${depStability.toFixed(2)} > ${currentStability.toFixed(2)})`,
          recommendation: 'Depend in direction of stability. Stable packages should not depend on unstable ones.',
          severity: 'high',
          metrics: {
            stability: currentStability,
          },
        });
      }
    }

    return violations;
  }

  private checkSAP(code: string, filePath: string): PackageViolation[] {
    const violations: PackageViolation[] = [];

    const abstractCount = (code.match(/\b(abstract\s+class|interface)\s+/g) || []).length;
    const concreteCount = (code.match(/\bclass\s+(?!.*abstract)/g) || []).length;
    const totalTypes = abstractCount + concreteCount;

    if (totalTypes === 0) return violations;

    const abstractness = abstractCount / totalTypes;

    const instability = this.estimateInstability(code);
    const distance = Math.abs(abstractness + instability - 1);

    if (distance > 0.5) {
      const zone = abstractness > 0.5 && instability > 0.5 ? 'Zone of Uselessness' : 'Zone of Pain';

      violations.push({
        violationType: 'stability_violation',
        principle: 'SAP',
        location: filePath,
        description: `SAP - Stable Abstractions: Package in "${zone}" (D=${distance.toFixed(2)})`,
        recommendation: zone === 'Zone of Pain'
          ? 'Rigid and hard to change. Add abstractions (interfaces) to improve flexibility.'
          : 'Too abstract with no concrete implementations. Add concrete classes or remove abstractions.',
        severity: distance > 0.7 ? 'high' : 'medium',
        metrics: {
          abstractness,
          stability: 1 - instability,
          distance,
        },
      });
    }

    return violations;
  }

  private getPackageName(filePath: string): string {
    const parts = filePath.split('/');
    return parts.slice(0, -1).join('/') || 'root';
  }

  private extractDependencies(code: string, _allFiles: string[]): Map<string, string[]> {
    const deps = new Map<string, string[]>();
    const imports = code.match(/from\s+['"]([^'"]+)['"]/g) || [];

    const currentPkg = this.getPackageName('');
    const pkgDeps: string[] = [];

    for (const imp of imports) {
      const match = imp.match(/from\s+['"]([^'"]+)['"]/);
      if (match) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
          const depPkg = this.getPackageName(importPath);
          if (depPkg !== currentPkg) {
            pkgDeps.push(depPkg);
          }
        }
      }
    }

    deps.set(currentPkg, pkgDeps);
    return deps;
  }

  private calculateStability(
    _pkg: string,
    dependencies: Map<string, string[]>,
    allFiles: string[]
  ): Map<string, number> {
    const stability = new Map<string, number>();

    const packages = new Set<string>();
    for (const file of allFiles) {
      packages.add(this.getPackageName(file));
    }

    for (const p of packages) {
      const efferent = (dependencies.get(p) || []).length;
      const afferent = Array.from(dependencies.entries()).filter(([_, deps]) =>
        deps.includes(p)
      ).length;

      const total = efferent + afferent;
      stability.set(p, total === 0 ? 0 : efferent / total);
    }

    return stability;
  }

  private estimateInstability(code: string): number {
    const exports = (code.match(/export\s+(class|function|const|interface)/g) || []).length;
    const imports = (code.match(/import\s+.*from/g) || []).length;

    const total = exports + imports;
    return total === 0 ? 0 : imports / total;
  }
}
