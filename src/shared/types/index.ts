/**
 * Shared types for all agents in the Architecture Toolkit
 */

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface CodeLocation {
  filePath: string;
  line?: number;
  className?: string;
  methodName?: string;
  column?: number;
}

export interface CodeExample {
  before: string;
  after: string;
}

export interface Violation {
  severity: Severity;
  location: string;
  description: string;
  recommendation: string;
  documentationReference: string;
  exampleCode?: CodeExample;
  category?: string;
  principle?: string;
}

export interface AgentReport {
  agent: string;
  timestamp: Date;
  filesAnalyzed: number;
  violations: Violation[];
  complianceScore: number;
  references: string[];
  summary?: Record<string, unknown>;
}

export interface ComprehensiveReport {
  summary: {
    totalFiles: number;
    totalViolations: number;
    overallCompliance: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
  };
  agents: {
    solid?: AgentReport;
    architecture?: AgentReport;
    cleanCode?: AgentReport;
    patterns?: AgentReport;
    testing?: AgentReport;
    packageDesign?: AgentReport;
    refactoring?: AgentReport;
  };
  recommendations: PrioritizedRecommendation[];
  references: string[];
}

export interface PrioritizedRecommendation {
  priority: number;
  severity: Severity;
  category: string;
  recommendation: string;
  affectedFiles: string[];
  estimatedEffort?: 'low' | 'medium' | 'high';
}

export interface AnalysisOptions {
  agents?: {
    solid?: boolean;
    architecture?: boolean;
    cleanCode?: boolean;
    patterns?: boolean;
    testing?: boolean;
    packageDesign?: boolean;
    refactoring?: boolean;
  };
  knowledgeBasePath?: string;
  outputFormat?: 'console' | 'json' | 'markdown';
  severity?: Severity[];
  exclude?: string[];
}

// Re-export agent types for backward compatibility
export * from '../../agents/solid-validator/types.js';
export * from '../../agents/architecture-reviewer/types.js';
export * from '../../agents/clean-code-analyzer/types.js';
export * from '../../agents/pattern-advisor/types.js';
export * from '../../agents/testing-strategy/types.js';
export * from '../../agents/package-design/types.js';
export * from '../../agents/pattern-refactoring-guide/types.js';
