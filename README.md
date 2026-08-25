# TalentLens AI

## Smart Resume Screening & Candidate Ranking Platform

TalentLens AI is an AI-assisted recruitment platform designed to help recruiters screen resumes, match candidates with job requirements, and understand candidate strengths, skill gaps, and overall job alignment.

## 🚀 Live Demo

Coming soon — deployment in progress.

## 📂 GitHub Repository

https://github.com/shagun-raj/TalentLens-AI

## ✨ Features

- 📄 Resume Upload
- 🔍 Resume Information Extraction
- 🤖 AI-Based Resume Screening
- 🎯 Job-Specific Candidate Matching
- 📊 Explainable Match Scores
- 🧠 Skill Gap Analysis
- 👥 Candidate Comparison
- 🏆 Candidate Ranking
- 💼 AI Job Specification Generation
- 💬 Recruiter AI Copilot
- 📈 Recruitment Analytics
- 🕘 Screening History
- 🔎 Candidate Search and Filtering
- 🛡️ Responsible AI Notice

## 🧩 How It Works

Recruiter creates or selects a job and uploads a candidate resume.

Recruiter → Create / Select Job → Upload Resume → Resume Text Extraction → AI Analysis with Gemini → Skills, Experience & Education Analysis → Candidate–Job Match Score → Strengths, Skill Gaps & Explanation → Candidate Ranking & Comparison

## 🧠 AI Capabilities

### Resume Screening
TalentLens AI analyzes uploaded resumes against the selected job requirements and extracts relevant candidate information.

### Candidate Matching
Candidates are evaluated based on required skills, preferred skills, experience, projects, and education.

### Explainable Scoring
The platform provides a match score along with matched skills, missing skills, strengths, skill gaps, and candidate-job alignment.

### AI Job Specification
Recruiters can generate structured job specifications using Gemini based on the selected role and requirements.

### Recruiter AI Copilot
The AI Copilot helps recruiters analyze candidates, understand scores, identify skill gaps, compare profiles, and prepare interview questions.

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Motion

### Backend
- Node.js
- Express.js
- TypeScript

### AI
- Google Gemini API
- @google/genai

### Resume Processing
- PDF.js
- PDF Parse

## 🏗️ Architecture

TalentLens AI uses a React + Vite frontend with an Express.js backend.

Frontend: React + Vite → Express.js Backend → Gemini API Service → Google Gemini API

The Gemini API key is handled through environment variables and is not stored in the frontend or committed to GitHub.

## 🔌 AI API Endpoints

GET /api/gemini/status

POST /api/gemini/screen-resume

POST /api/gemini/generate-job-spec

POST /api/gemini/copilot-chat

## 💻 Run Locally

### 1. Clone the repository

git clone https://github.com/shagun-raj/TalentLens-AI.git

### 2. Open the project

cd TalentLens-AI

### 3. Install dependencies

npm install

### 4. Configure the Gemini API

Create a .env file in the project root:

GEMINI_API_KEY=YOUR_GEMINI_API_KEY

Never commit the .env file to GitHub.

### 5. Start the development server

npm run dev

Open http://localhost:3000

## 📦 Production Build

Create the production build:

npm run build

Start the production server:

npm start

The application will run at:

http://localhost:3000

## 📁 Project Structure

TalentLens-AI/
├── src/
│   ├── components/
│   │   ├── analytics/
│   │   ├── candidates/
│   │   ├── common/
│   │   ├── copilot/
│   │   ├── dashboard/
│   │   ├── history/
│   │   ├── jobs/
│   │   ├── layout/
│   │   ├── screening/
│   │   └── settings/
│   ├── context/
│   ├── data/
│   ├── server/
│   │   ├── geminiService.ts
│   │   └── pdfService.ts
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── server.ts
├── package.json
├── bun.lock
├── vite.config.ts
├── tsconfig.json
├── metadata.json
├── .gitignore
└── README.md

## 🔐 Security

Sensitive information must be stored using environment variables.

The following files should never be committed to GitHub:

.env
.env.local
.env.*.local

Never publish your Gemini API key in source code, GitHub repositories, README files, screenshots, or public documentation.

## 📊 Project Status

The current project includes React frontend, Express backend, Gemini AI integration, resume PDF processing, resume screening, candidate matching, candidate ranking, match score calculation, skill gap analysis, job specification generation, Recruiter AI Copilot, candidate comparison, and recruitment analytics.

The project is currently being prepared for production deployment.

## 🔮 Future Improvements

- Persistent database storage
- Recruiter authentication
- Multi-user organization support
- Advanced candidate filtering
- More detailed analytics
- Production monitoring
- Automated testing
- Improved AI evaluation and validation
- Cloud file storage
- Role-based access control

## 👩‍💻 Project

TalentLens AI — Smart Resume Screening & Candidate Ranking Platform

GitHub Repository:
https://github.com/shagun-raj/TalentLens-AI

Live Demo:
Coming soon — deployment in progress.
