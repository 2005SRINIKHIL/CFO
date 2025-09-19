import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  BarChart3, 
  Shield, 
  ArrowRight,
  Target,
  Sparkles,
  Rocket,
  Brain,
  Layers,
  Globe,
  Activity,
  Trophy,
  Gamepad2,
  BarChart4,
  LineChart,
  Cpu
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isGamingMode, setIsGamingMode] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 200]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  const coreFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Analytics',
      description: 'Advanced machine learning algorithms provide intelligent insights and predictive forecasting for your financial future.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Rocket,
      title: 'Hyper-Speed Processing',
      description: 'Lightning-fast real-time data processing with instant calculations across millions of data points.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Military-Grade Security',
      description: 'Bank-level encryption with zero-trust architecture ensuring your financial data remains completely secure.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Layers,
      title: 'Multi-Dimensional Modeling',
      description: 'Complex scenario modeling with infinite variables and real-time sensitivity analysis.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Activity,
      title: 'Live Market Integration',
      description: 'Real-time market data integration with global financial indices and economic indicators.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Globe,
      title: 'Global Scale Operations',
      description: 'Multi-currency, multi-region support with automatic regulatory compliance across 180+ countries.',
      color: 'from-teal-500 to-blue-500'
    }
  ];

  const gamingFeatures = [
    {
      icon: Trophy,
      title: 'Achievement System',
      description: 'Unlock badges and achievements as you master financial planning milestones',
      points: '1000 XP'
    },
    {
      icon: Target,
      title: 'Mission-Based Goals',
      description: 'Complete financial challenges and level up your CFO skills',
      points: '2500 XP'
    },
    {
      icon: Gamepad2,
      title: 'Interactive Simulations',
      description: 'Gamified scenario planning with real-time feedback and scoring',
      points: '5000 XP'
    },
    {
      icon: Sparkles,
      title: 'Power-Up Features',
      description: 'Boost your analysis with special tools and advanced capabilities',
      points: '10000 XP'
    }
  ];

  const liveMetrics = [
    { label: 'Active Users', value: '125,847', change: '+12.3%' },
    { label: 'Data Points Processed', value: '2.4B', change: '+156.7%' },
    { label: 'Accuracy Rate', value: '99.97%', change: '+0.03%' },
    { label: 'Response Time', value: '0.23ms', change: '-15.2%' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live data updates
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"
        />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Logo/Brand */}
            <motion.div 
              className="flex justify-center items-center space-x-4 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50" />
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
                  <BarChart3 className="w-12 h-12 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CFO AI
                </h1>
                <p className="text-gray-400 text-sm">Next-Gen Financial Intelligence</p>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              className="text-6xl md:text-8xl font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Financial
              </span>
              <br />
              <span className="text-white">Intelligence</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Reimagined
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Harness the power of advanced AI and real-time analytics to transform your financial decision-making. 
              Experience the future of CFO-level insights, today.
            </motion.p>

            {/* Gaming Mode Toggle */}
            <motion.div 
              className="flex justify-center items-center space-x-6 py-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <span className="text-gray-400">Professional Mode</span>
              <motion.button
                onClick={() => setIsGamingMode(!isGamingMode)}
                className={`relative w-16 h-8 rounded-full transition-colors ${
                  isGamingMode ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-600'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                  animate={{ x: isGamingMode ? 32 : 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </motion.button>
              <span className="text-gray-400">Gaming Mode</span>
              {isGamingMode && <Gamepad2 className="w-6 h-6 text-purple-400 animate-pulse" />}
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center space-x-3">
                  <Rocket className="w-6 h-6" />
                  <span>Sign Up & Start</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
              
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 border-2 border-gray-600 hover:border-blue-500 rounded-xl font-semibold text-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Activity className="w-6 h-6 text-blue-400" />
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                </div>
              </motion.button>
            </motion.div>

            {/* Live Metrics Bar */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 p-6 bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-800"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              {liveMetrics.map((metric) => (
                <div key={metric.label} className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{metric.value}</div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                  <div className={`text-xs ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Cutting-Edge
              </span>
              <br />
              <span className="text-white">Capabilities</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Revolutionary features powered by next-generation AI and quantum-speed processing
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-700/50" />
                  <div className="relative p-8 h-full">
                    {/* Icon with gradient background */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-full h-full text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Hover effect gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gaming Mode Features */}
      {isGamingMode && (
        <section className="relative z-10 py-32 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="text-center mb-20"
            >
              <div className="flex justify-center items-center space-x-4 mb-6">
                <Gamepad2 className="w-12 h-12 text-purple-400" />
                <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Gaming Mode Activated
                </h2>
                <Sparkles className="w-12 h-12 text-pink-400 animate-pulse" />
              </div>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Transform financial planning into an engaging, rewarding experience with gamification
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gamingFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    whileHover={{ y: -10, rotateY: 5 }}
                    className="group relative bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <IconComponent className="w-10 h-10 text-purple-400 group-hover:text-pink-400 transition-colors" />
                      <span className="text-sm font-bold text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded-full">
                        {feature.points}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Application Preview Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Use
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {' '}Dashboard
                </span>
                <br />
                Available Now
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Jump straight into your personalized CFO dashboard with real-time data visualization, 
                AI-powered insights, and predictive analytics. Start making smarter financial decisions immediately.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={onGetStarted}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <Rocket className="w-6 h-6" />
                    <span>Launch Application</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
                <motion.button
                  onClick={onGetStarted}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-gray-600 hover:border-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <BarChart4 className="w-6 h-6 text-cyan-400" />
                    <span>Start Analytics</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              {/* Mock Dashboard Preview */}
              <div className="relative bg-gray-900/50 backdrop-blur-lg rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-400 text-sm ml-4">CFO AI Dashboard</span>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {['Revenue', 'Expenses', 'Profit'].map((metric, i) => (
                      <div key={metric} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-gray-400 text-sm">{metric}</div>
                        <div className="text-2xl font-bold text-white">
                          {i === 0 ? '$2.4M' : i === 1 ? '$1.2M' : '$1.2M'}
                        </div>
                        <div className="text-green-400 text-sm">+12.5%</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-3">Revenue Trend</div>
                    <div className="h-20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg flex items-end space-x-1 p-2">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-gradient-to-t from-blue-500 to-cyan-500 rounded-sm flex-1"
                          style={{ height: `${Math.random() * 80 + 20}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl"
              >
                <Cpu className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-2xl"
              >
                <LineChart className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-3xl border border-gray-700/50" />
            <div className="relative p-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {' '}Transform
                </span>
                <br />
                Your Financial Future?
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Join the next generation of financial leaders using AI-powered insights 
                to make smarter, faster, and more profitable decisions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button
                  onClick={onGetStarted}
                  whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl"
                >
                  <div className="flex items-center space-x-4">
                    <Rocket className="w-8 h-8" />
                    <span>Start Your Journey</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.button>
                
                <motion.button
                  onClick={onGetStarted}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-gray-600 hover:border-blue-500 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <BarChart3 className="w-8 h-8 text-blue-400" />
                    <span>Open Dashboard</span>
                  </div>
                </motion.button>
              </div>
              
              {isGamingMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 text-purple-400 font-semibold"
                >
                  🎮 Gaming Mode: Unlock achievements as you progress!
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;