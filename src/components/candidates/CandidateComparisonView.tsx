import React from 'react';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../common/CircularProgress';
import { RecommendationBadge, RecruiterStatusBadge } from '../common/Badge';
import {
  Columns,
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  GraduationCap,
  Award,
  ArrowLeft,
  Users,
  Check,
  Minus
} from 'lucide-react';

export const CandidateComparisonView: React.FC = () => {
  const {
    candidates,
    comparedCandidateIds,
    toggleCompareCandidate,
    clearCompareCandidates,
    setSelectedCandidateDetail,
    updateCandidateStatus,
    setActiveTab,
    selectedJobId,
    currentJob,
    getCandidateScreeningForJob
  } = useApp();

  const selectedCandidates = candidates.filter(c => comparedCandidateIds.includes(c.id));

  if (selectedCandidates.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
        <Columns className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-200">No Candidates Selected for Comparison</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Select 2 to 4 candidates from the Candidate Rankings or Dashboard to view an explainable side-by-side evaluation matrix.
        </p>
        <button
          onClick={() => setActiveTab('candidates')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white inline-flex items-center gap-2 cursor-pointer"
        >
          <Users className="w-4 h-4" />
          <span>Browse Candidate Rankings</span>
        </button>
      </div>
    );
  }

  const getInitials = (name?: string) => {
    if (!name || !name.trim()) return 'CD';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'CD';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('candidates')}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Columns className="w-5 h-5 text-indigo-400" />
              <span>Side-by-Side Candidate Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparing {selectedCandidates.length} profiles for <strong>{currentJob?.title || 'Selected Job'}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={clearCompareCandidates}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            Clear Selection
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
          >
            Back to Ranking
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {selectedCandidates.map((cand) => {
          const activeScreening = getCandidateScreeningForJob(cand, selectedJobId);
          const isScreened = Boolean(activeScreening);
          const overallScore = activeScreening ? activeScreening.overallScore : 0;
          const skillsScore = activeScreening?.requiredSkillsScore ?? activeScreening?.skillsScore ?? 0;
          const expScore = activeScreening?.experienceScore ?? 0;
          const eduScore = activeScreening?.educationScore ?? 0;
          const matchedSkills = activeScreening?.matchedSkills || [];
          const missingSkills = activeScreening?.missingSkills || [];
          const education = Array.isArray(cand.education) ? cand.education : [];
          const expYears = typeof cand.yearsOfExperience === 'number' ? cand.yearsOfExperience : 0;
          const rec = activeScreening?.recommendation || 'Needs Review';

          return (
            <div
              key={cand.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-5 relative shadow-sm"
            >
              {/* Remove button */}
              <button
                onClick={() => toggleCompareCandidate(cand.id)}
                className="absolute top-3.5 right-3.5 p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Remove from comparison"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Profile Overview */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-950 border border-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-sm shrink-0">
                    {getInitials(cand.name)}
                  </div>
                  <div className="min-w-0 pr-6">
                    <h3
                      onClick={() => setSelectedCandidateDetail(cand)}
                      className="font-bold text-sm text-slate-100 hover:text-indigo-300 cursor-pointer truncate"
                    >
                      {cand.name || 'Candidate'}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">{cand.currentRole || 'Software Professional'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {isScreened ? (
                    <RecommendationBadge recommendation={rec} size="sm" />
                  ) : (
                    <span className="text-[10px] font-semibold bg-amber-950/70 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                      Not Screened for Role
                    </span>
                  )}
                  <RecruiterStatusBadge status={cand.recruiterStatus} />
                </div>

                {/* Radial Score Gauge */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-around">
                  <CircularProgress value={isScreened ? overallScore : 0} size={64} strokeWidth={5.5} showLabel={true} />
                  <div className="text-right text-xs space-y-1 font-mono">
                    <p className="text-slate-400">Skills: <strong className="text-slate-200">{isScreened ? `${skillsScore}%` : '—'}</strong></p>
                    <p className="text-slate-400">Exp: <strong className="text-slate-200">{isScreened ? `${expScore}%` : '—'}</strong></p>
                    <p className="text-slate-400">Edu: <strong className="text-slate-200">{isScreened ? `${eduScore}%` : '—'}</strong></p>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-indigo-300 text-[11px] block mb-1">AI Synthesis:</span>
                  {activeScreening?.explanation || cand.aiSummary || 'Profile evaluated for alignment with target role requirements.'}
                </div>

                {/* Experience & Education */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
                    <span className="text-slate-400 text-[11px] font-semibold block">Experience</span>
                    <span className="font-bold text-slate-200">{expYears} Years</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
                    <span className="text-slate-400 text-[11px] font-semibold block">Education</span>
                    <span className="font-medium text-slate-200 text-[11px] leading-tight block truncate">
                      {education[0]?.degree || 'Degree'} {education[0]?.university ? `• ${education[0].university}` : ''}
                    </span>
                  </div>
                </div>

                {/* Matched Skills */}
                {isScreened ? (
                  <>
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-emerald-400 block">
                        Matched Skills ({matchedSkills.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {matchedSkills.map(s => (
                          <span key={s} className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" />
                            <span>{s}</span>
                          </span>
                        ))}
                        {matchedSkills.length === 0 && (
                          <span className="text-[11px] text-slate-500">None detected</span>
                        )}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-rose-400 block">
                        Missing Target Skills ({missingSkills.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {missingSkills.length > 0 ? (
                          missingSkills.map(s => (
                            <span key={s} className="text-[10px] bg-rose-950/70 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Minus className="w-2.5 h-2.5" />
                              <span>{s}</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">None missing</span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-400 block">Extracted Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {(cand.technicalSkills || []).slice(0, 5).map(s => (
                        <span key={s} className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-1.5 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => setSelectedCandidateDetail(cand)}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                >
                  Inspect Full Profile
                </button>

                <button
                  onClick={() => updateCandidateStatus(cand.id, 'shortlisted')}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    cand.recruiterStatus === 'shortlisted'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-600/80 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {cand.recruiterStatus === 'shortlisted' ? '✓ Shortlisted' : 'Shortlist Candidate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
