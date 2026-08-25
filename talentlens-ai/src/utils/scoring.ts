import {
  Candidate,
  Job,
  SkillEvaluation,
  ExperienceEvaluation,
  RecommendationStatus,
  MatchBreakdown,
  SkillMatchType
} from '../types';

/**
 * TalentLens AI Configurable Scoring Weights
 * Explicitly defined:
 * - Required skills: 40%
 * - Experience: 25%
 * - Projects/work relevance: 15%
 * - Education/certifications: 10%
 * - Preferred skills: 10%
 * Total = 100%
 */
export interface ScoringWeights {
  requiredSkills: number;   // 0.40
  experience: number;       // 0.25
  projects: number;         // 0.15
  education: number;        // 0.10
  preferredSkills: number;  // 0.10
}

export const EXPLAINABLE_SCORING_WEIGHTS: ScoringWeights = {
  requiredSkills: 0.40,  // 40% Weight
  experience: 0.25,      // 25% Weight
  projects: 0.15,        // 15% Weight
  education: 0.10,       // 10% Weight
  preferredSkills: 0.10, // 10% Weight
};

export interface RawCandidateSubScores {
  requiredSkills: number;   // 0 - 100
  experience: number;       // 0 - 100
  projects: number;         // 0 - 100
  education: number;        // 0 - 100
  preferredSkills: number;  // 0 - 100
}

export interface ComputedScoreResult {
  overall: number;
  breakdown: MatchBreakdown;
  recommendation: RecommendationStatus;
  recommendationAction: string;
  formulaExplanation: string;
  strengths: string[];
  skillGaps: string[];
}

/**
 * Clamps numeric scores strictly between 0 and 100.
 */
export function clampScore(value: number | undefined | null, min = 0, max = 100): number {
  if (typeof value !== 'number' || isNaN(value)) return min;
  return Math.max(min, Math.min(max, Math.round(value)));
}

/**
 * Computes deterministic overall candidate match score from sub-scores with configurable weights.
 */
export function calculateCandidateMatchScore(
  rawSubScores: RawCandidateSubScores,
  weights: ScoringWeights = EXPLAINABLE_SCORING_WEIGHTS
): ComputedScoreResult {
  const reqSkills = clampScore(rawSubScores.requiredSkills);
  const exp = clampScore(rawSubScores.experience);
  const proj = clampScore(rawSubScores.projects);
  const edu = clampScore(rawSubScores.education);
  const prefSkills = clampScore(rawSubScores.preferredSkills);

  // Exact formula: 0.40*ReqSkills + 0.25*Exp + 0.15*Projects + 0.10*Edu + 0.10*PrefSkills
  const weightedSum = (
    reqSkills * weights.requiredSkills +
    exp * weights.experience +
    proj * weights.projects +
    edu * weights.education +
    prefSkills * weights.preferredSkills
  );

  const overall = clampScore(weightedSum);

  let recommendation: RecommendationStatus = 'Good Match';
  let recommendationAction = 'Good fit. Move candidate to recruiter review.';

  if (overall >= 85) {
    recommendation = 'Strong Match';
    recommendationAction = 'Strong match. Move candidate to shortlist.';
  } else if (overall >= 70) {
    recommendation = 'Good Match';
    recommendationAction = 'Good fit. Move candidate to recruiter review.';
  } else if (overall >= 50) {
    recommendation = 'Moderate Match';
    recommendationAction = 'Moderate match. Review candidate profile carefully.';
  } else {
    recommendation = 'Low Match';
    recommendationAction = 'Low alignment with job criteria. Consider other candidates.';
  }

  const formulaExplanation = 
    `Overall score (${overall}%) = ` +
    `Required Skills (${reqSkills}% × ${Math.round(weights.requiredSkills * 100)}%) + ` +
    `Experience (${exp}% × ${Math.round(weights.experience * 100)}%) + ` +
    `Projects (${proj}% × ${Math.round(weights.projects * 100)}%) + ` +
    `Education (${edu}% × ${Math.round(weights.education * 100)}%) + ` +
    `Preferred Skills (${prefSkills}% × ${Math.round(weights.preferredSkills * 100)}%)`;

  const strengths: string[] = [];
  const skillGaps: string[] = [];

  if (reqSkills >= 80) strengths.push('Strong required technical skills overlap');
  if (exp >= 80) strengths.push('Experience requirement met');
  if (proj >= 75) strengths.push('Relevant project architecture and real-world work deliverables');
  if (edu >= 85) strengths.push('Degree and educational background align with role requirements');
  if (prefSkills >= 70) strengths.push('Possesses secondary preferred qualifications');

  if (reqSkills < 70) skillGaps.push('Partial gaps in core required competencies');
  if (exp < 65) skillGaps.push('Total experience is below target requisition benchmark');
  if (prefSkills < 50) skillGaps.push('Limited exposure to preferred secondary tools');

  return {
    overall,
    breakdown: {
      skillsMatch: reqSkills,
      requiredSkillsMatch: reqSkills,
      experienceMatch: exp,
      projectRelevance: proj,
      educationMatch: edu,
      preferredSkillsMatch: prefSkills,
    },
    recommendation,
    recommendationAction,
    formulaExplanation,
    strengths,
    skillGaps,
  };
}

/**
 * Parses numeric years range from experience strings like "2-4 years", "3-5 yrs", "5+ years", "Fresher / 0-1 year".
 */
export function parseExperienceRange(expStr?: string): { minYears: number; maxYears: number; formatted: string } {
  if (!expStr) return { minYears: 2, maxYears: 5, formatted: '2–4 years' };

  const str = expStr.toLowerCase();
  if (str.includes('fresher') || str.includes('0-1')) {
    return { minYears: 0, maxYears: 1, formatted: '0–1 years' };
  }

  const match = str.match(/(\d+)\s*(?:-|to)\s*(\d+)/);
  if (match) {
    const min = parseInt(match[1], 10);
    const max = parseInt(match[2], 10);
    return { minYears: min, maxYears: max, formatted: `${min}–${max} years` };
  }

  const singlePlus = str.match(/(\d+)\s*\+/);
  if (singlePlus) {
    const min = parseInt(singlePlus[1], 10);
    return { minYears: min, maxYears: min + 3, formatted: `${min}+ years` };
  }

  const single = str.match(/(\d+)/);
  if (single) {
    const val = parseInt(single[1], 10);
    return { minYears: Math.max(0, val - 1), maxYears: val + 2, formatted: `${val} years` };
  }

  return { minYears: 2, maxYears: 4, formatted: '2–4 years' };
}

/**
 * Compares candidate experience duration against job requirement profile.
 */
export function evaluateExperience(
  candidateYears: number,
  experienceRequiredStr?: string
): ExperienceEvaluation {
  const { minYears, maxYears, formatted } = parseExperienceRange(experienceRequiredStr);

  if (candidateYears >= minYears && candidateYears <= maxYears) {
    return {
      candidateYears,
      requiredRange: formatted,
      minYears,
      maxYears,
      status: 'met',
      displayText: '✓ Experience requirement met',
      details: `Candidate has ${candidateYears} years of experience, aligning with target range of ${formatted}.`,
    };
  } else if (candidateYears > maxYears) {
    return {
      candidateYears,
      requiredRange: formatted,
      minYears,
      maxYears,
      status: 'exceeded',
      displayText: `✓ Exceeds experience requirement (${candidateYears} yrs vs ${formatted})`,
      details: `Candidate brings ${candidateYears} years of experience, exceeding the required ${formatted}.`,
    };
  } else {
    const gap = Math.max(1, minYears - candidateYears);
    return {
      candidateYears,
      requiredRange: formatted,
      minYears,
      maxYears,
      status: 'gap',
      displayText: `⚠ Experience gap: ${gap} year${gap > 1 ? 's' : ''}`,
      details: `Candidate has ${candidateYears} years of experience, while the role seeks ${formatted} (gap of ${gap} year${gap > 1 ? 's' : ''}).`,
    };
  }
}

/**
 * Classifies skills into:
 * ✓ Strong Match
 * △ Partial Match
 * ✗ Missing
 */
export function classifySkills(
  targetSkills: string[],
  category: 'required' | 'preferred',
  candidateText: string,
  candidateSkillsList: string[] = []
): SkillEvaluation[] {
  const normText = (candidateText || '').toLowerCase();
  const lowerCandSkills = candidateSkillsList.map(s => s.toLowerCase().trim());

  return targetSkills.map(rawSkill => {
    const cleanSkill = rawSkill.trim();
    const skillLower = cleanSkill.toLowerCase();

    // Direct match in extracted skills list
    const exactInList = lowerCandSkills.some(cs => cs === skillLower || cs.includes(skillLower) || skillLower.includes(cs));

    // Regex check in full resume text
    const escaped = skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:\\b|[^a-zA-Z0-9])${escaped}(?:\\b|[^a-zA-Z0-9])`, 'i');
    const textHasSkill = regex.test(normText) || normText.includes(skillLower);

    // Related technology check for partial matches
    let isPartial = false;
    let partialEvidence = '';

    if (!exactInList && !textHasSkill) {
      if (skillLower.includes('spring') && (normText.includes('java') || normText.includes('springboot'))) {
        isPartial = true;
        partialEvidence = 'Related Java backend experience mentioned in resume.';
      } else if (skillLower.includes('react') && (normText.includes('javascript') || normText.includes('frontend') || normText.includes('vue'))) {
        isPartial = true;
        partialEvidence = 'JavaScript frontend background present.';
      } else if (skillLower.includes('docker') && (normText.includes('container') || normText.includes('kubernetes') || normText.includes('devops'))) {
        isPartial = true;
        partialEvidence = 'Containerization or DevOps concepts present.';
      } else if (skillLower.includes('sql') && (normText.includes('database') || normText.includes('postgres') || normText.includes('mysql') || normText.includes('mongo'))) {
        isPartial = true;
        partialEvidence = 'Database/data storage experience found.';
      } else if (skillLower.includes('aws') && (normText.includes('cloud') || normText.includes('azure') || normText.includes('gcp'))) {
        isPartial = true;
        partialEvidence = 'Cloud platform experience noted.';
      }
    }

    if (exactInList || textHasSkill) {
      return {
        skill: cleanSkill,
        category,
        status: 'strong_match',
        label: 'Strong Match',
        evidence: `Direct skill match evidenced in resume profile (${cleanSkill}).`,
      };
    } else if (isPartial) {
      return {
        skill: cleanSkill,
        category,
        status: 'partial_match',
        label: 'Partial Match',
        evidence: partialEvidence,
      };
    } else {
      return {
        skill: cleanSkill,
        category,
        status: 'missing',
        label: 'Missing',
        evidence: `No direct mention of ${cleanSkill} detected in candidate resume.`,
      };
    }
  });
}

/**
 * Evaluates Project & Work Relevance in 1-2 concise sentences.
 */
export function evaluateProjectRelevance(
  jobTitle: string,
  candidateProjects: any[],
  candidateWork: any[],
  resumeText: string
): { score: number; explanation: string } {
  const normTitle = (jobTitle || '').toLowerCase();
  const text = (resumeText || '').toLowerCase();

  let relevantKeywords = 0;
  if (normTitle.includes('java') && (text.includes('spring') || text.includes('rest') || text.includes('backend') || text.includes('microservice'))) {
    relevantKeywords += 3;
  }
  if (normTitle.includes('frontend') && (text.includes('react') || text.includes('ui') || text.includes('component') || text.includes('css'))) {
    relevantKeywords += 3;
  }
  if (normTitle.includes('python') && (text.includes('django') || text.includes('fastapi') || text.includes('pandas') || text.includes('data'))) {
    relevantKeywords += 3;
  }
  if (normTitle.includes('devops') && (text.includes('ci/cd') || text.includes('docker') || text.includes('kubernetes') || text.includes('terraform'))) {
    relevantKeywords += 3;
  }

  const projCount = candidateProjects.length;
  const workCount = candidateWork.length;

  let score = 75;
  if (projCount >= 2 || workCount >= 2) score += 10;
  if (relevantKeywords >= 2) score += 10;
  score = Math.min(95, Math.max(50, score));

  let explanation = `Candidate has experience building relevant projects and industry deliverables, aligning closely with the ${jobTitle} role requirements.`;
  if (normTitle.includes('java') || text.includes('spring') || text.includes('backend')) {
    explanation = 'Candidate has experience building REST APIs and backend services, which closely matches the role requirements.';
  } else if (normTitle.includes('react') || text.includes('frontend') || text.includes('ui')) {
    explanation = 'Candidate has experience creating responsive web applications and modular frontend architectures, fitting the required frontend scope.';
  } else if (normTitle.includes('python') || text.includes('data')) {
    explanation = 'Candidate demonstrates practical hands-on data manipulation and API engineering projects relevant to the target role.';
  }

  return { score, explanation };
}
