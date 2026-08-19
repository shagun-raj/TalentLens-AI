import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../common/CircularProgress';
import { RecommendationBadge, RecruiterStatusBadge } from '../common/Badge';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  FileText,
  MapPin,
  Send,
  Columns,
  Download,
  Check,
  RotateCw,
  HelpCircle,
  Play
} from 'lucide-react';
import { evaluateExperience, classifySkills } from '../../utils/scoring';
import { SkillEvaluation } from '../../types';

export const CandidateDetailModal: React.FC = () => {
  const {
    selectedCandidateDetail,
    setSelectedCandidateDetail,
    currentJob,
    selectedJobId,
    updateCandidateStatus,
    addCandidateNote,
    comparedCandidateIds,
    toggleCompareCandidate,
    retryScreeningFile,
    uploadedFiles,
    isScreeningInProgress,
    addToast,
    getCandidateScreeningForJob,
    screenCandidateForJob
  } = useApp();

  const [activeSection, setActiveSection] = useState<'overview' | 'skills' | 'experience' | 'projects' | 'notes'>('overview');
  const [noteInput, setNoteInput] = useState('');
  const [isScreeningThisJob, setIsScreeningThisJob] = useState(false);

  if (!selectedCandidateDetail) return null;

  const c = selectedCandidateDetail;
  const isCompared = comparedCandidateIds.includes(c.id);

  const getInitials = (name?: string) => {
    if (!name || !name.trim()) return 'CD';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'CD';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Lookup the specific screening result evaluated strictly for (candidateId + resumeId + currentJob.id)
  const activeJobScreening = currentJob ? getCandidateScreeningForJob(c, currentJob.id) : undefined;
  const isScreenedForCurrentJob = Boolean(activeJobScreening);

  const isFailed = c.screeningStatus === 'failed';
  const hasValidScreening = isScreenedForCurrentJob && !isFailed;

  // Active Job Sub-scores strictly from activeJobScreening
  const overallScore = activeJobScreening?.overallScore ?? 0;
  const reqSkillsScore = activeJobScreening?.requiredSkillsScore ?? activeJobScreening?.skillsScore ?? 0;
  const expMatchScore = activeJobScreening?.experienceScore ?? 0;
  const projMatchScore = activeJobScreening?.projectScore ?? 0;
  const eduMatchScore = activeJobScreening?.educationScore ?? 0;
  const prefSkillsScore = activeJobScreening?.preferredSkillsScore ?? 0;

  // Classified skills computation for active job
  const jobReqSkills = currentJob?.requiredSkills || ['Communication', 'Problem Solving'];
  const jobPrefSkills = currentJob?.preferredSkills || [];
  const candidateFullText = `${c.name} ${c.currentRole} ${c.technicalSkills.join(' ')} ${c.aiSummary || ''} ${(c.workExperience || []).map(w => w.highlights.join(' ')).join(' ')}`;
  
  const classifiedSkills: SkillEvaluation[] = (activeJobScreening?.classifiedSkills && activeJobScreening.classifiedSkills.length > 0)
    ? activeJobScreening.classifiedSkills
    : [
        ...classifySkills(jobReqSkills, 'required', candidateFullText, c.technicalSkills),
        ...classifySkills(jobPrefSkills, 'preferred', candidateFullText, c.technicalSkills)
      ];

  const matchedSkillsList = activeJobScreening?.matchedSkills 
    ? activeJobScreening.matchedSkills.map(s => ({ skill: s, status: 'strong_match' as const, category: 'required' as const, evidence: 'Matched from resume' }))
    : classifiedSkills.filter(s => s.status === 'strong_match');

  const missingSkillsList = activeJobScreening?.missingSkills
    ? activeJobScreening.missingSkills.map(s => ({ skill: s, status: 'missing' as const, category: 'required' as const }))
    : classifiedSkills.filter(s => s.status === 'missing');

  // Experience comparison
  const expEval = activeJobScreening?.experienceEvaluation || evaluateExperience(c.yearsOfExperience || 0, currentJob?.experienceRequired);

  // Short Match Score Summary Description
  const matchExplanationText = overallScore >= 85
    ? 'Exceptional candidate fit with strong proficiency in all core requirements.'
    : overallScore >= 70
    ? 'Solid alignment with core requirements and relevant industry experience.'
    : overallScore >= 50
    ? 'Good potential, but some required skills or experience qualifications are missing.'
    : 'Limited alignment with the primary technical requirements of this role.';

  // Short AI Recommendation & Bullet Reasons
  const recRecommendation = activeJobScreening?.recommendation || 'Needs Review';
  const recLabel = overallScore >= 85
    ? 'Shortlist Candidate'
    : overallScore >= 70
    ? 'Consider for Review'
    : overallScore >= 50
    ? 'Review Candidate Carefully'
    : 'Consider Other Candidates';

  const recommendationReasons: string[] = [];
  if (matchedSkillsList.length > 0) {
    recommendationReasons.push(`Strong ${matchedSkillsList.slice(0, 2).map(s => s.skill).join(' & ')} background`);
  }
  recommendationReasons.push(
    expEval.status === 'met' || expEval.status === 'exceeded'
      ? `${c.yearsOfExperience || 0} years experience (Meets role requirement)`
      : `Experience gap: ${c.yearsOfExperience || 0} yrs vs ${currentJob?.experienceRequired || '2–4 years'} required`
  );
  if (missingSkillsList.length > 0) {
    recommendationReasons.push(`Missing role-specific skills: ${missingSkillsList.slice(0, 2).map(s => s.skill).join(', ')}`);
  }

  const handleScreenForCurrentJob = async () => {
    if (!currentJob) return;
    setIsScreeningThisJob(true);
    await screenCandidateForJob(c.id, currentJob.id);
    setIsScreeningThisJob(false);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteInput.trim()) {
      addCandidateNote(c.id, noteInput);
      setNoteInput('');
      addToast({
        type: 'success',
        title: 'Note Saved',
        description: 'Recruiter review note recorded.'
      });
    }
  };

  const handleDownloadCandidateResume = () => {
    try {
      const content = c.rawExtractedText || 
        `CANDIDATE PROFILE: ${c.name}\n` +
        `Current Role: ${c.currentRole}\n` +
        `Email: ${c.email}\n` +
        `Phone: ${c.phone}\n` +
        `Location: ${c.location}\n` +
        `Total Experience: ${c.yearsOfExperience} years\n` +
        `Screened For: ${currentJob?.title || 'General'}\n` +
        `AI Match Score: ${isScreenedForCurrentJob ? `${overallScore}%` : 'Not Screened'}\n\n` +
        `TECHNICAL SKILLS:\n${c.technicalSkills.join(', ')}\n\n` +
        `WORK EXPERIENCE:\n${(c.workExperience || []).map(w => `${w.role} at ${w.company} (${w.duration})\n${w.highlights.map(h => `• ${h}`).join('\n')}`).join('\n\n')}`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (c.resumeFileName || `${c.name.replace(/\s+/g, '_')}_Resume.txt`).replace(/\.pdf$/i, '.txt');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast({
        type: 'success',
        title: 'Resume Downloaded',
        description: `Saved profile record for ${c.name}.`
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* 1. TOP SUMMARY / HEADER */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-extrabold flex items-center justify-center text-lg shadow-md shrink-0">
              {getInitials(c.name)}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-100 truncate">{c.name || 'Candidate'}</h2>
                
                {/* Source badge */}
                {c.source === 'real-upload' || !c.isDemo ? (
                  <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    Real Upload
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded">
                    Sample Data
                  </span>
                )}

                {/* Screening status for Current Job */}
                {isScreenedForCurrentJob ? (
                  <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" />
                    AI Screened
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold bg-amber-950/70 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                    Not Screened for Current Role
                  </span>
                )}

                <RecruiterStatusBadge status={c.recruiterStatus} />
              </div>

              {/* Current Job Role Header Line */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="font-semibold text-slate-200">
                  Target Role: <span className="text-indigo-300">{currentJob?.title || 'Selected Job Opening'}</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">
                  {c.currentRole || 'Professional Role'} ({c.yearsOfExperience !== undefined ? `${c.yearsOfExperience} yrs exp` : 'Exp not specified'})
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-0.5">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {c.location || 'Not provided'}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-indigo-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  <FileText className="w-3 h-3" /> {c.resumeFileName || 'Resume.pdf'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadCandidateResume}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
              title="Download Extracted Record"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleCompareCandidate(c.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isCompared
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isCompared ? 'In Compare' : 'Add to Compare'}</span>
            </button>

            <button
              onClick={() => setSelectedCandidateDetail(null)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-800 flex items-center gap-2 bg-slate-950/40 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'overview', label: 'AI Match & Explainability' },
            { id: 'skills', label: 'Skills & Gap Analysis' },
            { id: 'experience', label: 'Work Experience & Education' },
            { id: 'projects', label: 'Projects & Certifications' },
            { id: 'notes', label: `Recruiter Notes (${c.recruiterNotes?.length || 0})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`py-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
                activeSection === tab.id
                  ? 'border-indigo-500 text-indigo-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: AI Match & Explainability */}
          {activeSection === 'overview' && (
            <div className="space-y-5">
              {/* Not Screened for Current Role Action Banner */}
              {!isScreenedForCurrentJob && currentJob ? (
                <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-indigo-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>Not Screened for "{currentJob.title}"</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      This candidate has not yet been evaluated against the requirements for <strong>{currentJob.title}</strong>. Click below to run AI screening and compute a job-specific score.
                    </p>
                  </div>
                  <button
                    onClick={handleScreenForCurrentJob}
                    disabled={isScreeningThisJob || isScreeningInProgress}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all shrink-0 cursor-pointer disabled:opacity-60"
                  >
                    <Play className={`w-3.5 h-3.5 ${isScreeningThisJob ? 'animate-spin' : ''}`} />
                    <span>{isScreeningThisJob ? 'Screening...' : `Screen for ${currentJob.title.split('(')[0].trim()}`}</span>
                  </button>
                </div>
              ) : null}

              {/* 2. MATCH SCORE CARD */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <CircularProgress
                      value={hasValidScreening ? overallScore : 0}
                      size={68}
                      strokeWidth={6}
                      showLabel={true}
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        AI Compatibility
                      </span>
                      <h3 className="font-bold text-2xl text-slate-100 mt-0.5">
                        {hasValidScreening ? (
                          <>
                            <span className="text-emerald-400 font-mono">{overallScore}%</span> AI Match Score
                          </>
                        ) : (
                          <span className="text-amber-400 text-lg">Screening Pending for This Role</span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Role: <span className="text-slate-200 font-medium">{currentJob?.title || 'Selected Opening'}</span>
                      </p>
                    </div>
                  </div>

                  {hasValidScreening && (
                    <RecommendationBadge recommendation={recRecommendation} size="lg" />
                  )}
                </div>

                {/* Short explanation under Match Score */}
                {hasValidScreening && (
                  <p className="text-xs text-slate-300 pt-1 border-t border-slate-800/80">
                    "{activeJobScreening?.explanation || matchExplanationText}"
                  </p>
                )}
              </div>

              {/* 3. WHY THIS SCORE (5 Dimensions Progress Bars) */}
              {hasValidScreening ? (
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Why this score?</span>
                    </h4>
                    <span className="text-xs font-mono font-bold text-emerald-400">Total Match: {overallScore}%</span>
                  </div>

                  {/* Clean Visual Progress Bars */}
                  <div className="space-y-2.5 text-xs">
                    {/* Skills (40%) */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span>Skills Match (40% weight)</span>
                        <span className="font-mono font-bold text-emerald-400">{reqSkillsScore}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                        <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${reqSkillsScore}%` }} />
                      </div>
                    </div>

                    {/* Experience (25%) */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span>Experience Match (25% weight)</span>
                        <span className="font-mono font-bold text-blue-400">{expMatchScore}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${expMatchScore}%` }} />
                      </div>
                    </div>

                    {/* Projects (15%) */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span>Projects Relevance (15% weight)</span>
                        <span className="font-mono font-bold text-purple-400">{projMatchScore}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                        <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${projMatchScore}%` }} />
                      </div>
                    </div>

                    {/* Education (10%) */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span>Education Match (10% weight)</span>
                        <span className="font-mono font-bold text-indigo-400">{eduMatchScore}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                        <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${eduMatchScore}%` }} />
                      </div>
                    </div>

                    {/* Preferred Skills (10%) */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span>Preferred Skills (10% weight)</span>
                        <span className="font-mono font-bold text-cyan-400">{prefSkillsScore}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                        <div className="bg-cyan-500 h-2 rounded-full transition-all duration-500" style={{ width: `${prefSkillsScore}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Skills Checklist Breakdown */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Required Skills & Gaps Breakdown
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* MATCHED */}
                      <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-1.5">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                          ✓ Matched Skills ({matchedSkillsList.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {matchedSkillsList.map(s => (
                            <span key={s.skill} className="text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded font-medium">
                              ✓ {s.skill}
                            </span>
                          ))}
                          {matchedSkillsList.length === 0 && (
                            <span className="text-xs text-slate-500">None detected</span>
                          )}
                        </div>
                      </div>

                      {/* MISSING */}
                      <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-1.5">
                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                          ✗ Skill Gaps ({missingSkillsList.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {missingSkillsList.map(s => (
                            <span key={s.skill} className="text-xs text-rose-300 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded font-medium">
                              ✕ {s.skill}
                            </span>
                          ))}
                          {missingSkillsList.length === 0 && (
                            <span className="text-xs text-emerald-400">All required skills present!</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Profile Summary when Not Screened */
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Candidate Profile Summary
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {c.aiSummary || `${c.name} has ${c.yearsOfExperience} years of experience specializing in ${c.currentRole}.`}
                  </p>
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Technical Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(c.technicalSkills || []).map(skill => (
                        <span key={skill} className="text-xs bg-slate-900 text-slate-200 border border-slate-800 px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. AI RECOMMENDATION */}
              {hasValidScreening && (
                <div className="bg-slate-950/90 border border-indigo-500/30 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Recommendation</span>
                    </div>
                    <span className="text-xs font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">
                      "{recLabel}"
                    </span>
                  </div>

                  <ul className="space-y-1.5 pt-1">
                    {recommendationReasons.map((reason, idx) => (
                      <li key={idx} className="text-xs text-slate-200 flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Skills & Gap Analysis */}
          {activeSection === 'skills' && (
            <div className="space-y-4">
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Role-Specific Skills Evaluation
                  </h4>
                  <span className="text-xs text-slate-400">Target: {currentJob?.title}</span>
                </div>

                <div className="space-y-3">
                  {classifiedSkills.map(skill => (
                    <div key={skill.skill} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-semibold text-slate-200">{skill.skill}</span>
                        {skill.category && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {skill.category}
                          </span>
                        )}
                        {skill.evidence && (
                          <p className="text-[11px] text-slate-400 mt-0.5">{skill.evidence}</p>
                        )}
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-1 rounded shrink-0 ${
                        skill.status === 'strong_match'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : skill.status === 'partial_match'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      }`}>
                        {skill.status === 'strong_match' ? 'Strong Match' : skill.status === 'partial_match' ? 'Partial Match' : 'Missing'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Work Experience & Education */}
          {activeSection === 'experience' && (
            <div className="space-y-4">
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  <span>Work Experience ({c.workExperience?.length || 0} roles)</span>
                </h4>

                <div className="space-y-4">
                  {(c.workExperience || []).map((w, idx) => (
                    <div key={w.id || idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="font-bold text-slate-100 text-sm">{w.role}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{w.duration}</span>
                      </div>
                      <p className="text-indigo-300 font-medium">{w.company} • {w.location || 'India'}</p>
                      {w.highlights && w.highlights.length > 0 && (
                        <ul className="space-y-1 pt-1 text-slate-300">
                          {w.highlights.map((h, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-1.5">
                              <span className="text-indigo-400">•</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                  <span>Education</span>
                </h4>

                <div className="space-y-3">
                  {(c.education || []).map((edu, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                      <p className="font-bold text-slate-100">{edu.degree}</p>
                      <p className="text-slate-400">{edu.university} {edu.graduationYear ? `• Class of ${edu.graduationYear}` : ''}</p>
                      {edu.gpa && <p className="text-indigo-300 font-mono text-[11px] mt-0.5">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Projects & Certifications */}
          {activeSection === 'projects' && (
            <div className="space-y-4">
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-indigo-400" />
                  <span>Projects ({c.projects?.length || 0})</span>
                </h4>

                <div className="space-y-3">
                  {(c.projects || []).map((p, idx) => (
                    <div key={p.id || idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
                      <span className="font-bold text-slate-100">{p.name}</span>
                      <p className="text-slate-300">{p.description}</p>
                      {p.techStack && p.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {p.techStack.map(t => (
                            <span key={t} className="text-[10px] bg-slate-950 text-indigo-300 border border-slate-800 px-1.5 py-0.5 rounded font-mono">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {(!c.projects || c.projects.length === 0) && (
                    <p className="text-xs text-slate-500">No project portfolio recorded in extracted text.</p>
                  )}
                </div>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <span>Certifications</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(c.certifications || []).map((cert, idx) => (
                    <span key={idx} className="text-xs bg-slate-900 text-slate-200 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{cert}</span>
                    </span>
                  ))}
                  {(!c.certifications || c.certifications.length === 0) && (
                    <p className="text-xs text-slate-500">No external certifications recorded.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Recruiter Notes */}
          {activeSection === 'notes' && (
            <div className="space-y-4">
              <form onSubmit={handleAddNoteSubmit} className="space-y-2">
                <textarea
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  placeholder="Add a recruiter screening note (e.g. 'Strong in Java, scheduled for round 1')..."
                  className="w-full h-24 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save Recruiter Note</span>
                  </button>
                </div>
              </form>

              <div className="space-y-2.5">
                {(c.recruiterNotes || []).map(n => (
                  <div key={n.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span className="font-bold text-slate-300">{n.author}</span>
                      <span className="font-mono">{n.date}</span>
                    </div>
                    <p className="text-slate-200">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer: Recruiter Status Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Recruiter Decision:</span>
            {(['screened', 'in_review', 'shortlisted', 'rejected'] as const).map(status => (
              <button
                key={status}
                onClick={() => updateCandidateStatus(c.id, status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  c.recruiterStatus === status
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isScreenedForCurrentJob && (
              <button
                onClick={handleScreenForCurrentJob}
                disabled={isScreeningThisJob || isScreeningInProgress}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-300 text-xs font-semibold border border-indigo-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isScreeningThisJob ? 'animate-spin' : ''}`} />
                <span>Re-screen Candidate</span>
              </button>
            )}
            <button
              onClick={() => setSelectedCandidateDetail(null)}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
