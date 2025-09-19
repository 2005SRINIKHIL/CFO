import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Calendar, 
  DollarSign,
  Target,
  Zap,
  Clock
} from 'lucide-react';
import { useFinancial } from '../../contexts/FinancialContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const RunwayPage: React.FC = () => {
  const { financialData, scenarioResults, getRunwayMonths } = useFinancial();
  const [selectedScenario, setSelectedScenario] = useState('current');
  
  const runwayMonths = getRunwayMonths();
  const totalExpenses = 
    financialData.monthlyExpenses +
    (financialData.teamSize * financialData.averageSalary) +
    financialData.marketingBudget +
    financialData.operationalExpenses;
  
  const netCashFlow = financialData.monthlyRevenue - totalExpenses;
  const burnRate = totalExpenses;

  const scenarios = [
    {
      id: 'optimistic',
      name: 'Optimistic',
      description: '20% revenue growth, 10% expense reduction',
      color: 'green',
      multiplier: { revenue: 1.2, expenses: 0.9 }
    },
    {
      id: 'current',
      name: 'Current',
      description: 'Based on current financial data',
      color: 'blue',
      multiplier: { revenue: 1, expenses: 1 }
    },
    {
      id: 'pessimistic',
      name: 'Pessimistic',
      description: '10% revenue decline, 15% expense increase',
      color: 'red',
      multiplier: { revenue: 0.9, expenses: 1.15 }
    }
  ];

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const getRunwayColor = (months: number) => {
    if (months < 6) return 'red';
    if (months < 12) return 'orange';
    if (months < 18) return 'yellow';
    return 'green';
  };

  const getRunwayStatus = (months: number) => {
    if (months < 6) return 'Critical';
    if (months < 12) return 'Warning';
    if (months < 18) return 'Caution';
    return 'Healthy';
  };

  const chartData = scenarioResults.map(result => ({
    month: `M${result.month}`,
    cashBalance: result.cashBalance,
    revenue: result.revenue,
    expenses: result.expenses,
  }));

  const milestones = [
    {
      month: 6,
      title: 'Series A Preparation',
      description: 'Start preparing for Series A funding round',
      status: runwayMonths > 6 ? 'safe' : 'critical'
    },
    {
      month: 12,
      title: 'Product Market Fit',
      description: 'Achieve strong product-market fit metrics',
      status: runwayMonths > 12 ? 'safe' : 'warning'
    },
    {
      month: 18,
      title: 'Scale Operations',
      description: 'Begin scaling operations and team',
      status: runwayMonths > 18 ? 'safe' : 'caution'
    },
    {
      month: 24,
      title: 'Market Leadership',
      description: 'Establish market leadership position',
      status: runwayMonths > 24 ? 'safe' : 'neutral'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Runway Analysis</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor your financial runway and plan for sustainable growth
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Runway Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg bg-${getRunwayColor(runwayMonths)}-50 dark:bg-${getRunwayColor(runwayMonths)}-900/20`}>
              <Target className={`w-6 h-6 text-${getRunwayColor(runwayMonths)}-600 dark:text-${getRunwayColor(runwayMonths)}-400`} />
            </div>
            {netCashFlow > 0 ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Runway</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {isFinite(runwayMonths) ? `${runwayMonths.toFixed(1)} months` : '∞'}
            </p>
            <p className={`text-sm mt-2 text-${getRunwayColor(runwayMonths)}-600 dark:text-${getRunwayColor(runwayMonths)}-400`}>
              {getRunwayStatus(runwayMonths)}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Burn</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCurrency(burnRate)}
            </p>
            <p className="text-sm mt-2 text-red-600 dark:text-red-400">
              -{formatCurrency(burnRate / 30)}/day
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Cash Flow</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {netCashFlow >= 0 ? '+' : ''}{formatCurrency(netCashFlow)}
            </p>
            <p className={`text-sm mt-2 ${netCashFlow >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {netCashFlow >= 0 ? 'Positive' : 'Negative'} flow
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Zero Cash Date</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {isFinite(runwayMonths) 
                ? new Date(Date.now() + runwayMonths * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : 'Never'
              }
            </p>
            <p className="text-sm mt-2 text-blue-600 dark:text-blue-400">
              Projected date
            </p>
          </div>
        </motion.div>
      </div>

      {/* Critical Alert */}
      {runwayMonths < 12 && isFinite(runwayMonths) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6"
        >
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200 text-lg">
                {runwayMonths < 6 ? 'Critical Runway Alert' : 'Runway Warning'}
              </h3>
              <p className="text-red-700 dark:text-red-300 mt-1">
                Your current runway is {runwayMonths.toFixed(1)} months. 
                {runwayMonths < 6 
                  ? ' Immediate action required to extend runway or secure funding.'
                  : ' Consider planning fundraising activities or optimizing expenses.'
                }
              </p>
              <div className="mt-4 flex space-x-3">
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Create Action Plan
                </button>
                <button className="border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg text-sm font-medium">
                  View Scenarios
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Scenario Selector */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Runway Scenarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <motion.button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedScenario === scenario.id
                  ? `border-${scenario.color}-500 bg-${scenario.color}-50 dark:bg-${scenario.color}-900/20`
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-left">
                <h4 className={`font-semibold ${
                  selectedScenario === scenario.id 
                    ? `text-${scenario.color}-700 dark:text-${scenario.color}-300`
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {scenario.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {scenario.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Runway Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cash Runway Projection
          </h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Cash Balance</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value: number) => [formatCurrency(value), 'Cash Balance']}
              />
              <Area
                type="monotone"
                dataKey="cashBalance"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#cashGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Key Milestones</h3>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.month}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex items-center space-x-4 p-4 rounded-lg border ${
                milestone.status === 'safe' ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' :
                milestone.status === 'warning' ? 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20' :
                milestone.status === 'critical' ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' :
                'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                milestone.status === 'safe' ? 'bg-green-500 text-white' :
                milestone.status === 'warning' ? 'bg-orange-500 text-white' :
                milestone.status === 'critical' ? 'bg-red-500 text-white' :
                'bg-gray-400 text-white'
              }`}>
                {milestone.month}M
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{milestone.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{milestone.description}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                milestone.status === 'safe' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' :
                milestone.status === 'warning' ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' :
                milestone.status === 'critical' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' :
                'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}>
                {milestone.status === 'safe' ? 'On Track' :
                 milestone.status === 'warning' ? 'At Risk' :
                 milestone.status === 'critical' ? 'Critical' : 'Future'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RunwayPage;