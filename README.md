<<<<<<< HEAD
# KaushaIQ
=======
# KaushIQ 🌟
> **"Where Skills Meet Opportunity"** • *"From Skill Gap to Career"*  
> AI-Powered Academia–Industry Collaboration & Skill Intelligence Platform (Smart India Hackathon 2026)

---

## 🚀 Overview

**KaushIQ** is a full-stack, domain-agnostic ecosystem connecting **Students ↔ Academicians ↔ Institutions ↔ Industries**. It resolves the critical disconnect between curriculum skills and dynamic industry demands through intelligent skill mapping, personalized remediation roadmaps, project-backed digital skill passports, and deterministic opportunity matching.

### 🌟 Key Features

1. **Domain-Agnostic Relational Architecture**: Database-driven configuration supporting 15+ academic domains (Computer Science, Mechanical, Civil, Biotech, Healthcare, AYUSH, Commerce, Law, Agriculture, Design, etc.).
2. **Deterministic Matching Engine**: 6-factor weighted algorithm (40% Skills + 20% Domain + 15% Career + 10% Eligibility + 10% Projects + 5% Soft Skills) with transparent **"Why you matched"** explainability.
3. **Skill Gap Engine & Dynamic Remediation**: Real-time delta calculation (Required vs. Current) yielding critical/moderate/strong categorizations and 6-week personalized learning paths.
4. **Digital Skill Passport with QR Verification**: Tamper-evident verified credentials, employability index (0–100), and multi-tier verification (Self, Assessed, Faculty Verified, Project Verified, Industry Verified).
5. **AI Study Assistant & Career Copilot**: Context-aware RAG copilot grounded on module notes and profile telemetry.
6. **5 Role-Based Stakeholder Portals**:
   - 🎓 **Student**: Dynamic Readiness Score, Skill Gap Roadmaps, Learning Hub, Project Marketplace, Opportunity Hub, Application Tracker.
   - 👨‍🏫 **Faculty**: Research/Patents/FDPs tracking, Content Authoring Studio, Student Verification Queue.
   - 🏢 **Industry**: Talent Demand Intelligence (+42% AI/ML, +31% Cloud), Candidate Discovery Matrix, Job & Challenge posting, Project Grading.
   - 🏛️ **Institution**: 4-Year Skill Gap Heatmap Matrix, Placement Analytics, Automated Intervention Recommendations.
   - ⚙️ **Admin**: Dynamic UI-based Domain/Skill/Opportunity/Module management without code changes.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 / Vite, Tailwind CSS, Lucide React, Recharts, Axios, QRCode.react, Canvas-Confetti
- **Backend**: Node.js, Express.js, Prisma ORM, JWT Authentication, Bcrypt.js, Morgan
- **Database**: Relational Database (Prisma SQLite default with zero-config setup, instant PostgreSQL switch via `DATABASE_URL`)

---

## ⚡ Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npx prisma db push
npm run seed
npm run dev
# Backend runs at http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🎭 1-Click Demo Accounts

| Role | Name / Organization | Email | Password |
|---|---|---|---|
| **Student** | Rahul Kumar | `rahul.student@kaushiq.edu` | `demo123` |
| **Faculty** | Dr. Ananya Sharma | `ananya.faculty@kaushiq.edu` | `demo123` |
| **Industry** | TechNova Solutions | `technova.industry@kaushiq.com` | `demo123` |
| **Institution** | NIT Demo | `admin@nit.demo.edu` | `demo123` |
| **Admin** | KaushIQ Admin | `admin@kaushiq.gov.in` | `demo123` |

*Use the persistent **"Enter Demo"** switcher bar at the top of the app to switch personas instantly with one click.*

---

## 🏆 SIH 2026 Critical Journey Flow
1. Log in as **Rahul Kumar** (CS, Target: AI/ML Engineer) → Starting Readiness: **61/100**.
2. Identify critical gaps in **Machine Learning**, **Statistics**, and **SQL**.
3. Open **Machine Learning Fundamentals** in Learning Hub → review notes, ask AI Assistant, score 100% on the Quiz.
4. Complete and submit the **AI-Based Healthcare Prediction** industry challenge.
5. Switch to **TechNova Industry** → evaluate project with **4.7 / 5.0** rating.
6. Switch back to **Rahul** → Readiness dynamically updates from **61 → 87/100**; Match score for AI/ML Intern leaps to **92%**.
7. Click **Why?** to inspect explainable match breakdown → Click **Apply** (status changes to *Applied*).
8. Switch to **NIT Institution** → observe live updated 4th-year skill gap heatmap.
>>>>>>> 403d2b7 (adding frontend and backend)
