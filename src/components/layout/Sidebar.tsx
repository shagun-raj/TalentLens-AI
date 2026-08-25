import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileUp,
  BarChart3,
  History,
  Settings,
  Sparkles,
  Layers,
  PlusCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentJob, candidates, jobs } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, badge: jobs.length },
    { id: 'candidates', label: 'Candidates', icon: Users, badge: candidates.length },
    { id: 'screening', label: 'Screening', icon: FileUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col shrink-0 select-none h-screen sticky top-0">
      {/* Brand Identity Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800/80">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-white">TalentLens</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              AI
            </span>
          </div>
          <span className="text-[11px] text-slate-400 truncate">Smart Talent Screening</span>
        </div>
      </div>

      {/* Active Job Context Card */}
      {currentJob && (
        <div className="p-3 mx-3 my-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-medium flex items-center gap-1 text-[11px] uppercase tracking-wider text-indigo-400">
              <Layers className="w-3 h-3" /> Active Context
            </span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
              {currentJob.employmentType}
            </span>
          </div>
          <p className="font-semibold text-slate-200 truncate leading-snug" title={currentJob.title}>
            {currentJob.title}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
            <span>{candidates.filter(c => c.jobId === currentJob.id).length} screened</span>
            <button
              onClick={() => setActiveTab('jobs')}
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-0.5"
            >
              Switch <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto pt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${
                    isActive
                      ? 'bg-indigo-500/30 text-indigo-200'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Launch Call-To-Action */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <button
          onClick={() => setActiveTab('create-job')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>New Job Opening</span>
        </button>
        <button
          onClick={() => setActiveTab('screening')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-colors"
        >
          <FileUp className="w-3.5 h-3.5" />
          <span>Upload Resumes</span>
        </button>
      </div>

      {/* Privacy Guarantee Footer */}
      <div className="p-3 text-[11px] text-slate-400 border-t border-slate-900 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="truncate">Explainable AI & Bias Checked</span>
      </div>
    </aside>
  );
};
