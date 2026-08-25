import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Plus,
  FileUp,
  Bell,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  Layers
} from 'lucide-react';

export const TopNav: React.FC = () => {
  const {
    jobs,
    selectedJobId,
    setSelectedJobId,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    activities,
    setSelectedCandidateDetail,
    candidates,
    isCopilotOpen,
    setIsCopilotOpen
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showJobSelector, setShowJobSelector] = useState(false);

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  return (
    <header className="h-16 bg-slate-950/70 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Job Context Switcher */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowJobSelector(!showJobSelector)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm font-medium transition-all"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="max-w-[220px] truncate">{selectedJob?.title || 'Select Role'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showJobSelector && (
            <div className="absolute top-full left-0 mt-1.5 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-2 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1">
                Active Job Requisitions
              </div>
              {jobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setShowJobSelector(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedJobId === job.id
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="font-semibold text-slate-200 truncate">{job.title}</p>
                    <p className="text-[11px] text-slate-400">{job.department} • {job.screenedCount} candidates</p>
                  </div>
                  {selectedJobId === job.id && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
                </button>
              ))}
              <div className="pt-2 border-t border-slate-800 mt-1">
                <button
                  onClick={() => {
                    setShowJobSelector(false);
                    setActiveTab('create-job');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Requisition</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Search Candidates and Skills */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, skill (e.g. React, PostgreSQL), or role..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-slate-200 placeholder:text-slate-400 transition-all outline-none"
          />
        </div>
      </div>

      {/* Right: Actions, Notifications & Recruiter Avatar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('create-job')}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-indigo-400" />
          <span>New Job</span>
        </button>

        <button
          onClick={() => setIsCopilotOpen(!isCopilotOpen)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            isCopilotOpen
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
              : 'bg-indigo-950/60 hover:bg-indigo-900/80 border-indigo-500/40 text-indigo-300'
          }`}
          title="Open AI Recruiter Copilot"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        <button
          onClick={() => setActiveTab('screening')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 transition-colors"
        >
          <FileUp className="w-3.5 h-3.5" />
          <span>Upload Resumes</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
            title="Screening Activity & Alerts"
          >
            <Bell className="w-4 h-4" />
            {activities.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-950 animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Screening Activity Log
                </span>
                <span className="text-[10px] text-slate-400">{activities.length} updates</span>
              </div>
              <div className="max-h-72 overflow-y-auto space-y-2 mt-2">
                {activities.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    onClick={() => {
                      const cand = candidates.find(c => c.id === act.candidateId);
                      if (cand) setSelectedCandidateDetail(cand);
                      setShowNotifications(false);
                    }}
                    className="p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 cursor-pointer border border-slate-800/60 transition-colors text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 truncate">{act.candidateName}</span>
                      <span className="font-mono text-emerald-400 font-bold">{act.score}%</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{act.action}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{act.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recruiter Avatar Profile Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-sm ring-1 ring-white/10">
            SJ
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-tight">Sarah Jenkins</p>
            <p className="text-[10px] text-indigo-400 font-medium">Lead Technical Recruiter</p>
          </div>
        </div>
      </div>
    </header>
  );
};
