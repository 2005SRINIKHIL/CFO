import React, { createContext, useContext, useState, useCallback } from 'react';
import { FinancialData, ScenarioResult, ExpenseBreakdown, UsageMetrics } from '../types';

interface FinancialContextType {
  financialData: FinancialData;
  updateFinancialData: (data: Partial<FinancialData>) => void;
  scenarioResults: ScenarioResult[];
  usageMetrics: UsageMetrics;
  calculateScenario: () => void;
  trackUsage: (action: keyof UsageMetrics) => void;
  getExpenseBreakdown: () => ExpenseBreakdown[];
  getRunwayMonths: () => number;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [financialData, setFinancialData] = useState<FinancialData>({
    monthlyRevenue: 50000,
    monthlyExpenses: 35000,
    currentCash: 500000,
    growthRate: 15,
    teamSize: 8,
    averageSalary: 8000,
    marketingBudget: 10000,
    operationalExpenses: 15000,
  });

  const [scenarioResults, setScenarioResults] = useState<ScenarioResult[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics>({
    sessionsCount: 1,
    scenariosRun: 0,
    reportsGenerated: 0,
    lastActive: new Date(),
  });

  const updateFinancialData = useCallback((data: Partial<FinancialData>) => {
    setFinancialData(prev => ({ ...prev, ...data }));
  }, []);

  const calculateScenario = useCallback(() => {
    const results: ScenarioResult[] = [];
    let currentCash = financialData.currentCash;
    let monthlyRevenue = financialData.monthlyRevenue;
    
    const totalMonthlyExpenses = 
      financialData.monthlyExpenses +
      (financialData.teamSize * financialData.averageSalary) +
      financialData.marketingBudget +
      financialData.operationalExpenses;

    for (let month = 0; month <= 24; month++) {
      const revenue = monthlyRevenue * (1 + (financialData.growthRate / 100)) ** (month / 12);
      const expenses = totalMonthlyExpenses;
      const netCashFlow = revenue - expenses;
      currentCash += netCashFlow;

      const runwayMonths = currentCash > 0 
        ? Math.max(0, currentCash / Math.max(expenses - revenue, 1))
        : 0;

      results.push({
        month,
        revenue: Math.round(revenue),
        expenses: Math.round(expenses),
        cashBalance: Math.round(currentCash),
        runwayMonths: Math.round(runwayMonths * 10) / 10,
      });

      if (currentCash <= 0) break;
    }

    setScenarioResults(results);
    trackUsage('scenariosRun');
  }, [financialData]);

  const trackUsage = useCallback((action: keyof UsageMetrics) => {
    setUsageMetrics(prev => ({
      ...prev,
      [action]: prev[action] + 1,
      lastActive: new Date(),
    }));
  }, []);

  const getExpenseBreakdown = useCallback((): ExpenseBreakdown[] => {
    const salaries = financialData.teamSize * financialData.averageSalary;
    return [
      { category: 'Salaries', amount: salaries, color: '#3B82F6' },
      { category: 'Marketing', amount: financialData.marketingBudget, color: '#10B981' },
      { category: 'Operations', amount: financialData.operationalExpenses, color: '#F59E0B' },
      { category: 'Other Expenses', amount: financialData.monthlyExpenses, color: '#EF4444' },
    ];
  }, [financialData]);

  const getRunwayMonths = useCallback((): number => {
    const totalExpenses = 
      financialData.monthlyExpenses +
      (financialData.teamSize * financialData.averageSalary) +
      financialData.marketingBudget +
      financialData.operationalExpenses;
    
    const netBurn = totalExpenses - financialData.monthlyRevenue;
    return netBurn > 0 ? financialData.currentCash / netBurn : Infinity;
  }, [financialData]);

  return (
    <FinancialContext.Provider
      value={{
        financialData,
        updateFinancialData,
        scenarioResults,
        usageMetrics,
        calculateScenario,
        trackUsage,
        getExpenseBreakdown,
        getRunwayMonths,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};