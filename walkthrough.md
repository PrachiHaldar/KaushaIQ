# KaushIQ Full-Stack Web Application Walkthrough (SIH 2026)

**KaushIQ** (*"Where Skills Meet Opportunity"* • *"From Skill Gap to Career"*) is an AI-powered Academia–Industry Collaboration and Skill Intelligence Platform built for **Smart India Hackathon 2026**.

---

## 🌟 What Was Built

### 1. Monorepo Architecture
```
KaushIQ/
├── backend/                       # Node.js + Express.js + Prisma ORM + SQLite / PostgreSQL
│   ├── prisma/
│   │   ├── schema.prisma          # 30+ Relational models with full Foreign Keys
│   │   └── seed.js                # Multi-domain seed dataset (16 domains, 32+ skills, 5 roles)
│   ├── src/
│   │   ├── config/                # Database (Prisma Client), JWT Config
│   │   ├── middleware/            # JWT Auth, Role-Based Access Control, Error Handler
│   │   ├── services/              # Matching Engine, Skill Gap Engine, AI Copilot, Passport, Analytics
│   │   ├── controllers/           # 16 Dedicated REST Controllers
│   │   ├── routes/                # Modular REST Endpoints (/api/*)
│   │   ├── app.js & server.js     # Express App & Server on http://localhost:5000
│   ├── package.json
│   └── .env
│
├── frontend/                      # React 18 + Vite + Tailwind CSS + Lucide + Recharts
│   ├── src/
│   │   ├── components/            # DemoSwitcher, DemoJourneyBar, Navbar, Footer, RadarChart, Heatmap, Modal, Passport, AI Copilot
│   │   ├── context/               # AuthContext, NotificationContext
│   │   ├── pages/                 # 20+ Pages (Landing, DomainExplorer, StudentDashboard, SkillGaps, LearningHub, OpportunityHub, Applications, Projects, Passport, Stakeholder Portals)
│   │   ├── services/              # Axios API client with automatic token handling
│   │   ├── styles/index.css       # Ultra-premium glassmorphism, glowing gradients & animations
│   │   ├── App.jsx & main.jsx     # Router & Context Providers
│   ├── package.json
│   └── vite.config.js             # Dev server on http://localhost:5173 with /api proxy
│
├── .gitignore
└── README.md
```

---

## 🎯 Core Intelligent Engines & Features

### 1. 6-Factor Deterministic Matching Engine
Calculates real weighted compatibility:
- **Skill Match (40%)** + **Domain Match (20%)** + **Career Interest (15%)** + **Eligibility (10%)** + **Verified Projects (10%)** + **Soft Skills (5%)**.
- Transparent **"Why you matched"** explainability modal breaking down strengths, gaps, and actionable boost tips (*"Improve Machine Learning from 54 → 70 to reach 95% compatibility"*).

### 2. Universal Domain-Agnostic Relational Model
- **16 Domains Configured via Database**: Computer Science, AI & Data Science, Mechanical, Civil, Electrical, Biotechnology, Medicine, AYUSH, Commerce, FinTech, Law & IPR, Agriculture, Design & HCI, Pure Sciences, Education, Arts.
- **Dynamic Domain Expansion**: Administrators can register new academic disciplines through the Admin UI without code modifications.

### 3. Digital Skill Passport & Cryptographic QR Verification
- Tamper-evident verified credentials with QR code modal.
- Multi-tier verification levels: `Self Declared`, `Assessed`, `Project Verified`, `Faculty Verified`, `Industry Verified`.
- Public verification endpoint: [`/verify-passport/:code`](http://localhost:5173/verify-passport/KSH-2026-NITK-88219).

### 4. Context-Grounded AI Study Assistant & Career Copilot
- Grounded RAG responses based on actual module lecture notes and live student profile data.
- Multi-actions: *"Explain simply"*, *"Summarize lecture"*, *"Generate 10 MCQs"*, *"Revision cheatsheet"*.

### 5. Institutional 4-Year Skill Gap Heatmap Matrix
- Color-graded matrix (Red: &lt;50%, Amber: 50-65%, Cyan: 65-80%, Green: &gt;80%) tracking cohort progression across 1st, 2nd, 3rd, and 4th years.
- Automated AI Strategic Recommendations (AI Bootcamps, Faculty Upskilling, Industry Labs).

---

## 🎭 1-Click Demo Personas Ready

| Role | Persona | Email | Password | Primary Portal |
|---|---|---|---|---|
| **Student** | Rahul Kumar | `rahul.student@kaushiq.edu` | `demo123` | `/dashboard` |
| **Faculty** | Dr. Ananya Sharma | `ananya.faculty@kaushiq.edu` | `demo123` | `/faculty/dashboard` |
| **Industry** | TechNova Solutions | `technova.industry@kaushiq.com` | `demo123` | `/industry/dashboard` |
| **Institution** | NIT Surathkal Demo | `admin@nit.demo.edu` | `demo123` | `/institution/dashboard` |
| **Admin** | KaushIQ Admin | `admin@kaushiq.gov.in` | `demo123` | `/admin/dashboard` |

---

## 🏆 SIH 2026 Critical Journey Verification

The entire 10-step end-to-end evaluation flow has been tested and verified:
1. **Step 1**: Rahul logs in as Student (CS, Target: AI/ML Engineer) → Starting Readiness **61/100**.
2. **Step 2**: Identifies critical gaps in **Machine Learning**, **Statistics**, and **SQL**.
3. **Step 3**: Personalized 6-week remediation roadmap generated.
4. **Step 4**: Opens **Machine Learning Fundamentals** in Learning Hub → reviews notes, takes interactive MCQ quiz with instant score update in DB.
5. **Step 5**: Submits **AI-Based Healthcare Disease Risk Prediction** challenge.
6. **Step 6**: Evaluated with **4.7/5.0** rating → Readiness dynamically leaps from **61 → 87/100** in DB and UI.
7. **Step 7**: Top Opportunity (*AI/ML Intern*) shows updated **92% Match** with *"Why?"* explainable breakdown.
8. **Step 8**: 1-Click Apply → Status changes to **APPLIED** with recruitment timeline.
9. **Step 9**: Switch to **TechNova Industry** → Rahul appears at top compatibility in Candidate Discovery.
10. **Step 10**: Switch to **NIT Institution** → Live 4-Year Skill Gap Heatmap and AI Recommendations update.
