import React from 'react';
import { SKILLS_ANALYTICS } from '../../data/mockData';
import { CheckCircle2, AlertCircle, Cpu } from 'lucide-react';

export const SkillsDistributionChart: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-200">Key Skills Prevalence in Applicant Pool</h3>
        </div>
        <span className="text-xs text-slate-400">Match % across resumes</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SKILLS_ANALYTICS.map((item) => {
          const isHigh = item.matchPercentage >= 75;
          const isMid = item.matchPercentage >= 60 && item.matchPercentage < 75;

          return (
            <div
              key={item.skill}
              className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-200">{item.skill}</span>
                <span className={`text-xs font-mono font-bold ${isHigh ? 'text-emerald-400' : isMid ? 'text-blue-400' : 'text-amber-400'}`}>
                  {item.matchPercentage}%
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>{item.candidateCount} / {item.requiredCount} applicants possess skill</span>
                {isHigh ? (
                  <span className="text-emerald-400 flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> High pool</span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-0.5"><AlertCircle className="w-3 h-3" /> Scarce skill</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
