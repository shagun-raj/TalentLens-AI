export interface SampleResume {
  id: string;
  name: string;
  targetRoleMatch: string;
  expectedScore: string;
  fileName: string;
  fileSize: string;
  text: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'sample-ananya',
    name: 'Ananya Sharma',
    targetRoleMatch: 'Senior Full-Stack Engineer (Strong Fit)',
    expectedScore: '94% Match',
    fileName: '01_Ananya_Sharma_Strong_Match.pdf',
    fileSize: '350 KB',
    text: `Ananya Sharma
Bengaluru, India | +91 98765 43210 | ananya.sharma@example.com | github.com/ananyasharma | linkedin.com/in/ananyasharma

PROFESSIONAL SUMMARY
Senior Full-Stack Software Engineer with 6.5+ years of experience designing and scaling production cloud applications, resilient microservices, and reactive user interfaces. Expertise in React 18, TypeScript, Node.js, PostgreSQL, Redis, Docker, and AWS architecture. Proven leader who has scaled platforms to 800,000 active monthly users.

CORE TECHNICAL SKILLS
• Languages & Frontend: TypeScript, JavaScript (ES6+), React.js, Next.js, Redux Toolkit, Tailwind CSS, HTML5, CSS3/Sass
• Backend & Cloud: Node.js, Express, PostgreSQL, Redis, Docker, AWS (ECS, S3, RDS, CloudFront), RESTful APIs, GraphQL
• Tooling & Practices: Git, GitHub Actions, Jest, React Testing Library, Microservices Architecture, CI/CD, Agile

PROFESSIONAL EXPERIENCE
Lead Full-Stack Engineer | RazorCloud Technologies, Bengaluru | 2022 – Present
• Architected enterprise workflow automation platform using React 18, TypeScript, Node.js, and PostgreSQL serving 800k monthly active users.
• Optimized complex SQL queries and introduced Redis multi-tier caching, reducing 95th percentile response latency from 320ms to 48ms.
• Designed automated containerized testing & deployment pipeline with Docker and AWS ECS, cutting deployment failure rates to under 0.2%.
• Mentored 8 software engineers, conducted system architecture design reviews, and established company-wide TypeScript quality standards.

Senior Software Engineer | FinTech Innovators, Bengaluru | 2019 – 2022
• Engineered real-time payments dashboard in React with state management using Redux Toolkit and WebSockets.
• Developed secure REST and GraphQL APIs in Node.js and Express with OAuth2 and RBAC authorization protocols.
• Led database migration from legacy monolithic store to partitioned PostgreSQL instances with zero data downtime.

EDUCATION & CERTIFICATIONS
• Bachelor of Technology in Computer Science & Engineering | National Institute of Technology (NIT) Karnataka (2019) – GPA 8.9/10
• AWS Certified Solutions Architect – Associate (2023)`
  },
  {
    id: 'sample-rohan',
    name: 'Rohan Mehta',
    targetRoleMatch: 'Full-Stack Developer (Good Fit)',
    expectedScore: '82% Match',
    fileName: '02_Rohan_Mehta_Good_Match.pdf',
    fileSize: '310 KB',
    text: `Rohan Mehta
Mumbai, India | +91 98123 45678 | rohan.mehta@example.com | linkedin.com/in/rohanmehta

PROFESSIONAL SUMMARY
Full-Stack Software Engineer with 4 years of hands-on experience building web applications, RESTful APIs, and database solutions using React, TypeScript, Node.js, Express, and PostgreSQL. Experienced with Docker containers and cloud deployments on AWS.

TECHNICAL PROFICIENCIES
• Languages: TypeScript, JavaScript, Python, SQL
• Frontend: React, Redux, Tailwind CSS, Vite, HTML5, CSS3
• Backend: Node.js, Express, REST APIs, PostgreSQL, MongoDB, Docker
• Cloud & Tools: AWS EC2/S3, Git, Jest, Postman, Linux

WORK EXPERIENCE
Full-Stack Engineer | Nexus Digital Solutions, Mumbai | 2021 – Present
• Developed customer-facing web applications using React, TypeScript, and Tailwind CSS.
• Built and maintained REST APIs using Node.js and Express connected to PostgreSQL database.
• Implemented Docker containerization for development and staging environments.
• Collaborated with product designers to implement responsive and accessible UI components.

Junior Software Developer | WebCraft Labs, Pune | 2020 – 2021
• Built reusable UI components in React and integrated third-party RESTful services.
• Wrote unit and integration tests using Jest, achieving 80% test coverage.
• Assisted in database schema design and writing SQL queries for PostgreSQL.

EDUCATION
• Bachelor of Engineering in Information Technology | Mumbai University (2020) – GPA 8.4/10`
  },
  {
    id: 'sample-1',
    name: 'Devon Vance',
    targetRoleMatch: 'Senior Full-Stack Engineer (Strong Fit)',
    expectedScore: '92% Match',
    fileName: 'Devon_Vance_Staff_FullStack.pdf',
    fileSize: '340 KB',
    text: `Devon Vance
San Francisco, CA | (415) 555-7382 | devon.vance@example.com | github.com/devonvance

PROFESSIONAL SUMMARY
Senior Full-Stack Software Engineer with 6+ years of production experience architecting mission-critical web platforms, high-throughput microservices, and modern React/TypeScript frontends. Proven track record scaling applications to 500k+ MAU, leading agile pods, and establishing zero-downtime CI/CD workflows with Docker, PostgreSQL, and AWS.

CORE TECHNICAL SKILLS
• Languages: TypeScript, JavaScript (ES6+), Python, SQL, HTML5, CSS3
• Frontend: React 18, Next.js, Redux Toolkit, Tailwind CSS, Vite, WebSockets
• Backend & Cloud: Node.js, Express, PostgreSQL, Redis, Docker, AWS (ECS, S3, RDS, CloudWatch), RESTful APIs, GraphQL
• Tooling & Testing: Git, GitHub Actions, Jest, Cypress, Datadog

PROFESSIONAL EXPERIENCE
Staff Software Engineer | Apex Nimbus Labs, San Francisco, CA | 2022 – Present
• Architected and shipped multi-tenant cloud analytics suite using React 18, TypeScript, and Node.js microservices serving 450,000 active enterprise users.
• Reduced PostgreSQL p95 query latency by 44% through indexing optimization, query partitioning, and Redis caching.
• Designed automated CI/CD deployment pipelines on AWS ECS with Docker, cutting release turnaround times from 4 hours to 12 minutes.
• Mentored 6 junior/mid-level software engineers through structured code reviews, architectural RFCs, and pair-programming sessions.

Senior Full-Stack Engineer | HyperScale Digital, San Jose, CA | 2019 – 2022
• Developed modular component library in React/Tailwind CSS adopted across 4 distributed product engineering teams.
• Implemented resilient RESTful APIs in Node.js/Express with robust JWT authentication and role-based access control.
• Managed PostgreSQL schema migrations and integrated background task processing via Redis queues.

EDUCATION & CERTIFICATIONS
• Bachelor of Science in Computer Science | University of California, Berkeley (2019) – GPA 3.85
• AWS Certified Solutions Architect – Associate (2023)`
  },
  {
    id: 'sample-2',
    name: 'Amina Nour',
    targetRoleMatch: 'Senior Full-Stack / Cloud (Good Fit with Redis gap)',
    expectedScore: '84% Match',
    fileName: 'Amina_Nour_FullStack_Engineer.pdf',
    fileSize: '310 KB',
    text: `Amina Nour
Austin, TX | (512) 555-9014 | amina.nour@example.com | linkedin.com/in/aminanour

PROFESSIONAL SUMMARY
Product-minded Full-Stack Software Engineer with 4.5 years of experience delivering responsive web applications, distributed APIs, and database solutions. Passionate about TypeScript, React state management, containerization with Docker, and automated end-to-end testing.

CORE SKILLS
• Programming: TypeScript, JavaScript, Python, SQL
• Web Frameworks: React, Vue.js, Node.js, Fastify, Express, Tailwind CSS
• Data & Infrastructure: PostgreSQL, MySQL, MongoDB, Docker, GCP (Cloud Run, Cloud SQL)
• Practices: Agile/Scrum, Test-Driven Development, CI/CD

EXPERIENCE
Senior Frontend & Full-Stack Engineer | QuantIQ Software, Austin, TX | 2021 – Present
• Built high-performance dashboard interfaces in React 18, TypeScript, and Tailwind CSS for financial compliance analysts.
• Authored Node.js backend services interfacing with PostgreSQL database cluster with 99.98% uptime.
• Decreased frontend initial bundle size by 35% using dynamic code splitting and tree shaking.
• Collaborated closely with Product Managers and UI/UX designers to rapidly iterate on customer feedback cycles.

Full Stack Developer | Horizon Logic, Dallas, TX | 2019 – 2021
• Created interactive web applications using React, Node.js, and MongoDB.
• Implemented automated integration tests using Jest and Supertest, achieving 88% branch coverage.

EDUCATION
• B.S. in Software Engineering | University of Texas at Austin (2019) – GPA 3.78`
  },
  {
    id: 'sample-3',
    name: 'Carlos Mendez',
    targetRoleMatch: 'DevOps & Backend Specialist (Moderate Fit for Pure Full-Stack)',
    expectedScore: '68% Match',
    fileName: 'Carlos_Mendez_DevOps_Backend.pdf',
    fileSize: '290 KB',
    text: `Carlos Mendez
Seattle, WA | (206) 555-4819 | carlos.mendez@example.com

SUMMARY
DevOps & Backend Engineer with 5 years experience specializing in cloud infrastructure, Kubernetes, Go, Python, and PostgreSQL databases. Limited experience in client-side React UI development, seeking roles with strong backend or infrastructure emphasis.

SKILLS
• Infrastructure: Docker, Kubernetes, Terraform, AWS (EKS, EC2, IAM), CI/CD
• Backend: Go, Python, Node.js basics, PostgreSQL, Redis, Kafka
• Frontend: Basic HTML, minimal JavaScript

WORK HISTORY
DevOps Engineer | CloudPioneer Systems | 2021 – Present
• Orchestrated Kubernetes clusters across multi-region AWS environments.
• Built infrastructure-as-code templates using Terraform.

Backend Engineer | DataSphere Corp | 2019 – 2021
• Built data ingestion pipelines in Go and Python connected to PostgreSQL and Kafka.

EDUCATION
• B.S. in Information Technology | University of Washington (2019)`
  }
];
