export type RecommendationStatus = 
  | 'Strong Match' 
  | 'Good Match' 
  | 'Needs Review' 
  | 'Moderate Match' 
  | 'Low Match' 
  | 'strong_match' 
  | 'good_match' 
  | 'needs_review' 
  | 'low_match';

export type RecruiterCandidateStatus = 
  | 'applied' 
  | 'screened' 
  | 'shortlisted' 
  | 'in_review' 
  | 'rejected' 
  | 'interview_scheduled';

export type ScreeningItemStatus = 
  | 'uploaded' 
  | 'processing' 
  | 'analyzing' 
  | 'completed' 
  | 'needs_review' 
  | 'failed';

export type ScreeningFlowState = 
  | 'not_screened'
  | 'uploading'
  | 'extracting'
  | 'analyzing'
  | 'calculating_match'
  | 'screened'
  | 'screening_failed';

export type SkillMatchType = 'strong_match' | 'partial_match' | 'missing';

export interface SkillEvaluation {
  skill: string;
  category: 'required' | 'preferred';
  status: SkillMatchType;
  label: string; // e.g. 'Strong Match', 'Partial Match', 'Missing'
  evidence?: string; // Short 1-sentence evidence found in resume
}

export interface ExperienceEvaluation {
  candidateYears: number;
  requiredRange: string;
  minYears: number;
  maxYears: number;
  status: 'met' | 'exceeded' | 'gap';
  displayText: string; // e.g. '✓ Experience requirement met' or '⚠ Experience gap: 1 year'
  details: string;
}

export interface MatchBreakdown {
  skillsMatch: number;          // 0 - 100 (40% weight - Required skills)
  requiredSkillsMatch?: number; // 0 - 100 (40% weight)
  experienceMatch: number;      // 0 - 100 (25% weight)
  projectRelevance: number;     // 0 - 100 (15% weight)
  educationMatch: number;       // 0 - 100 (10% weight)
  preferredSkillsMatch?: number;// 0 - 100 (10% weight)
  requirementRelevance?: number;// legacy compatibility
}

export interface WorkExperienceItem {
  id?: string;
  company: string;
  role: string;
  duration: string;
  location?: string;
  highlights: string[];
}

export interface EducationItem {
  degree: string;
  university: string;
  graduationYear?: number;
  gpa?: string;
  fieldOfStudy?: string;
}

export interface ProjectItem {
  id?: string;
  name: string;
  description: string;
  techStack: string[];
  link?: string;
}

export interface ScreeningResult {
  screeningResultId: string;
  candidateId: string;
  resumeId?: string;
  uploadId?: string;
  fileHash?: string;
  jobId: string;
  jobTitle?: string;
  overallScore: number;
  skillsScore: number;
  requiredSkillsScore?: number;
  experienceScore: number;
  educationScore: number;
  projectScore: number;
  preferredSkillsScore?: number;
  matchedSkills: string[];
  missingSkills: string[];
  classifiedSkills?: SkillEvaluation[];
  experienceEvaluation?: ExperienceEvaluation;
  projectRelevanceExplanation?: string;
  strengths: string[];
  skillGaps: string[];
  potentialConcerns: string[];
  summary: string;
  recommendation: RecommendationStatus;
  recommendationAction?: string; // e.g. "Good fit. Move candidate to recruiter review."
  explanation: string;
  formulaExplanation?: string;
  screenedAt: string;
}

export interface Candidate {
  id: string;                    // Unique Candidate ID (often matches primary resumeId)
  resumeId?: string;             // Unique Resume Identifier
  uploadId?: string;             // Upload instance identifier
  fileHash?: string;             // Content fingerprint for duplicate detection
  jobId: string;                 // Primary / Screened Job ID
  jobTitle?: string;             // Primary Job Title
  source?: 'real-upload' | 'sample'; // Distinct source categorization
  isDemo?: boolean;
  resumeSource?: 'AI Screened' | 'Sample Data';
  screeningResultId?: string;
  createdAt?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl?: string;
  
  // AI Match Scores & Analysis (for active/primary job)
  overallMatchScore: number;
  matchBreakdown: MatchBreakdown;
  recommendation: RecommendationStatus;
  recommendationAction?: string;
  explanation?: string;
  formulaExplanation?: string;
  
  // Recruiter control state
  recruiterStatus: RecruiterCandidateStatus;
  screeningStatus?: ScreeningItemStatus;
  screeningFlowState?: ScreeningFlowState;
  recruiterNotes: { id: string; author: string; text: string; date: string }[];
  
  // Extracted candidate profile from THIS exact resume
  yearsOfExperience: number;
  currentRole: string;
  education: EducationItem[];
  technicalSkills: string[];
  softSkills: string[];
  
  // Explainable AI Match Fields
  matchedSkills: string[];
  missingSkills: string[];
  classifiedSkills?: SkillEvaluation[];
  experienceEvaluation?: ExperienceEvaluation;
  projectRelevanceExplanation?: string;
  skillGaps: string[];
  strengths: string[];
  potentialConcerns: string[];
  relevantExperience: string[];
  
  workExperience: WorkExperienceItem[];
  projects: ProjectItem[];
  certifications: string[];
  
  aiSummary: string;
  
  // Multi-job Screening Results (jobId -> ScreeningResult)
  screeningsByJob?: Record<string, ScreeningResult>;
  
  // File metadata
  resumeFileName: string;
  resumeFileSize: string;
  uploadedAt: string;
  rawExtractedText?: string;
  pageCount?: number;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experienceRequired: string;
  salaryRange?: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  educationRequirements: string;
  importantKeywords?: string[];
  status: 'active' | 'draft' | 'closed' | 'paused';
  applicantsCount: number;
  screenedCount: number;
  shortlistedCount: number;
  averageMatchScore: number;
  createdAt: string;
}

export interface UploadedResumeFile {
  id: string;                    // uploadId
  resumeId?: string;             // resumeId
  fileHash?: string;             // SHA-256 fingerprint of file content
  isDuplicate?: boolean;         // True if exact file hash was already uploaded
  duplicateCandidateId?: string; // ID of existing candidate with matching fileHash
  file?: File;
  name: string;
  size: number;
  formattedSize: string;
  uploadProgress: number;
  status: ScreeningItemStatus;
  screeningStep?: 'uploading' | 'extracting' | 'analyzing' | 'calculating_match' | 'completed' | 'failed';
  errorMessage?: string;
  uploadedAt: string;
  base64Data?: string;
  extractedText?: string;
}

export interface ScreeningActivity {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  score: number;
  recommendation: RecommendationStatus;
  action: string;
  timestamp: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export type ActiveTab = 
  | 'dashboard'
  | 'jobs'
  | 'create-job'
  | 'candidates'
  | 'screening'
  | 'comparison'
  | 'analytics'
  | 'history'
  | 'settings';
