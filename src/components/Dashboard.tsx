import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, AlertTriangle } from 'lucide-react';
import { useFinancial } from '../contexts/FinancialContext';
import RunwayChart from './charts/RunwayChart';
import ExpenseChart from './charts/ExpenseChart';
import CashFlowGauge from './charts/CashFlowGauge';

const Dashboard: React.FC = () => {
  const { financialData, scenarioResults, getRunwayMonths, usageMetrics } = useFinancial();
  
  const runwayMonths = getRunwayMonths();
  const currentMonth = scenarioResults.find(r => r.month === 0);
  const netCashFlow = (financialData.monthlyRevenue - 
    (financialData.monthlyExpenses + financialData.teamSize * financialData.averageSalary + 
     financialData.marketingBudget + financialData.operationalExpenses));

  const metrics = [
    {
      title: 'Current Cash',
      value: `$${(financialData.currentCash / 1000).toFixed(0)}K`,
      change: '+5.2%',
      icon: DollarSign,
      color: 'blue',
      trend: 'up'
    },
    {
      title: 'Monthly Revenue',
      value: `$${(financialData.monthlyRevenue / 1000).toFixed(0)}K`,
      change: `+${financialData.growthRate}%`,
      icon: TrendingUp,
      color: 'green',
      trend: 'up'
    },
    {
      title: 'Runway',
      value: isFinite(runwayMonths) ? `${runwayMonths.toFixed(1)} months` : '∞',
      change: runwayMonths < 12 ? 'Critical' : runwayMonths < 18 ? 'Warning' : 'Healthy',
      icon: Calendar,
      color: runwayMonths < 12 ? 'red' : runwayMonths < 18 ? 'yellow' : 'green',
      trend: netCashFlow > 0 ? 'up' : 'down'
    },
    {
      title: 'Team Size',
      value: `${financialData.teamSize} people`,
      change: `$${(financialData.teamSize * financialData.averageSalary / 1000).toFixed(0)}K/mo`,
      icon: Users,
      color: 'purple',
      trend: 'neutral'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor your startup's financial health and runway
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {usageMetrics.scenariosRun} scenarios analyzed
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-${metric.color}-50 dark:bg-${metric.color}-900/20`}>
                  <IconComponent className={`w-6 h-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                </div>
                {metric.trend === 'up' && (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                )}
                {metric.trend === 'down' && (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {metric.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {metric.value}
                </p>
                <p className={`text-sm mt-2 ${
                  metric.color === 'red' ? 'text-red-600 dark:text-red-400' :
                  metric.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-green-600 dark:text-green-400'
                }`}>
                  {metric.change}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Alert for Critical Runway */}
      {runwayMonths < 12 && isFinite(runwayMonths) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center space-x-3"
        >
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-200">Critical Runway Alert</h3>
            <p className="text-red-700 dark:text-red-300 text-sm">
              Your current runway is {runwayMonths.toFixed(1)} months. Consider reducing expenses or increasing revenue.
            </p>
          </div>
        </motion.div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <RunwayChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ExpenseChart />
        </motion.div>
      </div>

      {/* Cash Flow Gauge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <CashFlowGauge />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;