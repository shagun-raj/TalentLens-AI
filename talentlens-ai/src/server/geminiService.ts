import { GoogleGenAI, Type } from '@google/genai';
import { extractTextFromPDFBuffer } from './pdfService';
import {
  calculateCandidateMatchScore,
  clampScore,
  classifySkills,
  evaluateExperience,
  evaluateProjectRelevance,
  EXPLAINABLE_SCORING_WEIGHTS
} from '../utils/scoring';
import { SkillEvaluation, ExperienceEvaluation } from '../types';

const apiKey = process.env.GEMINI_API_KEY || '';

export function isGeminiConfigured(): boolean {
  return Boolean(apiKey && apiKey.trim().length > 0 && apiKey !== 'MY_GEMINI_API_KEY');
}

export const ai = isGeminiConfigured()
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

export interface ScreenResumeRequest {
  fileName: string;
  resumeText?: string;
  resumeBase64?: string;
  job: {
    title: string;
    department?: string;
    experienceRequired: string;
    description: string;
    requiredSkills: string[];
    preferredSkills: string[];
    educationRequirements: string;
    importantKeywords?: string[];
  };
}

export interface StructuredScreeningResponse {
  candidate: {
    name: string;
    email: string;
    phone: string;
    location: string;
    professionalTitle: string;
  };
  education: Array<{
    degree: string;
    university: string;
    graduationYear?: number;
    gpa?: string;
    fieldOfStudy?: string;
  }>;
  experience: {
    years: number;
    roles: Array<{
      company: string;
      role: string;
      duration: string;
      highlights: string[];
    }>;
  };
  skills: {
    technical: string[];
    soft: string[];
  };
  projects: Array<{
    name: string;
    description: string;
    techStack: string[];
  }>;
  certifications: string[];
  matchedSkills: string[];
  missingSkills: string[];
  classifiedSkills?: SkillEvaluation[];
  experienceEvaluation?: ExperienceEvaluation;
  projectRelevanceExplanation?: string;
  relevantExperience: string[];
  strengths: string[];
  skillGaps: string[];
  potentialConcerns: string[];
  matchScore: {
    overall: number;
    requiredSkills: number;
    experience: number;
    projects: number;
    education: number;
    preferredSkills: number;
    // legacy compat
    skills?: number;
  };
  formulaExplanation?: string;
  summary: string;
  recommendation: 'Strong Match' | 'Good Match' | 'Moderate Match' | 'Low Match';
  recommendationAction: string;
  explanation: string;
}

/**
 * Executes a Gemini API operation with controlled exponential backoff retry for transient 503/429 errors.
 */
async function callGeminiWithRetry<T>(
  operation: () => Promise<T>,
  contextName: string,
  maxAttempts: number = 3
): Promise<T> {
  let attempt = 0;
  let delayMs = 1500;

  while (attempt < maxAttempts) {
    attempt++;
    try {
      return await operation();
    } catch (error: any) {
      const status = error?.status || error?.statusCode || error?.response?.status;
      const errorMsg = String(error?.message || error || '');
      const is503 = status === 503 || errorMsg.includes('503') || errorMsg.toLowerCase().includes('unavailable') || errorMsg.toLowerCase().includes('overloaded');
      const is429 = status === 429 || errorMsg.includes('429') || errorMsg.toLowerCase().includes('resource has been exhausted');
      const isRetryable = is503 || is429;

      console.warn(`[Gemini API] Attempt ${attempt}/${maxAttempts} for ${contextName} returned: ${is503 ? '503 Service Unavailable' : is429 ? '429 Rate Limit' : errorMsg}`);

      if (isRetryable && attempt < maxAttempts) {
        console.log(`[Gemini API] Retrying in ${delayMs}ms (Attempt ${attempt + 1}/${maxAttempts})...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        delayMs *= 2;
      } else {
        if (is503) {
          throw new Error('AI screening service is temporarily unavailable (503). Please retry in a few moments.');
        }
        throw error;
      }
    }
  }
  throw new Error('AI screening service is temporarily unavailable. Maximum retry attempts reached.');
}

export async function screenResumeWithGemini(params: ScreenResumeRequest): Promise<{
  screening: StructuredScreeningResponse;
  extractedTextLength: number;
  pagesCount: number;
}> {
  if (!isGeminiConfigured() || !ai) {
    throw new Error('Gemini API is not configured. Please verify GEMINI_API_KEY in environment.');
  }

  const { fileName, resumeBase64, job } = params;
  let finalResumeText = params.resumeText || '';
  let pagesCount = 1;

  if (resumeBase64 && (!finalResumeText || finalResumeText.trim().length < 20)) {
    const pdfBuffer = Buffer.from(resumeBase64.replace(/^data:application\/pdf;base64,/, ''), 'base64');
    const extraction = await extractTextFromPDFBuffer(pdfBuffer, fileName);
    if (!extraction.success) {
      throw new Error(`PDF extraction failed: ${extraction.error}`);
    }
    if (extraction.text) {
      finalResumeText = extraction.text;
      pagesCount = extraction.numPages;
    }
  }

  if (!finalResumeText || finalResumeText.trim().length < 20) {
    throw new Error('Resume content is empty or unreadable. Please check the PDF file.');
  }

  const systemInstruction = `You are the TalentLens AI recruitment screening assistant.
Extract verifiable candidate information from the resume and compare it against the Job Requisition requirements.
DO NOT make autonomous hiring decisions. Provide objective evidence for human recruiter decision-support.

CRITICAL BIAS GUARDRAIL:
Do not infer or use protected characteristics (age, gender, religion, caste, race, ethnicity, disability, marital status, photograph) for evaluation.
Do NOT invent information that is not present in the resume. If information is missing, output "Not provided".

Evaluate candidate alignment across these 5 dimensions:
1. Required Skills (40% weight): Technical overlap with required skills (${job.requiredSkills.join(', ') || 'None'})
2. Experience (25% weight): Years of experience vs required range (${job.experienceRequired || 'Not specified'})
3. Projects/Work Relevance (15% weight): Real-world project scope, architectural responsibility, and stack relevance
4. Education/Certifications (10% weight): Academic background and verified credentials (${job.educationRequirements || 'Any'})
5. Preferred Skills (10% weight): Overlap with preferred skills (${job.preferredSkills.join(', ') || 'None'})

Output strict JSON adhering to the specified schema.`;

  const sanitizedResumeText = finalResumeText.length > 30000 
    ? finalResumeText.substring(0, 30000) + '\n[...Resume text truncated for length...]'
    : finalResumeText;

  const prompt = `Evaluate this candidate resume for the "${job.title}" requisition:

=== CANDIDATE RESUME FILENAME: "${fileName}" ===
${sanitizedResumeText}
=== END OF RESUME ===

Target Job Requirements:
- Title: ${job.title}
- Required Skills: ${job.requiredSkills.join(', ')}
- Preferred Skills: ${job.preferredSkills.join(', ')}
- Experience Required: ${job.experienceRequired}
- Education Requirements: ${job.educationRequirements}
- Description: ${job.description}

Extract structured candidate profile, evaluate skills (Strong Match, Partial Match, Missing), compare experience, project relevance (1-2 sentences), and score breakdown.`;

  const response = await callGeminiWithRetry(async () => {
    return await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            candidate: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                professionalTitle: { type: Type.STRING },
              },
              required: ['name', 'email', 'phone', 'location', 'professionalTitle'],
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  degree: { type: Type.STRING },
                  university: { type: Type.STRING },
                  graduationYear: { type: Type.INTEGER },
                  gpa: { type: Type.STRING },
                  fieldOfStudy: { type: Type.STRING },
                },
                required: ['degree', 'university'],
              },
            },
            experience: {
              type: Type.OBJECT,
              properties: {
                years: { type: Type.NUMBER },
                roles: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      company: { type: Type.STRING },
                      role: { type: Type.STRING },
                      duration: { type: Type.STRING },
                      highlights: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ['company', 'role', 'duration', 'highlights'],
                  },
                },
              },
              required: ['years', 'roles'],
            },
            skills: {
              type: Type.OBJECT,
              properties: {
                technical: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                soft: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['technical', 'soft'],
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  techStack: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['name', 'description', 'techStack'],
              },
            },
            certifications: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            matchedSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            missingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            skillGaps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            potentialConcerns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            subScores: {
              type: Type.OBJECT,
              properties: {
                requiredSkills: { type: Type.INTEGER },
                experience: { type: Type.INTEGER },
                projects: { type: Type.INTEGER },
                education: { type: Type.INTEGER },
                preferredSkills: { type: Type.INTEGER },
              },
              required: ['requiredSkills', 'experience', 'projects', 'education', 'preferredSkills'],
            },
            projectRelevanceExplanation: { type: Type.STRING },
            summary: { type: Type.STRING },
            recommendation: {
              type: Type.STRING,
              enum: ['Strong Match', 'Good Match', 'Moderate Match', 'Low Match'],
            },
            recommendationAction: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: [
            'candidate',
            'education',
            'experience',
            'skills',
            'projects',
            'certifications',
            'matchedSkills',
            'missingSkills',
            'strengths',
            'skillGaps',
            'subScores',
            'projectRelevanceExplanation',
            'summary',
            'recommendation',
            'recommendationAction',
            'explanation',
          ],
        },
      },
    });
  }, `Resume Screening: ${fileName}`, 3);

  const parsedJson = JSON.parse(response.text || '{}');

  // Compute deterministic weighted score
  const computed = calculateCandidateMatchScore({
    requiredSkills: parsedJson.subScores?.requiredSkills ?? 80,
    experience: parsedJson.subScores?.experience ?? 80,
    projects: parsedJson.subScores?.projects ?? 75,
    education: parsedJson.subScores?.education ?? 85,
    preferredSkills: parsedJson.subScores?.preferredSkills ?? 65,
  });

  // Classify skills with explicit evidence
  const classifiedReq = classifySkills(job.requiredSkills, 'required', finalResumeText, parsedJson.skills?.technical || []);
  const classifiedPref = classifySkills(job.preferredSkills, 'preferred', finalResumeText, parsedJson.skills?.technical || []);
  const allClassified = [...classifiedReq, ...classifiedPref];

  // Evaluate experience
  const candidateYears = typeof parsedJson.experience?.years === 'number' ? parsedJson.experience.years : 3;
  const expEvaluation = evaluateExperience(candidateYears, job.experienceRequired);

  // Evaluate project relevance
  const projRelevance = evaluateProjectRelevance(job.title, parsedJson.projects || [], parsedJson.experience?.roles || [], finalResumeText);

  const structuredResponse: StructuredScreeningResponse = {
    candidate: {
      name: parsedJson.candidate?.name || fileName.replace(/\.pdf$/i, '').replace(/_/g, ' '),
      email: parsedJson.candidate?.email || 'Not provided',
      phone: parsedJson.candidate?.phone || 'Not provided',
      location: parsedJson.candidate?.location || 'Not provided',
      professionalTitle: parsedJson.candidate?.professionalTitle || 'Software Professional',
    },
    education: parsedJson.education || [],
    experience: parsedJson.experience || { years: candidateYears, roles: [] },
    skills: parsedJson.skills || { technical: [], soft: [] },
    projects: parsedJson.projects || [],
    certifications: parsedJson.certifications || [],
    matchedSkills: allClassified.filter(s => s.status === 'strong_match').map(s => s.skill),
    missingSkills: allClassified.filter(s => s.status === 'missing').map(s => s.skill),
    classifiedSkills: allClassified,
    experienceEvaluation: expEvaluation,
    projectRelevanceExplanation: parsedJson.projectRelevanceExplanation || projRelevance.explanation,
    relevantExperience: [expEvaluation.displayText],
    strengths: parsedJson.strengths?.length ? parsedJson.strengths : computed.strengths,
    skillGaps: parsedJson.skillGaps?.length ? parsedJson.skillGaps : computed.skillGaps,
    potentialConcerns: parsedJson.potentialConcerns || [],
    matchScore: {
      overall: computed.overall,
      requiredSkills: computed.breakdown.requiredSkillsMatch || 80,
      experience: computed.breakdown.experienceMatch || 80,
      projects: computed.breakdown.projectRelevance || 75,
      education: computed.breakdown.educationMatch || 85,
      preferredSkills: computed.breakdown.preferredSkillsMatch || 65,
      skills: computed.breakdown.requiredSkillsMatch || 80,
    },
    formulaExplanation: computed.formulaExplanation,
    summary: parsedJson.summary || `Candidate evaluated with an overall match score of ${computed.overall}%.`,
    recommendation: computed.recommendation as any,
    recommendationAction: computed.recommendationAction,
    explanation: parsedJson.explanation || computed.formulaExplanation,
  };

  return {
    screening: structuredResponse,
    extractedTextLength: finalResumeText.length,
    pagesCount,
  };
}

export async function generateJobSpecWithGemini(params: {
  title: string;
  department?: string;
  rawDescription?: string;
  experienceLevel?: string;
}) {
  if (!isGeminiConfigured() || !ai) {
    throw new Error('Gemini API is not configured.');
  }

  const { title, department, rawDescription, experienceLevel } = params;

  const systemInstruction = `You are an expert Talent Acquisition Architect and Job Specification Specialist across all industries and professions (Software Engineering, Data & AI, Design, Sales, Marketing, HR, Finance, Accounting, Legal, Healthcare, Education/Teaching, Civil/Mechanical Engineering, Operations, Customer Support, etc.).
Generate comprehensive, industry-standard, and modern Job Requirements for any given job role in the Indian market.
Always use Indian Rupee (₹) for salary ranges (e.g. ₹4,00,000 - ₹8,00,000 per year or ₹12,00,000 - ₹20,00,000 per year). Never output USD or dollars.`;

  const prompt = `Generate a complete job specification for:
Job Title: ${title}
Department: ${department || 'General'}
Experience Level: ${experienceLevel || 'Mid-Level (2-5 years)'}
${rawDescription ? `Initial Notes / Draft:\n${rawDescription}` : ''}
`;

  const response = await callGeminiWithRetry(async () => {
    return await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            department: { type: Type.STRING },
            experienceRequired: { type: Type.STRING },
            salaryRange: { type: Type.STRING },
            description: { type: Type.STRING },
            requiredSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            preferredSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            educationRequirements: { type: Type.STRING },
            importantKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            interviewQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'title',
            'department',
            'experienceRequired',
            'salaryRange',
            'description',
            'requiredSkills',
            'preferredSkills',
            'educationRequirements',
            'importantKeywords',
            'interviewQuestions',
          ],
        },
      },
    });
  }, `Job Spec Generation (${title})`, 3);

  return JSON.parse(response.text?.trim() || '{}');
}

export async function recruiterCopilotChat(params: {
  messages: { role: 'user' | 'assistant'; content: string }[];
  context?: {
    jobTitle?: string;
    jobRequirements?: string;
    candidatesSummary?: string;
  };
}) {
  if (!isGeminiConfigured() || !ai) {
    throw new Error('Gemini API is not configured.');
  }

  const { messages, context } = params;

  let systemInstruction = `You are TalentLens Copilot, an AI recruiter assistant and talent analytics advisor.
You assist hiring managers and recruiters in analyzing candidates, comparing profiles, interpreting match scores, crafting targeted interview questions, and spotting technical skill gaps.
Be concise, analytical, and structured in your answers. Use bullet points and bold highlights where helpful.`;

  if (context) {
    systemInstruction += `\n\nCurrent Requisition Context:
Role: ${context.jobTitle || 'Active Requisition'}
Job Details: ${context.jobRequirements || 'Standard Engineering Requirements'}
Candidates in Current Pool:
${context.candidatesSummary || 'No candidate data provided.'}`;
  }

  const lastUserMessage = messages[messages.length - 1]?.content || 'Hello';
  const historyParts = messages.slice(0, -1).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

  const prompt = `${historyParts ? `Conversation History:\n${historyParts}\n\n` : ''}User Question: ${lastUserMessage}`;

  const response = await callGeminiWithRetry(async () => {
    return await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
  }, 'Copilot Chat', 3);

  return {
    reply: response.text || "I couldn't process that request at this moment.",
  };
}
