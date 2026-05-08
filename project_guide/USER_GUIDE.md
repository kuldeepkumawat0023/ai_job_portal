# 👤 User Guide — AI-Based Multi-Category Smart Job Portal
### *What You Get as a User (Candidate, Recruiter & Admin)*

> **Project:** AI-Based Multi-Category Smart Job Portal
> **Powered By:** Next.js (TypeScript) + TailwindCSS 4 + OpenAI GPT-4o
> **Document Type:** User Facilities & Features Guide

---

## 📌 Table of Contents

1. [Who is This For?](#1-who-is-this-for)
2. [How to Get Started](#2-how-to-get-started)
3. [Facility 1 — Secure Account System](#3-facility-1--secure-account-system)
4. [Facility 2 — Profile Management](#4-facility-2--profile-management)
5. [Facility 3 — Resume Upload](#5-facility-3--resume-upload)
6. [Facility 4 — AI Resume Analysis (OpenAI Powered)](#6-facility-4--ai-resume-analysis-openai-powered)
7. [Facility 5 — Smart AI Job Matching](#7-facility-5--smart-ai-job-matching)
8. [Facility 6 — Job Search & Filters](#8-facility-6--job-search--filters)
9. [Facility 7 — One-Click Job Application](#9-facility-7--one-click-job-application)
10. [Facility 8 — Application Tracking System](#10-facility-8--application-tracking-system)
11. [Facility 9 — Personalized Job Recommendations](#11-facility-9--personalized-job-recommendations)
12. [Facility 10 — Personal Dashboard](#12-facility-10--personal-dashboard)
13. [Facility 11 — Multi-Category Job Support](#13-facility-11--multi-category-job-support)
14. [Facility 12 — Mobile Responsive UI](#14-facility-12--mobile-responsive-ui)
15. [Facility 13 — Security & Data Privacy](#15-facility-13--security--data-privacy)
16. [Complete User Journey (Flow)](#16-complete-user-journey-flow)
17. [Pricing & Plans](#17-pricing--plans)
18. [Summary Table](#18-summary-table)
19. [Recruiter Guide — Hire 10x Faster](#19-recruiter-guide--hire-10x-faster)

---

## 1. 🙋 Who is This For?

This guide is for:
*   **Job Seekers (Candidates):** To find, match, and apply for the best jobs.
*   **Recruiters (Hiring Managers):** To post jobs, rank talent using AI, and hire faster.
*   **Admins & Super Admins:** To manage the platform, track revenue, and monitor growth via a unified Management Portal.

| User Type         | Description                                                  |
|-------------------|--------------------------------------------------------------|
| 🧑‍💼 Unified User   | **(Candidate & Recruiter combined)** Every user can apply for jobs AND can switch to "Hiring Mode" to post jobs. |
| 👑 Admin / Super  | Platform managers overseeing users, jobs, and revenue        |

---

## 2. 🚀 How to Get Started — The 5-Minute Setup

Traditional job hunting takes **30+ hours of headache** every week. Our AI-powered platform automates 95% of that work, getting you from "Search" to "Interview" faster.

### The Value Proposition:
| Traditional Way         | The AI-Powered Way (Our Platform)         |
|-------------------------|-------------------------------------------|
| 30+ Hours of Manual Work| **5 Minutes Setup**                       |
| Manual Resume Tuning    | **Automated AI Optimization**             |
| Endless Manual Searching| **0 Hours Weekly Job Matching**           |
| Uncertain Progress      | **95% Time Saved & Clear Roadmap**        |

### Getting Started Steps:
```
Step 1 → Register / Sign Up (Email or Google)
Step 2 → **Complete Guided Onboarding (AI Welcome Tour)**
Step 3 → Complete Your Profile & Upload Resume (PDF)
Step 4 → Let AI Do the Work — Get Matched Jobs Instantly
Step 5 → Track Progress on your Actionable Dashboard
```

---

## 3. 🔐 Facility 1 — Secure Account System

Every user gets a **fully secure personal account**. You can access these via the main navigation header:
*   **Sign In:** For existing users to access their dashboard.
*   **Sign Up Free:** For new users to create their lifetime free account.

### What You Can Do:

| Feature              | Description                                              |
|----------------------|----------------------------------------------------------|
| **Sign In**          | Access your dashboard using your existing account         |
| **Sign Up Free**     | Create your lifetime free account in seconds             |
| **Login Options**    | Log in with **Email** or **"Continue with Google"**      |
| **Login Security**   | JWT-based authentication for maximum safety              |
| **Logout**           | Securely log out from any device                         |

### How It Works:
```
User Registers → Password encrypted with bcrypt → Account saved in DB
User Logs In   → JWT Token generated → Sent with every API request
```

### The Login Experience:
Our login page features a **modern split-screen design**:
*   **Left Side:** A clean, focused form for Email login or One-click Google access.
*   **Right Side:** A rotating selection of professional and leadership quotes to inspire you as you start your job search journey.

### ✅ Benefit:
> Your account is **100% secure**, and your login experience is designed to be as fast and inspiring as possible. No one else can access your data without your credentials.

---

## 4. 👤 Facility 2 — Comprehensive Profile & Usage Management

Build your digital identity and track your platform activity in real-time. This is your **personal command center**.

### Key Profile Features:

| Feature              | Description                                              |
|----------------------|----------------------------------------------------------|
| **Usage Counters**   | Track **Resume Retries** and **Job Searches** used this month|
| **Profile Photo**    | Upload and update your photo via the **"Change Photo"** button|
| **Personal Info**    | Update your Full Name and Email directly from the profile |
| **Resume Hub**       | Upload, update, or delete your latest resume instantly   |

### Tracking Your Limits:
The platform includes built-in usage monitoring to help you manage your monthly AI resources:
*   **Resume Retries:** Shows how many times you've re-analyzed your profile.
*   **Job Searches:** Shows how many deep AI-powered searches you've performed.

### ✅ Benefit:
> Stay in full control of your **AI resources and digital identity**. The more complete your profile, the **more accurate your AI job matching** will be.

---

## 5. 📄 Facility 3 — Resume Upload

You can upload your resume once and the system will use it automatically for all job applications.

### Resume Upload Features:

| Feature              | Description                                              |
|----------------------|----------------------------------------------------------|
| **Supported Formats**| PDF and DOC formats supported                            |
| **Cloud Storage**    | Resume stored securely on Cloudinary (cloud)             |
| **Update Anytime**   | Replace your old resume with a new one whenever needed   |
| **Auto-Attach**      | Resume is automatically attached when you apply for a job|
| **Secure Access**    | Only you and the recruiter you apply to can access it    |

### How It Works:
```
You Upload Resume (PDF)
    → Multer middleware receives the file
    → File stored on Cloudinary cloud storage
    → Cloudinary URL saved to your profile in MongoDB
    → Resume ready to use for all applications
```

### ✅ Benefit:
> Upload your resume **once** — it is automatically used every time you apply. No need to re-attach it.

---

## 6. 🧠 Facility 4 — AI Resume Analysis (OpenAI Powered)

This is the **most powerful and unique feature** of this platform.

After you upload your resume, the system uses **OpenAI GPT-4o** to automatically read and understand it.

### What the AI Does:

| AI Action                | Description                                              |
|--------------------------|----------------------------------------------------------|
| **Resume Reading**       | AI reads the full text of your resume                    |
| **Skill Extraction**     | Identifies all your technical skills automatically       |
| **Experience Detection** | Understands your years of experience                     |
| **Category Detection**   | Assigns you a category: Frontend / Backend / Data Science / QA |
| **Professional Summary** | Generates a short professional summary from your resume  |

### AI Processing Flow:
```
Resume PDF
    ↓
pdf-parse (extracts raw text)
    ↓
Text sent to OpenAI GPT-4o API
    ↓
AI analyzes skills, experience, context
    ↓
Returns structured JSON data
    ↓
Saved to your profile
```

### Real Example:

**Your Resume Contains:**
> *"Built web apps using React.js, Redux Toolkit, and REST APIs. Worked on 3 production projects over 2 years."*

**AI Output:**
```json
{
  "skills": ["React.js", "Redux Toolkit", "REST API", "JavaScript"],
  "experience": 2,
  "category": "Frontend Developer",
  "summary": "Experienced Frontend Developer with 2 years building production-grade React applications."
}
```

### ✅ Benefit:
> You do **not need to manually fill in your skills**. The AI reads your resume and understands your profile automatically — just like a senior HR professional would.

---

## 7. 📊 Facility 5 — Smart AI Job Matching

Every job on the platform comes with a **personalized AI Match Score** calculated specifically for you.

### How It Works:
```
Your Resume Data (from AI Analysis)
    +
Job Description
    ↓
OpenAI GPT-4o compares both
    ↓
Returns Match Score (0–100%) + Reason
    ↓
Displayed alongside every job listing
```

### Example Match Scores:

| Job Title                 | Your Match Score | Status         |
|---------------------------|------------------|----------------|
| React Frontend Developer  | 92%              | ✅ Excellent Match |
| Node.js Backend Developer | 74%              | ✅ Good Match      |
| Data Scientist            | 45%              | ⚠️ Partial Match  |
| Java Developer            | 22%              | ❌ Low Match       |

### AI Match Explanation (what OpenAI returns):
> *"Candidate has strong React.js and Redux skills which match the job requirements well. Missing TypeScript experience slightly reduces the score."*

### ✅ Benefit:
> You instantly know **how well you fit a job** before applying. Focus your effort on the best-matched opportunities and never waste time on unsuitable roles.

---

## 8. 🔍 Facility 6 — AI-Powered Job Search & Filters

Find exactly the right role using our high-precision filtering system.

### Advanced Search Filters:

| Filter           | Options                                                  |
|------------------|----------------------------------------------------------|
| **Job Title**    | Search by specific role (e.g., QA, React Developer)      |
| **Location**     | Filter by city, country, or remote status                |
| **Contract Type**| Full Time, Part Time, Freelance, Contract                |
| **Experience**   | Entry Level, Intermediate, Senior, Lead                  |
| **Work Type**    | Onsite, Remote, Hybrid                                   |
| **Published**    | Past 24 hours, Past week, Past month                     |

### Special Features:
*   **Result Slider:** Select exactly how many top matches (1-100) you want to see.
*   **Search Limit:** Each user gets a set number of AI-powered searches per day (e.g., 5 searches/day) to keep the system fast and focused.

### ✅ Benefit:
> Save hours of manual searching. Use deep filters and AI-matching to find jobs that **perfectly align** with your tech stack, location, and lifestyle.

---

## 9. 📬 Facility 7 — One-Click Job Application

Applying for a job is made as simple and fast as possible.

### Application Features:

| Feature                   | Description                                          |
|---------------------------|------------------------------------------------------|
| **One-Click Apply**       | Apply to any job with a single button click          |
| **Resume Auto-Attached**  | Your uploaded resume is automatically included       |
| **Profile Auto-Filled**   | Your profile data is sent along with the application |
| **Multiple Applications** | Apply to as many jobs as you want simultaneously     |
| **Confirmation**          | You receive instant confirmation after applying      |

### Application Flow:
```
Click "Apply Now"
    → Application document created in database
    → Your resume URL attached automatically
    → Status set to "Applied"
    → Recruiter is notified via Real-time Alerts
```

### ✅ Benefit:
> The entire application process takes **less than 5 seconds**. No forms to fill, no resume to re-upload.

---

### 📈 Facility 8 — Real-Time Kanban Application Tracking

Unlike traditional portals, our system uses a professional **Kanban-style pipeline** to show you exactly where you stand.

| Status           | Icon | Meaning                                                    |
|------------------|------|------------------------------------------------------------|
| **Applied**      | 📥   | Successfully submitted, awaiting AI review.                |
| **Shortlisted**  | ⭐   | **AI Instant Action:** Your profile matched the criteria!   |
| **Interviewing** | 🗣️   | Recruiter has moved you to the interview stage.            |
| **Hired**        | 🤝   | Congratulations! You have been selected for the role.      |
| **Rejected**     | ❌   | Your profile did not match this specific job requirement.  |

**✅ Benefit:**
> Complete transparency. No more "black hole" applications. Track your journey from **Applied** to **Hired** in real-time.

---

## 11. 🎯 Facility 9 — Personalized Job Recommendations

The platform does not wait for you to search — it **automatically recommends the best jobs** for you based on your profile.

### How Recommendations Work:

| Step | Action                                                     |
|------|------------------------------------------------------------|
| 1    | AI analyzes your skills and experience from your profile   |
| 2    | AI identifies your job category (e.g., Frontend Developer) |
| 3    | Best-matching jobs are shortlisted for you                 |
| 4    | Displayed on your Home page and Dashboard                  |

### Example:
> You are a React Developer with 2 years of experience.
> The system automatically shows you: React Developer jobs, Frontend Engineer roles, UI Developer openings — all ranked by match score.

### ✅ Benefit:
> You don't need to search manually. **Relevant, high-match jobs come to you automatically** every time you log in.

---

## 12. 📊 Facility 10 — Actionable Personal Dashboard & Analytics

Your dashboard is your **Career Control Center**. It doesn't just show data — it guides you with a gamified checklist and real-time progress tracking.

### A. The Actionable Career Checklist
The system provides a step-by-step roadmap to getting hired. Each card includes the estimated time (ETA) and difficulty level.

| Task Card              | Difficulty   | ETA          | Action                                           |
|------------------------|--------------|--------------|--------------------------------------------------|
| **Upload Resume**      | 🟢 Beginner  | 2-3 min      | Start with your latest resume to unlock insights |
| **Get AI Suggestions** | 🟢 Beginner  | 2-5 min      | Review actionable tips to improve impact         |
| **Rewrite Resume**     | 🟡 Intermed. | 10-20 min    | Apply AI improvements and strengthen your story |
| **Improve Match Score**| 🟡 Intermed. | 10-15 min    | Aim for 70%+ score to pass ATS screens          |
| **Prepare for Interview**| 🔴 Advanced  | 15-25 min    | Practice with targeted mock questions           |
| **Enhance Portfolio**  | 🟡 Intermed. | 10-20 min    | Polish LinkedIn and GitHub project highlights   |

### B. Analytics & Readiness Widgets
Track your professional growth with real-time AI-powered widgets:
*   **Role Readiness (0-100%):** A visual bar showing how prepared you are for your target category.
*   **Average AI Score:** The average quality score across all your analyzed resumes.
*   **Monthly Analysis Tracker:** Keep track of your usage (e.g., "3 resumes remaining this month").
*   **Weekly Progress:** A summary of your activity (resumes analyzed, applications sent).

### ✅ Benefit:
> You get a clear, gamified path to becoming **"Job Ready"**. No more guessing. Follow the checklist, track your metrics, and watch your **Readiness Score** hit 100%.

---

## 13. 🌐 Facility 11 — Multi-Category Job Support

This platform supports jobs across **multiple technical domains** — you are not limited to just one field.

### Supported Job Categories:

| Category               | Example Job Titles                             |
|------------------------|------------------------------------------------|
| 💻 **Frontend**        | React Developer, UI/UX Engineer, Web Designer  |
| 🔧 **Backend**         | Node.js Developer, API Engineer, Java Developer|
| 📊 **Data Science**    | ML Engineer, Data Analyst, AI Researcher       |
| 🧪 **QA Testing**      | Test Engineer, Automation Tester, QA Analyst   |

### ✅ Benefit:
> Whether you are a frontend developer, backend engineer, data scientist, or QA tester — this platform has **relevant jobs for every tech category**.

---

## 14. ⚡ Facility 12 — Mobile Responsive UI

The platform is fully optimized to work perfectly on **all screen sizes and devices**.

### Device Support:

| Device            | Experience                                          |
|-------------------|-----------------------------------------------------|
| 📱 **Mobile**     | Full access — optimized mobile layout               |
| 💻 **Desktop**    | Rich experience with full dashboard and features    |
| 📟 **Tablet**     | Responsive layout adapts to tablet size             |

### UI Features:

| Feature              | Description                                        |
|----------------------|----------------------------------------------------|
| **Fast Loading**     | Optimized React components for quick performance   |
| **Clean Design**     | Built with Shadcn UI — modern and professional     |
| **Smooth Navigation**| Single Page Application — no page reloads          |
| **Dark/Light Mode**  | Comfortable viewing in any environment             |

### ✅ Benefit:
> Access the platform **from anywhere** — your phone, laptop, or tablet — without losing any features or functionality.

---

## 15. 🔒 Facility 13 — Security & Data Privacy

Your personal and professional information is completely protected.

### Security Measures:

| Security Feature       | Technology Used                                  |
|------------------------|--------------------------------------------------|
| **Account Security**   | JWT (JSON Web Token) authentication              |
| **Password Protection**| bcrypt hashing — passwords never stored as plain text |
| **Protected Routes**   | Middleware blocks unauthorized API access        |
| **Role-Based Access**  | Candidates cannot access recruiter-only areas    |
| **Data Privacy**       | Your data is never shared with third parties     |
| **Secure File Storage**| Resumes stored on Cloudinary — not on local disk |

### ✅ Benefit:
> Your resume, contact details, and personal information are **completely safe and private**.

---

### 🎤 Facility 14 — AI-Powered Interview Prep Assistant

Getting a job application accepted is only the first half — clearing the interview is the second. Our AI helps you prepare like a pro.

#### A. Project Explanation (The STAR Method)
Enter your project details (Name, Role, Stack, Challenges, Metrics) and let the AI generate a **professional script** using the STAR method:
*   **S**ituation: The context of the project.
*   **T**ask: What was required.
*   **A**ction: What **you** specifically did.
*   **R**esult: The outcome (e.g., "Reduced loading time by 40%").

#### B. Behavioral Questions Prep
Generate practice questions based on standard industry categories:
*   Teamwork & Collaboration
*   Ownership & Leadership
*   Problem-Solving under pressure

**✅ User Benefit:**
> You go into every interview with **confidence**, knowing exactly how to talk about your projects and yourself in a professional, structured way.

---

### 🎭 Facility 15 — Advanced Recruitment Features (Premium)

Our platform goes beyond just resumes. We offer high-end tools to make you stand out.

#### A. 📹 1-Min Video Pitch
Record a 60-second video introduction directly on your profile. Recruiters love seeing communication skills before the first call.

#### B. 🏅 AI Verified Skill Badges
Take AI-generated MCQ tests for your skills. Pass the test to earn a **"Verified Expert"** badge that boosts your AI match score.

#### C. 🔔 Live Socket.io Notifications
Get instant "Ting!" alerts on your dashboard the moment a recruiter moves your application or sends a message.

#### D. 📄 1-Click AI Resume Builder
If your current resume is poorly formatted, use our AI builder to generate a professional, ATS-optimized PDF in seconds.

**✅ User Benefit:**
> These "Killer Features" make you look like a top 1% candidate and give you a massive advantage over users on traditional platforms.

---

### 📁 Facility 16 — Resume History & AI Diagnostics Hub

Don't just upload and forget. Manage your entire professional history in one place and ensure your resumes are being read correctly by the AI.

#### Key Features:
*   **Resume Versioning:** Keep a record of every resume you've ever uploaded.
*   **Run Diagnostics:** A special tool to "debug" your resume. It checks for hidden text issues or formatting errors that might confuse recruiters.
*   **4-Step AI Journey (Stepper):** Every analysis follows a clear path:
    1. **Upload:** Add your PDF.
    2. **Results:** View your match scores.
    3. **AI Suggestions:** Get improvement tips.
    4. **Interview Scripts:** Prepare for the role.

**✅ User Benefit:**
> You have full control over your data. If your resume isn't getting hits, use the **Diagnostics** tool to fix it and try again with a new version.

---

### 🌐 Facility 17 — AI Technical Portfolio Builder & README Generator

Stand out from the crowd with a professional online presence tailored to your career path. This feature helps you build and analyze your technical portfolio for **any role** (SDE, Frontend, Backend, AI, etc.).

#### Universal README Sections:
*   **Architecture & Design:** (e.g., MVC, Microservices, Clean Architecture).
*   **Tech Stack:** (React, Node.js, Python, Java, AWS, Docker, etc.).
*   **CI/CD & DevOps:** (GitHub Actions, Jenkins, Terraform, Kubernetes).
*   **Portfolio Projects:** (Highlighting technical challenges and impact).
*   **GitHub Stats:** (Automatic "Top Languages" and "Repo Stats" widgets).

#### Your 5-Step Journey:
1.  **Open Generator:** Use the community tool to scaffold your README for your specific tech stack.
2.  **Select Sections:** Bio, Universal Tech Badges, Stats Widgets, and Repositories.
3.  **Add Role-Specific Content:** Detail your coding philosophy and system design expertise.
4.  **Create Repository:** Create a repo named `YOUR_USERNAME/YOUR_USERNAME`.
5.  **Polish and Connect:** Link your profile to LinkedIn and your professional blog.

**✅ User Benefit:**
> You don't just apply for jobs; you **attract recruiters** with a high-end technical profile that shows your expertise in your specific domain — whether it's web dev, data science, or mobile apps.

---

### 🎭 Facility 18 — Resume-Based AI Mock Interview & Confidence Check

Don't just prepare with text — practice with a **live AI interviewer** for exactly 10 to 15 minutes before your real Google Meet interview.

#### Key Features:
*   **10-15 Min Timed Session:** A strict mock interview environment to test your time management.
*   **Resume-Driven Q&A:** The AI dynamically generates questions strictly based on your uploaded resume (e.g., specific projects, skills, and past experience).
*   **Live AI Avatar & Voice:** Speak your answers naturally. The AI uses Speech-to-Text to interact with you via camera and microphone.
*   **Response Quality Report:** After the session, the AI gives you a detailed report: *"Based on your resume, your response quality was X% and your confidence level was Y%."* It highlights exact mistakes and areas for improvement.

**✅ User Benefit:**
> Practice anytime, anywhere. Test your exact resume knowledge and build rock-solid confidence before sitting in front of a real hiring manager.

---

## 16. 🔄 Full User Journey Flow Chart)

Here is the complete end-to-end journey of a user on this platform:

```
┌─────────────────────────────────────────────────────────────┐
│                    USER JOURNEY                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [1] REGISTER / LOGIN                                       │
│       → Create account securely (Email or Google)           │
│       → JWT token generated                                 │
│              ↓                                              │
│  [2] GUIDED AI ONBOARDING (NEW)                             │
│       → Welcome Modal & Feature Tour                        │
│       → Personalized greeting & initial setup               │
│              ↓                                              │
│  [3] COMPLETE PROFILE & UPLOAD RESUME                       │
│       → Add name, skills, experience, bio                   │
│       → PDF Resume stored securely on Cloudinary            │
│              ↓                                              │
│  [4] AI ANALYZES RESUME                                     │
│       → pdf-parse extracts text                             │
│       → OpenAI GPT-4o reads and understands                 │
│              ↓                                              │
│  [5] VIEW AI JOB MATCHING & DASHBOARD                       │
│       → Match score shown for every job (0-100%)            │
│       → Personalized recommendations ready                  │
│              ↓                                              │
│  [6] VIEW RECOMMENDED JOBS                                  │
│       → Best-matched jobs displayed on dashboard            │
│       → Match score shown for every job                     │
│              ↓                                              │
│  [7] SEARCH & FILTER JOBS                                   │
│       → Filter by category, location, salary                │
│              ↓                                              │
│  [8] APPLY WITH ONE CLICK                                   │
│       → Resume auto-attached                                │
│       → **Instant AI-Based Shortlisting**                   │
│              ↓                                              │
│  [9] TRACK APPLICATION STATUS                               │
│       → Direct "Accepted" status for high AI scores         │
│       → Real-time updates from dashboard                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 17. 💎 Pricing & Plans

Choose the plan that fits your career goals. Whether you are just starting or looking for a serious career shift, we have you covered.

### 🆓 Free Plan ($0 Forever)
*Perfect for getting started.*
*   **3 Resume Analyses** per month.
*   **5 Job Searches** per month.
*   Basic AI-powered improvement suggestions.

### 👑 Premium Plan ($97 One-Time)
*Lifetime access to all features — Most Popular!*
*   **Unlimited** Resume Analyses & Job Searches.
*   **Detailed Email Reports** for every analysis.
*   **30+ Curated Jobs** delivered daily.
*   **Advanced AI Coaching** for interview preparation.
*   **Full Portfolio Analyzer** for GitHub and LinkedIn.
*   **Job Description Matching** to see exactly how you fit.

### 💳 How to Upgrade to Premium
We use an ultra-secure, bank-level encrypted payment gateway (Stripe/Razorpay) to process your upgrade.

1.  **Click Upgrade:** Go to your Dashboard or Profile and click the **"Upgrade to Premium"** button.
2.  **Secure Checkout:** You will be redirected to a secure checkout page. We support Credit/Debit Cards, UPI, and Net Banking.
3.  **Instant Activation:** The moment your payment is successful, your account is instantly upgraded.
4.  **No Refresh Needed:** You will automatically be sent back to your dashboard with all Premium limits completely unlocked.

---

## 18. 📋 Summary Table — All User Facilities

| # | Facility                      | Key Benefit                                          | AI Powered |
|---|-------------------------------|------------------------------------------------------|------------|
| 1 | Secure Account System         | Safe login (Email & Google) and session management  | ❌          |
| 2 | Profile Management            | Build a complete professional profile               | ❌          |
| 3 | Resume Upload                 | Upload once, use everywhere automatically            | ❌          |
| 4 | AI Resume Analysis            | AI reads your resume and extracts skills             | ✅ OpenAI  |
| 5 | Smart AI Job Matching         | Get a % match score for every job                   | ✅ OpenAI  |
| 6 | Job Search & Filters          | Find jobs by category, location, salary             | ❌          |
| 7 | One-Click Job Application     | Apply instantly with resume auto-attached           | ❌          |
| 8 | Application Tracking          | Monitor status: Pending / Accepted / Rejected       | ❌          |
| 9 | Personalized Recommendations  | AI suggests best jobs for you automatically          | ✅ OpenAI  |
| 10| Personal Dashboard            | All features in one organized view                  | ✅ OpenAI  |
| 11| Multi-Category Support        | Jobs across Frontend, Backend, Data Science, QA     | ❌          |
| 12| Mobile Responsive UI          | Works on all devices — phone, tablet, desktop       | ❌          |
| 13| Security & Data Privacy       | Encrypted data, secure APIs, no data sharing        | ❌          |
| 14| AI Interview Prep Assistant   | AI-generated scripts for project & behavioral questions| ✅ OpenAI  |
| 15| Advanced Recruitment Tools    | Video Pitch, AI Badges, Socket Alerts, Resume Builder | ✅ OpenAI  |
| 16| Resume History & Diagnostics  | Manage multiple resume versions and debug parsing issues| ✅ OpenAI  |
| 17| AI Portfolio & README Builder | Build a professional GitHub/LinkedIn profile automatically| ✅ OpenAI  |
| 18 | Real-time AI Mock Interview   | Live voice/video interview practice with AI feedback | ✅ OpenAI  |
| 19 | Unified Mode Switching        | One-click toggle between Candidate (Blue) & Hiring (Purple) Modes | ❌          |
| 20 | Management Portal (RBAC)      | Unified dashboard for Admin/Super Admin (Revenue/Users/Jobs)| ❌          |

---

---

### 🔄 Facility 19 — Unified Architecture & Real-Time Notification Flow

Ye section detail mein samjhata hai ki ek hi frontend application ke andar User (Candidate) aur Company (Recruiter) dono ke dashboards aur notifications kaise manage hote hain.

#### 1. Global State & Mode Switching Logic
*   **Top Navbar:** Ek global toggle button hoga: **"Switch to Hiring Mode"**.
*   **Visual Theming:** User ko clearly apna mode samajh aaye iske liye **Theme Colors** change honge:
    *   **Candidate Mode:** Blue / Professional Theme.
    *   **Hiring Mode:** Dark Purple / Executive Theme.
*   **Database Level:** User ke database model mein `hasCompanyProfile` (boolean) check hoga.
    *   Agar user pehli baar "Hiring Mode" par click karta hai, toh ek pop-up aayega: *"Please create your Company Profile to start hiring."*
    *   Agar profile bani hui hai, toh click karte hi URL `/dashboard` se redirect hokar `/company-dashboard` par chala jayega, aur pura UI naye theme ke sath Recruiter ATS mein badal jayega.

#### 2. Real-Time Notification & Response Flow (Detailed)
Socket.io ka connection user ke **`userId`** par based hoga, na ki uske mode par. Iska fayda ye hai ki user kisi bhi screen par ho, use notification zaroor aayegi.

**Scenario A: Job Apply Notification (Candidate -> Recruiter)**
1.  **Action:** Candidate A, Job X (jo User B ne post ki hai) par apply karta hai.
2.  **Backend Logic:** Backend dekhta hai ki Job X ka owner User B hai. Backend Socket.io par event bhejta hai `new_applicant`.
3.  **Frontend Response (User B):**
    *   **If User B is in Recruiter Dashboard:** Kanban board ke "Applied" column mein Candidate A ka card instantly slide hoke add ho jayega. Ek success sound ("Ting") aayega.
    *   **If User B is in Candidate Dashboard:** Top navbar ki bell icon (🔔) par ek red dot (badge) aayega aur ek toast dikhega: *"You have a new applicant for your posted job [Job Title]"*.

**Scenario B: Interview Schedule Notification (Recruiter -> Candidate)**
1.  **Action:** User B (Recruiter mode mein) Candidate A ka card select karta hai aur **"Schedule Google Meet"** karke kal subah 10 baje ka time set karta hai.
2.  **Backend Logic:** Backend event bhejta hai `interview_scheduled`.
3.  **Frontend Response (Candidate A):**
    *   **If online:** Candidate A ke dashboard mein push notification aayega: *"Interview Scheduled by [Company]! Tomorrow at 10 AM. [Join Google Meet Link]"*. Uska application status pipeline mein automatically 'Interviewing' ho jayega.
    *   **If offline:** Ek automated Email chala jayega Google Meet link aur timing ke sath.

**Scenario C: Post-Interview Feedback (After Meeting)**
1.  **Action:** Interview (Google Meet) complete hone ke baad, Recruiter apne portal par candidate ke card par click karta hai.
2.  **Recruiter Action:** Wo **"Submit Feedback"** form bharta hai (e.g., Technical Skills: 8/10, Communication: 9/10, Final Status: Hired ya Rejected).
3.  **Backend Logic:** Backend database update karta hai aur Candidate ko ek detailed feedback card bhejta hai.
4.  **Frontend Response (Candidate):** Candidate ko notification milti hai. Wo apne dashboard mein jaa kar company ka exact feedback aur apna final result (Hired/Rejected) dekh sakta hai. Ye transparency trust build karti hai.

---

## 20. 🏢 Recruiter Guide — Hire 10x Faster

Are you a hiring manager? Our AI-powered ecosystem helps you find top talent without the manual headache of screening thousands of resumes.

### Step 1: Create Your Company Brand
Register your company, upload your logo, and add your mission statement. A professional company page attracts better talent.

### Step 2: Post a Job with AI Assistance
Add the job title and let our **AI Job Description Generator** write the full requirements, responsibilities, and "About the Role" section for you.

### Step 3: Visual Kanban ATS Pipeline
Manage your candidates on a **Drag & Drop board**. Move talent from *Applied* to *Shortlisted* to *Hired* with a single mouse click.
*   **AI Ranking:** Highest-scoring candidates are automatically flagged.
*   **1-Click Resume View:** Peek at resumes instantly without leaving the board.
*   **Face-to-Face Interview Scheduler:** Send exact Date/Time and a **Google Meet Link** for the real face-to-face interview directly from the candidate card.

### Step 4: Real Face-to-Face Interview
AI handles the pre-screening, but the final interview is done by you face-to-face via Google Meet. 

### Step 5: Post-Interview Feedback
After the Google Meet, return to the Kanban board, fill out a quick "Submit Feedback" form (e.g., Tech Skills: 8/10), and drop the candidate in the "Hired" or "Rejected" column. The candidate receives this transparent feedback instantly via Socket.io.

### Step 6: Maintain Your "Company Response Rating" (SLA)
When candidates apply, you will get instant alerts in your **Dashboard Notification Center**. You must reply to them quickly (ideally on the same day). 
*   **Why it matters:** Candidates can rate their interview and feedback experience with your company.
*   **The Benefit:** A fast response time and good feedback generate a public **Company Profile Rating (e.g., ⭐ 4.8/5)** visible to all users. High ratings build trust and attract the absolute best talent to your future job posts!

### ✅ Recruiter Benefit:
> Save **80% of your time**. Our AI does the manual reading; you only spend time talking to the highest-qualified "A-Players."

---

## 🏁 Conclusion

This platform is a **Dual-Sided Marketplace** designed to make hiring and job hunting a seamless, AI-driven experience for everyone.

| Feature | For Candidates | For Recruiters |
|---|---|---|
| **AI Analysis** | Get resume scores | Rank applicants automatically |
| **Search** | Find high-match jobs | Find top-scoring talent |
| **Automation** | 1-Click apply | Instant AI shortlisting |

> **Bottom Line:** Whether you are looking for your dream role or building a world-class team, our AI-Based Job Portal is the only tool you need.

---

*📅 Document Version: 1.0 (SEO Optimized) | Platform: AI-Based Multi-Category Smart Job Portal | Status: Production Ready*
