export interface FinancialData {
  monthlyRevenue: number;
  monthlyExpenses: number;
  currentCash: number;
  growthRate: number;
  teamSize: number;
  averageSalary: number;
  marketingBudget: number;
  operationalExpenses: number;
}

export interface ScenarioResult {
  month: number;
  revenue: number;
  expenses: number;
  cashBalance: number;
  runwayMonths: number;
}

export interface ChartDataPoint {
  month: string;
  revenue: number;
  expenses: number;
  cashBalance: number;
}

export interface ExpenseBreakdown {
  category: string;
  amount: number;
  color: string;
}

export interface UsageMetrics {
  sessionsCount: number;
  scenariosRun: number;
  reportsGenerated: number;
  lastActive: Date;
}