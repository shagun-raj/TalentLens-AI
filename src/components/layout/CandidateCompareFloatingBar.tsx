import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Columns, X, ArrowRight, Layers, Trash2 } from 'lucide-react';

export const CandidateCompareFloatingBar: React.FC = () => {
  const { comparedCandidateIds, candidates, toggleCompareCandidate, clearCompareCandidates, setActiveTab } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  if (comparedCandidateIds.length === 0) return null;

  const comparedCandidates = candidates.filter(c => comparedCandidateIds.includes(c.id));

  return (
    <div className="fixed bottom-5 right-6 z-40 flex flex-col items-end">
      {/* Expanded Quick Panel */}
      {isExpanded ? (
        <div className="mb-2 bg-slate-900/95 border border-indigo-500/40 rounded-2xl shadow-2xl backdrop-blur-xl p-4 w-80 sm:w-96 text-xs text-slate-200 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Columns className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-slate-100">Compare Candidates ({comparedCandidateIds.length}/4)</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
              title="Minimize"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Selected Candidates list */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {comparedCandidates.map(c => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-[10px] shrink-0">
                    {c.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0 truncate">
                    <p className="font-semibold text-slate-200 truncate">{c.name}</p>
                    <p className="text-[10px] text-slate-400">{c.overallMatchScore}% Match • {c.currentRole}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleCompareCandidate(c.id)}
                  className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              onClick={clearCompareCandidates}
              className="text-slate-400 hover:text-rose-400 flex items-center gap-1 font-medium transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear all</span>
            </button>

            <button
              onClick={() => {
                setIsExpanded(false);
                setActiveTab('comparison');
              }}
              disabled={comparedCandidateIds.length < 2}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                comparedCandidateIds.length >= 2
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Open Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Floating Button / Pill */}
      <div className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-1.5 pl-3.5 pr-2.5 shadow-xl shadow-indigo-600/40 border border-indigo-400/30 transition-all cursor-pointer">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-xs font-bold"
        >
          <Columns className="w-4 h-4" />
          <span>Compare ({comparedCandidateIds.length})</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            clearCompareCandidates();
          }}
          className="p-1 hover:bg-indigo-700 rounded-full text-indigo-200 hover:text-white transition-colors ml-1"
          title="Clear comparison list"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
