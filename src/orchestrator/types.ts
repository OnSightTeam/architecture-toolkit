/**
 * Orchestrator Types
 * Standard agent report format for orchestrator integration
 */

export interface AgentReport {
  agent: string;
  summary?: string;
  violations: Array<{
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    description: string;
    location: string;
    recommendation: string;
    principle?: string;
  }>;
  complianceScore: number;
}
