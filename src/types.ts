export interface KPI {
  id: string;
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  unit?: string;
}

export interface SectorData {
  name: string;
  budget: number;
  efficiency: number;
  population: number;
}

export type Sector = 'Health' | 'Education' | 'Security' | 'Transport' | 'Sanitation';

export interface GovernanceMetric {
  id: string;
  category: string;
  status: 'compliant' | 'warning' | 'critical';
  lastAudit: string;
}
