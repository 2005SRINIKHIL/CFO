import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useFinancial } from '../../contexts/FinancialContext';

const CashFlowGauge: React.FC = () => {
  const { financialData, getRunwayMonths } = useFinancial();
  
  const totalExpenses = 
    financialData.monthlyExpenses +
    (financialData.teamSize * financialData.averageSalary) +
    financialData.marketingBudget +
    financialData.operationalExpenses;

  const netCashFlow = financialData.monthlyRevenue - totalExpenses;
  const burnRate = totalExpenses;
  const runwayMonths = getRunwayMonths();

  // Calculate health score (0-100)
  const healthScore = Math.max(0, Math.min(100, 
    (netCashFlow > 0 ? 80 : 40) + 
    (runwayMonths > 18 ? 20 : runwayMonths > 12 ? 10 : runwayMonths > 6 ? 5 : 0)
  ));

  const getHealthColor = () => {
    if (healthScore >= 70) return 'green';
    if (healthScore >= 40) return 'yellow';
    return 'red';
  };

  const getHealthStatus = () => {
    if (healthScore >= 70) return 'Healthy';
    if (healthScore >= 40) return 'Warning';
    return 'Critical';
  };

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const healthColor = getHealthColor();
  const colorClasses = {
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    red: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Cash Flow Health Monitor
        </h3>
        <div className={`flex items-center space-x-2 ${colorClasses[healthColor]}`}>
          {healthColor === 'green' && <TrendingUp className="w-5 h-5" />}
          {healthColor === 'yellow' && <AlertTriangle className="w-5 h-5" />}
          {healthColor === 'red' && <TrendingDown className="w-5 h-5" />}
          <span className="font-medium">{getHealthStatus()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gauge */}
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-24 mb-4">
            <svg className="w-full h-full" viewBox="0 0 200 100">
              {/* Background arc */}
              <path
                d="M 20 80 A 80 80 0 0 1 180 80"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Progress arc */}
              <motion.path
                d="M 20 80 A 80 80 0 0 1 180 80"
                fill="none"
                stroke={healthColor === 'green' ? '#10B981' : healthColor === 'yellow' ? '#F59E0B' : '#EF4444'}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="251.2" // Circumference of semicircle
                strokeDashoffset={251.2 - (251.2 * healthScore) / 100}
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * healthScore) / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-center"
              >
                <div className={`text-3xl font-bold ${colorClasses[healthColor]}`}>
                  {healthScore}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Health Score</div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Cash Flow</span>
            <span className={`font-semibold ${netCashFlow >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {netCashFlow >= 0 ? '+' : ''}{formatCurrency(netCashFlow)}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Burn Rate</span>
            <span className="font-semibold text-red-600 dark:text-red-400">
              -{formatCurrency(burnRate)}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Runway</span>
            <span className={`font-semibold ${colorClasses[healthColor]}`}>
              {isFinite(runwayMonths) ? `${runwayMonths.toFixed(1)} months` : '∞'}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              +{formatCurrency(financialData.monthlyRevenue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlowGauge;