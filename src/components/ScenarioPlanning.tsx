import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { useFinancial } from '../contexts/FinancialContext';

const ScenarioPlanning: React.FC = () => {
  const { financialData, updateFinancialData, calculateScenario } = useFinancial();

  useEffect(() => {
    calculateScenario();
  }, [calculateScenario]);

  const handleSliderChange = (key: keyof typeof financialData, value: number) => {
    updateFinancialData({ [key]: value });
  };

  const resetToDefaults = () => {
    updateFinancialData({
      monthlyRevenue: 50000,
      monthlyExpenses: 35000,
      currentCash: 500000,
      growthRate: 15,
      teamSize: 8,
      averageSalary: 8000,
      marketingBudget: 10000,
      operationalExpenses: 15000,
    });
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
    </motion.div>
  );
};

export default ScenarioPlanning;