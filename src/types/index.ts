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

export interface RevenueStream {
  id: string;
  name: string;
  type: 'subscription' | 'one-time' | 'usage-based' | 'commission';
  monthlyRevenue: number;
  customers: number;
  averageValue: number;
  growthRate: number;
  color: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  salary: number;
  startDate: Date;
  equity?: number;
  status: 'active' | 'inactive';
}

export interface UserSettings {
  currency: string;
  timezone: string;
  notifications: {
    email: boolean;
    dashboard: boolean;
    reports: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}