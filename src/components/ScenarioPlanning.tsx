import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, FileText, Eye, Plus, Users } from 'lucide-react';
import { useFinancial } from '../contexts/FinancialContext';

const ScenarioPlanning: React.FC = () => {
  const { financialData, updateFinancialData, calculateScenario, scenarioResults } = useFinancial();
  const [showActionPlan, setShowActionPlan] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
  const [showHiringPlan, setShowHiringPlan] = useState(false);

  useEffect(() => {
    calculateScenario();
  }, [calculateScenario]);

  const handleSliderChange = (key: keyof typeof financialData, value: number) => {
    updateFinancialData({ [key]: value });
  };

  const resetToDefaults = () => {
    const defaultData = {
      monthlyRevenue: 50000,
      monthlyExpenses: 35000,
      currentCash: 500000,
      growthRate: 15,
      teamSize: 8,
      averageSalary: 8000,
      marketingBudget: 10000,
      operationalExpenses: 15000,
    };
    updateFinancialData(defaultData);
    // Recalculate scenario with new data
    setTimeout(() => calculateScenario(), 100);
  };

  const scenarios = [
    {
      category: 'Revenue',
      items: [
        {
          label: 'Monthly Revenue',
          key: 'monthlyRevenue' as keyof typeof financialData,
          min: 0,
          max: 200000,
          step: 5000,
          format: (val: number) => `$${(val / 1000).toFixed(0)}K`,
        },
        {
          label: 'Growth Rate (%)',
          key: 'growthRate' as keyof typeof financialData,
          min: -20,
          max: 50,
          step: 1,
          format: (val: number) => `${val}%`,
        },
      ],
    },
    {
      category: 'Team & Expenses',
      items: [
        {
          label: 'Team Size',
          key: 'teamSize' as keyof typeof financialData,
          min: 1,
          max: 50,
          step: 1,
          format: (val: number) => `${val} people`,
        },
        {
          label: 'Average Salary',
          key: 'averageSalary' as keyof typeof financialData,
          min: 3000,
          max: 15000,
          step: 500,
          format: (val: number) => `$${(val / 1000).toFixed(1)}K/mo`,
        },
        {
          label: 'Marketing Budget',
          key: 'marketingBudget' as keyof typeof financialData,
          min: 0,
          max: 50000,
          step: 1000,
          format: (val: number) => `$${(val / 1000).toFixed(0)}K`,
        },
        {
          label: 'Operational Expenses',
          key: 'operationalExpenses' as keyof typeof financialData,
          min: 0,
          max: 50000,
          step: 1000,
          format: (val: number) => `$${(val / 1000).toFixed(0)}K`,
        },
      ],
    },
    {
      category: 'Cash Position',
      items: [
        {
          label: 'Current Cash',
          key: 'currentCash' as keyof typeof financialData,
          min: 50000,
          max: 2000000,
          step: 25000,
          format: (val: number) => `$${(val / 1000).toFixed(0)}K`,
        },
        {
          label: 'Other Monthly Expenses',
          key: 'monthlyExpenses' as keyof typeof financialData,
          min: 0,
          max: 100000,
          step: 2500,
          format: (val: number) => `$${(val / 1000).toFixed(0)}K`,
        },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Scenario Planning</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Adjust parameters to see how they impact your financial runway
          </p>
        </div>
        <div className="flex space-x-3">
          <motion.button
            onClick={resetToDefaults}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </motion.button>
          <motion.button
            onClick={calculateScenario}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Run Scenario</span>
          </motion.button>
          <motion.button
            onClick={() => setShowActionPlan(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Create Action Plan</span>
          </motion.button>
          <motion.button
            onClick={() => setShowScenarios(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Scenarios</span>
          </motion.button>
          <motion.button
            onClick={() => setShowHiringPlan(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Edit Hiring Plan</span>
          </motion.button>
        </div>
      </div>

      {/* Scenario Controls */}
      <div className="space-y-8">
        {scenarios.map((section, sectionIndex) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {section.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                  className="space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.label}
                    </label>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {item.format(financialData[item.key] as number)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={item.min}
                    max={item.max}
                    step={item.step}
                    value={financialData[item.key] as number}
                    onChange={(e) => handleSliderChange(item.key, Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                        (((financialData[item.key] as number) - item.min) / (item.max - item.min)) * 100
                      }%, #E5E7EB ${
                        (((financialData[item.key] as number) - item.min) / (item.max - item.min)) * 100
                      }%, #E5E7EB 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{item.format(item.min)}</span>
                    <span>{item.format(item.max)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Plan Modal */}
      {showActionPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Action Plan</h3>
              <button
                onClick={() => setShowActionPlan(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Revenue Optimization</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Increase monthly revenue from ${(financialData.monthlyRevenue/1000).toFixed(0)}K to ${((financialData.monthlyRevenue * 1.2)/1000).toFixed(0)}K</li>
                  <li>• Focus on customer acquisition and retention</li>
                  <li>• Explore new revenue streams</li>
                </ul>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">Cost Management</h4>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>• Review and optimize operational expenses</li>
                  <li>• Negotiate better rates with vendors</li>
                  <li>• Implement cost tracking measures</li>
                </ul>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">Team Growth</h4>
                <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                  <li>• Plan strategic hiring for key positions</li>
                  <li>• Budget for {financialData.teamSize + 2} team members next quarter</li>
                  <li>• Implement performance-based compensation</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Scenarios Modal */}
      {showScenarios && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Scenario Results</h3>
              <button
                onClick={() => setShowScenarios(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-2">Month</th>
                    <th className="text-left p-2">Revenue</th>
                    <th className="text-left p-2">Expenses</th>
                    <th className="text-left p-2">Cash Balance</th>
                    <th className="text-left p-2">Runway</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarioResults.slice(0, 12).map((result, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">${(result.revenue/1000).toFixed(0)}K</td>
                      <td className="p-2">${(result.expenses/1000).toFixed(0)}K</td>
                      <td className="p-2 font-semibold">${(result.cashBalance/1000).toFixed(0)}K</td>
                      <td className="p-2">{result.runwayMonths.toFixed(1)}mo</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}

      {/* Hiring Plan Modal */}
      {showHiringPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Hiring Plan</h3>
              <button
                onClick={() => setShowHiringPlan(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Team Size</label>
                  <input
                    type="number"
                    value={financialData.teamSize}
                    onChange={(e) => handleSliderChange('teamSize', Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Average Salary</label>
                  <input
                    type="number"
                    value={financialData.averageSalary}
                    onChange={(e) => handleSliderChange('averageSalary', Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Hiring Projections</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Month 1-3:</span>
                    <span>+2 developers (${((financialData.averageSalary * 2)/1000).toFixed(0)}K/mo)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Month 4-6:</span>
                    <span>+1 designer (${(financialData.averageSalary/1000).toFixed(0)}K/mo)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Month 7-12:</span>
                    <span>+1 sales rep (${(financialData.averageSalary/1000).toFixed(0)}K/mo)</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total Additional Cost:</span>
                    <span>${((financialData.averageSalary * 4)/1000).toFixed(0)}K/mo</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    updateFinancialData({ 
                      teamSize: financialData.teamSize + 4,
                      monthlyExpenses: financialData.monthlyExpenses + (financialData.averageSalary * 4)
                    });
                    setShowHiringPlan(false);
                  }}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Apply Hiring Plan
                </button>
                <button
                  onClick={() => setShowHiringPlan(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ScenarioPlanning;