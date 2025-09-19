import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Users, 
  Calendar,
  Plus,
  Edit3,
  Trash2,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useFinancial } from '../../contexts/FinancialContext';
import { useRevenueStreams } from '../../hooks/useRevenueStreams';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { RevenueStream } from '../../types';

const RevenuePage: React.FC = () => {
  const { financialData, updateFinancialData } = useFinancial();
  const { revenueStreams, addRevenueStream, updateRevenueStream, deleteRevenueStream, loading, error } = useRevenueStreams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('12months');
  
  const [newStream, setNewStream] = useState({
    name: '',
    type: 'subscription' as const,
    monthlyRevenue: 0,
    customers: 0,
    averageValue: 0,
    growthRate: 0,
    color: '#8B5CF6'
  });

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const getTotalRevenue = () => {
    return revenueStreams.reduce((total, stream) => total + stream.monthlyRevenue, 0);
  };

  const getTotalCustomers = () => {
    return revenueStreams.reduce((total, stream) => total + stream.customers, 0);
  };

  const getAverageGrowthRate = () => {
    const totalRevenue = getTotalRevenue();
    return revenueStreams.reduce((sum, stream) => 
      sum + (stream.growthRate * (stream.monthlyRevenue / totalRevenue)), 0
    );
  };

  // Generate historical data for charts
  const generateHistoricalData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => {
      const baseRevenue = getTotalRevenue();
      const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const trendGrowth = (index / 12) * (getAverageGrowthRate() / 100);
      
      return {
        month,
        revenue: Math.round(baseRevenue * (1 + trendGrowth + variation)),
        customers: Math.round(getTotalCustomers() * (1 + trendGrowth * 0.8 + variation * 0.5)),
        arpu: Math.round((baseRevenue / getTotalCustomers()) * (1 + variation * 0.3))
      };
    });
  };

  const historicalData = generateHistoricalData();

  const handleAddRevenueStream = async () => {
    // Basic validation
    if (!newStream.name.trim()) {
      alert('Please enter a revenue stream name');
      return;
    }
    
    if (newStream.monthlyRevenue <= 0) {
      alert('Monthly revenue must be greater than 0');
      return;
    }

    try {
      await addRevenueStream(newStream);
      
      const newTotalRevenue = [...revenueStreams, newStream].reduce((sum, s) => sum + s.monthlyRevenue, 0);
      updateFinancialData({ monthlyRevenue: newTotalRevenue });
      
      setNewStream({
        name: '',
        type: 'subscription',
        monthlyRevenue: 0,
        customers: 0,
        averageValue: 0,
        growthRate: 0,
        color: '#8B5CF6'
      });
      setShowAddModal(false);
      alert('Revenue stream added successfully!');
    } catch (error) {
      console.error('Failed to add revenue stream:', error);
      alert('Failed to add revenue stream. Please try again.');
    }
  };

  const handleDeleteStream = async (id: string) => {
    try {
      await deleteRevenueStream(id);
      
      const updatedStreams = revenueStreams.filter(s => s.id !== id);
      const newTotalRevenue = updatedStreams.reduce((sum, s) => sum + s.monthlyRevenue, 0);
      updateFinancialData({ monthlyRevenue: newTotalRevenue });
    } catch (error) {
      console.error('Failed to delete revenue stream:', error);
    }
  };

  const revenueTargets = [
    { period: 'This Month', target: 55000, actual: getTotalRevenue(), status: getTotalRevenue() >= 55000 ? 'achieved' : 'pending' },
    { period: 'This Quarter', target: 165000, actual: getTotalRevenue() * 3, status: getTotalRevenue() * 3 >= 165000 ? 'achieved' : 'pending' },
    { period: 'This Year', target: 600000, actual: getTotalRevenue() * 12, status: getTotalRevenue() * 12 >= 600000 ? 'achieved' : 'pending' }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Revenue Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track revenue streams, analyze performance, and optimize growth
          </p>
        </div>
        <motion.button
          onClick={() => setShowAddModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Revenue Stream</span>
        </motion.button>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCurrency(getTotalRevenue())}
            </p>
            <p className="text-sm mt-2 text-green-600 dark:text-green-400">
              +{getAverageGrowthRate().toFixed(1)}% growth
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
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {getTotalCustomers().toLocaleString()}
            </p>
            <p className="text-sm mt-2 text-blue-600 dark:text-blue-400">
              Active customers
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
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">ARPU</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              ${Math.round(getTotalRevenue() / getTotalCustomers())}
            </p>
            <p className="text-sm mt-2 text-purple-600 dark:text-purple-400">
              Avg revenue per user
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
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue Streams</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {revenueStreams.length}
            </p>
            <p className="text-sm mt-2 text-orange-600 dark:text-orange-400">
              Active streams
            </p>
          </div>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="12months">Last 12 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="3months">Last 3 Months</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
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
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Revenue Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={revenueStreams.map(stream => ({
                    name: stream.name,
                    value: stream.monthlyRevenue,
                    fill: stream.color
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {revenueStreams.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue Streams Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Streams</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Stream</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Customers</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Avg Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Growth</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {revenueStreams.map((stream, index) => (
                <motion.tr
                  key={stream.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: stream.color }}
                      ></div>
                      <span className="font-medium text-gray-900 dark:text-white">{stream.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {stream.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white font-semibold">
                    {formatCurrency(stream.monthlyRevenue)}
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">
                    {stream.customers.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">
                    ${stream.averageValue}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${
                      stream.growthRate > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stream.growthRate > 0 ? '+' : ''}{stream.growthRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStream(stream.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Targets */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Targets</h3>
        <div className="space-y-4">
          {revenueTargets.map((target, index) => (
            <motion.div
              key={target.period}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{target.period}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatCurrency(target.actual)} / {formatCurrency(target.target)}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      target.status === 'achieved' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min((target.actual / target.target) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  target.status === 'achieved' 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                }`}>
                  {target.status === 'achieved' ? 'Achieved' : 'In Progress'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Revenue Stream Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAddModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Revenue Stream</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={newStream.name}
                  onChange={(e) => setNewStream({...newStream, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select
                  value={newStream.type}
                  onChange={(e) => setNewStream({...newStream, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="subscription">Subscription</option>
                  <option value="one-time">One-time</option>
                  <option value="usage-based">Usage-based</option>
                  <option value="commission">Commission</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Revenue</label>
                <input
                  type="number"
                  value={newStream.monthlyRevenue}
                  onChange={(e) => setNewStream({...newStream, monthlyRevenue: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customers</label>
                <input
                  type="number"
                  value={newStream.customers}
                  onChange={(e) => setNewStream({...newStream, customers: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddRevenueStream}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
              >
                Add Stream
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-4 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default RevenuePage;