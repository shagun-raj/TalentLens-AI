import React from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, Users, FileUp, Sparkles, MapPin, ChevronRight, Plus } from 'lucide-react';

export const ActiveJobsGrid: React.FC = () => {
  const { jobs, selectedJobId, setSelectedJobId, setActiveTab } = useApp();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-200">Active Job Requisitions</h3>
        </div>
        <button
          onClick={() => setActiveTab('create-job')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post New Requisition</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {jobs.map((job) => {
          const isSelected = selectedJobId === job.id;

          return (
            <div
              key={job.id}
              onClick={() => setSelectedJobId(job.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-950/90 border-indigo-500/60 ring-1 ring-indigo-500/40'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                    {job.department}
                  </span>
                  <span className="text-[11px] text-slate-400">{job.employmentType}</span>
                </div>

                <h4 className="font-bold text-sm text-slate-100 mt-2.5 line-clamp-2 leading-snug">
                  {job.title}
                </h4>

                <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>

                {/* Requirements preview */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {job.requiredSkills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills.length > 3 && (
                    <span className="text-[10px] text-slate-400">+{job.requiredSkills.length - 3}</span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> {job.screenedCount} screened
                  </span>
                  {job.averageMatchScore > 0 && (
                    <span className="font-mono text-emerald-400 font-bold">
                      {job.averageMatchScore}% avg
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedJobId(job.id);
                    setActiveTab('screening');
                  }}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <FileUp className="w-3 h-3" /> Screen
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
