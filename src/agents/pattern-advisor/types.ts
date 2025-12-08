/**
 * Pattern Advisor Types
 * Recommends design patterns based on code analysis
 */

export type PatternCategory = 'creational' | 'structural' | 'behavioral';

export type DesignPattern =
  // Creational
  | 'Factory Method' | 'Abstract Factory' | 'Builder' | 'Prototype' | 'Singleton'
  // Structural
  | 'Adapter' | 'Bridge' | 'Composite' | 'Decorator' | 'Facade' | 'Flyweight' | 'Proxy'
  // Behavioral
  | 'Chain of Responsibility' | 'Command' | 'Iterator' | 'Mediator' | 'Memento'
  | 'Observer' | 'State' | 'Strategy' | 'Template Method' | 'Visitor';

export interface PatternRecommendation {
  pattern: DesignPattern;
  category: PatternCategory;
  location: string;
  problem: string;
  solution: string;
  reasoning: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  documentationReference: string;
  exampleCode?: {
    before: string;
    after: string;
  };
  alternatives?: string[];
  tradeoffs?: {
    pros: string[];
    cons: string[];
  };
}

export interface CreationalPatternResult {
  compliant: boolean;
  confidence: number;
  recommendations: PatternRecommendation[];
}

export interface StructuralPatternResult {
  compliant: boolean;
  confidence: number;
  recommendations: PatternRecommendation[];
}

export interface BehavioralPatternResult {
  compliant: boolean;
  confidence: number;
  recommendations: PatternRecommendation[];
}

export interface PatternAnalysisResults {
  creational: CreationalPatternResult;
  structural: StructuralPatternResult;
  behavioral: BehavioralPatternResult;
}

export interface PatternAdvisorReport {
  summary: {
    filesAnalyzed: number;
    totalRecommendations: number;
    highPriorityRecommendations: number;
    patternsByCategory: Record<PatternCategory, number>;
  };
  results: PatternAnalysisResults;
  topRecommendations: PatternRecommendation[];
  references: string[];
}

export interface AnalyzeForPatternsInput {
  filePath: string;
}
