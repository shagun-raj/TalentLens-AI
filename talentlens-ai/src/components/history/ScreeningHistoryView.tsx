import React from 'react';
import { useApp } from '../../context/AppContext';
import { RecommendationBadge } from '../common/Badge';
import { History, Sparkles, FileText, UserCheck, Calendar, Filter } from 'lucide-react';

export const ScreeningHistoryView: React.FC = () => {
  const { activities, candidates, setSelectedCandidateDetail } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          <span>Screening Audit & Activity History</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Complete audit trail of AI resume evaluations and recruiter decision updates.
        </p>
      </div>

      {/* Activity Timeline Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-800">
          {activities.map((act) => {
            const cand = candidates.find(c => c.id === act.candidateId);

            return (
              <div
                key={act.id}
                onClick={() => {
                  if (cand) setSelectedCandidateDetail(cand);
                }}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-950/40 cursor-pointer transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {act.score}%
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-100 truncate">{act.candidateName}</span>
                      <RecommendationBadge status={act.recommendation} size="sm" />
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">{act.jobTitle}</p>
                    <p className="text-xs text-indigo-300/90 mt-1 font-medium">{act.action}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{act.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
