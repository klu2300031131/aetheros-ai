import React, { useState } from 'react';
import LandingPage from './pages/LandingPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import Sidebar from './components/Sidebar.tsx';
import CommandPalette from './components/CommandPalette.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import CopilotPage from './pages/CopilotPage.tsx';
import AgentsPage from './pages/AgentsPage.tsx';
import DigitalTwinPage from './pages/DigitalTwinPage.tsx';
import PredictiveAI from './pages/PredictiveAI.tsx';
import AnalyticsCenter from './pages/AnalyticsCenter.tsx';
import IntelligencePages from './pages/IntelligencePages.tsx';
import AdminSettings from './pages/AdminSettings.tsx';
import { Search, Bell, Menu } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string } | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Nav actions
  const handleEnterOS = () => {
    setCurrentPage('login');
  };

  const handleLoginSuccess = (user: { name: string; role: string }) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  // Render OS Panel views
  const renderOsView = () => {
    switch (currentPage) {
      case 'dashboard':
      case 'reports':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'copilot':
        return <CopilotPage />;
      case 'agents':
        return <AgentsPage />;
      case 'twin':
      case 'map':
        return <DigitalTwinPage />;
      case 'predictive':
        return <PredictiveAI />;
      case 'analytics':
        return <AnalyticsCenter />;
      case 'intelligence':
      case 'compliance':
        return <IntelligencePages />;
      case 'admin':
        return <AdminSettings />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  // If outside operating system, show full pages
  if (currentPage === 'landing') {
    return <LandingPage onEnterOS={handleEnterOS} onEnterLogin={() => setCurrentPage('login')} />;
  }

  if (currentPage === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} onBackToLanding={() => setCurrentPage('landing')} />;
  }

  return (
    <div className="min-h-screen bg-[#030308] text-[#f1f1f6] flex">
      {/* Sidebar Desktop */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          setMobileMenuOpen(false);
        }}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      {/* Mobile Drawer (Collapsible menu) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-64 h-full bg-[#070712] border-r border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple">
                  <span className="text-sm font-bold text-white">Æ</span>
                </div>
                <span className="font-bold text-white text-sm">AetherOS AI</span>
              </div>
              <nav className="space-y-4">
                {[
                  { id: 'dashboard', label: 'Executive Dashboard' },
                  { id: 'analytics', label: 'Analytics Center' },
                  { id: 'copilot', label: 'AI Copilot' },
                  { id: 'agents', label: 'Multi-Agent Mesh' },
                  { id: 'twin', label: 'Digital Twin Sim' },
                  { id: 'intelligence', label: 'Supply Intelligence' },
                  { id: 'admin', label: 'Admin Settings' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left py-2 text-sm font-medium ${currentPage === item.id ? 'text-brand-purple' : 'text-brand-muted hover:text-white'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
            <button onClick={handleLogout} className="text-xs text-brand-danger py-2 border-t border-white/10 text-left">
              Log Out of system
            </button>
          </div>
        </div>
      )}

      {/* Main Command Workspace */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen overflow-x-hidden">
        {/* Workspace Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#030308]/60 backdrop-blur-md px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1 text-brand-muted hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Simulated Command Input trigger */}
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-xs text-brand-muted hover:bg-white/10 hover:text-white transition-all w-48 sm:w-64 text-left"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search platform...</span>
              <kbd className="hidden sm:inline-block ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[9px]">
                Ctrl + K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Alert Center */}
            <button
              onClick={() => alert("Notification panel: 3 critical warnings flagged.")}
              className="relative rounded-lg p-2 text-brand-muted hover:bg-white/5 hover:text-white transition-colors"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-danger animate-pulse"></span>
            </button>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-emerald animate-pulse"></span>
              <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider hidden sm:inline-block">
                Clearance: {currentUser?.name} ({currentUser?.role})
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic page render slot */}
        <main className="flex-1 bg-[#030308]/40">
          {renderOsView()}
        </main>
      </div>

      {/* Global Command Center modal */}
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={setCurrentPage}
      />
    </div>
  );
}
