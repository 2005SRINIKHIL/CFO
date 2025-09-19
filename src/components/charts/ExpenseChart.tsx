import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFinancial } from '../../contexts/FinancialContext';

const ExpenseChart: React.FC = () => {
  const { getExpenseBreakdown } = useFinancial();
  const expenseData = getExpenseBreakdown();

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
          <p className="text-white font-medium">{data.payload.category}</p>
          <p className="text-blue-400">
            {formatCurrency(data.value)} ({((data.value / expenseData.reduce((a, b) => a + b.amount, 0)) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Monthly Expense Breakdown
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: {formatCurrency(expenseData.reduce((a, b) => a + b.amount, 0))}
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="amount"
              label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {expenseData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {item.category}: {formatCurrency(item.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseChart;