import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecommendationBadge } from '../common/Badge';
import { CircularProgress } from '../common/CircularProgress';
import {
  Users,
  Search,
  ArrowUpDown,
  Sparkles,
  Columns,
  Eye,
  Clock,
  MapPin,
  FileText,
  X,
  FileUp,
  Zap,
  Check,
  Minus,
  Play
} from 'lucide-react';

export const CandidateRankingList: React.FC = () => {
  const {
    jobs,
    filteredCandidates,
    selectedJobId,
    setSelectedJobId,
    currentJob,
    setSelectedCandidateDetail,
    comparedCandidateIds,
    toggleCompareCandidate,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    candidates,
    loadSampleCandidates,
    hasLoadedDemoData,
    getCandidateScreeningForJob,
    screenCandidateForJob
  } = useApp();

  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [recFilter, setRecFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'real' | 'sample'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'experience' | 'name'>('score');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [screeningCandidateId, setScreeningCandidateId] = useState<string | null>(null);

  const normalizeRec = (r: string) => (r || '').toLowerCase().replace(/[\s_]+/g, '');
  const normalizeStatus = (s: string) => (s || '').toLowerCase().replace(/[\s_]+/g, '');

  const handleScreenForRole = async (candidateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentJob) return;
    setScreeningCandidateId(candidateId);
    await screenCandidateForJob(candidateId, currentJob.id);
    setScreeningCandidateId(null);
  };

  // Predictable Filtering Pipeline:
  // Evaluates candidate against targetJobId (currentJob.id or selectedJobId)
  const processedCandidates = [...filteredCandidates]
    .filter(c => {
      const activeScreening = getCandidateScreeningForJob(c, selectedJobId);
      const isScreenedForCurrent = Boolean(activeScreening);
      const score = activeScreening ? activeScreening.overallScore : 0;
      const rec = activeScreening?.recommendation || 'Needs Review';
      
      // Screening status filtering
      if (statusFilter === 'screened' && !isScreenedForCurrent) return false;
      if (statusFilter === 'not_screened' && isScreenedForCurrent) return false;
      if (statusFilter !== 'all' && statusFilter !== 'screened' && statusFilter !== 'not_screened') {
        if (normalizeStatus(c.recruiterStatus) !== normalizeStatus(statusFilter)) return false;
      }

      const matchesScore = minScoreFilter === 0 || (isScreenedForCurrent && score >= minScoreFilter);
      const matchesRec = recFilter === 'all' || (isScreenedForCurrent && normalizeRec(rec) === normalizeRec(recFilter));
      const matchesSource =
        sourceFilter === 'all' ||
        (sourceFilter === 'real' && (c.source === 'real-upload' || !c.isDemo)) ||
        (sourceFilter === 'sample' && Boolean(c.isDemo));

      return matchesScore && matchesRec && matchesSource;
    })
    .sort((a, b) => {
      const screeningA = getCandidateScreeningForJob(a, selectedJobId);
      const screeningB = getCandidateScreeningForJob(b, selectedJobId);
      let comparison = 0;
      if (sortBy === 'score') {
        const scoreA = screeningA ? screeningA.overallScore : -1;
        const scoreB = screeningB ? screeningB.overallScore : -1;
        comparison = scoreB - scoreA;
      } else if (sortBy === 'experience') {
        const expA = typeof a.yearsOfExperience === 'number' ? a.yearsOfExperience : 0;
        const expB = typeof b.yearsOfExperience === 'number' ? b.yearsOfExperience : 0;
        comparison = expB - expA;
      } else if (sortBy === 'name') {
        comparison = (a.name || '').localeCompare(b.name || '');
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });

  const resetAllFilters = () => {
    setMinScoreFilter(0);
    setRecFilter('all');
    setStatusFilter('all');
    setSourceFilter('all');
    setSearchQuery('');
  };

  const realCount = candidates.filter(c => (c.source === 'real-upload' || !c.isDemo)).length;
  const sampleCount = candidates.filter(c => c.isDemo).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Candidates & AI Rankings</span>
            </h1>
            <span className="text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
              {processedCandidates.length} profiles
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Active Job: <strong className="text-slate-200">{currentJob?.title || 'Selected Job Opening'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Target Role Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
            <span className="text-slate-400">Job:</span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="bg-transparent font-semibold text-slate-200 outline-none cursor-pointer max-w-[200px] truncate"
            >
              <option value="all" className="bg-slate-900 text-slate-200">
                All Job Requisitions
              </option>
              {jobs.map(j => (
                <option key={j.id} value={j.id} className="bg-slate-900 text-slate-200">
                  {j.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setActiveTab('screening')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Upload Resumes</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search candidates by name (e.g. Rohan Mehta, Ananya), role, skills, location, or resume filename..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Active Search Query Feedback */}
      {searchQuery.trim() && (
        <div className="flex items-center justify-between bg-indigo-950/40 border border-indigo-500/30 rounded-xl px-4 py-2 text-xs text-indigo-200">
          <span>
            Search results for <strong className="text-white">"{searchQuery}"</strong> ({processedCandidates.length} candidate profiles)
          </span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs font-semibold text-indigo-300 hover:text-white underline cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Filter Tabs & Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3">
        {/* Row 1: Source Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1">Source:</span>
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                sourceFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All Profiles ({candidates.length})
            </button>
            <button
              onClick={() => setSourceFilter('real')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                sourceFilter === 'real'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Real Uploads ({realCount})</span>
            </button>
            <button
              onClick={() => setSourceFilter('sample')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                sourceFilter === 'sample'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Sample Data ({sampleCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!hasLoadedDemoData ? (
              <button
                onClick={loadSampleCandidates}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                + Load Sample Profiles
              </button>
            ) : null}
          </div>
        </div>

        {/* Row 2: Secondary Dropdown Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Screening / Recruiter Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <span className="text-slate-400">Screening Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-200 outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-slate-200">All Statuses</option>
                <option value="screened" className="bg-slate-900 text-slate-200">Screened for this Job</option>
                <option value="not_screened" className="bg-slate-900 text-slate-200">Not Screened for this Job</option>
                <option value="shortlisted" className="bg-slate-900 text-slate-200">Shortlisted</option>
                <option value="in_review" className="bg-slate-900 text-slate-200">In Review</option>
                <option value="rejected" className="bg-slate-900 text-slate-200">Rejected</option>
              </select>
            </div>

            {/* Score Range Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <span className="text-slate-400">Min Score:</span>
              <select
                value={minScoreFilter}
                onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                className="bg-transparent font-semibold text-slate-200 outline-none cursor-pointer"
              >
                <option value={0} className="bg-slate-900 text-slate-200">Any Score</option>
                <option value={80} className="bg-slate-900 text-slate-200">80%+ (High Fit)</option>
                <option value={70} className="bg-slate-900 text-slate-200">70%+ (Good Fit)</option>
                <option value={50} className="bg-slate-900 text-slate-200">50%+ (Moderate)</option>
              </select>
            </div>

            {/* AI Recommendation Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <span className="text-slate-400">Recommendation:</span>
              <select
                value={recFilter}
                onChange={(e) => setRecFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-200 outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-slate-200">All Recommendations</option>
                <option value="Strong Fit" className="bg-slate-900 text-slate-200">Strong Fit</option>
                <option value="Moderate Fit" className="bg-slate-900 text-slate-200">Moderate Fit</option>
                <option value="Needs Review" className="bg-slate-900 text-slate-200">Needs Review</option>
                <option value="Low Fit" className="bg-slate-900 text-slate-200">Low Fit</option>
              </select>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <span className="text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-200 outline-none cursor-pointer"
              >
                <option value="score" className="bg-slate-900 text-slate-200">Match Score</option>
                <option value="experience" className="bg-slate-900 text-slate-200">Experience</option>
                <option value="name" className="bg-slate-900 text-slate-200">Name</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={`Sort ${sortOrder === 'desc' ? 'Ascending' : 'Descending'}`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Candidate List Render */}
      {processedCandidates.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">No candidates match the selected filters</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria, score thresholds, or source filter.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
            <button
              onClick={() => setActiveTab('screening')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
            >
              Upload Resumes
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {processedCandidates.map((candidate, idx) => {
            const isCompared = comparedCandidateIds.includes(candidate.id);
            const isReal = candidate.source === 'real-upload' || !candidate.isDemo;
            const activeScreening = getCandidateScreeningForJob(candidate, selectedJobId);
            const isScreenedForCurrent = Boolean(activeScreening);
            const displayScore = activeScreening ? activeScreening.overallScore : 0;
            const displayRec = activeScreening?.recommendation || 'Needs Review';
            const matchedSkills = activeScreening?.matchedSkills || [];
            const missingSkills = activeScreening?.missingSkills || [];

            return (
              <div
                key={candidate.id}
                className={`bg-slate-900/90 border rounded-xl p-4 transition-all duration-150 hover:bg-slate-900 ${
                  isReal
                    ? 'border-indigo-500/40 hover:border-indigo-500/70 shadow-sm'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Avatar, Rank, Candidate Info & Source Tag */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Rank Badge */}
                    <div className="flex flex-col items-center justify-center w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-slate-400 shrink-0">
                      #{idx + 1}
                    </div>

                    {/* Candidate Info */}
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2
                          className="text-base font-bold text-slate-100 hover:text-indigo-300 cursor-pointer truncate"
                          onClick={() => setSelectedCandidateDetail(candidate)}
                        >
                          {candidate.name}
                        </h2>

                        {/* Source Tag Distinction */}
                        {isReal ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                            <Sparkles className="w-3 h-3 text-indigo-400" />
                            <span>REAL UPLOAD</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            SAMPLE DATA
                          </span>
                        )}

                        {isScreenedForCurrent ? (
                          <span className="text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>AI Screened</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold bg-amber-950/70 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                            Not Screened for Current Role
                          </span>
                        )}

                        {isScreenedForCurrent && (
                          <RecommendationBadge recommendation={displayRec} size="sm" />
                        )}
                      </div>

                      <p className="text-xs text-slate-300 font-medium">
                        {candidate.currentRole}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                        {candidate.yearsOfExperience !== undefined && (
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {candidate.yearsOfExperience} yrs exp
                          </span>
                        )}
                        {candidate.location && candidate.location !== 'Not found' && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {candidate.location}
                          </span>
                        )}
                        {candidate.resumeFileName && (
                          <span className="flex items-center gap-1 font-mono text-slate-400">
                            <FileText className="w-3 h-3 text-slate-500" />
                            {candidate.resumeFileName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Top Matched Skills & Missing Skills */}
                  <div className="lg:w-1/3 space-y-2 border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-3 lg:pt-0 lg:pl-4">
                    {isScreenedForCurrent ? (
                      <>
                        {/* Top Matched Skills */}
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                            Role-Matched Skills:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {matchedSkills.slice(0, 4).map(skill => (
                              <span
                                key={skill}
                                className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded"
                              >
                                <Check className="w-2.5 h-2.5 text-emerald-400" />
                                <span>{skill}</span>
                              </span>
                            ))}
                            {matchedSkills.length === 0 && (
                              <span className="text-[10px] text-slate-500">None detected for role</span>
                            )}
                          </div>
                        </div>

                        {/* Missing Skills */}
                        {missingSkills.length > 0 && (
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                              Missing Requirements:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {missingSkills.slice(0, 3).map(skill => (
                                <span
                                  key={skill}
                                  className="inline-flex items-center gap-1 text-[10px] font-medium bg-rose-950/40 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded"
                                >
                                  <Minus className="w-2.5 h-2.5 text-rose-400" />
                                  <span>{skill}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                          Extracted Candidate Skills:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {(candidate.technicalSkills || []).slice(0, 4).map(skill => (
                            <span
                              key={skill}
                              className="text-[10px] font-medium bg-slate-950 text-slate-300 border border-slate-800 px-1.5 py-0.5 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Match Score & Action Buttons */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 border-slate-800/80 pt-3 lg:pt-0 shrink-0">
                    {/* Match Score Display */}
                    {isScreenedForCurrent ? (
                      <div className="flex items-center gap-2.5">
                        <CircularProgress
                          value={displayScore}
                          size={48}
                          strokeWidth={4.5}
                          showLabel={true}
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold text-slate-200 block">
                            {displayScore}% Match
                          </span>
                          <span className="text-[10px] text-slate-400">AI Compatibility</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleScreenForRole(candidate.id, e)}
                        disabled={screeningCandidateId === candidate.id}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
                      >
                        <Play className={`w-3.5 h-3.5 ${screeningCandidateId === candidate.id ? 'animate-spin' : ''}`} />
                        <span>{screeningCandidateId === candidate.id ? 'Screening...' : 'Screen Candidate'}</span>
                      </button>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCandidateDetail(candidate)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Profile</span>
                      </button>

                      <button
                        onClick={() => toggleCompareCandidate(candidate.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          isCompared
                            ? 'bg-indigo-950 border-indigo-500 text-indigo-200'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                        }`}
                        title={isCompared ? 'Remove from comparison' : 'Compare candidate'}
                      >
                        <Columns className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
