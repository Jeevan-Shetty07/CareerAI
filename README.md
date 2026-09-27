# 🚀 CareerAI — AI-Powered Career Intelligence & Job Readiness Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?style=flat-square)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg?style=flat-square)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg?style=flat-square)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg?style=flat-square)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-orange.svg?style=flat-square)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg?style=flat-square)](https://tailwindcss.com/)

**CareerAI** is a production-quality, full-stack AI career acceleration platform engineered to help software engineers, developers, and tech professionals analyze their technical competencies, optimize ATS resume scoring, simulate dynamic technical & behavioral interviews, practice sandboxed coding problems, and bridge skill gaps with milestone-driven roadmaps.

---

## 🌟 Core Features

- 📄 **Multi-Format ATS Resume Parser & Scoring Engine**
  - Ingests `.pdf`, `.docx`, and plain text documents.
  - Extracts categorized skills (Languages, Frameworks, Databases, Cloud, DevOps, Tools), experience, education, and projects.
  - Generates a **0–100 ATS compatibility score** with section-by-section bullet recommendations with quantified metrics.

- 🎯 **Job Description Skill Match & Gap Analysis**
  - Compares candidate profiles against raw job postings.
  - Identifies **Exact Matches**, **Partial/Transferable Skills**, and **Critical Missing Skills**.
  - Generates actionable, prioritized plans to bridge technical gaps before applying.

- 🗺️ **Dynamic Multi-Phase Learning Roadmaps**
  - Generates tailored curriculums for target engineering roles (Full Stack, DevOps, AI Engineer, Cloud Architect).
  - Weekly timelines, core milestones, hands-on capstone projects, and curated learning references.

- 🎙️ **AI Mock Interview Simulator & Scorecard**
  - Interactive technical, behavioral (STAR method), and system design mock sessions.
  - Configurable seniority levels (Junior, Mid, Senior, Staff) and real-time critique.
  - Post-interview comprehensive evaluation reports (Communication, Technical Depth, Problem Solving).

- 💻 **Live Coding Sandbox & AI Code Reviewer**
  - In-browser code runner with isolated VM execution.
  - Runs solutions against test cases with millisecond execution timing and pass/fail validation.
  - Automated **Big-O Time and Space Complexity** estimation and code smell detection.

- 🐙 **GitHub Developer Portfolio Intelligence**
  - Analyzes public repositories, commit patterns, primary language distribution, and documentation quality.
  - Computes a Developer Profile Score with optimization strategies to impress technical recruiters.

- 📊 **Job Application Tracker (Kanban / Pipeline)**
  - Full CRUD tracking for opportunities across `Saved`, `Applied`, `Interviewing`, `Offer`, and `Rejected` statuses.

- 🤖 **Conversational AI Career Copilot**
  - Specialized AI advisor for compensation negotiation scripts, cover letter formulation, and architectural interview drills.

---

## 🏗️ System Architecture

```
                                  +---------------------------------------+
                                  |         CareerAI Client (React)       |
                                  |    (Vite, Tailwind, Monaco Editor)    |
                                  +-------------------+-------------------+
                                                      |
                                             RESTful API Requests
                                             (JWT Authentication)
                                                      |
                                                      v
                                  +-------------------+-------------------+
                                  |      Express.js / Node.js Server      |
                                  |            (TypeScript)               |
                                  +---------+-------------------+---------+
                                            |                   |
                     +----------------------+                   +---------------------+
                     |                                                                |
                     v                                                                v
        +------------+------------+                                      +------------+------------+
        |   AI & LLM Services     |                                      |   Persistence & Storage |
        | - Google Gemini API     |                                      | - PostgreSQL (JSONB)    |
        | - Prompt Orchestration  |                                      | - Resilient File Store  |
        | - Heuristic Fallbacks   |                                      | - Multi-Format Uploads  |
        +-------------------------+                                      +-------------------------+
                     |                                                                |
                     v                                                                v
        +------------+------------+                                      +------------+------------+
        |  Code Execution Sandbox |                                      | Document Parsers        |
        | - Isolated Node VM      |                                      | - pdf-parse             |
        | - Big-O Complexity Eval |                                      | - mammoth (.docx)       |
        +-------------------------+                                      +-------------------------+
```

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React 18 with TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS, PostCSS, Custom Glassmorphism UI
- **Icons & Visuals:** Lucide React, Canvas Confetti, Recharts
- **Code Editor:** Monaco Editor

### **Backend & APIs**
- **Runtime:** Node.js (v20+) & TypeScript
- **Framework:** Express.js
- **Security:** Helmet, CORS, JWT (`jsonwebtoken`), Bcrypt (`bcryptjs`)
- **File Ingestion:** Multer, `pdf-parse`, `mammoth`
- **Validation:** Zod schemas

### **AI & Data Layer**
- **LLM Engine:** Google Gemini API (`@google/generative-ai`)
- **Database:** PostgreSQL with JSONB indexing + zero-config resilient fallback
- **Execution Sandbox:** Sandboxed Node.js VM runtime

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Jeevan-Shetty07/CareerAI.git
cd CareerAI
```

### 2. Install Dependencies
```bash
# Install root, server, and client dependencies
npm install
npm install --prefix server
npm install --prefix client
```

### 3. Environment Configuration
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Optional: PostgreSQL Database (defaults to resilient local store if offline)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/careerai

# Security & JWT
JWT_SECRET=super-secure-careerai-secret-key-2026
JWT_EXPIRES_IN=7d

# Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Servers
```bash
# Start both server and client concurrently
npm run dev
```
- Client running at: `http://localhost:5173`
- Backend API running at: `http://localhost:5000`

### 5. Run Automated Test Suite
```bash
npm test
```

---

## 👤 Instant Demo Credentials
- **Email:** `demo@careerai.local`
- **Password:** `DemoPassword123!`

---

## 📜 License
This project is licensed under the MIT License.
