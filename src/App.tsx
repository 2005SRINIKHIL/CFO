import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FinancialProvider } from './contexts/FinancialContext';
import LandingPage from './components/LandingPage';
import AuthModal from './components/auth/AuthModal';
import UserInputPage from './components/UserInputPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScenarioPlanning from './components/ScenarioPlanning';
import ReportGenerator from './components/ReportGenerator';
import RunwayPage from './components/pages/RunwayPage';
import TeamPlanningPage from './components/pages/TeamPlanningPage';
import RevenuePage from './components/pages/RevenuePage';
import SettingsPage from './components/pages/SettingsPage';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LandingPage 
          onGetStarted={() => {
            setAuthMode('signup');
            setShowAuthModal(true);
          }} 
        />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      </>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <UserInputPage onComplete={() => setHasCompletedOnboarding(true)} />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'scenarios':
        return <ScenarioPlanning />;
      case 'reports':
        return <ReportGenerator />;
      case 'runway':
        return <RunwayPage />;
      case 'team':
        return <TeamPlanningPage />;
      case 'revenue':
        return <RevenuePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <FinancialProvider>
          <AppContent />
        </FinancialProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;