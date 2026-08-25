import { Candidate, Job, ScreeningActivity } from '../types';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Full-Stack Developer (React & Node.js)',
    department: 'Engineering',
    location: 'Bengaluru, India (Hybrid)',
    employmentType: 'Full-time',
    experienceRequired: '3-6 years',
    salaryRange: '₹18,00,000 - ₹28,00,000',
    description: 'We are seeking an experienced Full-Stack Developer to build scalable web applications using React, TypeScript, Node.js, and PostgreSQL. You will design RESTful APIs, optimize frontend rendering, and collaborate with product teams.',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'Git', 'System Design'],
    preferredSkills: ['Docker', 'AWS', 'GraphQL', 'Redis', 'Tailwind CSS'],
    educationRequirements: "B.Tech / B.E. / M.C.A in Computer Science or equivalent practical experience",
    importantKeywords: ['Microservices', 'State Management', 'Relational DB', 'Jest', 'API Security'],
    status: 'active',
    applicantsCount: 14,
    screenedCount: 12,
    shortlistedCount: 4,
    averageMatchScore: 84,
    createdAt: '2026-08-10',
  },
  {
    id: 'job-2',
    title: 'Frontend Developer (React & TypeScript)',
    department: 'Engineering',
    location: 'Noida / Delhi NCR (Hybrid)',
    employmentType: 'Full-time',
    experienceRequired: '2-5 years',
    salaryRange: '₹12,00,000 - ₹18,00,000',
    description: 'Looking for a Frontend Developer proficient in React, TypeScript, Next.js, and Tailwind CSS to create responsive, accessible, high-performance web applications.',
    requiredSkills: ['React', 'TypeScript', 'Next.js', 'JavaScript', 'HTML5/CSS3', 'Tailwind CSS', 'Redux/Zustand'],
    preferredSkills: ['Storybook', 'Jest/Cypress', 'GraphQL', 'Web Vitals Optimization'],
    educationRequirements: "Bachelor's degree in Computer Science, IT, or equivalent practical portfolio",
    importantKeywords: ['Component Architecture', 'Client State', 'Accessibility', 'Responsive Design'],
    status: 'active',
    applicantsCount: 18,
    screenedCount: 15,
    shortlistedCount: 5,
    averageMatchScore: 82,
    createdAt: '2026-08-11',
  },
  {
    id: 'job-3',
    title: 'Backend Developer (Node.js & Microservices)',
    department: 'Engineering',
    location: 'Hyderabad, India (Hybrid)',
    employmentType: 'Full-time',
    experienceRequired: '3-5 years',
    salaryRange: '₹15,00,000 - ₹24,00,000',
    description: 'Seeking a Backend Developer to design high-throughput microservices, distributed transactional databases, and event-driven architectures with Node.js, Express, PostgreSQL, and Kafka.',
    requiredSkills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Microservices', 'REST APIs', 'Docker', 'Redis'],
    preferredSkills: ['Kafka', 'AWS', 'Kubernetes', 'gRPC', 'MongoDB'],
    educationRequirements: "B.Tech / B.E. / M.C.A in Computer Science or related engineering discipline",
    importantKeywords: ['Distributed Systems', 'Message Queues', 'Caching', 'Database Indexing'],
    status: 'active',
    applicantsCount: 12,
    screenedCount: 10,
    shortlistedCount: 3,
    averageMatchScore: 80,
    createdAt: '2026-08-12',
  },
  {
    id: 'job-4',
    title: 'Java Developer (Spring Boot & Cloud)',
    department: 'Enterprise Engineering',
    location: 'Pune, India (Hybrid)',
    employmentType: 'Full-time',
    experienceRequired: '3-6 years',
    salaryRange: '₹14,00,000 - ₹24,00,000',
    description: 'Enterprise Java Developer needed to architect core transaction processing microservices using Java 17/21, Spring Boot 3, Hibernate, and AWS Cloud services.',
    requiredSkills: ['Java', 'Spring Boot', 'Hibernate / JPA', 'Microservices', 'MySQL / Oracle', 'REST APIs', 'Maven / Gradle'],
    preferredSkills: ['Kafka', 'Docker', 'AWS', 'JUnit', 'Redis'],
    educationRequirements: "B.E./B.Tech in Computer Science, IT or Master's in Computer Applications",
    importantKeywords: ['Enterprise Java', 'Spring Security', 'Multithreading', 'Design Patterns'],
    status: 'active',
    applicantsCount: 9,
    screenedCount: 8,
    shortlistedCount: 3,
    averageMatchScore: 85,
    createdAt: '2026-08-13',
  },
  {
    id: 'job-5',
    title: 'Python Developer (FastAPI & AI Integration)',
    department: 'AI & Data',
    location: 'Bengaluru, India (Hybrid)',
    employmentType: 'Full-time',
    experienceRequired: '3-5 years',
    salaryRange: '₹16,00,000 - ₹25,00,000',
    description: 'Build backend pipelines, asynchronous API services, and LLM integrations using Python 3.11, FastAPI, Celery, PostgreSQL, and vector databases.',
    requiredSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AsyncIO', 'RESTful APIs', 'PyTest'],
    preferredSkills: ['LangChain', 'Vector DBs (Chroma/Pinecone)', 'Redis', 'AWS', 'Celery'],
    educationRequirements: "B.S./B.Tech in Computer Science, Data Science, or related field",
    importantKeywords: ['Async Programming', 'FastAPI', 'ORM', 'AI Tooling'],
    status: 'active',
    applicantsCount: 16,
    screenedCount: 14,
    shortlistedCount: 4,
    averageMatchScore: 86,
    createdAt: '2026-08-14',
  },
  {
    id: 'job-6',
    title: 'Data Analyst (SQL & Business Intelligence)',
    department: 'Data & Analytics',
    location: 'Gurugram / Noida (Hybrid)',
    employmentType: 'Full-time',
    experienceRequired: '2-4 years',
    salaryRange: '₹10,00,000 - ₹16,00,000',
    description: 'Extract business insights from data warehouses, build executive dashboards in Power BI / Tableau, write complex SQL aggregations, and present KPI metrics.',
    requiredSkills: ['SQL', 'Power BI / Tableau', 'Python / R', 'Data Modeling', 'Excel / Sheets', 'Statistical Analysis'],
    preferredSkills: ['Snowflake', 'BigQuery', 'dbt', 'Data Pipelines'],
    educationRequirements: "Degree in Statistics, Mathematics, Computer Science, Economics or quantitative field",
    importantKeywords: ['Cohort Analysis', 'ETL', 'Dashboarding', 'KPI Tracking'],
    status: 'active',
    applicantsCount: 20,
    screenedCount: 18,
    shortlistedCount: 6,
    averageMatchScore: 83,
    createdAt: '2026-08-15',
  },
  {
    id: 'job-7',
    title: 'Data Scientist (Machine Learning & NLP)',
    department: 'AI & Data',
    location: 'Bengaluru, India (Hybrid)',
    employmentType: 'Full-time',
    experienceRequired: '4-7 years',
    salaryRange: '₹22,00,000 - ₹34,00,000',
    description: 'Design and deploy production ML models, LLM fine-tuning pipelines, and predictive analytics systems utilizing PyTorch, Scikit-learn, Pandas, and MLflow.',
    requiredSkills: ['Python', 'PyTorch / TensorFlow', 'Scikit-learn', 'Pandas & NumPy', 'Machine Learning', 'NLP / Transformers', 'SQL'],
    preferredSkills: ['MLOps', 'Docker', 'FastAPI', 'Hugging Face', 'AWS SageMaker'],
    educationRequirements: "Master's or B.Tech in Computer Science, AI, Data Science, or Applied Mathematics",
    importantKeywords: ['Feature Engineering', 'Model Evaluation', 'Transformers', 'Deep Learning'],
    status: 'active',
    applicantsCount: 11,
    screenedCount: 10,
    shortlistedCount: 3,
    averageMatchScore: 88,
    createdAt: '2026-08-16',
  },
  {
    id: 'job-8',
    title: 'DevOps Engineer (Kubernetes & Cloud)',
    department: 'DevOps & Platform',
    location: 'Remote, India',
    employmentType: 'Full-time',
    experienceRequired: '4-6 years',
    salaryRange: '₹18,00,000 - ₹28,00,000',
    description: 'Automate CI/CD pipelines, orchestrate Kubernetes clusters, write Infrastructure as Code with Terraform, and manage AWS/GCP cloud infrastructure.',
    requiredSkills: ['Kubernetes', 'Docker', 'Terraform', 'AWS / GCP', 'CI/CD (GitHub Actions/GitLab)', 'Linux', 'Monitoring (Prometheus/Grafana)'],
    preferredSkills: ['Helm', 'ArgoCD', 'Ansible', 'Security Governance', 'Cost Optimization'],
    educationRequirements: "B.E./B.Tech in Computer Science, IT, or equivalent cloud certifications",
    importantKeywords: ['IaC', 'Containerization', 'GitOps', 'Zero Trust'],
    status: 'active',
    applicantsCount: 10,
    screenedCount: 9,
    shortlistedCount: 3,
    averageMatchScore: 81,
    createdAt: '2026-08-17',
  },
  {
    id: 'job-9',
    title: 'UI/UX Designer (Figma & Design Systems)',
    department: 'Product & Design',
    location: 'Bengaluru, India (Hybrid)',
    employmentType: 'Full-time',
    experienceRequired: '3-5 years',
    salaryRange: '₹14,00,000 - ₹20,00,000',
    description: 'Lead user research, create intuitive wireframes and interactive prototypes in Figma, and maintain design system components across web and mobile.',
    requiredSkills: ['Figma', 'Design Systems', 'User Research', 'Wireframing & Prototyping', 'Usability Testing', 'Information Architecture'],
    preferredSkills: ['HTML/CSS basics', 'Design Tokens', 'Storybook', 'Micro-interactions'],
    educationRequirements: "Degree in Interaction Design, HCI, Graphic Design, or proven portfolio of shipped products",
    importantKeywords: ['Component Libraries', 'User Flows', 'Accessibility (WCAG)', 'Design Tokens'],
    status: 'active',
    applicantsCount: 15,
    screenedCount: 13,
    shortlistedCount: 4,
    averageMatchScore: 85,
    createdAt: '2026-08-18',
  },
  {
    id: 'job-10',
    title: 'QA Engineer (Automation & API Testing)',
    department: 'Quality Engineering',
    location: 'Pune / Mumbai, India (Hybrid)',
    employmentType: 'Full-time',
    experienceRequired: '3-5 years',
    salaryRange: '₹12,00,000 - ₹18,00,000',
    description: 'Design automated regression suites, perform API load testing with Postman/JMeter, and write end-to-end test scenarios using Cypress / Playwright and Selenium.',
    requiredSkills: ['Selenium / Cypress / Playwright', 'Java / JavaScript', 'API Testing (Postman/RestAssured)', 'Test Automation', 'SQL', 'CI/CD Integration'],
    preferredSkills: ['JMeter', 'Docker', 'Performance Testing', 'Appium'],
    educationRequirements: "B.Tech / B.E. in Computer Science, IT, or MCA",
    importantKeywords: ['Test Automation', 'Regression Testing', 'Postman', 'E2E Testing'],
    status: 'active',
    applicantsCount: 8,
    screenedCount: 7,
    shortlistedCount: 2,
    averageMatchScore: 83,
    createdAt: '2026-08-18',
  },
  {
    id: 'job-11',
    title: 'Mobile App Developer (Flutter & React Native)',
    department: 'Mobile Engineering',
    location: 'Bengaluru / Hyderabad (Hybrid)',
    employmentType: 'Full-time',
    experienceRequired: '3-5 years',
    salaryRange: '₹16,00,000 - ₹24,00,000',
    description: 'Develop high-performance cross-platform iOS and Android mobile applications using Flutter or React Native with clean architecture and offline-first state management.',
    requiredSkills: ['Flutter / React Native', 'Dart / TypeScript', 'REST APIs & WebSockets', 'State Management (Bloc/Redux)', 'Mobile App Performance', 'App Store / Play Store Deployment'],
    preferredSkills: ['Native Android (Kotlin) / iOS (Swift)', 'Firebase', 'GraphQL', 'Push Notifications'],
    educationRequirements: "B.Tech / B.E. in Computer Science or related discipline",
    importantKeywords: ['Cross-Platform', 'State Management', 'Offline Sync', 'App Publishing'],
    status: 'active',
    applicantsCount: 10,
    screenedCount: 9,
    shortlistedCount: 3,
    averageMatchScore: 84,
    createdAt: '2026-08-19',
  },
  {
    id: 'job-12',
    title: 'Software Engineer (Core Platform & Microservices)',
    department: 'Engineering',
    location: 'Noida / Gurugram (Hybrid)',
    employmentType: 'Full-time',
    experienceRequired: '2-4 years',
    salaryRange: '₹14,00,000 - ₹20,00,000',
    description: 'Build backend microservices, transactional databases, and scalable distributed business logic using Java/Node.js, PostgreSQL, and cloud infrastructure.',
    requiredSkills: ['Java / Node.js', 'PostgreSQL / MySQL', 'RESTful APIs', 'Data Structures & Algorithms', 'Git', 'Unit Testing'],
    preferredSkills: ['Docker', 'AWS', 'Redis', 'Kafka'],
    educationRequirements: "B.Tech / B.E. in Computer Science or IT",
    importantKeywords: ['Object Oriented Programming', 'Clean Code', 'API Design', 'Relational DB'],
    status: 'active',
    applicantsCount: 16,
    screenedCount: 14,
    shortlistedCount: 4,
    averageMatchScore: 82,
    createdAt: '2026-08-19',
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    jobId: 'job-1',
    isDemo: true,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91-98765-43210',
    location: 'Bengaluru, India',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    overallMatchScore: 94,
    matchBreakdown: {
      skillsMatch: 96,
      experienceMatch: 92,
      educationMatch: 95,
      projectRelevance: 94,
      requirementRelevance: 93,
    },
    recommendation: 'strong_match',
    recruiterStatus: 'shortlisted',
    recruiterNotes: [
      {
        id: 'note-1',
        author: 'Priya Nair (Lead Recruiter)',
        text: 'Exceptional deep dive on TypeScript & PostgreSQL performance tuning. Strong team leadership profile at previous fintech startup.',
        date: '2026-08-15 14:30',
      }
    ],
    yearsOfExperience: 5.5,
    currentRole: 'Senior Full-Stack Engineer at RazorFin Tech',
    education: [
      {
        degree: 'B.Tech in Computer Science and Engineering',
        university: 'National Institute of Technology (NIT) Trichy',
        graduationYear: 2021,
        gpa: '8.8 / 10.0',
        fieldOfStudy: 'Distributed Systems & Web Technologies',
      }
    ],
    technicalSkills: [
      'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs',
      'System Design', 'Git', 'Docker', 'Redis', 'Tailwind CSS', 'AWS', 'Jest'
    ],
    softSkills: ['Sprint Leadership', 'Cross-functional Collaboration', 'Technical Mentorship', 'Clear Documentation'],
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'Git', 'System Design', 'Docker', 'Redis', 'AWS'],
    missingSkills: ['GraphQL'],
    skillGaps: ['Limited production exposure to public GraphQL federation schemas'],
    strengths: [
      'Extensive 5+ years experience building production React/Node full-stack platforms',
      'Proven expertise optimizing complex PostgreSQL queries reducing p99 latency by 42%',
      'Active contributor to open-source TypeScript tooling with solid architecture practices'
    ],
    potentialConcerns: [
      'Primary cloud experience is AWS; easily transfers to GCP/Azure if required.'
    ],
    relevantExperience: [
      'Led rewrite of payments gateway dashboard in React 18 & TypeScript with zero downtime',
      'Designed PostgreSQL event store handling 8,000 requests/sec with Redis caching layer'
    ],
    workExperience: [
      {
        id: 'exp-1',
        company: 'RazorFin Tech',
        role: 'Senior Full-Stack Engineer',
        duration: 'Jun 2023 – Present (3 yrs 2 mos)',
        location: 'Bengaluru, India',
        highlights: [
          'Architected high-throughput ledger microservices in Node.js & TypeScript supporting ₹12 Cr daily transaction volume.',
          'Built modular component design library in React and Tailwind CSS adopted by 25+ developers across 4 squads.',
          'Spearheaded automated integration testing with Jest & Playwright, raising code coverage from 62% to 91%.'
        ]
      },
      {
        id: 'exp-2',
        company: 'CloudPulse Analytics',
        role: 'Full-Stack Software Engineer',
        duration: 'Aug 2021 – May 2023 (1 yr 10 mos)',
        location: 'Hyderabad, India',
        highlights: [
          'Engineered real-time telemetry dashboards in React and WebSockets with sub-50ms render latency.',
          'Developed PostgreSQL data ingest pipelines and RESTful API endpoints in Express / Node.js.'
        ]
      }
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'OmniFlow Task Engine',
        description: 'Open-source distributed background job processor built with TypeScript, Node.js, Redis, and React admin UI.',
        techStack: ['TypeScript', 'Node.js', 'Redis', 'React', 'Docker'],
        link: 'https://github.com/rahul/omniflow'
      },
      {
        id: 'proj-2',
        name: 'SchemaLens PostgreSQL Profiler',
        description: 'CLI and web utility that visualizes table locks and missing indexes in production relational databases.',
        techStack: ['Node.js', 'PostgreSQL', 'React', 'Tailwind CSS']
      }
    ],
    certifications: [
      'AWS Certified Solutions Architect – Associate (2024)',
      'Meta Certified Front-End Developer Specialization'
    ],
    aiSummary: 'Rahul is an outstanding candidate with 5.5 years of verifiable hands-on experience directly matching every core requirement (React, TypeScript, Node.js, PostgreSQL, System Design). He displays solid architecture depth in high-load transactional environments and strong testing rigor. Recommended for technical interview.',
    resumeFileName: 'Rahul_Sharma_FullStack_Resume.pdf',
    resumeFileSize: '342 KB',
    uploadedAt: '2026-08-15 11:20'
  },
  {
    id: 'cand-2',
    jobId: 'job-1',
    isDemo: true,
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    phone: '+91-98123-45678',
    location: 'Noida, India',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    overallMatchScore: 88,
    matchBreakdown: {
      skillsMatch: 90,
      experienceMatch: 86,
      educationMatch: 92,
      projectRelevance: 89,
      requirementRelevance: 85,
    },
    recommendation: 'strong_match',
    recruiterStatus: 'screened',
    recruiterNotes: [],
    yearsOfExperience: 4.2,
    currentRole: 'Full Stack Engineer at Veloce Health India',
    education: [
      {
        degree: 'B.Tech in Computer Science',
        university: 'Delhi Technological University (DTU)',
        graduationYear: 2022,
        gpa: '8.4 / 10.0'
      }
    ],
    technicalSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'Git', 'Docker', 'GraphQL', 'Tailwind CSS', 'Next.js'],
    softSkills: ['Product Sense', 'Communication', 'User-Centric Design', 'Agile/Scrum'],
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'Git', 'Docker', 'Tailwind CSS', 'GraphQL'],
    missingSkills: ['System Design (Formal Tier 1)', 'Redis'],
    skillGaps: ['Experience with multi-region distributed caching layers is lighter than senior tier'],
    strengths: [
      'Strong React and TypeScript frontend depth with clean component hierarchy',
      'Solid experience with Node.js & PostgreSQL APIs in healthcare domain',
      'Self-driven builder with live deployed customer-facing SaaS features'
    ],
    potentialConcerns: [
      '4.2 years of total experience is at the baseline of the 3-6 year requirement, though quality of work is high.'
    ],
    relevantExperience: [
      'Built patient onboarding workflows in React & TypeScript improving conversion by 28%',
      'Designed REST and GraphQL endpoints backed by PostgreSQL on AWS'
    ],
    workExperience: [
      {
        id: 'exp-3',
        company: 'Veloce Health India',
        role: 'Full Stack Software Engineer',
        duration: 'Jul 2022 – Present (4 yrs 1 mo)',
        location: 'Noida, India',
        highlights: [
          'Implemented patient telemetry and clinical review portals with React, TypeScript, and Node.js.',
          'Migrated legacy Express services to containerized Docker microservices on AWS.',
          'Optimized patient record database queries on PostgreSQL.'
        ]
      }
    ],
    projects: [
      {
        id: 'proj-3',
        name: 'MediSync Appointments',
        description: 'Full-stack calendar and booking application for private medical practices.',
        techStack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS']
      }
    ],
    certifications: ['Docker Certified Associate'],
    aiSummary: 'Priya has 4.2 years of strong full-stack product development experience across React, TypeScript, Node.js, and PostgreSQL. She exhibits high code cleanliness, GraphQL proficiency, and practical Docker deployment skills.',
    resumeFileName: 'Priya_Singh_FullStack_2026.pdf',
    resumeFileSize: '280 KB',
    uploadedAt: '2026-08-15 11:25'
  },
  {
    id: 'cand-3',
    jobId: 'job-1',
    isDemo: true,
    name: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    phone: '+91-97654-32109',
    location: 'Pune, India',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    overallMatchScore: 81,
    matchBreakdown: {
      skillsMatch: 84,
      experienceMatch: 82,
      educationMatch: 80,
      projectRelevance: 78,
      requirementRelevance: 82,
    },
    recommendation: 'good_match',
    recruiterStatus: 'in_review',
    recruiterNotes: [],
    yearsOfExperience: 4.8,
    currentRole: 'Backend Engineer at Apex Data Systems',
    education: [
      {
        degree: 'B.E. in Information Technology',
        university: 'Pune University (COEP)',
        graduationYear: 2021,
      }
    ],
    technicalSkills: ['Node.js', 'PostgreSQL', 'REST APIs', 'Git', 'System Design', 'Docker', 'AWS', 'Redis', 'Python', 'React (Intermediate)'],
    softSkills: ['Problem Solving', 'Autonomous Delivery', 'Root Cause Analysis'],
    matchedSkills: ['Node.js', 'PostgreSQL', 'REST APIs', 'Git', 'System Design', 'Docker', 'AWS', 'Redis'],
    missingSkills: ['TypeScript (Advanced)', 'React (Senior level)'],
    skillGaps: ['Candidate has stronger backend and data pipeline emphasis than React frontend UI polish'],
    strengths: [
      'Deep expertise in Node.js asynchronous architecture and database optimization',
      'Solid AWS and container infrastructure skills'
    ],
    potentialConcerns: [
      'React experience is moderate; may need short ramp-up time for complex interactive UI architecture compared to backend work.'
    ],
    relevantExperience: [
      'Built distributed API gateways in Node.js handling 15k RPM',
      'Designed PostgreSQL partition tables for high-volume analytics'
    ],
    workExperience: [
      {
        id: 'exp-4',
        company: 'Apex Data Systems',
        role: 'Backend / Platform Engineer',
        duration: 'Sep 2021 – Present (4 yrs 11 mos)',
        location: 'Pune, India',
        highlights: [
          'Engineered core RESTful API microservices in Node.js and PostgreSQL with Redis caching.',
          'Built internal admin dashboards utilizing React and Tailwind CSS.'
        ]
      }
    ],
    projects: [
      {
        id: 'proj-4',
        name: 'FastRoute API Gateway',
        description: 'Lightweight rate-limiting gateway in Node.js and Redis.',
        techStack: ['Node.js', 'Redis', 'Docker']
      }
    ],
    certifications: ['AWS Developer Associate'],
    aiSummary: 'Rohan brings strong 4.8 years backend engineering expertise with Node.js, PostgreSQL, Redis, and AWS. His React experience is functional for internal tools. Recommended for backend-heavy full-stack roles.',
    resumeFileName: 'Rohan_Mehta_Resume_Eng.pdf',
    resumeFileSize: '410 KB',
    uploadedAt: '2026-08-16 09:12'
  },
  {
    id: 'cand-4',
    jobId: 'job-1',
    isDemo: true,
    name: 'Aman Verma',
    email: 'aman.verma@example.com',
    phone: '+91-98234-56789',
    location: 'Gurugram, India',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    overallMatchScore: 76,
    matchBreakdown: {
      skillsMatch: 78,
      experienceMatch: 68,
      educationMatch: 85,
      projectRelevance: 80,
      requirementRelevance: 72,
    },
    recommendation: 'needs_review',
    recruiterStatus: 'in_review',
    recruiterNotes: [
      {
        id: 'note-2',
        author: 'Amit Saxena',
        text: 'Solid projects in React and Express, but total commercial experience is 2.5 years (below 3-6 target). Review project repository quality before advancing.',
        date: '2026-08-16 16:10',
      }
    ],
    yearsOfExperience: 2.5,
    currentRole: 'Associate Software Engineer at ByteCraft India',
    education: [
      {
        degree: 'B.Tech in Computer Science',
        university: 'Indraprastha University (IPU), Delhi',
        graduationYear: 2024,
        gpa: '8.6 / 10.0'
      }
    ],
    technicalSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Git', 'Tailwind CSS', 'Express', 'MongoDB'],
    softSkills: ['Fast Learner', 'Enthusiastic', 'Agile Mindset'],
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Git'],
    missingSkills: ['System Design (Senior)', 'Docker in Production', 'AWS', 'Redis'],
    skillGaps: ['Years of experience (2.5 yrs) is below job requirement (3-6 yrs)', 'No documented experience leading large-scale architectural refactors'],
    strengths: [
      'Excellent academic foundations and top-tier grade',
      'Modern tech stack familiarity (React, TypeScript, Tailwind CSS)',
      'High velocity contributor on product features'
    ],
    potentialConcerns: [
      'Experience gap for a senior role; would excel as a Mid-level Full Stack hire.'
    ],
    relevantExperience: [
      'Developed customer account management workflows with React and TypeScript',
      'Wrote CRUD endpoints in Node.js and PostgreSQL'
    ],
    workExperience: [
      {
        id: 'exp-5',
        company: 'ByteCraft India',
        role: 'Associate Software Engineer',
        duration: 'Jun 2024 – Present (2 yrs 2 mos)',
        location: 'Gurugram, India',
        highlights: [
          'Built responsive frontend components using React, TypeScript and Tailwind CSS.',
          'Maintained Node.js REST services and resolved database query bottlenecks in PostgreSQL.'
        ]
      }
    ],
    projects: [
      {
        id: 'proj-5',
        name: 'DevBoard Kanban',
        description: 'Interactive real-time collaboration board with React and Node.js.',
        techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL']
      }
    ],
    certifications: [],
    aiSummary: 'Aman is a talented junior-to-mid engineer with 2.5 years experience and strong fundamental skills in React, TypeScript, and Node. Recommended for recruiter manual review for Mid-Level role.',
    resumeFileName: 'Aman_Verma_Resume_2026.pdf',
    resumeFileSize: '195 KB',
    uploadedAt: '2026-08-16 10:45'
  },
  {
    id: 'cand-5',
    jobId: 'job-1',
    isDemo: true,
    name: 'Kavita Iyer',
    email: 'kavita.iyer@example.com',
    phone: '+91-97123-45678',
    location: 'Bengaluru, India',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    overallMatchScore: 91,
    matchBreakdown: {
      skillsMatch: 94,
      experienceMatch: 90,
      educationMatch: 88,
      projectRelevance: 92,
      requirementRelevance: 91,
    },
    recommendation: 'strong_match',
    recruiterStatus: 'shortlisted',
    recruiterNotes: [],
    yearsOfExperience: 6.0,
    currentRole: 'Lead Full-Stack Engineer at FinScale India',
    education: [
      {
        degree: 'M.Tech in Software Engineering',
        university: 'BITS Pilani',
        graduationYear: 2020,
      }
    ],
    technicalSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'System Design', 'Git', 'CI/CD', 'AWS', 'Docker', 'GraphQL'],
    softSkills: ['Technical Leadership', 'Mentoring', 'Architecture Reviews'],
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'System Design', 'Git', 'Docker', 'AWS'],
    missingSkills: ['Redis'],
    skillGaps: ['Minimal direct Redis caching configuration'],
    strengths: [
      '6 years hands-on experience matching both frontend and backend requirements',
      'Strong track record leading UI architecture and CI/CD automation',
      'Master’s degree from BITS Pilani'
    ],
    potentialConcerns: ['None significant; strong culture and technical fit.'],
    relevantExperience: [
      'Led 6-person full-stack engineering team delivering micro-frontend React platform',
      'Engineered Node.js backend services with PostgreSQL handling 20k concurrent sessions'
    ],
    workExperience: [
      {
        id: 'exp-6',
        company: 'FinScale India',
        role: 'Lead Full-Stack Engineer',
        duration: 'Jan 2022 – Present (4 yrs 7 mos)',
        location: 'Bengaluru, India',
        highlights: [
          'Led architecture of core customer portal with React, TypeScript, and Node.js.',
          'Reduced bundle size by 45% and improved Core Web Vitals to 98/100.',
          'Authored high-volume REST APIs on Node.js / PostgreSQL.'
        ]
      }
    ],
    projects: [
      {
        id: 'proj-6',
        name: 'MicroState UI',
        description: 'Lightweight reactive state library for TypeScript & React applications.',
        techStack: ['TypeScript', 'React', 'Vite']
      }
    ],
    certifications: ['AWS Certified Developer – Associate'],
    aiSummary: 'Kavita possesses 6 years of stellar full-stack leadership with deep proficiency in React, TypeScript, Node.js, and PostgreSQL. She exceeds experience thresholds with proven enterprise scale achievements. Strong shortlist recommendation.',
    resumeFileName: 'Kavita_Iyer_CV_SeniorFS.pdf',
    resumeFileSize: '312 KB',
    uploadedAt: '2026-08-16 11:30'
  },
  {
    id: 'cand-6',
    jobId: 'job-1',
    isDemo: true,
    name: 'Vikram Malhotra',
    email: 'vikram.malhotra@example.com',
    phone: '+91-99887-76655',
    location: 'Mumbai, India',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    overallMatchScore: 64,
    matchBreakdown: {
      skillsMatch: 60,
      experienceMatch: 70,
      educationMatch: 75,
      projectRelevance: 58,
      requirementRelevance: 62,
    },
    recommendation: 'low_match',
    recruiterStatus: 'screened',
    recruiterNotes: [],
    yearsOfExperience: 4.0,
    currentRole: 'PHP / Laravel Web Developer at WebCraft India',
    education: [
      {
        degree: 'B.E. in Information Technology',
        university: 'Mumbai University',
        graduationYear: 2022,
      }
    ],
    technicalSkills: ['PHP', 'Laravel', 'MySQL', 'JavaScript (Vanilla)', 'Vue.js', 'HTML/CSS', 'Git', 'WordPress'],
    softSkills: ['Client Communication', 'Task Estimation', 'Responsive UI'],
    matchedSkills: ['Git', 'REST APIs (via PHP)'],
    missingSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'System Design (Distributed)', 'Docker', 'AWS'],
    skillGaps: [
      'Lacks core required skills: React, TypeScript, Node.js',
      'Experience is centered on PHP/Laravel monoliths rather than modern TypeScript/Node distributed systems'
    ],
    strengths: [
      'Solid relational database knowledge with MySQL',
      'Reliable web delivery experience'
    ],
    potentialConcerns: [
      'Significant skill mismatch for modern React + Node stack; requires extensive retraining.'
    ],
    relevantExperience: ['Built REST APIs in PHP/Laravel and MySQL databases'],
    workExperience: [
      {
        id: 'exp-7',
        company: 'WebCraft India',
        role: 'Web Developer',
        duration: 'May 2022 – Present (4 yrs 3 mos)',
        location: 'Mumbai, India',
        highlights: ['Developed custom web applications using PHP, Laravel, and MySQL.', 'Created responsive frontend views with Vue.js and Tailwind CSS.']
      }
    ],
    projects: [
      {
        id: 'proj-7',
        name: 'StoreFront Laravel',
        description: 'E-commerce web application with payment checkout and admin CMS.',
        techStack: ['PHP', 'Laravel', 'MySQL']
      }
    ],
    certifications: [],
    aiSummary: 'Vikram has 4 years of web development background, but his core toolset is PHP/Laravel and MySQL rather than the required React, TypeScript, and Node.js stack. Recommended for rejection or reassignment to PHP-based openings.',
    resumeFileName: 'Vikram_Malhotra_WebDev_Resume.pdf',
    resumeFileSize: '240 KB',
    uploadedAt: '2026-08-16 14:02'
  }
];

export const INITIAL_ACTIVITIES: ScreeningActivity[] = [
  {
    id: 'act-1',
    candidateId: 'cand-1',
    candidateName: 'Rahul Sharma',
    jobId: 'job-1',
    jobTitle: 'Full-Stack Developer (React & Node.js)',
    score: 94,
    recommendation: 'strong_match',
    action: 'Shortlisted by Priya Nair',
    timestamp: '10 mins ago',
  },
  {
    id: 'act-2',
    candidateId: 'cand-5',
    candidateName: 'Kavita Iyer',
    jobId: 'job-1',
    jobTitle: 'Full-Stack Developer (React & Node.js)',
    score: 91,
    recommendation: 'strong_match',
    action: 'Shortlisted by Priya Nair',
    timestamp: '45 mins ago',
  },
  {
    id: 'act-3',
    candidateId: 'cand-2',
    candidateName: 'Priya Singh',
    jobId: 'job-1',
    jobTitle: 'Full-Stack Developer (React & Node.js)',
    score: 88,
    recommendation: 'strong_match',
    action: 'AI Screening Complete – High Match',
    timestamp: '2 hours ago',
  },
  {
    id: 'act-4',
    candidateId: 'cand-3',
    candidateName: 'Rohan Mehta',
    jobId: 'job-1',
    jobTitle: 'Full-Stack Developer (React & Node.js)',
    score: 81,
    recommendation: 'good_match',
    action: 'Moved to Recruiter Review',
    timestamp: '3 hours ago',
  },
  {
    id: 'act-5',
    candidateId: 'cand-4',
    candidateName: 'Aman Verma',
    jobId: 'job-1',
    jobTitle: 'Full-Stack Developer (React & Node.js)',
    score: 76,
    recommendation: 'needs_review',
    action: 'Flagged for Experience Gap Review',
    timestamp: '5 hours ago',
  }
];

export const SKILLS_ANALYTICS = [
  { skill: 'React', requiredCount: 14, candidateCount: 12, matchPercentage: 86 },
  { skill: 'TypeScript', requiredCount: 14, candidateCount: 11, matchPercentage: 79 },
  { skill: 'Node.js', requiredCount: 14, candidateCount: 10, matchPercentage: 71 },
  { skill: 'PostgreSQL', requiredCount: 14, candidateCount: 9, matchPercentage: 64 },
  { skill: 'System Design', requiredCount: 14, candidateCount: 8, matchPercentage: 57 },
  { skill: 'Docker / Containers', requiredCount: 10, candidateCount: 9, matchPercentage: 90 },
  { skill: 'AWS / Cloud', requiredCount: 10, candidateCount: 7, matchPercentage: 70 },
  { skill: 'GraphQL', requiredCount: 6, candidateCount: 4, matchPercentage: 66 },
];

export const MATCH_DISTRIBUTION = [
  { range: '90 - 100%', count: 4, label: 'Exceptional Fit' },
  { range: '80 - 89%', count: 6, label: 'Strong Fit' },
  { range: '70 - 79%', count: 3, label: 'Moderate Fit' },
  { range: 'Below 70%', count: 2, label: 'Low Fit' },
];
