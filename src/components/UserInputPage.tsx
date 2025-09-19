import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  Building, 
  Target,
  ArrowRight,
  Check,
  AlertCircle
} from 'lucide-react';
import { useFinancial } from '../contexts/FinancialContext';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../lib/database';

interface UserInputPageProps {
  onComplete: () => void;
}

const UserInputPage: React.FC<UserInputPageProps> = ({ onComplete }) => {
  const { updateFinancialData } = useFinancial();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Company Info
    companyName: '',
    industry: '',
    stage: 'seed',
    
    // Financial Data
    currentCash: 500000,
    monthlyRevenue: 50000,
    monthlyExpenses: 35000,
    growthRate: 15,
    
    // Team Data
    teamSize: 8,
    averageSalary: 8000,
    
    // Budget Allocation
    marketingBudget: 10000,
    operationalExpenses: 15000,
    
    // Goals
    targetRunway: 18,
    revenueGoal: 100000
  });

  const steps = [
    {
      title: 'Company Information',
      description: 'Tell us about your company',
      icon: Building,
      fields: ['companyName', 'industry', 'stage']
    },
    {
      title: 'Financial Position',
      description: 'Current financial status',
      icon: DollarSign,
      fields: ['currentCash', 'monthlyRevenue', 'monthlyExpenses', 'growthRate']
    },
    {
      title: 'Team & Operations',
      description: 'Team size and operational costs',
      icon: Users,
      fields: ['teamSize', 'averageSalary', 'marketingBudget', 'operationalExpenses']
    },
    {
      title: 'Goals & Targets',
      description: 'Set your financial targets',
      icon: Target,
      fields: ['targetRunway', 'revenueGoal']
    }
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 
    'Manufacturing', 'Real Estate', 'Media', 'Food & Beverage', 'Other'
  ];

  const stages = [
    { value: 'idea', label: 'Idea Stage' },
    { value: 'mvp', label: 'MVP/Prototype' },
    { value: 'seed', label: 'Seed Stage' },
    { value: 'series-a', label: 'Series A' },
    { value: 'series-b', label: 'Series B+' },
    { value: 'profitable', label: 'Profitable' }
  ];

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - save data and complete onboarding
      setSaving(true);
      try {
        // Save financial data
        const financialData = {
          currentCash: formData.currentCash,
          monthlyRevenue: formData.monthlyRevenue,
          monthlyExpenses: formData.monthlyExpenses,
          growthRate: formData.growthRate,
          teamSize: formData.teamSize,
          averageSalary: formData.averageSalary,
          marketingBudget: formData.marketingBudget,
          operationalExpenses: formData.operationalExpenses
        };
        
        await updateFinancialData(financialData);

        // Save user profile if user is logged in
        if (user) {
          const userProfile = {
            name: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            phone: '',
            role: 'Founder',
            companyName: formData.companyName,
            companySize: formData.teamSize.toString(),
            industry: formData.industry
          };
          
          await DatabaseService.saveUserProfile(user.uid, userProfile);
        }
        
        onComplete();
      } catch (error) {
        console.error('Error saving onboarding data:', error);
        // Still complete onboarding even if save fails
        onComplete();
      } finally {
        setSaving(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    const currentFields = steps[currentStep].fields;
    return currentFields.every(field => {
      const value = formData[field as keyof typeof formData];
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      return value > 0;
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry *
              </label>
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select your industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Stage *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {stages.map(stage => (
                  <motion.button
                    key={stage.value}
                    onClick={() => handleInputChange('stage', stage.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.stage === stage.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-sm font-medium">{stage.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Cash Position *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={formData.currentCash}
                  onChange={(e) => handleInputChange('currentCash', Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="500000"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Current value: {formatCurrency(formData.currentCash)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Revenue *
                </label>
                <input
                  type="number"
                  value={formData.monthlyRevenue}
                  onChange={(e) => handleInputChange('monthlyRevenue', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="50000"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formatCurrency(formData.monthlyRevenue)}/month
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Expenses *
                </label>
                <input
                  type="number"
                  value={formData.monthlyExpenses}
                  onChange={(e) => handleInputChange('monthlyExpenses', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="35000"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formatCurrency(formData.monthlyExpenses)}/month
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expected Growth Rate (Annual %) *
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.growthRate}
                onChange={(e) => handleInputChange('growthRate', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>0%</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{formData.growthRate}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Team Size *
                </label>
                <input
                  type="number"
                  value={formData.teamSize}
                  onChange={(e) => handleInputChange('teamSize', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="8"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formData.teamSize} employees
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Average Salary *
                </label>
                <input
                  type="number"
                  value={formData.averageSalary}
                  onChange={(e) => handleInputChange('averageSalary', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="8000"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formatCurrency(formData.averageSalary)}/month per employee
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Marketing Budget *
                </label>
                <input
                  type="number"
                  value={formData.marketingBudget}
                  onChange={(e) => handleInputChange('marketingBudget', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="10000"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formatCurrency(formData.marketingBudget)}/month
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Operational Expenses *
                </label>
                <input
                  type="number"
                  value={formData.operationalExpenses}
                  onChange={(e) => handleInputChange('operationalExpenses', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="15000"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formatCurrency(formData.operationalExpenses)}/month
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-blue-800 dark:text-blue-200">Total Monthly Costs</h4>
              </div>
              <p className="text-blue-700 dark:text-blue-300">
                Salaries: {formatCurrency(formData.teamSize * formData.averageSalary)} + 
                Marketing: {formatCurrency(formData.marketingBudget)} + 
                Operations: {formatCurrency(formData.operationalExpenses)} + 
                Other: {formatCurrency(formData.monthlyExpenses)} = 
                <span className="font-semibold"> {formatCurrency(
                  formData.teamSize * formData.averageSalary + 
                  formData.marketingBudget + 
                  formData.operationalExpenses + 
                  formData.monthlyExpenses
                )}</span>
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Runway (Months) *
              </label>
              <input
                type="range"
                min="6"
                max="36"
                value={formData.targetRunway}
                onChange={(e) => handleInputChange('targetRunway', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>6 months</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{formData.targetRunway} months</span>
                <span>36 months</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Revenue Goal (Monthly) *
              </label>
              <input
                type="number"
                value={formData.revenueGoal}
                onChange={(e) => handleInputChange('revenueGoal', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="100000"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Target: {formatCurrency(formData.revenueGoal)}/month
              </p>
            </div>

            <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold text-green-800 dark:text-green-200">Setup Summary</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-green-600 dark:text-green-400">Company: {formData.companyName}</p>
                  <p className="text-green-600 dark:text-green-400">Industry: {formData.industry}</p>
                  <p className="text-green-600 dark:text-green-400">Stage: {stages.find(s => s.value === formData.stage)?.label}</p>
                </div>
                <div>
                  <p className="text-green-600 dark:text-green-400">Cash: {formatCurrency(formData.currentCash)}</p>
                  <p className="text-green-600 dark:text-green-400">Team: {formData.teamSize} people</p>
                  <p className="text-green-600 dark:text-green-400">Target Runway: {formData.targetRunway} months</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Setup Your CFO Helper</h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              {React.createElement(steps[currentStep].icon, { 
                className: "w-6 h-6 text-blue-600 dark:text-blue-400" 
              })}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {steps[currentStep].description}
              </p>
            </div>
          </div>

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <motion.button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              whileHover={{ scale: currentStep === 0 ? 1 : 1.02 }}
              whileTap={{ scale: currentStep === 0 ? 1 : 0.98 }}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Previous
            </motion.button>

            <motion.button
              onClick={handleNext}
              disabled={!isStepValid() || saving}
              whileHover={{ scale: (!isStepValid() || saving) ? 1 : 1.02 }}
              whileTap={{ scale: (!isStepValid() || saving) ? 1 : 0.98 }}
              className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                (!isStepValid() || saving)
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <span>
                {saving ? 'Saving...' : currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
              </span>
              {saving ? (
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserInputPage;