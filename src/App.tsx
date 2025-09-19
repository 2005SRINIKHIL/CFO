import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FinancialProvider, useFinancial } from './contexts/FinancialContext';
import { DatabaseService } from './lib/database';
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
import ErrorBoundary from './components/ErrorBoundary';
import DemoBanner from './components/DemoBanner';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { setDemoMode, isDemoMode, updateFinancialData } = useFinancial();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [checkingUserData, setCheckingUserData] = useState(false);

  // Check if user has existing data when they log in
  useEffect(() => {
    const checkUserData = async () => {
      if (user && !hasCompletedOnboarding) {
        setCheckingUserData(true);
        try {
          // Check if user has profile data
          const userProfile = await DatabaseService.getUserProfile(user.uid);
          const financialData = await DatabaseService.getFinancialData(user.uid);
          
          if (userProfile || financialData) {
            // User has existing data, skip onboarding
            setHasCompletedOnboarding(true);
            
            // Load existing financial data if available
            if (financialData) {
              await updateFinancialData(financialData);
            }
          }
        } catch (error) {
          console.error('Error checking user data:', error);
          // If there's an error, just proceed normally
        } finally {
          setCheckingUserData(false);
        }
      }
    };

    checkUserData();
  }, [user, hasCompletedOnboarding, updateFinancialData]);

  // Show loading spinner while auth is loading or checking user data
  if (loading || checkingUserData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {checkingUserData ? 'Loading your data...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Show landing page and auth modal if not logged in
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

  // Show financial data setup if not completed
  if (!hasCompletedOnboarding) {
    return (
      <UserInputPage onComplete={() => setHasCompletedOnboarding(true)} />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'scenarios':
        return (
          <ErrorBoundary>
            <ScenarioPlanning />
          </ErrorBoundary>
        );
      case 'reports':
        return (
          <ErrorBoundary>
            <ReportGenerator />
          </ErrorBoundary>
        );
      case 'runway':
        return (
          <ErrorBoundary>
            <RunwayPage />
          </ErrorBoundary>
        );
      case 'team':
        return (
          <ErrorBoundary>
            <TeamPlanningPage />
          </ErrorBoundary>
        );
      case 'revenue':
        return (
          <ErrorBoundary>
            <RevenuePage />
          </ErrorBoundary>
        );
      case 'settings':
        return (
          <ErrorBoundary>
            <SettingsPage />
          </ErrorBoundary>
        );
      default:
        return (
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {isDemoMode && (
        <DemoBanner 
          onExitDemo={() => {
            setDemoMode(false);
          }} 
        />
      )}
      <div className="flex flex-1 min-h-0">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-full bg-gray-50 dark:bg-gray-900"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <FinancialProvider>
            <AppContent />
          </FinancialProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;