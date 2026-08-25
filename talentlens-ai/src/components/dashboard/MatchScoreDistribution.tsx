import React from 'react';
import { MATCH_DISTRIBUTION } from '../../data/mockData';
import { Target } from 'lucide-react';

export const MatchScoreDistribution: React.FC = () => {
  const total = MATCH_DISTRIBUTION.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-200">Candidate Score Distribution</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">15 Resumes Analyzed</span>
      </div>

      <div className="space-y-3.5">
        {MATCH_DISTRIBUTION.map((item) => {
          const percentage = Math.round((item.count / total) * 100);
          let barColor = 'bg-emerald-500';
          let textColor = 'text-emerald-400';

          if (item.range.includes('80')) {
            barColor = 'bg-blue-500';
            textColor = 'text-blue-400';
          } else if (item.range.includes('70')) {
            barColor = 'bg-amber-500';
            textColor = 'text-amber-400';
          } else if (item.range.includes('Below')) {
            barColor = 'bg-rose-500';
            textColor = 'text-rose-400';
          }

          return (
            <div key={item.range} className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200 font-mono">{item.range}</span>
                  <span className="text-slate-400 text-[11px]">({item.label})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-bold">{item.count} candidates</span>
                  <span className={`font-mono font-semibold ${textColor}`}>({percentage}%)</span>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
