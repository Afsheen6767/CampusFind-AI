import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { DashboardPage } from './components/DashboardPage';
import { ReportItemForm } from './components/ReportItemForm';
import { BrowseItemsPage } from './components/BrowseItemsPage';
import { AIMatchAssistantPage } from './components/AIMatchAssistantPage';
import { MyReportsPage } from './components/MyReportsPage';
import { ItemDetailModal } from './components/ItemDetailModal';
import { ToastContainer } from './components/NotificationToast';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <main className="flex-1 bg-slate-950 text-slate-100">
      {currentView === 'landing' && <LandingPage />}
      {currentView === 'login' && <AuthModal mode="login" />}
      {currentView === 'register' && <AuthModal mode="register" />}
      {currentView === 'profile' && <AuthModal mode="profile" />}
      {currentView === 'dashboard' && <DashboardPage />}
      {currentView === 'report_lost' && <ReportItemForm type="lost" />}
      {currentView === 'report_found' && <ReportItemForm type="found" />}
      {currentView === 'browse' && <BrowseItemsPage />}
      {currentView === 'ai_match' && <AIMatchAssistantPage />}
      {currentView === 'my_reports' && <MyReportsPage />}
    </main>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
        <Navbar />
        <MainContent />
        <Footer />
        <ItemDetailModal />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}

export default App;
