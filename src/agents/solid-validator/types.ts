/**
 * SOLID Principle Validation Types
 * Based on the SOLID Validator Agent Specification
 */

export type SOLIDPrinciple = 'SRP' | 'OCP' | 'LSP' | 'ISP' | 'DIP';

export type ViolationSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface CodeLocation {
  filePath: string;
  line?: number;
  className?: string;
  methodName?: string;
}

export interface CodeExample {
  before: string;
  after: string;
}

export interface BaseViolation {
  location: string;
  description: string;
  recommendation: string;
  documentationReference: string;
  exampleCode?: CodeExample;
  severity?: ViolationSeverity;
}

// Single Responsibility Principle
export interface SRPViolation extends BaseViolation {
  reasonsForChange: string[];
}

export interface SRPResult {
  principle: 'Single Responsibility Principle';
  compliant: boolean;
  confidence: number;
  violations: SRPViolation[];
}

// Open/Closed Principle
export type OCPViolationType = 'switch_statement' | 'type_checking' | 'hardcoded_logic';

export interface OCPViolation extends BaseViolation {
  violationType: OCPViolationType;
  currentCode: string;
  suggestedPattern: 'Strategy' | 'Factory' | 'Template Method' | 'Visitor';
  refactoringSteps: string[];
  patternReference: string;
}

export interface OCPResult {
  principle: 'Open/Closed Principle';
  compliant: boolean;
  confidence: number;
  violations: OCPViolation[];
}

// Liskov Substitution Principle
export type LSPViolationType = 'contract_violation' | 'type_checking' | 'exception_mismatch';

export interface LSPViolation extends BaseViolation {
  violationType: LSPViolationType;
  baseContract: string;
  derivedContract: string;
  substitutabilityIssue: string;
}

export interface LSPResult {
  principle: 'Liskov Substitution Principle';
  compliant: boolean;
  confidence: number;
  violations: LSPViolation[];
}

// Interface Segregation Principle
export type ISPViolationType = 'fat_interface' | 'forced_implementation' | 'mixed_concerns';

export interface ISPViolation extends BaseViolation {
  violationType: ISPViolationType;
  interfaceName: string;
  methodCount: number;
  unusedMethods: string[];
  clients: string[];
  suggestedSplit: {
    interface1: string[];
    interface2: string[];
  };
}

export interface ISPResult {
  principle: 'Interface Segregation Principle';
  compliant: boolean;
  confidence: number;
  violations: ISPViolation[];
}

// Dependency Inversion Principle
export type DIPViolationType = 'concrete_dependency' | 'wrong_direction';

export interface DIPViolation extends BaseViolation {
  violationType: DIPViolationType;
  highLevelModule: string;
  lowLevelDependency: string;
  currentDependency: string;
  suggestedAbstraction: string;
  refactoringSteps: string[];
  patternReference: 'Dependency Injection' | 'Service Locator' | 'Abstract Factory';
}

export interface DIPResult {
  principle: 'Dependency Inversion Principle';
  compliant: boolean;
  confidence: number;
  violations: DIPViolation[];
}

// Combined Results
export interface SOLIDValidationResults {
  srp: SRPResult;
  ocp: OCPResult;
  lsp: LSPResult;
  isp: ISPResult;
  dip: DIPResult;
}

export interface SOLIDReport {
  summary: {
    filesAnalyzed: number;
    totalViolations: number;
    complianceScore: number;
    criticalIssues: number;
  };
  results: SOLIDValidationResults;
  recommendations: string[];
  references: string[];
}

// Tool Input/Output Types
export interface ValidateCodeInput {
  filePath: string;
  className?: string;
  methodName?: string;
}

export interface ValidateInterfaceInput {
  filePath: string;
  interfaceName: string;
}

export interface ValidateInheritanceInput {
  filePath: string;
  baseClass: string;
  derivedClass: string;
}

export interface GenerateReportInput {
  results: SOLIDValidationResults;
  filePaths: string[];
}
