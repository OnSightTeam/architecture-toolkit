/**
 * Pattern Refactoring Guide Agent Types
 * Defines refactoring opportunities and step-by-step transformation plans
 */

export type RefactoringType =
  | 'extract_method'
  | 'extract_class'
  | 'introduce_parameter_object'
  | 'replace_conditional_with_polymorphism'
  | 'introduce_null_object'
  | 'replace_magic_number'
  | 'decompose_conditional'
  | 'consolidate_duplicate_code';

export type RefactoringPriority = 'critical' | 'high' | 'medium' | 'low';

export interface RefactoringStep {
  stepNumber: number;
  action: string;
  code?: string;
  validation?: string;
}

export interface RefactoringOpportunity {
  type: RefactoringType;
  priority: RefactoringPriority;
  location: string;
  description: string;
  currentIssue: string;
  expectedOutcome: string;
  steps: RefactoringStep[];
  estimatedEffort: 'low' | 'medium' | 'high';
  benefits: string[];
  risks: string[];
  codeExample?: {
    before: string;
    after: string;
  };
}

export interface RefactoringAnalysisResult {
  compliant: boolean;
  confidence: number;
  opportunities: RefactoringOpportunity[];
}

export interface PatternTransformationResult {
  compliant: boolean;
  confidence: number;
  opportunities: RefactoringOpportunity[];
}

export interface CodeSmellRefactoringResult {
  compliant: boolean;
  confidence: number;
  opportunities: RefactoringOpportunity[];
}

export interface PatternRefactoringReport {
  summary: {
    totalOpportunities: number;
    criticalRefactorings: number;
    highPriorityRefactorings: number;
    mediumPriorityRefactorings: number;
    lowPriorityRefactorings: number;
    estimatedTotalEffort: string;
  };
  results: {
    refactoringAnalysis: RefactoringAnalysisResult;
    patternTransformation: PatternTransformationResult;
    codeSmellRefactoring: CodeSmellRefactoringResult;
  };
}

export interface AnalyzeRefactoringInput {
  filePath: string;
}
