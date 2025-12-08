/**
 * Package Design Agent Types
 * Defines package cohesion and coupling principles
 */

export type CohesionPrinciple = 'REP' | 'CCP' | 'CRP';
export type CouplingPrinciple = 'ADP' | 'SDP' | 'SAP';

export type PackageViolationType =
  | 'cohesion_violation'
  | 'coupling_violation'
  | 'cyclic_dependency'
  | 'stability_violation';

export interface PackageViolation {
  violationType: PackageViolationType;
  principle?: CohesionPrinciple | CouplingPrinciple;
  location: string;
  description: string;
  recommendation: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedPackages?: string[];
  metrics?: {
    stability?: number;
    abstractness?: number;
    distance?: number;
  };
}

export interface CohesionAnalysisResult {
  compliant: boolean;
  confidence: number;
  violations: PackageViolation[];
}

export interface CouplingAnalysisResult {
  compliant: boolean;
  confidence: number;
  violations: PackageViolation[];
}

export interface StabilityMetricsResult {
  compliant: boolean;
  confidence: number;
  violations: PackageViolation[];
  metrics: {
    [packageName: string]: {
      stability: number;
      abstractness: number;
      distance: number;
    };
  };
}

export interface PackageDesignReport {
  summary: {
    totalPackages: number;
    totalViolations: number;
    complianceScore: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
  };
  results: {
    cohesion: CohesionAnalysisResult;
    coupling: CouplingAnalysisResult;
    stability: StabilityMetricsResult;
  };
}

export interface AnalyzePackageInput {
  filePath: string;
  allFiles: string[];
}
