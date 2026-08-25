import React from 'react';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../common/CircularProgress';
import { RecommendationBadge } from '../common/Badge';
import { ArrowRight, Sparkles, MapPin, Briefcase } from 'lucide-react';

export const TopCandidatesWidget: React.FC = () => {
  const { filteredCandidates, setSelectedCandidateDetail, setActiveTab } = useApp();

  // Top 4 ranked candidates sorted by match score
  const topCandidates = [...filteredCandidates]
    .sort((a, b) => (b.overallMatchScore ?? 0) - (a.overallMatchScore ?? 0))
    .slice(0, 4);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-200">Top Ranked AI Matches</h3>
        </div>
        <button
          onClick={() => setActiveTab('candidates')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
        >
          <span>View All Ranked Candidates</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {topCandidates.map((cand, index) => {
          const matchedSkills = Array.isArray(cand.matchedSkills) ? cand.matchedSkills : [];
          const overallScore = typeof cand.overallMatchScore === 'number' ? cand.overallMatchScore : 0;
          const expYears = typeof cand.yearsOfExperience === 'number' ? cand.yearsOfExperience : 0;

          return (
            <div
              key={cand.id}
              onClick={() => setSelectedCandidateDetail(cand)}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-indigo-500/50 hover:bg-slate-950 cursor-pointer transition-all duration-200 group flex items-start gap-4"
            >
              {/* Circular score gauge */}
              <div className="shrink-0">
                <CircularProgress score={overallScore} size={54} strokeWidth={5} labelSize="text-sm" />
              </div>

              {/* Candidate summary info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs font-bold text-slate-400">#{index + 1}</span>
                    <h4 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors truncate">
                      {cand.name || 'Candidate'}
                    </h4>
                  </div>
                  <RecommendationBadge recommendation={cand.recommendation} size="sm" />
                </div>

                <div className="flex items-center gap-2 mt-1">
                  {!cand.isDemo ? (
                    <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/60 px-1.5 py-0.2 rounded border border-indigo-500/30 flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                      Real Profile
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded">
                      Sample Data
                    </span>
                  )}
                  <p className="text-xs text-slate-300 truncate">{cand.currentRole || 'Software Professional'}</p>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-slate-400" /> {expYears} yrs exp
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {cand.location || 'Location Not Specified'}
                  </span>
                </div>

                {/* Matched skills pill tags */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {matchedSkills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] bg-slate-800/90 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700/60"
                    >
                      {skill}
                    </span>
                  ))}
                  {matchedSkills.length > 3 && (
                    <span className="text-[10px] text-slate-400 px-1 py-0.5">
                      +{matchedSkills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
