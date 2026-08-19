import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { JobListView } from './components/jobs/JobListView';
import { JobCreationForm } from './components/jobs/JobCreationForm';
import { ResumeUploadView } from './components/screening/ResumeUploadView';
import { CandidateRankingList } from './components/candidates/CandidateRankingList';
import { CandidateDetailModal } from './components/candidates/CandidateDetailModal';
import { CandidateComparisonView } from './components/candidates/CandidateComparisonView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ScreeningHistoryView } from './components/history/ScreeningHistoryView';
import { SettingsView } from './components/settings/SettingsView';
import { RecruiterCopilotDrawer } from './components/copilot/RecruiterCopilotDrawer';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <AppLayout>
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'jobs' && <JobListView />}
      {activeTab === 'create-job' && <JobCreationForm />}
      {activeTab === 'screening' && <ResumeUploadView />}
      {activeTab === 'candidates' && <CandidateRankingList />}
      {activeTab === 'comparison' && <CandidateComparisonView />}
      {activeTab === 'analytics' && <AnalyticsView />}
      {activeTab === 'history' && <ScreeningHistoryView />}
      {activeTab === 'settings' && <SettingsView />}

      {/* Global Candidate Detail Modal */}
      <CandidateDetailModal />

      {/* AI Recruiter Copilot Assistant */}
      <RecruiterCopilotDrawer />
    </AppLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
