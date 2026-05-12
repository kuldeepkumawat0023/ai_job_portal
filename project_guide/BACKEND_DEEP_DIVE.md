# 🚀 AI Job Portal - Backend Deep Dive & Architecture Plan

This document provides a comprehensive, end-to-end technical breakdown of the AI Job Portal backend. It explains how the system is structured, how the APIs interact, and the logic behind core AI and payment features.

---

## 🏗️ 1. Architecture Overview
The backend is built using a **Modular MVC-like architecture** with Node.js, Express, and MongoDB.

### Core Folders:
- **Models (`/models`):** Defines the "Schema" (structure) of data like Users, Jobs, and AI results.
- **Controllers (`/controllers`):** Contains the "Brain" of the app. This is where OpenAI, Stripe, and Cloudinary logic lives.
- **Routes (`/routes`):** Defines the API endpoints (`/api/v1/...`) that the frontend calls.
- **Middleware (`/middleware`):** Handles security (JWT Auth), File Uploads (Multer), and Usage Limits.

---

## 🔑 2. Core Modules & API Workflow

### A. Authentication & User Management (`authRoutes.js`)
- **Flow:** User Signup -> Email OTP Verification -> JWT Token Generation.
- **Roles:** The system supports 3 roles: `candidate`, `recruiter`, and `admin`.
- **API Use:** Used for secure login and maintaining user sessions.

### B. AI Resume Intelligence (`resumeRoutes.js` & `aiRoutes.js`)
- **Resume Upload:** Uses `cloudinary` to store PDF files and `pdf-parse` to read the content.
- **AI Analysis (GPT-4o):**
    - **Scoring:** AI grades the resume (0-100).
    - **Matching:** Compares resume text with Job Description to find the "Match %".
    - **Coaching:** Generates personalized tips for the candidate.
- **API Use:** Powers the "AI Resume Builder" and "Smart Matching" UI.

### C. Recruitment & ATS Pipeline (`jobRoutes.js` & `applicationRoutes.js`)
- **Job Posting:** Recruiters can post jobs and use AI to auto-generate JDs.
- **Kanban Board:** Applications are tracked through stages: `Pending` -> `Shortlisted` -> `Interviewing` -> `Hired`.
- **API Use:** Allows recruiters to manage thousands of candidates efficiently.

### D. AI Mock Interview (`mockInterviewRoutes.js`)
- **Simulation:** Generates 5 job-specific questions (Technical & Behavioral).
- **Grading:** Evaluates user answers in real-time.
- **Metrics:** Provides a **Technical Score** and **Confidence Score** at the end.
- **API Use:** Helps candidates practice before real interviews.

---

## 💰 3. Monetization & Usage Limits
- **Stripe Integration:** Handles the **$97 Lifetime Premium Plan**.
- **Webhooks:** Listens for successful payments to automatically activate premium features.
- **Usage Enforcement:**
    - **Free Tier:** 3 Resume Analyses / 5 Job Searches per month.
    - **Premium Tier:** Unlimited access.
- **Logic:** A custom middleware `checkUsageLimit` checks the user's counters in MongoDB before allowing AI/Search requests.

---

## 🛠️ 4. End-to-End User Journeys

### 👨‍💻 Candidate Journey:
1. **Join:** Signup -> Verify OTP.
2. **AI Boost:** Upload Resume -> Get AI Score & Coaching Tips.
3. **Apply:** Search Jobs -> Check Match % -> Apply.
4. **Prepare:** Start AI Mock Interview -> Get Grading.
5. **Career:** Track Applications on Dashboard -> Get Hired.

### 💼 Recruiter Journey:
1. **Setup:** Register Company Profile.
2. **Post:** Generate AI JD -> Post Job.
3. **Manage:** View Applicant Match Scores -> Move candidates through Kanban stages.
4. **Interview:** Schedule interviews -> Hire best talent.

---

## 🛡️ 5. Security & Technology Stack
- **AI Brain:** OpenAI API (GPT-4o Model).
- **Payments:** Stripe API.
- **Files:** Cloudinary (CDN).
- **Security:** 
    - JWT (JSON Web Tokens) for Auth.
    - RBAC (Role Based Access Control) to restrict Admin/Recruiter routes.
    - Rate Limiting to prevent API abuse.

---

## 📅 6. Current Implementation Status
| Feature | Status | Details |
| :--- | :--- | :--- |
| **Auth System** | ✅ Ready | JWT + OTP + Roles |
| **AI Resume Analysis** | ✅ Ready | GPT-4o Scoring & Coaching |
| **Job & Application** | ✅ Ready | Full CRUD + Kanban |
| **Payment System** | ✅ Ready | $97 Plan + Webhooks |
| **AI Mock Interview** | ✅ Ready | Real-time Grading |
| **Usage Limits** | ✅ Ready | Free/Premium enforcement |

---

**Next Phase:** Integrating these APIs with the **Next.js Frontend** (Phase 3).
