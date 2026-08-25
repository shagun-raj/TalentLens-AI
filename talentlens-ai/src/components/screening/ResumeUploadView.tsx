import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_RESUMES } from '../../data/sampleResumes';
import {
  FileUp,
  FileText,
  Trash2,
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  RotateCw,
  Eye,
  ArrowRight,
  Check,
  AlertTriangle,
  Download,
  X,
  Briefcase,
  Copy,
  Plus,
  Clock
} from 'lucide-react';

export const ResumeUploadView: React.FC = () => {
  const {
    currentJob,
    jobs,
    selectedJobId,
    setSelectedJobId,
    uploadedFiles,
    addUploadedFiles,
    forceUploadDuplicate,
    loadSampleResume,
    loadSampleCandidates,
    clearSampleCandidates,
    hasLoadedDemoData,
    removeUploadedFile,
    clearUploadedFiles,
    startScreening,
    retryScreeningFile,
    isScreeningInProgress,
    candidates,
    setSelectedCandidateDetail,
    setActiveTab,
    getCandidateScreeningForJob
  } = useApp();

  const [isDragging, setIsDragging] = useState(false);
  const [viewingResumeFile, setViewingResumeFile] = useState<{ name: string; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addUploadedFiles(e.target.files);
    }
  };

  const pendingCount = uploadedFiles.filter(f => f.status !== 'completed' && !f.isDuplicate).length;

  const handleViewCandidateById = (fileId: string) => {
    const candidate = candidates.find(c => c.id === fileId || c.resumeId === fileId);
    if (candidate) {
      setSelectedCandidateDetail(candidate);
      setActiveTab('candidates');
    }
  };

  const handleDownloadResume = (file: { name: string; file?: File; extractedText?: string; base64Data?: string }) => {
    try {
      if (file.file) {
        const url = URL.createObjectURL(file.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (file.base64Data) {
        const byteCharacters = atob(file.base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = file.name.endsWith('.pdf') ? file.name : `${file.name}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (file.extractedText) {
        const blob = new Blob([file.extractedText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name.replace(/\.pdf$/i, '.txt');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download error', err);
    }
  };

  // Real uploaded candidate records
  const realCandidates = candidates.filter(c => c.source === 'real-upload' || !c.isDemo);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileUp className="w-5 h-5 text-indigo-400" />
            <span>Upload Candidate Resumes</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload PDF resumes. Exact file duplicates are detected with content fingerprinting to protect screening scores.
          </p>
        </div>

        {/* Selected Job Requisition Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 self-start sm:self-auto">
          <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs text-slate-400">Target Role:</span>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-200 outline-none cursor-pointer max-w-[200px] truncate"
          >
            {jobs.map(j => (
              <option key={j.id} value={j.id} className="bg-slate-900 text-slate-200">
                {j.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Role Mini Preview */}
      {currentJob && (
        <div className="bg-slate-900/90 border border-indigo-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block mb-0.5">
              Screening Against Active Role
            </span>
            <p className="font-bold text-slate-200">{currentJob.title}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Experience: {currentJob.experienceRequired} • Location: {currentJob.location} • {currentJob.salaryRange}
            </p>
          </div>

          <div className="flex flex-wrap gap-1 max-w-sm">
            {currentJob.requiredSkills.slice(0, 5).map(skill => (
              <span key={skill} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[10px]">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
          isDragging
            ? 'border-indigo-500 bg-indigo-950/25 shadow-xl'
            : 'border-slate-800 hover:border-slate-700 bg-slate-950/50 hover:bg-slate-950/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-3">
          <FileUp className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-200">
          Upload Candidate Resumes
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md">
          Drag and drop PDF resumes here, or click to browse files from your computer.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-all"
          >
            Browse Files
          </button>
          <span className="text-[11px] text-slate-400">
            PDF only • Content SHA-256 fingerprinting prevents accidental duplicate screenings
          </span>
        </div>
      </div>

      {/* Current Upload Batch Queue */}
      {uploadedFiles.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-4 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-200">
                Current Upload Batch ({uploadedFiles.length})
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={clearUploadedFiles}
                disabled={isScreeningInProgress}
                className="text-xs text-slate-400 hover:text-rose-400 font-medium transition-colors"
              >
                Clear Queue
              </button>
              <button
                onClick={startScreening}
                disabled={isScreeningInProgress || pendingCount === 0}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all ${
                  isScreeningInProgress || pendingCount === 0
                    ? 'bg-indigo-800 opacity-60 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30 cursor-pointer'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${isScreeningInProgress ? 'animate-spin' : ''}`} />
                <span>
                  {isScreeningInProgress
                    ? 'Screening with AI...'
                    : pendingCount === 0
                    ? 'All Resumes Screened'
                    : `Run AI Screening (${pendingCount})`}
                </span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {uploadedFiles.map((file) => {
              const matchedCand = candidates.find(c => c.id === file.id || c.resumeId === file.id || (file.duplicateCandidateId && c.id === file.duplicateCandidateId));
              const isExtracted = Boolean(file.extractedText);
              const isAnalyzing = file.status === 'processing' || file.status === 'analyzing';
              const isCompleted = file.status === 'completed';
              const isFailed = file.status === 'failed';
              const isDuplicate = Boolean(file.isDuplicate);

              // 4. DUPLICATE UPLOAD DISPLAY
              if (isDuplicate) {
                return (
                  <div
                    key={file.id}
                    className="py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-900/60 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0">
                          <Copy className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-300">Duplicate detected</span>
                            <span className="text-[10px] bg-amber-500/20 text-amber-200 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono">
                              {file.name}
                            </span>
                          </div>
                          <p className="text-slate-300">
                            Resume already uploaded {matchedCand ? `(${matchedCand.name} • ${matchedCand.overallMatchScore}% Match)` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {matchedCand && (
                          <button
                            onClick={() => {
                              setSelectedCandidateDetail(matchedCand);
                              setActiveTab('candidates');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-indigo-400" />
                            <span>View Existing</span>
                          </button>
                        )}

                        <button
                          onClick={() => forceUploadDuplicate(file.id)}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Upload Anyway</span>
                        </button>

                        <button
                          onClick={() => removeUploadedFile(file.id)}
                          className="text-slate-400 hover:text-rose-400 p-1.5 rounded transition-colors"
                          title="Dismiss"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={file.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex flex-col space-y-3"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* File info */}
                    <div className="flex items-center gap-3 min-w-0 lg:w-1/3">
                      <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-[11px] font-bold">
                        PDF
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-200 truncate">{file.name}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                          <span>{file.formattedSize}</span>
                          <span>•</span>
                          <span className={isCompleted ? 'text-emerald-400 font-medium' : isFailed ? 'text-amber-400' : 'text-slate-400'}>
                            {isCompleted ? 'Screened' : isFailed ? 'Failed' : isAnalyzing ? 'Analyzing with AI...' : 'Extracted & Ready'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 4-Step Status Pipeline: Uploaded ✓ → Extracted ✓ → AI Screening → Match Score */}
                    <div className="flex items-center gap-1.5 text-[11px] font-medium shrink-0 overflow-x-auto py-1">
                      {/* Step 1: Uploaded ✓ */}
                      <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                        <Check className="w-3 h-3" />
                        <span>Uploaded</span>
                      </div>

                      <ArrowRight className="w-2.5 h-2.5 text-slate-600 shrink-0" />

                      {/* Step 2: Extracted ✓ */}
                      <div
                        className={`flex items-center gap-1 px-2 py-0.5 rounded border ${
                          isExtracted || isCompleted
                            ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
                            : 'text-slate-400 bg-slate-950 border-slate-800'
                        }`}
                      >
                        {isExtracted || isCompleted ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>Extracted</span>
                      </div>

                      <ArrowRight className="w-2.5 h-2.5 text-slate-600 shrink-0" />

                      {/* Step 3: AI Screening */}
                      <div
                        className={`flex items-center gap-1 px-2 py-0.5 rounded border ${
                          isCompleted
                            ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
                            : isAnalyzing
                            ? 'text-indigo-300 bg-indigo-950/60 border-indigo-500/40'
                            : isFailed
                            ? 'text-amber-300 bg-amber-950/40 border-amber-500/40'
                            : 'text-slate-400 bg-slate-950 border-slate-800'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-3 h-3" />
                        ) : isAnalyzing ? (
                          <Sparkles className="w-3 h-3 animate-spin text-indigo-400" />
                        ) : isFailed ? (
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>AI Screening</span>
                      </div>

                      <ArrowRight className="w-2.5 h-2.5 text-slate-600 shrink-0" />

                      {/* Step 4: Match Score */}
                      <div
                        className={`flex items-center gap-1 px-2 py-0.5 rounded border ${
                          isCompleted && matchedCand
                            ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30 font-bold'
                            : 'text-slate-500 bg-slate-950/60 border-slate-800/80'
                        }`}
                      >
                        {isCompleted && matchedCand ? (
                          <span>Score: {matchedCand.overallMatchScore}%</span>
                        ) : (
                          <span>Match Score</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isCompleted && (
                        <>
                          <button
                            onClick={() => handleViewCandidateById(file.id)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Candidate</span>
                          </button>

                          <button
                            onClick={() => setViewingResumeFile({ name: file.name, text: file.extractedText || matchedCand?.rawExtractedText || 'No text extracted' })}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                            title="Inspect Text"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDownloadResume(file)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {!isCompleted && !isFailed && (
                        <button
                          onClick={startScreening}
                          disabled={isScreeningInProgress}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Run AI Screening</span>
                        </button>
                      )}

                      {isFailed && (
                        <button
                          onClick={() => retryScreeningFile(file.id)}
                          disabled={isScreeningInProgress}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-900/60 border border-amber-500/40 text-amber-200 hover:bg-amber-800/60 text-xs font-semibold transition-colors"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Retry</span>
                        </button>
                      )}

                      <button
                        onClick={() => removeUploadedFile(file.id)}
                        disabled={isScreeningInProgress}
                        className="text-slate-400 hover:text-rose-400 p-1.5 rounded transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 8. UPLOAD HISTORY: Separate card/row for each uploaded resume */}
      {realCandidates.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Uploaded Resumes History ({realCandidates.length})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Real candidate profiles extracted and stored independently in TalentLens.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('candidates')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View in All Candidates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {realCandidates.map((cand) => {
              const activeScreening = getCandidateScreeningForJob(cand, selectedJobId);
              const targetJobName = jobs.find(j => j.id === cand.jobId)?.title || currentJob?.title || 'Selected Job';
              const matchScore = activeScreening ? activeScreening.overallScore : cand.overallMatchScore;

              return (
                <div
                  key={cand.id}
                  className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors"
                >
                  {/* Left info */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-100 hover:text-indigo-300 cursor-pointer" onClick={() => { setSelectedCandidateDetail(cand); setActiveTab('candidates'); }}>
                        {cand.name}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        REAL UPLOAD
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-300">
                      {cand.currentRole}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1 font-mono text-slate-400">
                        <FileText className="w-3 h-3 text-slate-500" />
                        {cand.resumeFileName || 'Resume.pdf'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Briefcase className="w-3 h-3 text-slate-500" />
                        Target: <strong className="text-slate-300">{targetJobName}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Middle Status Pipeline */}
                  <div className="flex items-center gap-1.5 text-[11px] font-medium shrink-0">
                    <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                      <Check className="w-3 h-3" />
                      <span>Uploaded</span>
                    </span>
                    <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                    <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                      <Check className="w-3 h-3" />
                      <span>Extracted</span>
                    </span>
                    <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                    <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                      <Check className="w-3 h-3" />
                      <span>AI Screened</span>
                    </span>
                  </div>

                  {/* Right Column: Score & Action */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-base font-extrabold text-emerald-400 font-mono">
                        {matchScore}%
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        Match Score
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCandidateDetail(cand);
                        setActiveTab('candidates');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resume Text Inspection Modal */}
      {viewingResumeFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-200">{viewingResumeFile.name}</h3>
              </div>
              <button
                onClick={() => setViewingResumeFile(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950/60 rounded-b-2xl">
              {viewingResumeFile.text || 'No text extracted.'}
            </div>
          </div>
        </div>
      )}

      {/* Reference Demo Data Controls */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-slate-200">Sample Candidate Dataset</h4>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Reference Data</span>
          </div>
          <p className="text-xs text-slate-400">
            Explore TalentLens AI candidate scoring with pre-screened sample profiles without overwriting real uploads.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {hasLoadedDemoData ? (
            <button
              onClick={clearSampleCandidates}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Clear Sample Data
            </button>
          ) : (
            <button
              onClick={loadSampleCandidates}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Load Sample Candidates</span>
            </button>
          )}

          <button
            onClick={() => loadSampleResume('sample-ananya')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-950/80 border border-indigo-500/30 text-xs font-semibold text-indigo-300 transition-colors"
          >
            <span>+ Test Resume (Ananya)</span>
          </button>
        </div>
      </div>

      {/* Compliance / Privacy Protocol */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Responsible AI Protocol:</strong> TalentLens evaluates strictly verifiable skills, experience duration, and role accomplishments. Demographic information is excluded from screening calculations.
        </p>
      </div>
    </div>
  );
};
