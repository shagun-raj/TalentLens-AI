import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecommendationBadge, RecruiterStatusBadge } from '../common/Badge';
import {
  Briefcase,
  Users,
  FileUp,
  Sparkles,
  CheckCircle2,
  Plus,
  ArrowRight,
  MapPin,
  Clock,
  IndianRupee,
  Layers,
  AlertCircle,
  Search,
  ChevronDown,
  Eye,
  Check,
  RotateCw
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    jobs,
    candidates,
    selectedJobId,
    setSelectedJobId,
    currentJob,
    setActiveTab,
    setSelectedCandidateDetail,
    searchQuery,
    setSearchQuery,
    uploadedFiles,
    retryScreeningFile,
    isScreeningInProgress,
    getCandidateScreeningForJob
  } = useApp();

  const [showJobSelector, setShowJobSelector] = useState(false);

  // 4 Core Real Metrics
  const activeJobsCount = jobs.filter(j => j.status === 'active').length;
  const totalCandidatesCount = candidates.length;
  const aiScreenedCount = candidates.filter(c => Boolean(getCandidateScreeningForJob(c, selectedJobId))).length;
  const shortlistedCount = candidates.filter(c => c.recruiterStatus === 'shortlisted').length;

  // Real "Needs Attention" Calculations
  const waitingReviewCandidates = candidates.filter(c => {
    const scr = getCandidateScreeningForJob(c, selectedJobId);
    const score = scr ? scr.overallScore : 0;
    return c.recruiterStatus === 'in_review' || (c.recruiterStatus === 'screened' && score >= 70);
  });
  const shortlistedCandidates = candidates.filter(c => c.recruiterStatus === 'shortlisted');
  const failedOrPendingUploads = uploadedFiles.filter(f => f.status === 'failed' || f.status === 'uploaded');

  // Filtered recent candidates based on search
  const displayedCandidates = candidates
    .filter(c => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.currentRole.toLowerCase().includes(q) ||
        c.technicalSkills.some(s => s.toLowerCase().includes(q))
      );
    })
    .slice(0, 5);

  const recentJobs = [...jobs].slice(0, 4);

  // Recently uploaded file for quick feedback banner
  const latestUploaded = uploadedFiles.length > 0 ? uploadedFiles[uploadedFiles.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* 1. CLEAN TOP BAR: ACTIVE JOB CONTEXT + SEARCH + ACTIONS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm">
        {/* Left: Active Job Context Selector */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowJobSelector(!showJobSelector)}
              className="text-left bg-slate-950 border border-slate-800 hover:border-indigo-500/50 px-3.5 py-2 rounded-xl transition-all flex items-center gap-2.5"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
                  Active Job Requisition
                </span>
                <span className="text-sm font-bold text-slate-100 max-w-[240px] truncate block">
                  {currentJob?.title || 'Senior Full-Stack Engineer'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1 shrink-0" />
            </button>

            {showJobSelector && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 border-b border-slate-800">
                  Select Job Context
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1 pt-1">
                  <button
                    onClick={() => {
                      setSelectedJobId('all');
                      setShowJobSelector(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedJobId === 'all'
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <span>All Job Requisitions</span>
                    {selectedJobId === 'all' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>

                  {jobs.map(job => (
                    <button
                      key={job.id}
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setShowJobSelector(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedJobId === job.id
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <p className="font-semibold text-slate-200 truncate">{job.title}</p>
                        <p className="text-[10px] text-slate-400">{job.department} • {job.location}</p>
                      </div>
                      {selectedJobId === job.id && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="hidden md:block text-xs text-slate-400">
            {currentJob?.department || 'Engineering'} • {currentJob?.location || 'Bengaluru, India'}
          </p>
        </div>

        {/* Center/Right: Search and Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Search */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search candidate, skill, role..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Secondary Action: Create Job */}
          <button
            onClick={() => setActiveTab('create-job')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>New Job</span>
          </button>

          {/* Primary Action: Upload Resume */}
          <button
            onClick={() => setActiveTab('screening')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-sm shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Upload Resume</span>
          </button>
        </div>
      </div>

      {/* 8. UPLOAD FEEDBACK NOTIFICATION (if latest file uploaded) */}
      {latestUploaded && latestUploaded.status === 'analyzed' && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-emerald-300">Resume Uploaded & Screened</p>
              <p className="text-slate-300 text-[11px] mt-0.5">
                <strong className="text-white">{latestUploaded.candidateName || latestUploaded.name}</strong> was added to your candidate list with AI compatibility evaluation.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('candidates')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
            >
              View Candidates
            </button>
          </div>
        </div>
      )}

      {/* 2. 4 CORE SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Active Jobs */}
        <div
          onClick={() => setActiveTab('jobs')}
          className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Active Jobs</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold font-mono text-slate-100">{activeJobsCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Open requisitions</p>
          </div>
        </div>

        {/* Card 2: Total Candidates */}
        <div
          onClick={() => setActiveTab('candidates')}
          className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Total Candidates</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold font-mono text-slate-100">{totalCandidatesCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">In talent pipeline</p>
          </div>
        </div>

        {/* Card 3: AI Screened */}
        <div
          onClick={() => setActiveTab('candidates')}
          className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">AI Screened</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold font-mono text-emerald-400">{aiScreenedCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Scored & evaluated</p>
          </div>
        </div>

        {/* Card 4: Shortlisted */}
        <div
          onClick={() => setActiveTab('candidates')}
          className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Shortlisted</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold font-mono text-amber-400">{shortlistedCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Approved for interview</p>
          </div>
        </div>
      </div>

      {/* 3. "NEEDS YOUR ATTENTION" SECTION */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-indigo-400" />
            <span>Needs Your Attention</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Real-time pipeline alerts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          {/* Item 1: Waiting for Review */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="font-bold text-slate-200">
                {waitingReviewCandidates.length} candidate{waitingReviewCandidates.length !== 1 ? 's' : ''} waiting for review
              </p>
              <p className="text-[11px] text-slate-400">Screened with good role alignment</p>
            </div>
            <button
              onClick={() => setActiveTab('candidates')}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 transition-colors"
            >
              Review
            </button>
          </div>

          {/* Item 2: Shortlisted Candidates */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="font-bold text-slate-200">
                {shortlistedCandidates.length} candidate{shortlistedCandidates.length !== 1 ? 's' : ''} shortlisted
              </p>
              <p className="text-[11px] text-slate-400">Ready for interview coordination</p>
            </div>
            <button
              onClick={() => setActiveTab('candidates')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shrink-0 border border-slate-700 transition-colors"
            >
              View Shortlist
            </button>
          </div>

          {/* Item 3: Resumes / Re-screening status */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              {failedOrPendingUploads.length > 0 ? (
                <>
                  <p className="font-bold text-amber-300">
                    {failedOrPendingUploads.length} resume{failedOrPendingUploads.length !== 1 ? 's' : ''} needs re-screening
                  </p>
                  <p className="text-[11px] text-slate-400">Retry screening with 1 click</p>
                </>
              ) : (
                <>
                  <p className="font-bold text-emerald-300">All uploads screened</p>
                  <p className="text-[11px] text-slate-400">No pending resume queues</p>
                </>
              )}
            </div>
            <button
              onClick={() => setActiveTab('screening')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shrink-0 border border-slate-700 transition-colors"
            >
              Upload Resumes
            </button>
          </div>
        </div>
      </div>

      {/* 4 & 5. MAIN GRID: RECENT CANDIDATES & RECENT JOBS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Recent Candidates List / Table */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-100">Recent Candidates</h3>
            </div>
            <button
              onClick={() => setActiveTab('candidates')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>View All ({candidates.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {displayedCandidates.length === 0 ? (
            /* 7. FRIENDLY EMPTY STATE */
            <div className="p-8 text-center space-y-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <Users className="w-8 h-8 text-slate-500 mx-auto" />
              <div>
                <p className="text-sm font-bold text-slate-200">No candidates yet</p>
                <p className="text-xs text-slate-400 mt-1">Upload resumes to start screening candidates.</p>
              </div>
              <button
                onClick={() => setActiveTab('screening')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors"
              >
                Upload Resume
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {displayedCandidates.map(c => {
                const isReal = !c.isDemo;
                const activeScreening = getCandidateScreeningForJob(c, selectedJobId);
                const isScreened = Boolean(activeScreening);
                const displayScore = activeScreening ? activeScreening.overallScore : 0;
                const displayRec = activeScreening?.recommendation;

                return (
                  <div
                    key={c.id}
                    className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-950/40 px-2 rounded-xl transition-colors"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          onClick={() => setSelectedCandidateDetail(c)}
                          className="text-xs font-bold text-slate-100 hover:text-indigo-300 cursor-pointer truncate"
                        >
                          {c.name}
                        </span>

                        {isReal ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shrink-0">
                            REAL UPLOAD
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                            SAMPLE DATA
                          </span>
                        )}

                        {isScreened && displayRec ? (
                          <RecommendationBadge recommendation={displayRec} size="sm" />
                        ) : (
                          <span className="text-[10px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                            Not screened for role
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 truncate">
                        {c.currentRole} • {c.yearsOfExperience} yrs exp • {c.location}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="text-right">
                        {isScreened ? (
                          <>
                            <span className="text-xs font-bold font-mono text-emerald-400 block">
                              {displayScore}%
                            </span>
                            <span className="text-[10px] text-slate-400">Match Score</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-bold font-mono text-slate-500 block">
                              —
                            </span>
                            <span className="text-[10px] text-slate-500">Not Screened</span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedCandidateDetail(c)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-indigo-400" />
                        <span>View Profile</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Column: Recent Jobs */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-100">Recent Jobs</h3>
            </div>
            <button
              onClick={() => setActiveTab('jobs')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>All Jobs ({jobs.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentJobs.map(job => (
              <div
                key={job.id}
                onClick={() => {
                  setSelectedJobId(job.id);
                  setActiveTab('candidates');
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                  selectedJobId === job.id
                    ? 'bg-indigo-950/40 border-indigo-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-indigo-500/30 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-100 truncate">{job.title}</p>
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-500/30 shrink-0">
                    {job.screenedCount} candidates
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{job.department} • {job.location}</span>
                  <span className="text-emerald-400 font-medium">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
