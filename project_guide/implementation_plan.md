# 🏗️ Unified Frontend Architecture Plan

Ye plan detail mein samjhata hai ki ek hi Next.js frontend application ke andar User (Candidate) aur Company (Recruiter) dono ke dashboards aur notifications kaise manage honge.

## 1. Routing & Layout Strategy (Next.js App Router)

Dono dashboards ek hi application mein rahenge, lekin unke URL routes aur components strictly separated honge. Hum **"Mode Switching"** ka concept use karenge (jaise LinkedIn ya Fiverr mein hota hai: *Switch to Selling / Switch to Buying*).

### Route Structure
```text
frontend/
 ├── src/app/
 │    ├── (candidate)/             # Candidate Mode Routes
 │    │    ├── dashboard/          # Candidate Stats & Pipeline
 │    │    ├── jobs/               # Job Search Page
 │    │    └── profile/            # Resume & Skills
 │    │
 │    ├── (recruiter)/             # Hiring Mode Routes
 │    │    ├── company-dashboard/  # Recruiter ATS & Kanban
 │    │    ├── post-job/           # AI Job Generator
 │    │    └── manage-team/        # Team settings
```

## 2. Global State & Mode Switching Logic

Hum frontend par ek global state (Zustand ya React Context) maintain karenge jo batayega ki user abhi kis mode mein hai.

### The "Switch Mode" Toggle & Theming
*   **Top Navbar:** Ek global toggle button hoga: **"Switch to Hiring Mode"**.
*   **Visual Theming:** User ko clearly apna mode samajh aaye iske liye **Theme Colors** change honge:
    *   **Candidate Mode:** Blue / Professional Theme.
    *   **Hiring Mode:** Dark Purple / Executive Theme.
*   **Database Level:** User ke database model mein `hasCompanyProfile` (boolean) check hoga.
    *   Agar user pehli baar "Hiring Mode" par click karta hai, toh ek pop-up aayega: *"Please create your Company Profile to start hiring."*
    *   Agar profile bani hui hai, toh click karte hi URL `/dashboard` se redirect hokar `/company-dashboard` par chala jayega, aur pura UI naye theme ke sath Recruiter ATS mein badal jayega.

## 3. Real-Time Notification & Response Flow (Detailed)

Socket.io ka connection user ke **`userId`** par based hoga, na ki uske mode par. Iska fayda ye hai ki user kisi bhi screen par ho, use notification zaroor aayegi.

### Scenario A: Job Apply Notification (Candidate -> Recruiter)
1.  **Action:** Candidate A, Job X (jo User B ne post ki hai) par apply karta hai.
2.  **Backend Logic:** Backend dekhta hai ki Job X ka owner User B hai. Backend Socket.io par `room_UserB` mein event bhejta hai `new_applicant`.
3.  **Frontend Response (User B):**
    *   **Case 1 (If User B is in Recruiter Dashboard):** Kanban board ke "Applied" column mein Candidate A ka card instantly slide hoke add ho jayega. Ek success sound ("Ting") aayega.
    *   **Case 2 (If User B is in Candidate Dashboard looking for his own job):** Top navbar ki bell icon (🔔) par ek red dot (badge) aayega aur ek toast dikhega: *"You have a new applicant for your posted job [Job Title]"*.

### Scenario B: Interview Schedule Notification (Recruiter -> Candidate)
1.  **Action:** User B (Recruiter mode mein) Candidate A ka card select karta hai aur **"Schedule Google Meet"** karke kal subah 10 baje ka time set karta hai.
2.  **Backend Logic:** Backend `room_CandidateA` mein event bhejta hai `interview_scheduled`.
3.  **Frontend Response (Candidate A):**
    *   **Case 1 (If online):** Candidate A ke dashboard mein push notification aayega: *"Interview Scheduled by [Company]! Tomorrow at 10 AM. [Join Google Meet Link]"*. Uska application status pipeline mein automatically 'Interviewing' ho jayega.
    *   **Case 2 (If offline):** Ek automated Email chala jayega Google Meet link aur timing ke sath. Jab wo wapas login karega, toh Navbar bell icon mein unread message dikhega.

### Scenario C: Post-Interview Feedback (After Meeting)
1.  **Action:** Interview (Google Meet) complete hone ke baad, Recruiter apne portal par candidate ke card par click karta hai.
2.  **Recruiter Action:** Wo **"Submit Feedback"** form bharta hai (e.g., Technical Skills: 8/10, Communication: 9/10, Final Status: Hired ya Rejected).
3.  **Backend Logic:** Backend database update karta hai aur Candidate ko ek detailed feedback card bhejta hai.
4.  **Frontend Response (Candidate):** Candidate ko notification milti hai. Wo apne dashboard mein jaa kar company ka exact feedback aur apna final result (Hired/Rejected) dekh sakta hai. Ye transparency trust build karti hai.
