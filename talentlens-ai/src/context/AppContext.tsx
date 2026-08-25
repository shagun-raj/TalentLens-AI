import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ActiveTab, 
  Candidate, 
  Job, 
  RecruiterCandidateStatus, 
  ScreeningActivity, 
  ScreeningResult,
  ToastMessage, 
  UploadedResumeFile 
} from '../types';
import { 
  INITIAL_CANDIDATES, 
  INITIAL_JOBS, 
  INITIAL_ACTIVITIES 
} from '../data/mockData';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import { extractTextFromPDFFile } from '../utils/pdfExtractor';
import { calculateFileHash } from '../utils/fileHash';

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  jobs: Job[];
  selectedJobId: string;
  setSelectedJobId: (id: string) => void;
  currentJob: Job | undefined;
  candidates: Candidate[];
  screeningResults: ScreeningResult[];
  getScreeningResult: (resultIdOrCandidateId: string) => ScreeningResult | undefined;
  getCandidateScreeningForJob: (candidate: Candidate, jobId?: string) => ScreeningResult | undefined;
  screenCandidateForJob: (candidateId: string, targetJobId: string) => Promise<boolean>;
  filteredCandidates: Candidate[];
  activities: ScreeningActivity[];
  uploadedFiles: UploadedResumeFile[];
  addUploadedFiles: (files: FileList | File[]) => Promise<void>;
  forceUploadDuplicate: (uploadId: string) => void;
  loadSampleResume: (sampleId: string) => void;
  loadSampleCandidates: () => void;
  clearSampleCandidates: () => void;
  hasLoadedDemoData: boolean;
  removeUploadedFile: (id: string) => void;
  clearUploadedFiles: () => void;
  startScreening: () => Promise<void>;
  retryScreeningFile: (fileId: string) => Promise<void>;
  isScreeningInProgress: boolean;
  createJob: (jobData: Partial<Job>) => string;
  updateJob: (jobId: string, updatedData: Partial<Job>) => void;
  closeJob: (jobId: string) => void;
  reopenJob: (jobId: string) => void;
  deleteJob: (jobId: string) => void;
  generateJobRequirementsAI: (title: string, rawDescription?: string, department?: string) => Promise<any>;
  selectedCandidateDetail: Candidate | null;
  setSelectedCandidateDetail: (candidate: Candidate | null) => void;
  comparedCandidateIds: string[];
  toggleCompareCandidate: (id: string) => void;
  clearCompareCandidates: () => void;
  updateCandidateStatus: (candidateId: string, status: RecruiterCandidateStatus) => void;
  addCandidateNote: (candidateId: string, noteText: string) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Copilot Chat
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  copilotMessages: CopilotMessage[];
  sendCopilotMessage: (content: string) => Promise<void>;
  isCopilotTyping: boolean;
  // Gemini Status
  isGeminiReady: boolean | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_REAL_CANDIDATES = 'talentlens_real_candidates_v3';
const STORAGE_REAL_RESULTS = 'talentlens_real_results_v3';
const STORAGE_REAL_CANDIDATES_PREV = 'talentlens_real_candidates_v2';
const STORAGE_REAL_RESULTS_PREV = 'talentlens_real_results_v2';
const STORAGE_REAL_ACTIVITIES = 'talentlens_real_activities_v1';
const STORAGE_REAL_JOBS = 'talentlens_real_jobs_v1';

const getInitialJobs = (): Job[] => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_REAL_JOBS) : null;
    if (raw) {
      const saved: Job[] = JSON.parse(raw);
      if (Array.isArray(saved) && saved.length > 0) {
        const savedIds = new Set(saved.map(j => j.id));
        const nonDuplicateInitial = INITIAL_JOBS.filter(j => !savedIds.has(j.id));
        return [...saved, ...nonDuplicateInitial];
      }
    }
  } catch (e) {
    console.error('Error reading jobs from localStorage:', e);
  }
  return INITIAL_JOBS;
};

// Build sample candidates with explicit screeningsByJob map initialized for their initial job ('job-1')
const buildSampleCandidates = (): { candidates: Candidate[]; screeningResults: ScreeningResult[] } => {
  const cands: Candidate[] = [];
  const results: ScreeningResult[] = [];

  for (const c of INITIAL_CANDIDATES) {
    const resumeId = c.resumeId || c.id;
    const initialJobId = c.jobId || 'job-1';
    const screeningId = `scr_${c.id}_${resumeId}_${initialJobId}`;

    const screening: ScreeningResult = {
      screeningResultId: screeningId,
      candidateId: c.id,
      resumeId,
      jobId: initialJobId,
      jobTitle: 'Full-Stack Developer (React & Node.js)',
      overallScore: c.overallMatchScore,
      skillsScore: c.matchBreakdown?.skillsMatch || c.overallMatchScore,
      requiredSkillsScore: c.matchBreakdown?.skillsMatch || c.overallMatchScore,
      experienceScore: c.matchBreakdown?.experienceMatch || c.overallMatchScore,
      educationScore: c.matchBreakdown?.educationMatch || c.overallMatchScore,
      projectScore: c.matchBreakdown?.projectRelevance || c.overallMatchScore,
      preferredSkillsScore: c.matchBreakdown?.preferredSkillsMatch || 70,
      matchedSkills: c.matchedSkills || [],
      missingSkills: c.missingSkills || [],
      classifiedSkills: c.classifiedSkills,
      experienceEvaluation: c.experienceEvaluation,
      projectRelevanceExplanation: c.projectRelevanceExplanation,
      strengths: c.strengths || [],
      skillGaps: c.skillGaps || [],
      potentialConcerns: c.potentialConcerns || [],
      summary: c.aiSummary || '',
      recommendation: c.recommendation,
      recommendationAction: c.recommendationAction,
      explanation: c.explanation || c.aiSummary || '',
      screenedAt: c.uploadedAt || '2026-08-10T10:00:00Z',
    };

    results.push(screening);

    const candItem: Candidate = {
      ...c,
      resumeId,
      fileHash: c.fileHash || `sample-hash-${c.id}`,
      source: 'sample',
      isDemo: true,
      resumeSource: 'Sample Data',
      resumeFileName: c.resumeFileName || `${(c.name || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`,
      resumeFileSize: c.resumeFileSize || '1.2 MB',
      uploadedAt: c.uploadedAt || '2026-08-10',
      createdAt: c.createdAt || '2026-08-10T10:00:00Z',
      screeningsByJob: {
        [initialJobId]: screening
      }
    };

    cands.push(candItem);
  }

  return { candidates: cands, screeningResults: results };
};

const getInitialCandidates = (): Candidate[] => {
  const { candidates: sampleItems } = buildSampleCandidates();

  try {
    const rawV3 = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_REAL_CANDIDATES) : null;
    if (rawV3) {
      const savedReal: Candidate[] = JSON.parse(rawV3);
      if (Array.isArray(savedReal) && savedReal.length > 0) {
        const cleanReal = savedReal.map(c => ({
          ...c,
          resumeId: c.resumeId || c.id,
          source: 'real-upload' as const,
          isDemo: false,
          resumeSource: 'AI Screened' as const,
        }));
        const realIds = new Set(cleanReal.map(c => c.id));
        const nonDuplicateSamples = sampleItems.filter(s => !realIds.has(s.id));
        return [...cleanReal, ...nonDuplicateSamples];
      }
    }

    // Fallback migration from V2
    const rawV2 = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_REAL_CANDIDATES_PREV) : null;
    if (rawV2) {
      const savedV2: Candidate[] = JSON.parse(rawV2);
      if (Array.isArray(savedV2) && savedV2.length > 0) {
        const cleanV2 = savedV2.map(c => ({
          ...c,
          resumeId: c.resumeId || c.id,
          source: 'real-upload' as const,
          isDemo: false,
          resumeSource: 'AI Screened' as const,
        }));
        const realIds = new Set(cleanV2.map(c => c.id));
        const nonDuplicateSamples = sampleItems.filter(s => !realIds.has(s.id));
        return [...cleanV2, ...nonDuplicateSamples];
      }
    }
  } catch (e) {
    console.error('Error reading real candidates from localStorage:', e);
  }
  return sampleItems;
};

const getInitialScreeningResults = (): ScreeningResult[] => {
  const { screeningResults: sampleResults } = buildSampleCandidates();

  try {
    const rawV3 = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_REAL_RESULTS) : null;
    if (rawV3) {
      const savedResults: ScreeningResult[] = JSON.parse(rawV3);
      if (Array.isArray(savedResults) && savedResults.length > 0) {
        const savedIds = new Set(savedResults.map(r => r.screeningResultId || `${r.candidateId}-${r.jobId}`));
        const nonDuplicateSamples = sampleResults.filter(s => !savedIds.has(s.screeningResultId) && !savedIds.has(`${s.candidateId}-${s.jobId}`));
        return [...savedResults, ...nonDuplicateSamples];
      }
    }

    const rawV2 = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_REAL_RESULTS_PREV) : null;
    if (rawV2) {
      const savedV2: ScreeningResult[] = JSON.parse(rawV2);
      if (Array.isArray(savedV2) && savedV2.length > 0) {
        return [...savedV2, ...sampleResults];
      }
    }
  } catch (e) {
    console.error('Error reading real screening results from localStorage:', e);
  }
  return sampleResults;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [jobs, setJobs] = useState<Job[]>(getInitialJobs);
  const [selectedJobId, setSelectedJobId] = useState<string>('job-1');
  const [hasLoadedDemoData, setHasLoadedDemoData] = useState<boolean>(true);
  const [candidates, setCandidates] = useState<Candidate[]>(getInitialCandidates);
  const [screeningResults, setScreeningResults] = useState<ScreeningResult[]>(getInitialScreeningResults);
  const [activities, setActivities] = useState<ScreeningActivity[]>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_REAL_ACTIVITIES) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    return INITIAL_ACTIVITIES;
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedResumeFile[]>([]);
  const [isScreeningInProgress, setIsScreeningInProgress] = useState<boolean>(false);
  const [selectedCandidateDetail, setSelectedCandidateDetail] = useState<Candidate | null>(null);
  const [comparedCandidateIds, setComparedCandidateIds] = useState<string[]>(['cand-1', 'cand-2']);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGeminiReady, setIsGeminiReady] = useState<boolean | null>(null);

  // AI Copilot state
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isCopilotTyping, setIsCopilotTyping] = useState<boolean>(false);
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: "Hello! I'm TalentLens Copilot. I can help analyze candidate match breakdowns, formulate tailored interview questions, highlight skill gaps, or compare candidates side-by-side. What would you like to explore?",
      timestamp: 'Just now'
    }
  ]);

  // Check Gemini configuration status on mount
  useEffect(() => {
    fetch('/api/gemini/status')
      .then(res => res.json())
      .then(data => {
        setIsGeminiReady(Boolean(data.configured));
      })
      .catch(() => {
        setIsGeminiReady(false);
      });
  }, []);

  // Persist jobs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REAL_JOBS, JSON.stringify(jobs));
    } catch (e) {
      console.error('Failed to persist jobs to localStorage:', e);
    }
  }, [jobs]);

  // Persist real candidates to localStorage (V3 format)
  useEffect(() => {
    try {
      const realOnly = candidates.filter(c => c.source === 'real-upload' || !c.isDemo);
      localStorage.setItem(STORAGE_REAL_CANDIDATES, JSON.stringify(realOnly));
    } catch (e) {
      console.error('Failed to persist real candidates to localStorage:', e);
    }
  }, [candidates]);

  // Persist real screening results to localStorage
  useEffect(() => {
    try {
      const realCandidateIds = new Set(candidates.filter(c => c.source === 'real-upload' || !c.isDemo).map(c => c.id));
      const realResults = screeningResults.filter(r => realCandidateIds.has(r.candidateId));
      localStorage.setItem(STORAGE_REAL_RESULTS, JSON.stringify(realResults));
    } catch (e) {
      console.error('Failed to persist real screening results to localStorage:', e);
    }
  }, [screeningResults, candidates]);

  // Persist activities to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REAL_ACTIVITIES, JSON.stringify(activities.slice(0, 50)));
    } catch (e) {
      console.error('Failed to persist activities to localStorage:', e);
    }
  }, [activities]);

  const currentJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Convert File to Base64 data URL
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  /**
   * Safe Candidate-Job Screening Lookup:
   * Retrieves strictly the screening result evaluated for (candidateId + resumeId + jobId).
   * If the candidate has NOT been screened for targetJobId, returns undefined (never synthesizes from another role).
   */
  const getCandidateScreeningForJob = (candidate: Candidate, jobId?: string): ScreeningResult | undefined => {
    const targetJobId = jobId || selectedJobId;
    
    // If 'all' jobs is selected, return primary/first available screening
    if (targetJobId === 'all') {
      if (candidate.screeningsByJob && candidate.jobId && candidate.screeningsByJob[candidate.jobId]) {
        return candidate.screeningsByJob[candidate.jobId];
      }
      const allKeys = candidate.screeningsByJob ? Object.keys(candidate.screeningsByJob) : [];
      if (allKeys.length > 0 && candidate.screeningsByJob) {
        return candidate.screeningsByJob[allKeys[0]];
      }
      const foundAny = screeningResults.find(r => r.candidateId === candidate.id);
      if (foundAny) return foundAny;
      return undefined;
    }

    // 1. Check candidate's embedded multi-job map first
    if (candidate.screeningsByJob && candidate.screeningsByJob[targetJobId]) {
      return candidate.screeningsByJob[targetJobId];
    }

    // 2. Check screeningResults state for exact candidateId + jobId pair
    const found = screeningResults.find(
      r => r.candidateId === candidate.id && r.jobId === targetJobId
    );
    if (found) return found;

    // 3. Candidate is NOT screened for this specific job -> return undefined (Do NOT leak other job scores)
    return undefined;
  };

  const getScreeningResult = (resultIdOrCandidateId: string): ScreeningResult | undefined => {
    return screeningResults.find(
      r => r.screeningResultId === resultIdOrCandidateId || r.candidateId === resultIdOrCandidateId
    );
  };

  /**
   * Upload Handler:
   * 1. Generates a deterministic SHA-256 fileHash from the actual uploaded file content.
   * 2. Detects exact file duplicates (same fileHash) vs different resumes with same candidate name.
   * 3. Prevents duplicate candidates / duplicate screenings for exact duplicates unless explicitly requested.
   */
  const addUploadedFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newItems: UploadedResumeFile[] = [];

    for (const f of fileArray) {
      const isPdf = f.name.toLowerCase().endsWith('.pdf') || f.type.includes('pdf');
      const sizeKb = Math.round(f.size / 1024);
      const formattedSize = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

      // Deterministic SHA-256 content fingerprint
      const fileHash = await calculateFileHash(f);

      // Unique identifiers strictly defined
      const uploadId = 'up-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
      const resumeId = 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

      // Check max size 25MB
      if (f.size > 25 * 1024 * 1024) {
        newItems.push({
          id: uploadId,
          resumeId,
          fileHash,
          file: f,
          name: f.name,
          size: f.size,
          formattedSize,
          uploadProgress: 0,
          status: 'failed',
          errorMessage: 'File size exceeds 25MB limit.',
          uploadedAt: 'Just now'
        });
        continue;
      }

      if (!isPdf) {
        newItems.push({
          id: uploadId,
          resumeId,
          fileHash,
          file: f,
          name: f.name,
          size: f.size,
          formattedSize,
          uploadProgress: 0,
          status: 'failed',
          errorMessage: 'Only valid PDF files are supported.',
          uploadedAt: 'Just now'
        });
        continue;
      }

      // Read base64
      let base64Data = '';
      try {
        base64Data = await fileToBase64(f);
      } catch (err) {
        console.error('Failed to read base64 file:', err);
      }

      // Run client-side extraction with pdfjs-dist
      let extractedText: string | undefined = undefined;
      let extractionError: string | undefined = undefined;
      try {
        const clientExtract = await extractTextFromPDFFile(f);
        if (clientExtract.success && clientExtract.text) {
          extractedText = clientExtract.text;
        } else if (!clientExtract.success) {
          extractionError = clientExtract.error;
        }
      } catch (e: any) {
        console.warn('Client extraction error:', e);
      }

      // Exact Duplicate Detection: Check if fileHash already exists in candidates
      const existingDuplicateCand = candidates.find(c => 
        (c.fileHash && c.fileHash === fileHash) ||
        (c.resumeFileName?.toLowerCase().trim() === f.name.toLowerCase().trim() && c.resumeFileSize === formattedSize && extractedText && c.rawExtractedText === extractedText)
      );

      const isExactDuplicate = Boolean(existingDuplicateCand);

      if (isExactDuplicate && existingDuplicateCand) {
        addToast({
          type: 'warning',
          title: 'Resume Already Uploaded',
          description: `"${f.name}" matches an existing screened record (${existingDuplicateCand.name}). View existing profile or choose Upload Anyway.`
        });
      }

      const fileItem: UploadedResumeFile = {
        id: uploadId,
        resumeId: isExactDuplicate ? (existingDuplicateCand?.resumeId || existingDuplicateCand!.id) : resumeId,
        fileHash,
        isDuplicate: isExactDuplicate,
        duplicateCandidateId: existingDuplicateCand?.id,
        file: f,
        name: f.name,
        size: f.size,
        formattedSize,
        uploadProgress: 100,
        status: extractionError ? 'failed' : (isExactDuplicate ? 'completed' : 'uploaded'),
        errorMessage: extractionError,
        base64Data,
        extractedText,
        uploadedAt: 'Just now'
      };

      newItems.push(fileItem);
    }

    setUploadedFiles(prev => [...prev, ...newItems]);
    const validCount = newItems.filter(i => i.status === 'uploaded' && !i.isDuplicate).length;
    const dupCount = newItems.filter(i => i.isDuplicate).length;

    if (validCount > 0) {
      addToast({
        type: 'success',
        title: `${validCount} PDF resume${validCount > 1 ? 's' : ''} uploaded`,
        description: 'Text extracted from PDF. Ready for AI screening against selected role.'
      });
    }

    if (dupCount > 0 && validCount === 0) {
      addToast({
        type: 'info',
        title: 'Duplicate Resume Detected',
        description: 'File has already been screened. Existing score is preserved.'
      });
    }
  };

  /**
   * Allows user to explicitly bypass duplicate warning and upload anyway.
   */
  const forceUploadDuplicate = (uploadId: string) => {
    setUploadedFiles(prev => prev.map(f => {
      if (f.id === uploadId) {
        const freshResumeId = 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
        return {
          ...f,
          resumeId: freshResumeId,
          isDuplicate: false,
          duplicateCandidateId: undefined,
          status: 'uploaded'
        };
      }
      return f;
    }));

    addToast({
      type: 'info',
      title: 'Queued for Re-screening',
      description: 'Resume queued to create a new separate screening evaluation.'
    });
  };

  const loadSampleResume = async (sampleId: string) => {
    const sample = SAMPLE_RESUMES.find(s => s.id === sampleId);
    if (!sample) return;

    const fileHash = await calculateFileHash(sample.text);
    const existingSample = candidates.find(c => c.fileHash === fileHash || (c.resumeFileName === sample.fileName && c.rawExtractedText === sample.text));
    const isDuplicate = Boolean(existingSample);

    const uploadId = 'sample-up-' + Date.now();
    const resumeId = isDuplicate ? (existingSample?.resumeId || existingSample!.id) : ('sample-res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6));

    const newFile: UploadedResumeFile = {
      id: uploadId,
      resumeId,
      fileHash,
      isDuplicate,
      duplicateCandidateId: existingSample?.id,
      name: sample.fileName,
      size: 340000,
      formattedSize: sample.fileSize,
      uploadProgress: 100,
      status: isDuplicate ? 'completed' : 'uploaded',
      extractedText: sample.text,
      uploadedAt: 'Just now'
    };

    setUploadedFiles(prev => [...prev, newFile]);

    if (isDuplicate) {
      addToast({
        type: 'info',
        title: 'Sample Resume Already Present',
        description: `"${sample.fileName}" is already in the candidate list.`
      });
    } else {
      addToast({
        type: 'success',
        title: `Sample Resume Loaded: ${sample.name}`,
        description: `Added "${sample.fileName}" (${sample.targetRoleMatch}) to queue.`
      });
    }
  };

  const removeUploadedFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearUploadedFiles = () => {
    setUploadedFiles([]);
  };

  /**
   * Helper to screen a single file item with Gemini AI against activeJob.
   */
  const processScreeningItem = async (file: UploadedResumeFile, activeJob: Job): Promise<boolean> => {
    // If exact duplicate and not forced, skip screening and preserve existing score
    if (file.isDuplicate && file.duplicateCandidateId) {
      return true;
    }

    setUploadedFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'analyzing', errorMessage: undefined } : f));

    const matchedSample = SAMPLE_RESUMES.find(s => s.fileName === file.name);
    let resumeText = file.extractedText || (matchedSample ? matchedSample.text : undefined);

    if (!resumeText && file.file) {
      try {
        const clientExtract = await extractTextFromPDFFile(file.file);
        if (clientExtract.success && clientExtract.text) {
          resumeText = clientExtract.text;
        }
      } catch (err: any) {
        console.warn('Fallback client extraction failed:', err);
      }
    }

    try {
      const response = await fetch('/api/gemini/screen-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          resumeText,
          resumeBase64: !resumeText ? file.base64Data : undefined,
          job: {
            title: activeJob.title,
            department: activeJob.department,
            experienceRequired: activeJob.experienceRequired,
            description: activeJob.description,
            requiredSkills: activeJob.requiredSkills,
            preferredSkills: activeJob.preferredSkills,
            educationRequirements: activeJob.educationRequirements,
            importantKeywords: activeJob.importantKeywords || [],
          },
        }),
      });

      const resJson = await response.json();

      if (!resJson.success || !resJson.data?.screening) {
        const rawErr = String(resJson.error || '');
        const is503 = response.status === 503 || rawErr.includes('503') || rawErr.toLowerCase().includes('temporarily unavailable');
        const errorMsg = is503 ? 'AI Service Temporarily Unavailable. Please retry.' : (rawErr || 'AI analysis could not be completed. Please retry.');
        setUploadedFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'failed', errorMessage: errorMsg } : f));
        return false;
      }

      const s = resJson.data.screening;

      // Candidate name strictly from this resume
      const candidateName = s.candidate?.name && s.candidate.name !== 'Not found' && s.candidate.name !== 'Not specified'
        ? s.candidate.name 
        : (matchedSample ? matchedSample.name : file.name.replace(/\.pdf$/i, '').replace(/_/g, ' '));

      const nowIso = new Date().toISOString();
      const normEmail = s.candidate?.email && s.candidate.email !== 'Not found' && s.candidate.email !== 'Not specified'
        ? s.candidate.email
        : `${candidateName.toLowerCase().replace(/\s+/g, '.')}@example.com`;

      // Unique entity identifiers: candidateId, resumeId, uploadId, jobId, screeningId
      const targetResumeId = file.resumeId || file.id;
      const candidateId = targetResumeId;
      const screeningResultId = `scr_${candidateId}_${targetResumeId}_${activeJob.id}`;

      const overallScore = Math.min(100, Math.max(0, typeof s.matchScore?.overall === 'number' ? s.matchScore.overall : 75));
      const skillsScore = Math.min(100, Math.max(0, typeof s.matchScore?.skills === 'number' ? s.matchScore.skills : (s.matchScore?.requiredSkills ?? 75)));
      const requiredSkillsScore = Math.min(100, Math.max(0, typeof s.matchScore?.requiredSkills === 'number' ? s.matchScore.requiredSkills : skillsScore));
      const experienceScore = Math.min(100, Math.max(0, typeof s.matchScore?.experience === 'number' ? s.matchScore.experience : 75));
      const educationScore = Math.min(100, Math.max(0, typeof s.matchScore?.education === 'number' ? s.matchScore.education : 75));
      const projectScore = Math.min(100, Math.max(0, typeof s.matchScore?.projects === 'number' ? s.matchScore.projects : 75));
      const preferredSkillsScore = Math.min(100, Math.max(0, typeof s.matchScore?.preferredSkills === 'number' ? s.matchScore.preferredSkills : 60));

      const matchedSkills = Array.isArray(s.matchedSkills) ? s.matchedSkills : [];
      const missingSkills = Array.isArray(s.missingSkills) ? s.missingSkills : [];
      const strengths = Array.isArray(s.strengths) ? s.strengths : [];
      const skillGaps = Array.isArray(s.skillGaps) ? s.skillGaps : [];
      const potentialConcerns = Array.isArray(s.potentialConcerns) ? s.potentialConcerns : [];
      const recommendation = s.recommendation || 'Needs Review';
      const explanation = s.explanation || s.summary || '';
      const summary = s.summary || 'Candidate analyzed by Gemini AI screening engine.';

      const screeningResult: ScreeningResult = {
        screeningResultId,
        candidateId,
        resumeId: targetResumeId,
        uploadId: file.id,
        fileHash: file.fileHash,
        jobId: activeJob.id,
        jobTitle: activeJob.title,
        overallScore,
        skillsScore: requiredSkillsScore,
        requiredSkillsScore,
        experienceScore,
        educationScore,
        projectScore,
        preferredSkillsScore,
        matchedSkills,
        missingSkills,
        classifiedSkills: s.classifiedSkills || [],
        experienceEvaluation: s.experienceEvaluation,
        projectRelevanceExplanation: s.projectRelevanceExplanation,
        strengths,
        skillGaps,
        potentialConcerns,
        summary,
        recommendation,
        recommendationAction: s.recommendationAction,
        explanation,
        formulaExplanation: s.formulaExplanation,
        screenedAt: nowIso,
      };

      const realCandidate: Candidate = {
        id: candidateId,
        resumeId: targetResumeId,
        uploadId: file.id,
        fileHash: file.fileHash,
        jobId: activeJob.id,
        jobTitle: activeJob.title,
        source: 'real-upload',
        isDemo: false,
        resumeSource: 'AI Screened',
        screeningResultId: screeningResultId,
        createdAt: nowIso,
        name: candidateName,
        email: normEmail,
        phone: s.candidate?.phone || 'Not provided',
        location: s.candidate?.location || 'India',
        currentRole: s.candidate?.professionalTitle || s.experience?.roles?.[0]?.role || activeJob.title.split('(')[0].trim(),
        overallMatchScore: overallScore,
        matchBreakdown: {
          skillsMatch: requiredSkillsScore,
          requiredSkillsMatch: requiredSkillsScore,
          experienceMatch: experienceScore,
          educationMatch: educationScore,
          projectRelevance: projectScore,
          preferredSkillsMatch: preferredSkillsScore,
          requirementRelevance: requiredSkillsScore,
        },
        recommendation,
        recommendationAction: s.recommendationAction,
        explanation,
        formulaExplanation: s.formulaExplanation,
        recruiterStatus: 'screened',
        recruiterNotes: [],
        yearsOfExperience: typeof s.experience?.years === 'number' ? s.experience.years : 0,
        education: (Array.isArray(s.education) ? s.education : []).map((edu: any) => ({
          degree: edu.degree || 'Degree',
          university: edu.university || 'University',
          graduationYear: edu.graduationYear || undefined,
          gpa: edu.gpa || undefined,
          fieldOfStudy: edu.fieldOfStudy || undefined,
        })),
        technicalSkills: Array.isArray(s.skills?.technical) ? s.skills.technical : [],
        softSkills: Array.isArray(s.skills?.soft) ? s.skills.soft : [],
        matchedSkills,
        missingSkills,
        classifiedSkills: s.classifiedSkills || [],
        experienceEvaluation: s.experienceEvaluation,
        projectRelevanceExplanation: s.projectRelevanceExplanation,
        skillGaps,
        strengths,
        potentialConcerns,
        relevantExperience: Array.isArray(s.relevantExperience) ? s.relevantExperience : [],
        workExperience: (Array.isArray(s.experience?.roles) ? s.experience.roles : []).map((role: any, idx: number) => ({
          id: `exp-${candidateId}-${idx}`,
          company: role.company || 'Company',
          role: role.role || 'Role',
          duration: role.duration || 'Duration not specified',
          highlights: Array.isArray(role.highlights) ? role.highlights : [],
        })),
        projects: (Array.isArray(s.projects) ? s.projects : []).map((proj: any, idx: number) => ({
          id: `proj-${candidateId}-${idx}`,
          name: proj.name || 'Project',
          description: proj.description || '',
          techStack: Array.isArray(proj.techStack) ? proj.techStack : [],
        })),
        certifications: Array.isArray(s.certifications) ? s.certifications : [],
        aiSummary: summary,
        resumeFileName: file.name,
        resumeFileSize: file.formattedSize,
        uploadedAt: 'Just now',
        rawExtractedText: resumeText,
        pageCount: resJson.data.pagesCount || 1,
        screeningsByJob: {
          [activeJob.id]: screeningResult
        }
      };

      // Persist screening result
      setScreeningResults(prev => {
        const filtered = prev.filter(r => !(r.candidateId === candidateId && r.jobId === activeJob.id));
        return [screeningResult, ...filtered];
      });

      // Persist candidate into single source of truth
      setCandidates(prev => {
        const existing = prev.find(c => c.id === candidateId);
        if (existing) {
          const updated = {
            ...existing,
            screeningsByJob: {
              ...(existing.screeningsByJob || {}),
              [activeJob.id]: screeningResult
            }
          };
          return [updated, ...prev.filter(c => c.id !== candidateId)];
        }
        return [realCandidate, ...prev.filter(c => c.id !== candidateId)];
      });

      // Update active candidate detail if currently inspected
      if (selectedCandidateDetail && selectedCandidateDetail.id === candidateId) {
        setSelectedCandidateDetail(prev => prev ? {
          ...prev,
          screeningsByJob: {
            ...(prev.screeningsByJob || {}),
            [activeJob.id]: screeningResult
          }
        } : null);
      }

      // Update screening activity log
      const newAct: ScreeningActivity = {
        id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        candidateId: realCandidate.id,
        candidateName: realCandidate.name,
        jobId: activeJob.id,
        jobTitle: activeJob.title,
        score: realCandidate.overallMatchScore,
        recommendation: realCandidate.recommendation,
        action: `AI Screening: ${realCandidate.overallMatchScore}% match score calculated for "${activeJob.title}"`,
        timestamp: 'Just now'
      };
      setActivities(prev => [newAct, ...prev]);

      // Mark file as completed
      setUploadedFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'completed', isDuplicate: false } : f));
      return true;
    } catch (err: any) {
      console.error('Screening failure:', err);
      setUploadedFiles(prev => prev.map(f => f.id === file.id ? { 
        ...f, 
        status: 'failed', 
        errorMessage: err.message || 'AI analysis could not be completed. Please retry.' 
      } : f));
      return false;
    }
  };

  /**
   * Screen an existing candidate for a specific job role.
   * Creates a dedicated screening record for (candidateId + resumeId + targetJobId)
   * without mutating or overwriting screenings for other jobs!
   */
  const screenCandidateForJob = async (candidateId: string, targetJobId: string): Promise<boolean> => {
    const candidate = candidates.find(c => c.id === candidateId);
    const targetJob = jobs.find(j => j.id === targetJobId);
    if (!candidate || !targetJob) return false;

    // Check if screening already exists for this job
    if (candidate.screeningsByJob && candidate.screeningsByJob[targetJobId]) {
      return true;
    }

    try {
      addToast({
        type: 'info',
        title: `Screening for ${targetJob.title}`,
        description: `Evaluating ${candidate.name}'s resume against role requirements...`
      });

      const response = await fetch('/api/gemini/screen-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: candidate.resumeFileName || `${candidate.name}.pdf`,
          resumeText: candidate.rawExtractedText || `${candidate.name} ${candidate.currentRole} ${candidate.technicalSkills.join(' ')} ${candidate.aiSummary}`,
          job: {
            title: targetJob.title,
            department: targetJob.department,
            experienceRequired: targetJob.experienceRequired,
            description: targetJob.description,
            requiredSkills: targetJob.requiredSkills,
            preferredSkills: targetJob.preferredSkills,
            educationRequirements: targetJob.educationRequirements,
            importantKeywords: targetJob.importantKeywords || [],
          },
        }),
      });

      const resJson = await response.json();
      if (!resJson.success || !resJson.data?.screening) {
        addToast({
          type: 'error',
          title: 'Screening Failed',
          description: resJson.error || 'Could not evaluate candidate for this role.'
        });
        return false;
      }

      const s = resJson.data.screening;
      const nowIso = new Date().toISOString();
      const resumeId = candidate.resumeId || candidate.id;
      const screeningResultId = `scr_${candidate.id}_${resumeId}_${targetJob.id}`;

      const overallScore = Math.min(100, Math.max(0, typeof s.matchScore?.overall === 'number' ? s.matchScore.overall : 75));
      const requiredSkillsScore = Math.min(100, Math.max(0, typeof s.matchScore?.requiredSkills === 'number' ? s.matchScore.requiredSkills : 75));
      const experienceScore = Math.min(100, Math.max(0, typeof s.matchScore?.experience === 'number' ? s.matchScore.experience : 75));
      const educationScore = Math.min(100, Math.max(0, typeof s.matchScore?.education === 'number' ? s.matchScore.education : 75));
      const projectScore = Math.min(100, Math.max(0, typeof s.matchScore?.projects === 'number' ? s.matchScore.projects : 75));
      const preferredSkillsScore = Math.min(100, Math.max(0, typeof s.matchScore?.preferredSkills === 'number' ? s.matchScore.preferredSkills : 60));

      const newScreeningResult: ScreeningResult = {
        screeningResultId,
        candidateId: candidate.id,
        resumeId,
        uploadId: candidate.uploadId,
        fileHash: candidate.fileHash,
        jobId: targetJob.id,
        jobTitle: targetJob.title,
        overallScore,
        skillsScore: requiredSkillsScore,
        requiredSkillsScore,
        experienceScore,
        educationScore,
        projectScore,
        preferredSkillsScore,
        matchedSkills: s.matchedSkills || [],
        missingSkills: s.missingSkills || [],
        classifiedSkills: s.classifiedSkills || [],
        experienceEvaluation: s.experienceEvaluation,
        projectRelevanceExplanation: s.projectRelevanceExplanation,
        strengths: s.strengths || [],
        skillGaps: s.skillGaps || [],
        potentialConcerns: s.potentialConcerns || [],
        summary: s.summary || '',
        recommendation: s.recommendation || 'Needs Review',
        recommendationAction: s.recommendationAction,
        explanation: s.explanation || s.summary || '',
        formulaExplanation: s.formulaExplanation,
        screenedAt: nowIso,
      };

      // Update screening results state
      setScreeningResults(prev => [
        newScreeningResult,
        ...prev.filter(r => !(r.candidateId === candidate.id && r.jobId === targetJob.id))
      ]);

      // Update candidate's multi-job screenings map (WITHOUT overwriting other roles)
      setCandidates(prev => prev.map(c => {
        if (c.id === candidate.id) {
          const updatedMap = {
            ...(c.screeningsByJob || {}),
            [targetJob.id]: newScreeningResult
          };
          return {
            ...c,
            screeningsByJob: updatedMap
          };
        }
        return c;
      }));

      // Update selectedCandidateDetail if viewing this candidate
      if (selectedCandidateDetail && selectedCandidateDetail.id === candidate.id) {
        setSelectedCandidateDetail(prev => prev ? {
          ...prev,
          screeningsByJob: {
            ...(prev.screeningsByJob || {}),
            [targetJob.id]: newScreeningResult
          }
        } : null);
      }

      // Add to activity log
      const newAct: ScreeningActivity = {
        id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        candidateId: candidate.id,
        candidateName: candidate.name,
        jobId: targetJob.id,
        jobTitle: targetJob.title,
        score: overallScore,
        recommendation: s.recommendation || 'Needs Review',
        action: `AI Screening: ${overallScore}% match score calculated for "${targetJob.title}"`,
        timestamp: 'Just now'
      };
      setActivities(prev => [newAct, ...prev]);

      addToast({
        type: 'success',
        title: 'Screening Complete',
        description: `${candidate.name} scored ${overallScore}% match for "${targetJob.title}".`
      });

      return true;
    } catch (e) {
      console.error('Multi-job screening error:', e);
      addToast({
        type: 'error',
        title: 'Screening Error',
        description: 'Failed to complete role screening.'
      });
      return false;
    }
  };

  const startScreening = async () => {
    if (uploadedFiles.length === 0) {
      addToast({
        type: 'info',
        title: 'No Files in Queue',
        description: 'Upload PDF resumes to run AI screening.'
      });
      return;
    }

    const unanalyzed = uploadedFiles.filter(f => f.status !== 'completed' && !f.isDuplicate);
    if (unanalyzed.length === 0) {
      addToast({
        type: 'info',
        title: 'All Resumes Screened',
        description: 'All uploaded resumes in queue have already been screened.'
      });
      return;
    }

    setIsScreeningInProgress(true);
    const activeJob = currentJob || jobs[0];
    let successCount = 0;

    for (const item of unanalyzed) {
      const ok = await processScreeningItem(item, activeJob);
      if (ok) {
        successCount++;
      }
    }

    // Update active job counts and average match score
    if (successCount > 0) {
      setJobs(prev => prev.map(j => {
        if (j.id === activeJob.id) {
          const jobScreenings = screeningResults.filter(r => r.jobId === activeJob.id);
          const totalScreened = jobScreenings.length + successCount;
          const totalScore = jobScreenings.reduce((acc, r) => acc + r.overallScore, 0);
          const avgScore = totalScreened > 0 ? Math.round(totalScore / totalScreened) : j.averageMatchScore;

          return {
            ...j,
            applicantsCount: j.applicantsCount + successCount,
            screenedCount: j.screenedCount + successCount,
            averageMatchScore: avgScore > 0 ? avgScore : j.averageMatchScore,
          };
        }
        return j;
      }));

      addToast({
        type: 'success',
        title: 'Screening Completed!',
        description: `Successfully analyzed ${successCount} candidate resume${successCount > 1 ? 's' : ''}.`
      });

      setSelectedJobId(activeJob.id);
      setActiveTab('candidates');
    } else {
      addToast({
        type: 'error',
        title: 'Screening Incomplete',
        description: 'AI analysis could not be completed for the queued resumes. Please retry.'
      });
    }

    setIsScreeningInProgress(false);
  };

  const retryScreeningFile = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;

    setIsScreeningInProgress(true);
    addToast({
      type: 'info',
      title: 'Retrying AI Analysis',
      description: `Re-analyzing "${file.name}" with Gemini...`
    });

    const activeJob = currentJob || jobs[0];
    const ok = await processScreeningItem(file, activeJob);

    if (ok) {
      addToast({
        type: 'success',
        title: 'Retry Successful',
        description: `Candidate profile created for "${file.name}".`
      });

      setSelectedJobId(activeJob.id);
      setActiveTab('candidates');
    }

    setIsScreeningInProgress(false);
  };

  const createJob = (jobData: Partial<Job>): string => {
    const newId = 'job-' + Date.now();
    const newJob: Job = {
      id: newId,
      title: jobData.title || 'Untitled Role',
      department: jobData.department || 'General',
      location: jobData.location || 'India (Hybrid)',
      employmentType: jobData.employmentType || 'Full-time',
      experienceRequired: jobData.experienceRequired || '2-5 years',
      salaryRange: jobData.salaryRange || '₹12,00,000 - ₹20,00,000',
      description: jobData.description || 'Job opening description and core responsibilities.',
      requiredSkills: jobData.requiredSkills && jobData.requiredSkills.length > 0 ? jobData.requiredSkills : ['Communication', 'Domain Knowledge'],
      preferredSkills: jobData.preferredSkills || [],
      educationRequirements: jobData.educationRequirements || "Bachelor's degree or equivalent practical experience",
      importantKeywords: jobData.importantKeywords || [],
      status: jobData.status || 'active',
      applicantsCount: 0,
      screenedCount: 0,
      shortlistedCount: 0,
      averageMatchScore: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setJobs(prev => [newJob, ...prev]);
    setSelectedJobId(newId);

    addToast({
      type: 'success',
      title: 'Job Opening Created',
      description: `"${newJob.title}" has been published. Ready to screen candidates.`
    });

    return newId;
  };

  const updateJob = (jobId: string, updatedData: Partial<Job>) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return { ...job, ...updatedData };
      }
      return job;
    }));

    addToast({
      type: 'success',
      title: 'Job Opening Updated',
      description: 'Role requirements and specifications have been updated.'
    });
  };

  const closeJob = (jobId: string) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return { ...job, status: 'closed' as const };
      }
      return job;
    }));

    addToast({
      type: 'info',
      title: 'Job Closed',
      description: 'Job opening marked as closed. Candidate profiles remain preserved.'
    });
  };

  const reopenJob = (jobId: string) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return { ...job, status: 'active' as const };
      }
      return job;
    }));

    addToast({
      type: 'success',
      title: 'Job Reopened',
      description: 'Job opening is now active and ready for screening.'
    });
  };

  const deleteJob = (jobId: string) => {
    const jobToDelete = jobs.find(j => j.id === jobId);
    setJobs(prev => prev.filter(j => j.id !== jobId));
    if (selectedJobId === jobId) {
      const remaining = jobs.filter(j => j.id !== jobId);
      if (remaining.length > 0) {
        setSelectedJobId(remaining[0].id);
      }
    }

    addToast({
      type: 'info',
      title: 'Job Deleted',
      description: `"${jobToDelete?.title || 'Job'}" has been removed.`
    });
  };

  const generateJobRequirementsAI = async (title: string, rawDescription?: string, department?: string) => {
    try {
      const response = await fetch('/api/gemini/generate-job-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, rawDescription, department })
      });
      const data = await response.json();
      if (data.success && data.data) {
        return data.data;
      }
      throw new Error(data.error || 'Failed to generate job spec');
    } catch (e: any) {
      console.warn('AI Job Spec Generation failed:', e);
      return {
        requiredSkills: ['Core Competencies', 'Problem Solving', 'Domain Expertise'],
        preferredSkills: ['Leadership', 'Tooling Proficiency'],
        experienceRequired: '3-5 years',
        salaryRange: '₹12,00,000 - ₹22,00,000',
        educationRequirements: "Bachelor's degree or equivalent industry experience",
        description: `We are looking for an experienced ${title} to join our team.`
      };
    }
  };

  const toggleCompareCandidate = (id: string) => {
    setComparedCandidateIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(candId => candId !== id);
      }
      if (prev.length >= 4) {
        addToast({
          type: 'warning',
          title: 'Comparison Limit',
          description: 'You can compare up to 4 candidates simultaneously.'
        });
        return prev;
      }
      return [...prev, id];
    });
  };

  const clearCompareCandidates = () => {
    setComparedCandidateIds([]);
  };

  const updateCandidateStatus = (candidateId: string, status: RecruiterCandidateStatus) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        return { ...c, recruiterStatus: status };
      }
      return c;
    }));

    if (selectedCandidateDetail && selectedCandidateDetail.id === candidateId) {
      setSelectedCandidateDetail(prev => prev ? { ...prev, recruiterStatus: status } : null);
    }

    const cand = candidates.find(c => c.id === candidateId);
    if (cand) {
      const newAct: ScreeningActivity = {
        id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        candidateId: cand.id,
        candidateName: cand.name,
        jobId: cand.jobId,
        jobTitle: jobs.find(j => j.id === cand.jobId)?.title || 'Job Opening',
        score: cand.overallMatchScore,
        recommendation: cand.recommendation,
        action: `Recruiter marked candidate as ${status.replace('_', ' ')}`,
        timestamp: 'Just now'
      };
      setActivities(prev => [newAct, ...prev]);
    }
  };

  const addCandidateNote = (candidateId: string, noteText: string) => {
    if (!noteText.trim()) return;

    const newNote = {
      id: 'note-' + Date.now(),
      author: 'Lead Recruiter',
      text: noteText.trim(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        const updatedNotes = [newNote, ...(c.recruiterNotes || [])];
        return { ...c, recruiterNotes: updatedNotes };
      }
      return c;
    }));

    if (selectedCandidateDetail && selectedCandidateDetail.id === candidateId) {
      setSelectedCandidateDetail(prev => prev ? {
        ...prev,
        recruiterNotes: [newNote, ...(prev.recruiterNotes || [])]
      } : null);
    }

    addToast({
      type: 'success',
      title: 'Recruiter Note Saved',
      description: 'Your private screening note was added to the candidate profile.'
    });
  };

  const sendCopilotMessage = async (content: string) => {
    if (!content.trim() || isCopilotTyping) return;

    const userMsg: CopilotMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: content.trim(),
      timestamp: 'Just now'
    };

    const newHistory = [...copilotMessages, userMsg];
    setCopilotMessages(newHistory);
    setIsCopilotTyping(true);

    try {
      const activeJob = currentJob || jobs[0];
      const candidatesSummary = candidates
        .slice(0, 5)
        .map(c => {
          const scr = getCandidateScreeningForJob(c, activeJob.id);
          const scoreText = scr ? `${scr.overallScore}% Match [${scr.recommendation}]` : 'Not yet screened for this role';
          return `- ${c.name} (${c.currentRole}, ${c.yearsOfExperience} yrs exp): ${scoreText}. Key skills: ${(c.technicalSkills || []).slice(0, 4).join(', ')}`;
        })
        .join('\n');

      const response = await fetch('/api/gemini/copilot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
          context: {
            jobTitle: activeJob.title,
            jobRequirements: `Required: ${activeJob.requiredSkills.join(', ')}. Preferred: ${activeJob.preferredSkills.join(', ')}. Experience: ${activeJob.experienceRequired}.`,
            candidatesSummary
          }
        })
      });

      const resJson = await response.json();
      let replyText = resJson.data?.reply;
      if (!replyText) {
        replyText = `Based on the candidates evaluated for "${activeJob.title}", ${candidates[0]?.name || 'the top candidate'} demonstrates strong background in software development and relevant competencies.`;
      }

      setCopilotMessages(prev => [
        ...prev,
        {
          id: 'msg-' + Date.now(),
          role: 'assistant',
          content: replyText,
          timestamp: 'Just now'
        }
      ]);
    } catch (e) {
      console.warn('Copilot chat error', e);
      setCopilotMessages(prev => [
        ...prev,
        {
          id: 'msg-' + Date.now(),
          role: 'assistant',
          content: "I've reviewed the candidates currently in the pipeline. Please ask any specific questions about candidates, missing skills, or interview preparation!",
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsCopilotTyping(false);
    }
  };

  const loadSampleCandidates = () => {
    const { candidates: sampleItems, screeningResults: sampleResults } = buildSampleCandidates();

    setCandidates(prev => {
      const realOnly = prev.filter(c => c.source === 'real-upload' || !c.isDemo);
      return [...realOnly, ...sampleItems];
    });

    setScreeningResults(prev => {
      const realCandidateIds = new Set(candidates.filter(c => c.source === 'real-upload' || !c.isDemo).map(c => c.id));
      const realResults = prev.filter(r => realCandidateIds.has(r.candidateId));
      return [...realResults, ...sampleResults];
    });

    setHasLoadedDemoData(true);
    addToast({
      title: 'Sample Candidates Loaded',
      description: 'Demo candidates added with "Sample Data" tags.',
      type: 'info'
    });
  };

  const clearSampleCandidates = () => {
    setCandidates(prev => prev.filter(c => c.source === 'real-upload' || !c.isDemo));
    setHasLoadedDemoData(false);
    addToast({
      title: 'Sample Data Cleared',
      description: 'Removed all demo profiles. Real uploaded resumes remain intact.',
      type: 'info'
    });
  };

  /**
   * Candidates filtered by search and role awareness.
   */
  const filteredCandidates = candidates.filter(c => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const nameMatch = Boolean(c.name && c.name.toLowerCase().includes(query));
    const emailMatch = Boolean(c.email && c.email.toLowerCase().includes(query));
    const roleMatch = Boolean(c.currentRole && c.currentRole.toLowerCase().includes(query));
    const locationMatch = Boolean(c.location && c.location.toLowerCase().includes(query));
    const fileMatch = Boolean(c.resumeFileName && c.resumeFileName.toLowerCase().includes(query));
    const skillMatch = Boolean(
      (c.technicalSkills && c.technicalSkills.some(s => s.toLowerCase().includes(query))) ||
      (c.softSkills && c.softSkills.some(s => s.toLowerCase().includes(query))) ||
      (c.matchedSkills && c.matchedSkills.some(s => s.toLowerCase().includes(query))) ||
      (c.missingSkills && c.missingSkills.some(s => s.toLowerCase().includes(query)))
    );

    return nameMatch || emailMatch || roleMatch || locationMatch || fileMatch || skillMatch;
  });

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        jobs,
        selectedJobId,
        setSelectedJobId,
        currentJob,
        candidates,
        screeningResults,
        getScreeningResult,
        getCandidateScreeningForJob,
        screenCandidateForJob,
        filteredCandidates,
        activities,
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
        createJob,
        updateJob,
        closeJob,
        reopenJob,
        deleteJob,
        generateJobRequirementsAI,
        selectedCandidateDetail,
        setSelectedCandidateDetail,
        comparedCandidateIds,
        toggleCompareCandidate,
        clearCompareCandidates,
        updateCandidateStatus,
        addCandidateNote,
        toasts,
        addToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        isCopilotOpen,
        setIsCopilotOpen,
        copilotMessages,
        sendCopilotMessage,
        isCopilotTyping,
        isGeminiReady,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
