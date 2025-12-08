/**
 * Architecture Reviewer Types
 * Based on Clean Architecture principles
 */

export type ArchitectureLayer = 'Entities' | 'UseCases' | 'InterfaceAdapters' | 'Frameworks';

export type ArchitectureViolationType =
  | 'dependency_rule'
  | 'layer_separation'
  | 'boundary_crossing'
  | 'circular_dependency'
  | 'framework_coupling';

export interface ArchitectureViolation {
  violationType: ArchitectureViolationType;
  location: string;
  description: string;
  recommendation: string;
  documentationReference: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  exampleCode?: {
    before: string;
    after: string;
  };
  sourceLayer?: ArchitectureLayer;
  targetLayer?: ArchitectureLayer;
  dependency?: string;
}

export interface DependencyRuleResult {
  compliant: boolean;
  confidence: number;
  violations: ArchitectureViolation[];
}

export interface LayerSeparationResult {
  compliant: boolean;
  confidence: number;
  violations: ArchitectureViolation[];
}

export interface BoundaryAnalysisResult {
  compliant: boolean;
  confidence: number;
  violations: ArchitectureViolation[];
}

export interface ArchitectureValidationResults {
  dependencyRule: DependencyRuleResult;
  layerSeparation: LayerSeparationResult;
  boundaryAnalysis: BoundaryAnalysisResult;
}

export interface ArchitectureReport {
  summary: {
    filesAnalyzed: number;
    totalViolations: number;
    complianceScore: number;
    criticalIssues: number;
  };
  results: ArchitectureValidationResults;
  recommendations: string[];
  references: string[];
}

export interface ValidateArchitectureInput {
  filePath: string;
  layer?: ArchitectureLayer;
}
