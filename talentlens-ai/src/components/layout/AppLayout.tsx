import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { ResponsibleAINotice } from './ResponsibleAINotice';
import { ToastContainer } from '../common/ToastContainer';
import { CandidateCompareFloatingBar } from './CandidateCompareFloatingBar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Primary Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Responsible AI Compliance Notice */}
        <ResponsibleAINotice />

        {/* Global Top Nav */}
        <TopNav />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-900/50 p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Persistent Toasts */}
      <ToastContainer />

      {/* Floating Comparison Drawer Launcher */}
      <CandidateCompareFloatingBar />
    </div>
  );
};
