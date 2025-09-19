import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Mail, Share, Calendar, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import { useFinancial } from '../contexts/FinancialContext';
import { useAuth } from '../contexts/AuthContext';
import { useRevenueStreams } from '../hooks/useRevenueStreams';
import { getOpenAIService } from '../lib/openai';
import { DatabaseService } from '../lib/database';
import EmailModal from './EmailModal';

const ReportGenerator: React.FC = () => {
  const { financialData, scenarioResults, getExpenseBreakdown, getRunwayMonths, trackUsage } = useFinancial();
  const { revenueStreams } = useRevenueStreams();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  React.useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const profile = await DatabaseService.getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    };
    loadUserProfile();
  }, [user]);

  const generateAIPoweredPDF = async (reportType: 'executive' | 'detailed' = 'executive') => {
    setIsGeneratingAI(true);
    trackUsage('reportsGenerated');

    try {
      const openAI = getOpenAIService();
      
      const financialSummary = {
        totalRevenue: financialData.monthlyRevenue,
        totalExpenses: financialData.monthlyExpenses + 
          (financialData.teamSize * financialData.averageSalary) +
          financialData.marketingBudget + 
          financialData.operationalExpenses,
        cashBurn: financialData.monthlyExpenses + 
          (financialData.teamSize * financialData.averageSalary) +
          financialData.marketingBudget + 
          financialData.operationalExpenses - financialData.monthlyRevenue,
        runway: getRunwayMonths(),
        growthRate: financialData.growthRate,
        revenueStreams: revenueStreams.map(stream => ({
          name: stream.name,
          amount: stream.monthlyRevenue,
          type: stream.type
        })),
        teamSize: financialData.teamSize,
        companyName: userProfile?.companyName || 'Your Company',
        industry: userProfile?.industry || 'Technology'
      };

      let aiContent = '';
      if (openAI) {
        if (reportType === 'executive') {
          aiContent = await openAI.generateExecutiveSummary(financialSummary);
        } else {
          aiContent = await openAI.generateDetailedAnalysis(financialSummary);
        }
      } else {
        // Fallback content when OpenAI is not available
        console.log('OpenAI not available, using fallback content for:', reportType);
        aiContent = generateFallbackContent(financialSummary, reportType);
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = 30;

      // Title
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${reportType === 'executive' ? 'EXECUTIVE' : 'DETAILED'} Financial Report`, margin, yPosition);
      yPosition += 15;
      
      // Company Info
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${financialSummary.companyName} • ${financialSummary.industry}`, margin, yPosition);
      yPosition += 10;
      
      // Date
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
      yPosition += 15;

      // AI-Generated Content
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      // Split content into lines that fit the page width
      const lines = pdf.splitTextToSize(aiContent, pageWidth - 2 * margin);
      
      lines.forEach((line: string) => {
        if (yPosition > 270) { // Add new page if needed
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });

      // Add financial data table
      yPosition += 10;
      if (yPosition > 200) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Key Financial Metrics', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const metrics = [
        ['Monthly Revenue', `$${financialSummary.totalRevenue.toLocaleString()}`],
        ['Monthly Expenses', `$${financialSummary.totalExpenses.toLocaleString()}`],
        ['Cash Burn Rate', `$${Math.abs(financialSummary.cashBurn).toLocaleString()}/month`],
        ['Runway', `${financialSummary.runway} months`],
        ['Growth Rate', `${financialSummary.growthRate}%`],
        ['Team Size', `${financialSummary.teamSize} employees`]
      ];

      metrics.forEach(([label, value]) => {
        pdf.text(label, margin, yPosition);
        pdf.text(value, margin + 60, yPosition);
        yPosition += 6;
      });

      // Save the PDF
      const fileName = `${reportType}-financial-report-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating AI-powered PDF:', error);
      alert('Failed to generate AI-powered report. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateFallbackContent = (data: any, type: 'executive' | 'detailed'): string => {
    const netCashFlow = data.totalRevenue - data.totalExpenses;
    const healthStatus = data.runway > 12 ? 'Strong' : data.runway > 6 ? 'Moderate' : 'Critical';
    
    if (type === 'executive') {
      return `EXECUTIVE SUMMARY

Financial Health: ${healthStatus}
${data.companyName} demonstrates ${healthStatus.toLowerCase()} financial health with ${data.runway} months of runway and a ${data.growthRate}% growth rate.

Key Metrics Overview:
• Monthly Revenue: $${data.totalRevenue.toLocaleString()}
• Monthly Expenses: $${data.totalExpenses.toLocaleString()}
• Net Cash Flow: ${netCashFlow >= 0 ? '+' : ''}$${netCashFlow.toLocaleString()}
• Current Runway: ${data.runway} months

Revenue Diversification:
The company operates ${data.revenueStreams.length} revenue stream${data.revenueStreams.length !== 1 ? 's' : ''}, providing ${data.revenueStreams.length > 1 ? 'good diversification' : 'focused revenue generation'}.

Strategic Recommendations:
1. ${data.runway < 12 ? 'Prioritize fundraising or cost optimization to extend runway' : 'Continue monitoring cash flow and growth metrics'}
2. ${data.growthRate < 10 ? 'Focus on growth acceleration strategies' : 'Maintain sustainable growth trajectory'}
3. ${data.revenueStreams.length < 2 ? 'Consider diversifying revenue streams' : 'Optimize existing revenue channels'}

Risk Assessment:
${data.runway < 6 ? 'CRITICAL: Immediate action required to extend runway' : data.runway < 12 ? 'MODERATE: Monitor cash flow closely' : 'LOW: Healthy runway provides operational flexibility'}`;
    } else {
      return `DETAILED FINANCIAL ANALYSIS

FINANCIAL POSITION ASSESSMENT
${data.companyName} currently maintains a ${healthStatus.toLowerCase()} financial position with ${data.runway} months of operational runway. The company generates $${data.totalRevenue.toLocaleString()} in monthly revenue against $${data.totalExpenses.toLocaleString()} in monthly expenses.

REVENUE ANALYSIS
Total Monthly Revenue: $${data.totalRevenue.toLocaleString()}
Revenue Streams (${data.revenueStreams.length}):
${data.revenueStreams.map((stream: any) => `• ${stream.name}: $${stream.amount.toLocaleString()} (${stream.type})`).join('\n')}

EXPENSE BREAKDOWN
Total Monthly Expenses: $${data.totalExpenses.toLocaleString()}
Team Size: ${data.teamSize} employees
Growth Rate: ${data.growthRate}% monthly

CASH FLOW ANALYSIS
Net Monthly Cash Flow: ${netCashFlow >= 0 ? '+' : ''}$${netCashFlow.toLocaleString()}
Burn Rate: $${Math.abs(netCashFlow).toLocaleString()}/month
Runway Extension Strategies: ${data.runway < 12 ? 'Required' : 'Recommended for optimization'}

STRATEGIC RECOMMENDATIONS

Immediate Actions (30-90 days):
1. ${data.runway < 6 ? 'Emergency cash flow management - reduce non-essential expenses' : 'Maintain current expense monitoring'}
2. ${data.growthRate < 5 ? 'Investigate growth bottlenecks and acceleration opportunities' : 'Optimize current growth channels'}
3. Revenue optimization through ${data.revenueStreams.length < 2 ? 'diversification' : 'stream optimization'}

Medium-term Strategy (3-12 months):
1. ${data.runway < 12 ? 'Fundraising preparation and execution' : 'Strategic growth investments'}
2. Team scaling aligned with revenue growth trajectory
3. Market expansion and customer acquisition optimization

RISK FACTORS
• Runway Risk: ${data.runway < 6 ? 'HIGH - Immediate attention required' : data.runway < 12 ? 'MEDIUM - Monitor closely' : 'LOW - Adequate runway'}
• Revenue Concentration: ${data.revenueStreams.length < 2 ? 'HIGH - Single revenue stream dependency' : 'MEDIUM - Monitor stream performance'}
• Growth Sustainability: ${data.growthRate > 20 ? 'Monitor for sustainable scaling' : data.growthRate < 5 ? 'Growth acceleration needed' : 'Balanced growth trajectory'}`;
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    trackUsage('reportsGenerated');

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Title
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CFO Helper - Financial Report', 20, 30);
      
      // Date
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
      
      // Executive Summary
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Executive Summary', 20, 65);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      const runwayMonths = getRunwayMonths();
      const totalExpenses = financialData.monthlyExpenses + 
        (financialData.teamSize * financialData.averageSalary) +
        financialData.marketingBudget + 
        financialData.operationalExpenses;
      
      const netCashFlow = financialData.monthlyRevenue - totalExpenses;
      
      const summaryText = [
        `Current Cash Position: $${(financialData.currentCash / 1000).toFixed(0)}K`,
        `Monthly Revenue: $${(financialData.monthlyRevenue / 1000).toFixed(0)}K`,
        `Monthly Burn Rate: $${(totalExpenses / 1000).toFixed(0)}K`,
        `Net Cash Flow: ${netCashFlow >= 0 ? '+' : ''}$${(netCashFlow / 1000).toFixed(0)}K`,
        `Financial Runway: ${isFinite(runwayMonths) ? `${runwayMonths.toFixed(1)} months` : 'Infinite'}`,
        `Team Size: ${financialData.teamSize} employees`,
        `Revenue Growth Rate: ${financialData.growthRate}% annually`
      ];
      
      let yPos = 75;
      summaryText.forEach(line => {
        pdf.text(line, 25, yPos);
        yPos += 8;
      });

      // Financial Metrics
      yPos += 10;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Key Financial Metrics', 20, yPos);
      
      yPos += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      // Expense Breakdown
      const expenseBreakdown = getExpenseBreakdown();
      pdf.text('Monthly Expense Breakdown:', 25, yPos);
      yPos += 8;
      
      expenseBreakdown.forEach(expense => {
        pdf.text(`• ${expense.category}: $${(expense.amount / 1000).toFixed(0)}K`, 30, yPos);
        yPos += 6;
      });

      // Recommendations
      yPos += 15;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Strategic Recommendations', 20, yPos);
      
      yPos += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      const recommendations = [];
      
      if (runwayMonths < 12 && isFinite(runwayMonths)) {
        recommendations.push('• URGENT: Runway is critical. Consider reducing expenses or increasing revenue immediately.');
      } else if (runwayMonths < 18 && isFinite(runwayMonths)) {
        recommendations.push('• WARNING: Runway is below 18 months. Plan fundraising or cost optimization.');
      }
      
      if (netCashFlow < 0) {
        recommendations.push('• Focus on achieving positive cash flow through revenue growth or expense reduction.');
      }
      
      if (financialData.growthRate < 10) {
        recommendations.push('• Consider strategies to accelerate revenue growth rate above 10% annually.');
      }
      
      if (expenseBreakdown.find(e => e.category === 'Salaries')?.amount! > totalExpenses * 0.6) {
        recommendations.push('• Salary costs exceed 60% of expenses. Review hiring plan and compensation structure.');
      }
      
      if (recommendations.length === 0) {
        recommendations.push('• Financial health appears strong. Continue monitoring key metrics.');
        recommendations.push('• Consider strategic investments in growth opportunities.');
      }
      
      recommendations.forEach(rec => {
        if (yPos > pageHeight - 30) {
          pdf.addPage();
          yPos = 20;
        }
        
        const lines = pdf.splitTextToSize(rec, pageWidth - 50);
        lines.forEach((line: string) => {
          pdf.text(line, 25, yPos);
          yPos += 6;
        });
        yPos += 3;
      });

      // Footer
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Generated by CFO Helper - Financial Intelligence Platform', 20, pageHeight - 15);
      
      // Save the PDF
      pdf.save('cfo-helper-financial-report.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const reportTypes = [
    {
      title: 'AI Executive Summary',
      description: 'AI-powered high-level overview with strategic insights',
      icon: Sparkles,
      color: 'blue',
      action: () => generateAIPoweredPDF('executive'),
      isAI: true
    },
    {
      title: 'AI Detailed Analysis',
      description: 'Comprehensive AI-driven analysis with recommendations',
      icon: FileText,
      color: 'green',
      action: () => generateAIPoweredPDF('detailed'),
      isAI: true
    },
    {
      title: 'Standard Report',
      description: 'Traditional financial report with charts and metrics',
      icon: Share,
      color: 'purple',
      action: generatePDF,
      isAI: false
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Report Generator</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Generate professional financial reports with your current scenario data
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Current Cash</div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            ${(financialData.currentCash / 1000).toFixed(0)}K
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-green-600 dark:text-green-400 text-sm font-medium">Monthly Revenue</div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            ${(financialData.monthlyRevenue / 1000).toFixed(0)}K
          </div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="text-orange-600 dark:text-orange-400 text-sm font-medium">Runway</div>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {isFinite(getRunwayMonths()) ? `${getRunwayMonths().toFixed(1)}M` : '∞'}
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">Team Size</div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {financialData.teamSize}
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTypes.map((report, index) => {
          const IconComponent = report.icon;
          const isGeneratingThis = report.isAI ? isGeneratingAI : isGenerating;
          return (
            <motion.div
              key={report.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className={`w-12 h-12 bg-${report.color}-100 dark:bg-${report.color}-900/20 rounded-lg flex items-center justify-center mb-4`}>
                <IconComponent className={`w-6 h-6 text-${report.color}-600 dark:text-${report.color}-400`} />
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {report.title}
                </h3>
                {report.isAI && (
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    AI
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {report.description}
              </p>
              <motion.button
                onClick={report.action}
                disabled={isGeneratingThis}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-center space-x-2 py-2 px-4 bg-${report.color}-500 hover:bg-${report.color}-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors`}
              >
                {isGeneratingThis ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Generate PDF</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Additional Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Email Report</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Send to stakeholders</div>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Schedule Reports</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Automated delivery</div>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportGenerator;