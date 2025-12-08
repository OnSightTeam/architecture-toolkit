/**
 * Clean Code Analyzer Types
 * Based on Clean Code principles by Robert C. Martin
 */

export type CodeSmellCategory =
  | 'naming'
  | 'function'
  | 'comment'
  | 'general'
  | 'error-handling';

export type CodeSmellId =
  // Naming (N1-N7)
  | 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | 'N6' | 'N7'
  // Functions (F1-F4)
  | 'F1' | 'F2' | 'F3' | 'F4'
  // Comments (C1-C5)
  | 'C1' | 'C2' | 'C3' | 'C4' | 'C5'
  // General (G1-G36)
  | 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6' | 'G7' | 'G8' | 'G9' | 'G10'
  | 'G11' | 'G12' | 'G13' | 'G14' | 'G15' | 'G16' | 'G17' | 'G18' | 'G19' | 'G20'
  | 'G21' | 'G22' | 'G23' | 'G24' | 'G25' | 'G26' | 'G27' | 'G28' | 'G29' | 'G30'
  | 'G31' | 'G32' | 'G33' | 'G34' | 'G35' | 'G36'
  // Error Handling (E1-E7)
  | 'E1' | 'E2' | 'E3' | 'E4' | 'E5' | 'E6' | 'E7';

export interface CleanCodeViolation {
  smellId: CodeSmellId;
  category: CodeSmellCategory;
  location: string;
  description: string;
  recommendation: string;
  documentationReference: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  exampleCode?: {
    before: string;
    after: string;
  };
  codeSnippet?: string;
}

export interface NamingResult {
  compliant: boolean;
  confidence: number;
  violations: CleanCodeViolation[];
}

export interface FunctionQualityResult {
  compliant: boolean;
  confidence: number;
  violations: CleanCodeViolation[];
}

export interface CommentQualityResult {
  compliant: boolean;
  confidence: number;
  violations: CleanCodeViolation[];
}

export interface CodeSmellResult {
  compliant: boolean;
  confidence: number;
  violations: CleanCodeViolation[];
}

export interface CleanCodeValidationResults {
  naming: NamingResult;
  functionQuality: FunctionQualityResult;
  commentQuality: CommentQualityResult;
  codeSmells: CodeSmellResult;
}

export interface CleanCodeReport {
  summary: {
    filesAnalyzed: number;
    totalViolations: number;
    complianceScore: number;
    criticalIssues: number;
    smellsByCategory: Record<CodeSmellCategory, number>;
  };
  results: CleanCodeValidationResults;
  recommendations: string[];
  references: string[];
}

export interface ValidateCleanCodeInput {
  filePath: string;
}
