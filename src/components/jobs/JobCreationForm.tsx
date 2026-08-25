import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job } from '../../types';
import {
  Briefcase,
  Sparkles,
  Plus,
  X,
  MapPin,
  Clock,
  IndianRupee,
  GraduationCap,
  CheckCircle2,
  FileText,
  Layers,
  ArrowRight,
  ArrowLeft,
  Check,
  Building,
  Users,
  FileUp,
  RotateCw,
  Info
} from 'lucide-react';

interface ProfessionPreset {
  name: string;
  category: string;
  icon: string;
  title: string;
  department: string;
  location: string;
  employmentType: Job['employmentType'];
  experienceRequired: string;
  minSalary: string;
  maxSalary: string;
  description: string;
  educationRequirements: string;
  requiredSkills: string[];
  preferredSkills: string[];
  keywords: string[];
}

const MULTI_INDUSTRY_PRESETS: ProfessionPreset[] = [
  {
    name: 'Full-Stack Dev',
    category: 'Engineering',
    icon: '💻',
    title: 'Full-Stack Developer (React & Node.js)',
    department: 'Engineering',
    location: 'Bengaluru, India (Hybrid)',
    employmentType: 'Full-time',
    experienceRequired: '3-6 years',
    minSalary: '14,00,000',
    maxSalary: '24,00,000',
    description: 'Design and build end-to-end scalable web applications using React, TypeScript, Node.js, and PostgreSQL with robust RESTful APIs.',
    educationRequirements: "B.Tech / B.E. / M.C.A in Computer Science or equivalent practical experience",
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'RESTful APIs', 'Git'],
    preferredSkills: ['Docker', 'AWS', 'Tailwind CSS', 'Redis', 'GraphQL'],
    keywords: ['Microservices', 'State Management', 'Relational DB', 'System Design']
  },
  {
    name: 'Java Developer',
    category: 'Engineering',
    icon: '☕',
    title: 'Java Developer (Spring Boot & Cloud)',
    department: 'Engineering',
    location: 'Pune / Mumbai, India (Hybrid)',
    employmentType: 'Full-time',
    experienceRequired: '3-6 years',
    minSalary: '12,00,000',
    maxSalary: '22,00,000',
    description: 'Develop high-throughput enterprise backend services using Java 17/21, Spring Boot, Hibernate, microservices architecture, and cloud deployment.',
    educationRequirements: "B.E. / B.Tech in CS / IT / Electronics or M.C.A",
    requiredSkills: ['Java', 'Spring Boot', 'Hibernate / JPA', 'Microservices', 'SQL', 'REST APIs'],
    preferredSkills: ['Kafka', 'Docker', 'AWS', 'JUnit', 'Redis'],
    keywords: ['Enterprise Java', 'Spring Security', 'Multithreading', 'Design Patterns']
  },
  {
    name: 'Data Analyst',
    category: 'Data & Analytics',
    icon: '📊',
    title: 'Data Analyst (SQL & Business Intelligence)',
    department: 'Data & Analytics',
    location: 'Gurugram / Noida, India (Hybrid)',
    employmentType: 'Full-time',
    experienceRequired: '2-4 years',
    minSalary: '8,00,000',
    maxSalary: '15,00,000',
    description: 'Extract business insights from data warehouses, write advanced SQL queries, build executive reporting dashboards in Power BI/Tableau, and identify growth drivers.',
    educationRequirements: "Degree in Statistics, Mathematics, Economics, Computer Science, or quantitative discipline",
    requiredSkills: ['SQL', 'Power BI / Tableau', 'Excel & Advanced Formulas', 'Data Modeling', 'Data Visualization'],
    preferredSkills: ['Python (Pandas)', 'Snowflake', 'Statistical Analysis', 'ETL Pipelines'],
    keywords: ['Cohort Analysis', 'Dashboarding', 'KPI Tracking', 'Business Metrics']
  },
  {
    name: 'UI/UX Designer',
    category: 'Design',
    icon: '🎨',
    title: 'UI/UX Designer (Figma & Design Systems)',
    department: 'Product & Design',
    location: 'Bengaluru, India (Hybrid)',
    employmentType: 'Full-time',
    experienceRequired: '2-5 years',
    minSalary: '10,00,000',
    maxSalary: '18,00,000',
    description: 'Conduct user research, map user flows, build responsive component libraries in Figma, and design intuitive, accessible user interfaces.',
    educationRequirements: "Degree in Design, Interaction Design, Human-Computer Interaction, or proven portfolio",
    requiredSkills: ['Figma', 'Wireframing & Prototyping', 'Design Systems', 'User Research', 'Usability Testing'],
    preferredSkills: ['Micro-interactions', 'Design Tokens', 'HTML/CSS Basics', 'Accessibility (WCAG)'],
    keywords: ['Component Architecture', 'User Flows', 'Responsive Design', 'Visual Hierarchy']
  },
  {
    name: 'HR Executive',
    category: 'Human Resources',
    icon: '👥',
    title: 'HR Executive (Talent Acquisition & Operations)',
    department: 'Human Resources',
    location: 'Delhi NCR / Noida, India',
    employmentType: 'Full-time',
    experienceRequired: '2-5 years',
    minSalary: '5,00,000',
    maxSalary: '9,00,000',
    description: 'Manage full-lifecycle recruitment, candidate screening, interview coordination, onboarding workflows, and employee engagement operations.',
    educationRequirements: "MBA in HR / Post Graduate Diploma in Human Resource Management or Bachelor's Degree",
    requiredSkills: ['Talent Sourcing', 'Candidate Screening', 'Interview Scheduling', 'HRMS Portals', 'Onboarding & Induction'],
    preferredSkills: ['Offer Negotiation', 'Employee Relations', 'Payroll Coordination', 'LinkedIn Recruiter'],
    keywords: ['Talent Pipeline', 'HR Compliance', 'Recruitment Metrics', 'Employee Engagement']
  },
  {
    name: 'Accountant',
    category: 'Finance & Accounts',
    icon: '💰',
    title: 'Senior Accountant (GST, Tally & Auditing)',
    department: 'Finance & Accounts',
    location: 'Mumbai / Pune, India',
    employmentType: 'Full-time',
    experienceRequired: '3-6 years',
    minSalary: '6,00,000',
    maxSalary: '11,00,000',
    description: 'Maintain general ledger, prepare balance sheets and profit/loss statements, file monthly GST/TDS returns, and coordinate statutory audits.',
    educationRequirements: "B.Com / M.Com / Inter CA or equivalent accounting qualification",
    requiredSkills: ['Tally Prime / ERP', 'GST Returns Filing', 'TDS Compliance', 'Financial Statements', 'Bank Reconciliation'],
    preferredSkills: ['Advanced Excel', 'Tax Audit Support', 'SAP FICO', 'Cost Accounting'],
    keywords: ['General Ledger', 'Statutory Compliance', 'Balance Sheet', 'Direct & Indirect Tax']
  },
  {
    name: 'Marketing Exec',
    category: 'Marketing & Sales',
    icon: '📈',
    title: 'Digital Marketing Executive (Performance & SEO)',
    department: 'Marketing & Growth',
    location: 'Bengaluru / Hyderabad, India',
    employmentType: 'Full-time',
    experienceRequired: '2-4 years',
    minSalary: '6,00,000',
    maxSalary: '12,00,000',
    description: 'Execute paid ad campaigns across Google & Meta, optimize organic search rankings (SEO), run email marketing sequences, and track conversion funnels.',
    educationRequirements: "Bachelor's Degree in Marketing, Communications, Business, or related field",
    requiredSkills: ['Google Ads', 'Meta Ads Manager', 'SEO (On-page & Off-page)', 'Google Analytics 4', 'Content Strategy'],
    preferredSkills: ['HubSpot / Mailchimp', 'Copywriting', 'Conversion Rate Optimization', 'Canva'],
    keywords: ['ROAS Optimization', 'Lead Generation', 'Organic Traffic', 'Campaign Funnels']
  },
  {
    name: 'Civil Engineer',
    category: 'Construction & Civil',
    icon: '🏗️',
    title: 'Civil Site Engineer (Project Execution & Quality)',
    department: 'Civil Projects',
    location: 'Noida / Greater Noida, India',
    employmentType: 'Full-time',
    experienceRequired: '3-6 years',
    minSalary: '5,50,000',
    maxSalary: '10,00,000',
    description: 'Supervise on-site civil construction activities, verify structural drawings in AutoCAD, ensure material quality control, and track project milestones.',
    educationRequirements: "B.E. / B.Tech / Diploma in Civil Engineering",
    requiredSkills: ['Site Supervision', 'AutoCAD Civil', 'Quantity Surveying', 'Quality Control & QA/QC', 'Bar Bending Schedules (BBS)'],
    preferredSkills: ['MS Project', 'Contractor Management', 'Billing & Estimation', 'Safety Protocols (HSE)'],
    keywords: ['RCC Structures', 'Site Execution', 'Material Testing', 'Project Estimation']
  },
  {
    name: 'Customer Support',
    category: 'Operations',
    icon: '📞',
    title: 'Customer Support Executive (Voice & Email)',
    department: 'Customer Success',
    location: 'Noida / Delhi NCR, India',
    employmentType: 'Full-time',
    experienceRequired: '1-3 years',
    minSalary: '3,50,000',
    maxSalary: '6,50,000',
    description: 'Deliver prompt, empathetic customer assistance via phone, email, and chat, resolve ticket escalations, and maintain 95%+ CSAT satisfaction scores.',
    educationRequirements: "Graduate in any discipline with strong written & verbal communication in English and Hindi",
    requiredSkills: ['Customer Communication', 'Zendesk / Freshdesk', 'Conflict Resolution', 'Active Listening', 'Ticket Management'],
    preferredSkills: ['CRM Navigation', 'Email Writing', 'SLA Adherence', 'Product Troubleshooting'],
    keywords: ['CSAT Score', 'First Contact Resolution', 'Voice Support', 'Omnichannel Care']
  },
  {
    name: 'Teacher / Educator',
    category: 'Education',
    icon: '📚',
    title: 'Senior Mathematics / Science Teacher (High School)',
    department: 'Academics',
    location: 'Bengaluru / Pune, India',
    employmentType: 'Full-time',
    experienceRequired: '3-7 years',
    minSalary: '4,50,000',
    maxSalary: '8,50,000',
    description: 'Deliver engaging, curriculum-aligned lesson plans, assess student learning outcomes, prepare examination materials, and mentor students.',
    educationRequirements: "B.Ed with B.Sc / M.Sc in Mathematics, Physics, or related subject",
    requiredSkills: ['Curriculum Planning', 'Classroom Management', 'Student Assessment', 'Conceptual Teaching', 'Parent-Teacher Communication'],
    preferredSkills: ['Digital Learning Tools (Smart Class)', 'CBSE / ICSE Board Prep', 'Lab Instruction'],
    keywords: ['Pedagogy', 'Interactive Learning', 'Academic Guidance', 'Student Mentoring']
  }
];

const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Finance & Accounts',
  'Marketing & Growth',
  'Product & Design',
  'Data & Analytics',
  'Operations & Logistics',
  'Customer Success',
  'Civil & Construction',
  'Academics & Education',
  'Healthcare & Medical',
  'Legal & Compliance',
  'Sales & Business Dev'
];

const INDIAN_LOCATIONS = [
  'Bengaluru, Karnataka (Hybrid)',
  'Bengaluru, Karnataka (On-site)',
  'Noida / Delhi NCR (Hybrid)',
  'Gurugram / Delhi NCR (Hybrid)',
  'New Delhi, India',
  'Pune, Maharashtra (Hybrid)',
  'Mumbai, Maharashtra (Hybrid)',
  'Hyderabad, Telangana (Hybrid)',
  'Chennai, Tamil Nadu (Hybrid)',
  'Kolkata, West Bengal (Hybrid)',
  'Ahmedabad, Gujarat (Hybrid)',
  'Remote (Anywhere in India)'
];

export const JobCreationForm: React.FC = () => {
  const { createJob, setActiveTab, setSelectedJobId, generateJobRequirementsAI, addToast } = useApp();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [createdJobId, setCreatedJobId] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState<string>('');
  const [department, setDepartment] = useState<string>('Engineering');
  const [customDepartment, setCustomDepartment] = useState<string>('');
  const [location, setLocation] = useState<string>('Bengaluru, Karnataka (Hybrid)');
  const [employmentType, setEmploymentType] = useState<Job['employmentType']>('Full-time');
  const [experienceRequired, setExperienceRequired] = useState<string>('3-5 years');
  const [minSalary, setMinSalary] = useState<string>('12,00,000');
  const [maxSalary, setMaxSalary] = useState<string>('20,00,000');
  const [description, setDescription] = useState<string>('');
  const [educationRequirements, setEducationRequirements] = useState<string>("Bachelor's degree in relevant discipline or equivalent practical experience");
  const [status, setStatus] = useState<'active' | 'draft'>('active');

  // Skills interactive chips
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js', 'PostgreSQL']);
  const [preferredSkills, setPreferredSkills] = useState<string[]>(['Docker', 'AWS', 'Tailwind CSS']);
  const [newRequiredSkillInput, setNewRequiredSkillInput] = useState<string>('');
  const [newPreferredSkillInput, setNewPreferredSkillInput] = useState<string>('');

  const finalDepartment = department === 'Other' && customDepartment.trim() ? customDepartment.trim() : department;

  const handleApplyPreset = (preset: ProfessionPreset) => {
    setTitle(preset.title);
    setDepartment(DEPARTMENTS.includes(preset.department) ? preset.department : 'Engineering');
    setLocation(preset.location);
    setEmploymentType(preset.employmentType);
    setExperienceRequired(preset.experienceRequired);
    setMinSalary(preset.minSalary);
    setMaxSalary(preset.maxSalary);
    setDescription(preset.description);
    setEducationRequirements(preset.educationRequirements);
    setRequiredSkills(preset.requiredSkills);
    setPreferredSkills(preset.preferredSkills);

    addToast({
      type: 'info',
      title: `Applied "${preset.name}" Template`,
      description: 'You can customize all fields and requirements before saving.'
    });
  };

  const handleAddRequiredSkill = () => {
    const val = newRequiredSkillInput.trim();
    if (val && !requiredSkills.includes(val)) {
      setRequiredSkills(prev => [...prev, val]);
      setNewRequiredSkillInput('');
    }
  };

  const handleRemoveRequiredSkill = (skill: string) => {
    setRequiredSkills(prev => prev.filter(s => s !== skill));
  };

  const handleAddPreferredSkill = () => {
    const val = newPreferredSkillInput.trim();
    if (val && !preferredSkills.includes(val)) {
      setPreferredSkills(prev => [...prev, val]);
      setNewPreferredSkillInput('');
    }
  };

  const handleRemovePreferredSkill = (skill: string) => {
    setPreferredSkills(prev => prev.filter(s => s !== skill));
  };

  const handleGenerateAIRequirements = async () => {
    if (!title.trim()) {
      addToast({
        type: 'warning',
        title: 'Job Title Required',
        description: 'Please type a Job Title first (e.g. HR Executive, Senior Accountant, Civil Engineer, React Developer).'
      });
      return;
    }

    setIsGeneratingAI(true);
    addToast({
      type: 'info',
      title: 'AI Job Architect Working',
      description: `Drafting tailored requirements for "${title}"...`
    });

    try {
      const spec = await generateJobRequirementsAI(title.trim(), description.trim(), finalDepartment);
      if (spec) {
        if (Array.isArray(spec.requiredSkills) && spec.requiredSkills.length > 0) {
          setRequiredSkills(spec.requiredSkills);
        }
        if (Array.isArray(spec.preferredSkills) && spec.preferredSkills.length > 0) {
          setPreferredSkills(spec.preferredSkills);
        }
        if (spec.description) {
          setDescription(spec.description);
        }
        if (spec.educationRequirements) {
          setEducationRequirements(spec.educationRequirements);
        }
        if (spec.experienceRequired) {
          setExperienceRequired(spec.experienceRequired);
        }

        addToast({
          type: 'success',
          title: 'Requirements Generated with AI',
          description: 'Skills, education, and job description populated. You can edit any field before creating.'
        });
      } else {
        addToast({
          type: 'error',
          title: 'Could not generate automatically',
          description: 'Please enter the requirements manually or try again.'
        });
      }
    } catch (e) {
      console.error(e);
      addToast({
        type: 'error',
        title: 'AI Generation Failed',
        description: 'Please enter requirements manually.'
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      addToast({
        type: 'warning',
        title: 'Missing Job Title',
        description: 'Please enter a job title.'
      });
      setActiveStep(1);
      return;
    }

    if (requiredSkills.length === 0) {
      addToast({
        type: 'warning',
        title: 'Skills Required',
        description: 'Please specify at least one required skill for AI candidate matching.'
      });
      setActiveStep(2);
      return;
    }

    const formattedSalary = minSalary && maxSalary 
      ? `₹${minSalary} - ₹${maxSalary} per year`
      : 'Competitive Salary (INR)';

    const newJob: Partial<Job> = {
      title: title.trim(),
      department: finalDepartment,
      location: location.trim(),
      employmentType: employmentType,
      experienceRequired: experienceRequired.trim(),
      salaryRange: formattedSalary,
      description: description.trim() || `Job opening for ${title.trim()} at ${finalDepartment}.`,
      requiredSkills: requiredSkills,
      preferredSkills: preferredSkills,
      educationRequirements: educationRequirements.trim(),
      status: status,
      applicantsCount: 0,
      screenedCount: 0,
      shortlistedCount: 0,
      averageMatchScore: 0,
    };

    const newId = createJob(newJob);
    setCreatedJobId(newId);
  };

  // SUCCESS CONFIRMATION VIEW
  if (createdJobId) {
    return (
      <div className="max-w-2xl mx-auto my-8 bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            ✓ Job Requisition Created Successfully
          </span>
          <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {finalDepartment} • {location} • {experienceRequired}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-2.5 max-w-lg mx-auto">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Target Skills:</span>
            <span className="font-semibold text-slate-200 truncate max-w-[280px]">
              {requiredSkills.slice(0, 4).join(', ')}{requiredSkills.length > 4 ? ` +${requiredSkills.length - 4}` : ''}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Salary Budget (INR):</span>
            <span className="font-semibold text-emerald-400">₹{minSalary} - ₹{maxSalary}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Active Screening Context:</span>
            <span className="text-indigo-400 font-bold">Selected as Active Requisition</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              setSelectedJobId(createdJobId);
              setActiveTab('screening');
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <FileUp className="w-4 h-4" />
            <span>Upload Resumes for this Job</span>
          </button>

          <button
            onClick={() => {
              setSelectedJobId(createdJobId);
              setActiveTab('jobs');
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span>View Requisitions</span>
          </button>

          <button
            onClick={() => {
              setCreatedJobId(null);
              setTitle('');
              setDescription('');
              setActiveStep(1);
            }}
            className="w-full sm:w-auto px-4 py-3 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            + Create Another Job
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <button
            onClick={() => setActiveTab('jobs')}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Job Requisitions</span>
          </button>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <span>New Job Opening</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create a job opening for any industry or role (Engineering, HR, Accounts, Marketing, Civil, Healthcare, Support, etc.).
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveStep(1)}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              activeStep === 1
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Role Basics
          </button>
          <button
            onClick={() => setActiveStep(2)}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              activeStep === 2
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Requirements & Skills
          </button>
          <button
            onClick={() => setActiveStep(3)}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              activeStep === 3
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Compensation & Save
          </button>
        </div>
      </div>

      {/* Quick Multi-Industry Presets Carousel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Start with Profession Templates (Click to fill)</span>
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">100% Customizable</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {MULTI_INDUSTRY_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 text-xs font-semibold text-slate-300 hover:text-indigo-200 shrink-0 transition-all flex items-center gap-1.5"
            >
              <span>{preset.icon}</span>
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STEP 1: BASIC INFORMATION */}
        {activeStep === 1 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-400" />
                <span>Step 1: Role & Location Details</span>
              </h3>
              <span className="text-xs text-slate-400">Step 1 of 3</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job Title (Completely free-form) */}
              <div className="md:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    Job Title <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAIRequirements}
                    disabled={isGeneratingAI || !title.trim()}
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGeneratingAI ? (
                      <>
                        <RotateCw className="w-3 h-3 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        <span>Generate Requirements with AI</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. HR Executive, Senior Accountant, Civil Engineer, Data Analyst, React Developer..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                />
                <p className="text-[11px] text-slate-500">
                  Type any job title across engineering, finance, HR, healthcare, education, legal, marketing, or operations.
                </p>
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-200 outline-none"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                  <option value="Other">Other / Custom Department</option>
                </select>

                {department === 'Other' && (
                  <input
                    type="text"
                    value={customDepartment}
                    onChange={(e) => setCustomDepartment(e.target.value)}
                    placeholder="Enter custom department..."
                    className="w-full mt-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none"
                  />
                )}
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">Job Location (India)</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-200 outline-none"
                >
                  {INDIAN_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Employment Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">Employment Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Full-time', 'Part-time', 'Contract'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEmploymentType(type)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        employmentType === type
                          ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Required */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">Experience Required</label>
                <input
                  type="text"
                  value={experienceRequired}
                  onChange={(e) => setExperienceRequired(e.target.value)}
                  placeholder="e.g. 2-5 years, 3-6 years, Freshers eligible"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-200 placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  if (!title.trim()) {
                    addToast({
                      type: 'warning',
                      title: 'Job Title Required',
                      description: 'Please specify a job title before continuing.'
                    });
                    return;
                  }
                  setActiveStep(2);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <span>Continue to Requirements</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: JOB REQUIREMENTS & SKILLS */}
        {activeStep === 2 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Step 2: Skills, Education & Description</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateAIRequirements}
                  disabled={isGeneratingAI || !title.trim()}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingAI ? 'Generating...' : 'AI Auto-Fill'}</span>
                </button>
                <span className="text-xs text-slate-400">Step 2 of 3</span>
              </div>
            </div>

            {/* Required Skills Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  Required Skills <span className="text-rose-400">*</span> (40% Match Weight)
                </label>
                <span className="text-[11px] text-slate-400">{requiredSkills.length} skills configured</span>
              </div>

              {/* Skills Tags Container */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center gap-2 min-h-[52px]">
                {requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequiredSkill(skill)}
                      className="hover:text-rose-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}

                <div className="flex items-center gap-1 flex-1 min-w-[160px]">
                  <input
                    type="text"
                    value={newRequiredSkillInput}
                    onChange={(e) => setNewRequiredSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRequiredSkill();
                      }
                    }}
                    placeholder="Type skill & press Enter..."
                    className="bg-transparent text-xs text-slate-200 placeholder-slate-500 outline-none w-full px-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddRequiredSkill}
                    className="p-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Preferred Skills Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  Preferred / Bonus Skills (10% Match Weight)
                </label>
                <span className="text-[11px] text-slate-400">{preferredSkills.length} skills configured</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center gap-2 min-h-[52px]">
                {preferredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePreferredSkill(skill)}
                      className="hover:text-rose-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}

                <div className="flex items-center gap-1 flex-1 min-w-[160px]">
                  <input
                    type="text"
                    value={newPreferredSkillInput}
                    onChange={(e) => setNewPreferredSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPreferredSkill();
                      }
                    }}
                    placeholder="Type bonus skill & press Enter..."
                    className="bg-transparent text-xs text-slate-200 placeholder-slate-500 outline-none w-full px-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddPreferredSkill}
                    className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Education Requirements */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">Education Requirements</label>
              <input
                type="text"
                value={educationRequirements}
                onChange={(e) => setEducationRequirements(e.target.value)}
                placeholder="e.g. Bachelor's / Master's in relevant discipline, B.Com / CA Inter, B.Tech / MCA..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-200 placeholder-slate-500 outline-none"
              />
            </div>

            {/* Job Description & Responsibilities */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">
                Job Description & Key Responsibilities
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Summarize key responsibilities, deliverables, team structure, and daily impact for this role..."
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-200 placeholder-slate-500 outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Step 2 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (requiredSkills.length === 0) {
                    addToast({
                      type: 'warning',
                      title: 'Skills Required',
                      description: 'Please add at least one required skill before proceeding.'
                    });
                    return;
                  }
                  setActiveStep(3);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <span>Continue to Compensation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: COMPENSATION & FINAL SAVE */}
        {activeStep === 3 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-indigo-400" />
                <span>Step 3: Compensation & Final Review</span>
              </h3>
              <span className="text-xs text-slate-400">Step 3 of 3</span>
            </div>

            {/* Compensation Inputs in INR */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-200">
                Annual Salary Range in Indian Rupees (₹)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400">Minimum Salary (₹ / Year)</span>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">₹</span>
                    <input
                      type="text"
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                      placeholder="e.g. 8,00,000"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400">Maximum Salary (₹ / Year)</span>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">₹</span>
                    <input
                      type="text"
                      value={maxSalary}
                      onChange={(e) => setMaxSalary(e.target.value)}
                      placeholder="e.g. 16,00,000"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-200 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Salary Preview Badge */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Preview on Job Card:</span>
                <span className="font-bold text-emerald-400">
                  ₹{minSalary || '0'} – ₹{maxSalary || '0'} per year
                </span>
              </div>
            </div>

            {/* Requisition Status */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200">Requisition Initial Status</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('active')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    status === 'active'
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <p className="font-bold text-xs">Active Requisition</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Immediately ready to screen candidate resumes</p>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    status === 'draft'
                      ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <p className="font-bold text-xs">Save as Draft</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Review requirements internally before opening</p>
                </button>
              </div>
            </div>

            {/* Summary Review Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <p className="font-bold text-slate-200">Summary of New Requisition:</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div><strong className="text-slate-300">Title:</strong> {title}</div>
                <div><strong className="text-slate-300">Department:</strong> {finalDepartment}</div>
                <div><strong className="text-slate-300">Location:</strong> {location}</div>
                <div><strong className="text-slate-300">Experience:</strong> {experienceRequired}</div>
                <div className="col-span-2">
                  <strong className="text-slate-300">Required Skills:</strong> {requiredSkills.join(', ')}
                </div>
              </div>
            </div>

            {/* Step 3 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Create Job Opening</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
