import React from 'react';
import { useApp } from '../../context/AppContext';
import { RecommendationBadge } from '../common/Badge';
import { History, Sparkles, ArrowRight, UserCheck } from 'lucide-react';

export const RecentActivityList: React.FC = () => {
  const { activities, candidates, setSelectedCandidateDetail, setActiveTab } = useApp();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-200">Recent Screening Activity</h3>
        </div>
        <button
          onClick={() => setActiveTab('history')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
        >
          <span>Full Audit Log</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {activities.slice(0, 5).map((act) => {
          const cand = candidates.find(c => c.id === act.candidateId);

          return (
            <div
              key={act.id}
              onClick={() => {
                if (cand) setSelectedCandidateDetail(cand);
              }}
              className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold font-mono text-xs border border-indigo-500/20 shrink-0">
                  {act.score}%
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-200 truncate">{act.candidateName}</span>
                    <RecommendationBadge recommendation={act.recommendation} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{act.action}</p>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 font-mono shrink-0 whitespace-nowrap">
                {act.timestamp}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
