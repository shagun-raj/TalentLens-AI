import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, Candidate } from '../../types';
import { RecommendationBadge } from '../common/Badge';
import {
  Briefcase,
  Plus,
  Users,
  FileUp,
  MapPin,
  Clock,
  IndianRupee,
  ChevronRight,
  Filter,
  Layers,
  Sparkles,
  Edit,
  Eye,
  CheckCircle2,
  AlertTriangle,
  X,
  Check,
  RotateCcw,
  Search,
  Calendar,
  Building,
  GraduationCap
} from 'lucide-react';

export const JobListView: React.FC = () => {
  const {
    jobs,
    selectedJobId,
    setSelectedJobId,
    setActiveTab,
    updateJob,
    closeJob,
    reopenJob,
    candidates,
    setSelectedCandidateDetail,
    addToast
  } = useApp();

  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'closed' | 'paused'>('all');
  const [jobSearch, setJobSearch] = useState<string>('');

  // Modals state
  const [detailJobModal, setDetailJobModal] = useState<Job | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [confirmCloseJob, setConfirmCloseJob] = useState<Job | null>(null);

  // Edit Job form state
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDepartment, setEditDepartment] = useState<string>('');
  const [editLocation, setEditLocation] = useState<string>('');
  const [editExperience, setEditExperience] = useState<string>('');
  const [editSalary, setEditSalary] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editEducation, setEditEducation] = useState<string>('');
  const [editStatus, setEditStatus] = useState<Job['status']>('active');
  const [editReqSkills, setEditReqSkills] = useState<string[]>([]);
  const [editPrefSkills, setEditPrefSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState<string>('');

  const departments = ['all', ...Array.from(new Set(jobs.map(j => j.department)))];

  const filteredJobs = jobs.filter(job => {
    const matchesDept = selectedDept === 'all' || job.department === selectedDept;
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesSearch = !jobSearch.trim() || (
      job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.department.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.location.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.requiredSkills.some(s => s.toLowerCase().includes(jobSearch.toLowerCase()))
    );
    return matchesDept && matchesStatus && matchesSearch;
  });

  const handleOpenEdit = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingJob(job);
    setEditTitle(job.title);
    setEditDepartment(job.department);
    setEditLocation(job.location);
    setEditExperience(job.experienceRequired);
    setEditSalary(job.salaryRange || '₹12,00,000 - ₹20,00,000');
    setEditDescription(job.description);
    setEditEducation(job.educationRequirements);
    setEditStatus(job.status);
    setEditReqSkills([...job.requiredSkills]);
    setEditPrefSkills([...job.preferredSkills]);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    updateJob(editingJob.id, {
      title: editTitle.trim(),
      department: editDepartment.trim(),
      location: editLocation.trim(),
      experienceRequired: editExperience.trim(),
      salaryRange: editSalary.trim(),
      description: editDescription.trim(),
      educationRequirements: editEducation.trim(),
      status: editStatus,
      requiredSkills: editReqSkills,
      preferredSkills: editPrefSkills,
    });

    setEditingJob(null);
  };

  const handleAddReqSkill = () => {
    if (newSkillInput.trim() && !editReqSkills.includes(newSkillInput.trim())) {
      setEditReqSkills(prev => [...prev, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveReqSkill = (skill: string) => {
    setEditReqSkills(prev => prev.filter(s => s !== skill));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <span>Job Requisitions & Openings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your open roles across all professions (Tech, HR, Finance, Design, Civil, Healthcare, Support, etc.).
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create-job')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Job Opening</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
        {/* Left: Search & Department */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              placeholder="Search job title, skill, location..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Status Filters */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {(['all', 'active', 'paused', 'draft', 'closed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all shrink-0 ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center space-y-3 bg-slate-900/60 rounded-3xl border border-slate-800 max-w-xl mx-auto my-6">
          <Briefcase className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No job requisitions found</h3>
          <p className="text-xs text-slate-400">
            {jobSearch || selectedDept !== 'all' || statusFilter !== 'all'
              ? 'Try clearing your search query or department filter.'
              : 'Create your first job opening to begin screening resumes.'}
          </p>
          <button
            onClick={() => setActiveTab('create-job')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors"
          >
            Create New Job Opening
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => {
            const isSelected = selectedJobId === job.id;
            const jobCandidates = candidates.filter(c => c.jobId === job.id);
            const screenedCount = jobCandidates.filter(c => c.overallMatchScore > 0).length;
            const shortlistedCount = jobCandidates.filter(c => c.recruiterStatus === 'shortlisted').length;

            return (
              <div
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500 shadow-xl shadow-indigo-950/40'
                    : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/30 hover:bg-slate-900'
                }`}
              >
                <div>
                  {/* Top Tags & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/30 text-indigo-300">
                      {job.department}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        job.status === 'active'
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                          : job.status === 'paused'
                          ? 'bg-amber-950/80 text-amber-400 border-amber-500/30'
                          : job.status === 'closed'
                          ? 'bg-rose-950/80 text-rose-400 border-rose-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base text-slate-100 mt-3 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                    {job.title}
                  </h3>

                  {/* Job Metadata */}
                  <div className="space-y-1.5 mt-3 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{job.experienceRequired}</span>
                    </div>
                    {job.salaryRange && (
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-300">{job.salaryRange}</span>
                      </div>
                    )}
                  </div>

                  {/* Required Skills Chips */}
                  <div className="mt-4">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Required Skills ({job.requiredSkills.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {job.requiredSkills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 4 && (
                        <span className="text-[11px] text-slate-400 px-1 py-0.5">
                          +{job.requiredSkills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Stats & Quick Actions */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-100">{jobCandidates.length}</span>
                      <span className="text-slate-400 text-[10px] ml-1">candidates</span>
                    </div>
                    {screenedCount > 0 && (
                      <div>
                        <span className="font-bold text-emerald-400">{screenedCount}</span>
                        <span className="text-slate-400 text-[10px] ml-1">screened</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setDetailJobModal(job)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="View Job Details & Requirements"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleOpenEdit(job, e)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Edit Job Requisition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setActiveTab('candidates');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <span>Candidates</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 10. FULL JOB DETAIL MODAL */}
      {detailJobModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/30 text-indigo-300">
                    {detailJobModal.department}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400">
                    {detailJobModal.status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-100">{detailJobModal.title}</h2>
                <p className="text-xs text-slate-400">
                  {detailJobModal.location} • {detailJobModal.employmentType} • {detailJobModal.experienceRequired}
                </p>
              </div>

              <button
                onClick={() => setDetailJobModal(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <p className="text-slate-400">Total Candidates</p>
                <p className="text-lg font-bold font-mono text-slate-100 mt-0.5">
                  {candidates.filter(c => c.jobId === detailJobModal.id).length}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <p className="text-slate-400">AI Screened</p>
                <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                  {candidates.filter(c => c.jobId === detailJobModal.id && c.overallMatchScore > 0).length}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <p className="text-slate-400">Shortlisted</p>
                <p className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                  {candidates.filter(c => c.jobId === detailJobModal.id && c.recruiterStatus === 'shortlisted').length}
                </p>
              </div>
            </div>

            {/* Job Details Section */}
            <div className="space-y-4 text-xs">
              {/* Salary & Education */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Compensation (INR)</span>
                  </span>
                  <p className="font-bold text-slate-200">{detailJobModal.salaryRange || 'Competitive (INR)'}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Education Requirement</span>
                  </span>
                  <p className="font-medium text-slate-200">{detailJobModal.educationRequirements}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <span className="font-bold text-slate-200">Required Skills (40% Weight):</span>
                <div className="flex flex-wrap gap-1.5">
                  {detailJobModal.requiredSkills.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {detailJobModal.preferredSkills.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-200">Preferred Skills (10% Weight):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {detailJobModal.preferredSkills.map(s => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1.5 pt-2">
                <span className="font-bold text-slate-200">Job Description:</span>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {detailJobModal.description}
                </p>
              </div>
            </div>

            {/* Candidates for this Job */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Candidates Evaluated for this Role</span>
                <span className="text-slate-400 font-mono">
                  {candidates.filter(c => c.jobId === detailJobModal.id).length} candidates
                </span>
              </h3>

              {candidates.filter(c => c.jobId === detailJobModal.id).length === 0 ? (
                /* 11. EMPTY CANDIDATES STATE */
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                  <p className="font-bold text-slate-200 text-xs">No candidates for this job yet.</p>
                  <p className="text-[11px] text-slate-400">Upload resumes to screen candidates against this role.</p>
                  <button
                    onClick={() => {
                      setSelectedJobId(detailJobModal.id);
                      setDetailJobModal(null);
                      setActiveTab('screening');
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors"
                  >
                    Upload Resumes
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80 bg-slate-950/60 rounded-2xl border border-slate-800 p-2">
                  {candidates.filter(c => c.jobId === detailJobModal.id).map(cand => (
                    <div key={cand.id} className="py-2.5 px-3 flex items-center justify-between gap-3 hover:bg-slate-900/50 rounded-xl transition-colors">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-200 text-xs truncate">{cand.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{cand.currentRole} • {cand.yearsOfExperience} yrs exp</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-bold font-mono text-emerald-400">{cand.overallMatchScore}%</span>
                        <button
                          onClick={() => {
                            setDetailJobModal(null);
                            setSelectedCandidateDetail(cand);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setSelectedJobId(detailJobModal.id);
                  setDetailJobModal(null);
                  addToast({
                    type: 'success',
                    title: 'Active Job Switched',
                    description: `Active context switched to "${detailJobModal.title}".`
                  });
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors"
              >
                Set as Active Job Context
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmCloseJob(detailJobModal)}
                  className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
                >
                  Close Job
                </button>
                <button
                  onClick={() => setDetailJobModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12. EDIT JOB MODAL */}
      {editingJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <form onSubmit={handleSaveEdit} className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Edit className="w-4 h-4 text-indigo-400" />
                <span>Edit Job Requisition</span>
              </h2>
              <button
                type="button"
                onClick={() => setEditingJob(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning banner */}
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                <strong>Note:</strong> If you modify required skills or experience, existing candidate match scores can be re-evaluated when you screen candidates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-200">Job Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-200">Department</label>
                <input
                  type="text"
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-200">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-200">Experience Required</label>
                <input
                  type="text"
                  value={editExperience}
                  onChange={(e) => setEditExperience(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-200">Salary Range (INR ₹)</label>
                <input
                  type="text"
                  value={editSalary}
                  onChange={(e) => setEditSalary(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-200">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="draft">Draft</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Required Skills */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold text-slate-200">Required Skills</label>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center gap-1.5">
                  {editReqSkills.map(s => (
                    <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs">
                      <span>{s}</span>
                      <button type="button" onClick={() => handleRemoveReqSkill(s)} className="hover:text-rose-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1 flex-1 min-w-[140px]">
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddReqSkill();
                        }
                      }}
                      placeholder="Add skill & Enter..."
                      className="bg-transparent text-xs text-slate-200 placeholder-slate-500 outline-none px-1 w-full"
                    />
                    <button type="button" onClick={handleAddReqSkill} className="p-1 rounded bg-indigo-600 text-white text-xs">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-200">Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingJob(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 13. CLOSE JOB CONFIRMATION MODAL */}
      {confirmCloseJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 text-xs">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-100 text-sm">Close Job Requisition?</h3>
              <p className="text-slate-400">
                Are you sure you want to close <strong className="text-slate-200">"{confirmCloseJob.title}"</strong>?
              </p>
              <p className="text-slate-500 text-[11px]">
                This will mark the job as closed. Candidate records, resume extractions, and screening scores will NOT be deleted.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setConfirmCloseJob(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  closeJob(confirmCloseJob.id);
                  setConfirmCloseJob(null);
                  if (detailJobModal?.id === confirmCloseJob.id) {
                    setDetailJobModal(null);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md shadow-rose-600/30"
              >
                Confirm & Close Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
