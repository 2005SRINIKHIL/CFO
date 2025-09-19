import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  DollarSign, 
  TrendingUp,
  UserPlus,
  Calendar,
  Briefcase,
  Star
} from 'lucide-react';
import { useFinancial } from '../../contexts/FinancialContext';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  salary: number;
  startDate: string;
  performance: 'excellent' | 'good' | 'average' | 'needs-improvement';
  equity: number;
}

const TeamPlanningPage: React.FC = () => {
  const { financialData, updateFinancialData } = useFinancial();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'CEO',
      department: 'Executive',
      salary: 12000,
      startDate: '2023-01-15',
      performance: 'excellent',
      equity: 15.0
    },
    {
      id: '2',
      name: 'Mike Chen',
      role: 'CTO',
      department: 'Engineering',
      salary: 11000,
      startDate: '2023-02-01',
      performance: 'excellent',
      equity: 8.0
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Head of Marketing',
      department: 'Marketing',
      salary: 9000,
      startDate: '2023-03-10',
      performance: 'good',
      equity: 2.5
    },
    {
      id: '4',
      name: 'David Kim',
      role: 'Senior Developer',
      department: 'Engineering',
      salary: 8500,
      startDate: '2023-04-01',
      performance: 'good',
      equity: 1.0
    },
    {
      id: '5',
      name: 'Lisa Wang',
      role: 'Product Manager',
      department: 'Product',
      salary: 9500,
      startDate: '2023-05-15',
      performance: 'excellent',
      equity: 1.5
    }
  ]);

  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    department: 'Engineering',
    salary: 8000,
    startDate: new Date().toISOString().split('T')[0],
    performance: 'good' as const,
    equity: 0.5
  });

  const departments = ['Engineering', 'Marketing', 'Sales', 'Product', 'Operations', 'Executive', 'Finance'];
  const performanceColors = {
    excellent: 'green',
    good: 'blue',
    average: 'yellow',
    'needs-improvement': 'red'
  };

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(1)}K`;
  };

  const getTotalSalaryCost = () => {
    return teamMembers.reduce((total, member) => total + member.salary, 0);
  };

  const getDepartmentStats = () => {
    const stats = departments.map(dept => ({
      department: dept,
      count: teamMembers.filter(m => m.department === dept).length,
      totalSalary: teamMembers.filter(m => m.department === dept).reduce((sum, m) => sum + m.salary, 0)
    })).filter(stat => stat.count > 0);
    
    return stats.sort((a, b) => b.totalSalary - a.totalSalary);
  };

  const addTeamMember = () => {
    const member: TeamMember = {
      id: Date.now().toString(),
      ...newMember
    };
    
    setTeamMembers([...teamMembers, member]);
    updateFinancialData({ 
      teamSize: teamMembers.length + 1,
      averageSalary: Math.round((getTotalSalaryCost() + newMember.salary) / (teamMembers.length + 1))
    });
    
    setNewMember({
      name: '',
      role: '',
      department: 'Engineering',
      salary: 8000,
      startDate: new Date().toISOString().split('T')[0],
      performance: 'good',
      equity: 0.5
    });
    setShowAddModal(false);
  };

  const deleteMember = (id: string) => {
    const updatedMembers = teamMembers.filter(m => m.id !== id);
    setTeamMembers(updatedMembers);
    
    if (updatedMembers.length > 0) {
      const newTotalSalary = updatedMembers.reduce((sum, m) => sum + m.salary, 0);
      updateFinancialData({ 
        teamSize: updatedMembers.length,
        averageSalary: Math.round(newTotalSalary / updatedMembers.length)
      });
    } else {
      updateFinancialData({ teamSize: 0, averageSalary: 0 });
    }
  };

  const hiringPlan = [
    { role: 'Senior Frontend Developer', department: 'Engineering', priority: 'High', estimatedSalary: 9000, timeframe: 'Q1 2024' },
    { role: 'Sales Manager', department: 'Sales', priority: 'Medium', estimatedSalary: 8500, timeframe: 'Q2 2024' },
    { role: 'DevOps Engineer', department: 'Engineering', priority: 'High', estimatedSalary: 9500, timeframe: 'Q1 2024' },
    { role: 'Content Marketing Specialist', department: 'Marketing', priority: 'Low', estimatedSalary: 6500, timeframe: 'Q3 2024' }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Planning</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your team and plan future hires with financial impact analysis
          </p>
        </div>
        <motion.button
          onClick={() => setShowAddModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </motion.button>
      </div>

      {/* Team Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Team Size</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {teamMembers.length}
            </p>
            <p className="text-sm mt-2 text-blue-600 dark:text-blue-400">
              Active employees
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
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Payroll</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCurrency(getTotalSalaryCost())}
            </p>
            <p className="text-sm mt-2 text-green-600 dark:text-green-400">
              Total salaries
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
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Salary</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCurrency(getTotalSalaryCost() / teamMembers.length)}
            </p>
            <p className="text-sm mt-2 text-purple-600 dark:text-purple-400">
              Per employee
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
              <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Performers</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {teamMembers.filter(m => m.performance === 'excellent').length}
            </p>
            <p className="text-sm mt-2 text-orange-600 dark:text-orange-400">
              Excellent rating
            </p>
          </div>
        </motion.div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Department Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getDepartmentStats().map((dept, index) => (
            <motion.div
              key={dept.department}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900 dark:text-white">{dept.department}</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">{dept.count} people</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {formatCurrency(dept.totalSalary)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Avg: {formatCurrency(dept.totalSalary / dept.count)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Team</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Salary</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Performance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Equity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member, index) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{member.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Started {new Date(member.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{member.role}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{member.department}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{formatCurrency(member.salary)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${performanceColors[member.performance]}-100 dark:bg-${performanceColors[member.performance]}-900/20 text-${performanceColors[member.performance]}-700 dark:text-${performanceColors[member.performance]}-300`}>
                      {member.performance}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{member.equity}%</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingMember(member)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMember(member.id)}
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

      {/* Hiring Plan */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hiring Plan</h3>
          <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
            Edit Plan
          </button>
        </div>
        <div className="space-y-4">
          {hiringPlan.map((hire, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{hire.role}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{hire.department}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(hire.estimatedSalary)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{hire.timeframe}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  hire.priority === 'High' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
                  hire.priority === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                  'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                }`}>
                  {hire.priority}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAddModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <input
                  type="text"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                <select
                  value={newMember.department}
                  onChange={(e) => setNewMember({...newMember, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Salary</label>
                <input
                  type="number"
                  value={newMember.salary}
                  onChange={(e) => setNewMember({...newMember, salary: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addTeamMember}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
              >
                Add Member
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

export default TeamPlanningPage;