import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { FinancialData, ScenarioResult, ExpenseBreakdown, UsageMetrics, RevenueStream, TeamMember } from '../types';
import { DatabaseService } from '../lib/database';
import { isFirebaseConfigured } from '../lib/firebase';
import { useAuth } from './AuthContext';

interface FinancialContextType {
  financialData: FinancialData;
  updateFinancialData: (data: Partial<FinancialData>) => Promise<void>;
  scenarioResults: ScenarioResult[];
  usageMetrics: UsageMetrics;
  calculateScenario: () => void;
  trackUsage: (action: keyof UsageMetrics) => Promise<void>;
  getExpenseBreakdown: () => ExpenseBreakdown[];
  getRunwayMonths: () => number;
  isDemoMode: boolean;
  setDemoMode: (demo: boolean) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

const defaultFinancialData: FinancialData = {
  monthlyRevenue: 50000,
  monthlyExpenses: 35000,
  currentCash: 500000,
  growthRate: 15,
  teamSize: 8,
  averageSalary: 8000,
  marketingBudget: 10000,
  operationalExpenses: 15000,
};

const demoFinancialData: FinancialData = {
  monthlyRevenue: 75000,
  monthlyExpenses: 45000,
  currentCash: 800000,
  growthRate: 20,
  teamSize: 12,
  averageSalary: 9000,
  marketingBudget: 15000,
  operationalExpenses: 20000,
};

const defaultUsageMetrics: UsageMetrics = {
  sessionsCount: 1,
  scenariosRun: 0,
  reportsGenerated: 0,
  lastActive: new Date(),
};

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [financialData, setFinancialData] = useState<FinancialData>(defaultFinancialData);
  const [scenarioResults, setScenarioResults] = useState<ScenarioResult[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics>(defaultUsageMetrics);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const setDemoMode = useCallback((demo: boolean) => {
    setIsDemoMode(demo);
    if (demo) {
      setFinancialData(demoFinancialData);
      setUsageMetrics({ ...defaultUsageMetrics, sessionsCount: 42, scenariosRun: 15, reportsGenerated: 8 });
    } else {
      setFinancialData(defaultFinancialData);
      setUsageMetrics(defaultUsageMetrics);
    }
  }, []);

  // Load user financial data from Firestore when user changes
  useEffect(() => {
    if (!user) {
      // Reset to defaults when user is not authenticated
      setFinancialData(defaultFinancialData);
      setUsageMetrics(defaultUsageMetrics);
      return;
    }

    if (!isFirebaseConfigured) {
      // When Firebase is not configured, use defaults and do not attempt remote calls
      setFinancialData(defaultFinancialData);
      setUsageMetrics(defaultUsageMetrics);
      return;
    }

    const load = async () => {
      try {
        // Load financial data
        const financialData = await DatabaseService.getFinancialData(user.uid);
        if (financialData) {
          setFinancialData({ ...defaultFinancialData, ...financialData });
        } else {
          // Create default data
          await DatabaseService.saveFinancialData(user.uid, defaultFinancialData);
          setFinancialData(defaultFinancialData);
        }

        // Load usage metrics
        const usageData = await DatabaseService.getUsageMetrics(user.uid);
        if (usageData) {
          setUsageMetrics(usageData);
        } else {
          // Create default usage metrics
          await DatabaseService.trackUsage(user.uid, 'sessionsCount');
          setUsageMetrics(defaultUsageMetrics);
        }
      } catch (e) {
        // Set default values to prevent null access
        console.error('Failed to load financial data', e);
        setFinancialData(defaultFinancialData);
        setUsageMetrics(defaultUsageMetrics);
      }
    };

    load();
  }, [user]);

  const updateFinancialData = useCallback(async (data: Partial<FinancialData>) => {
    setFinancialData(prev => {
      const merged = { ...prev, ...data };
      return merged;
    });

    // Skip database operations in demo mode
    if (isDemoMode) {
      return;
    }

  if (!user) {
      console.warn('Cannot persist financial data: user not authenticated');
      return;
    }
    
    try {
      await DatabaseService.saveFinancialData(user.uid, data);
    } catch (err) {
      console.error('Failed to persist financial data', err);
    }
  }, [user, isDemoMode]);

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
    // async track usage but do not await here
    void trackUsage('scenariosRun');
  }, [financialData]);

  const trackUsage = useCallback(async (action: keyof UsageMetrics) => {
    setUsageMetrics(prev => ({
      ...prev,
      [action]: (prev[action] as number) + 1,
      lastActive: new Date(),
    }));

    // Skip database operations in demo mode
    if (isDemoMode) {
      return;
    }

  if (!user) {
      console.warn('Cannot track usage: user not authenticated');
      return;
    }
    
    try {
      await DatabaseService.trackUsage(user.uid, action);
    } catch (err) {
      console.error('Failed to track usage', err);
    }
  }, [user, isDemoMode]);

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
        usageMetrics: usageMetrics,
        calculateScenario,
        trackUsage,
        getExpenseBreakdown,
        getRunwayMonths,
        isDemoMode,
        setDemoMode,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};