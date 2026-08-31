import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Play, Award, Compass, Eye } from 'lucide-react';

const JOURNEY_STEPS = [
  { step: 1, title: 'Student Login', role: 'STUDENT', path: '/dashboard', desc: 'Rahul Kumar (B.Tech CS, Target: AI/ML Engineer)' },
  { step: 2, title: 'Skill Gap Analysis', role: 'STUDENT', path: '/skill-gaps', desc: 'Baseline Readiness: 61% with Gaps in ML, Stats, SQL' },
  { step: 3, title: 'Learning Roadmap', role: 'STUDENT', path: '/learning', desc: 'Personalized 6-Week Remediation Roadmap' },
  { step: 4, title: 'Interactive Module', role: 'STUDENT', path: '/learning/machine-learning-fundamentals', desc: 'Notes, Video, AI Assistant & Quiz Mastery' },
  { step: 5, title: 'Industry Project', role: 'STUDENT', path: '/projects/ai-healthcare-prediction', desc: 'Healthcare AI Disease Prediction Challenge' },
  { step: 6, title: 'Score Leap 61→87', role: 'STUDENT', path: '/passport', desc: 'Evaluated 4.7/5 & Verified Skill Passport' },
  { step: 7, title: '92% Matched Job', role: 'STUDENT', path: '/opportunities', desc: 'AI/ML Internship with Explainable Matching "Why?"' },
  { step: 8, title: '1-Click Apply', role: 'STUDENT', path: '/applications', desc: 'Live Application Tracker & Timeline' },
  { step: 9, title: 'Industry Discovery', role: 'INDUSTRY', path: '/industry/candidates', desc: 'TechNova views Rahul at Top Compatibility' },
  { step: 10, title: 'Institution Heatmap', role: 'INSTITUTION', path: '/institution/dashboard', desc: 'NIT 4-Year Skill Gap Matrix & Action Engine' }
];

export default function DemoJourneyBar() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleStepJump = async (s) => {
    setCurrentStep(s.step);
    if (user?.role !== s.role) {
      await demoLogin(s.role);
    }
    navigate(s.path);
  };

  return (
    <div className="bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border-b border-indigo-500/20 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30 flex items-center gap-1 shrink-0">
            <Compass className="w-3.5 h-3.5 text-brand-400" />
            SIH 2026 Walkthrough:
          </div>
          <span className="text-slate-300 font-medium hidden sm:inline">
            Step {currentStep} of 10: <strong className="text-white">{JOURNEY_STEPS[currentStep - 1].title}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {JOURNEY_STEPS.map((s) => {
            const isCurrent = currentStep === s.step;
            const isCompleted = currentStep > s.step;

            return (
              <button
                key={s.step}
                onClick={() => handleStepJump(s)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all shrink-0 flex items-center gap-1 border ${
                  isCurrent
                    ? 'bg-brand-600 text-white border-brand-400 shadow-md shadow-brand-500/30 ring-1 ring-brand-400'
                    : isCompleted
                    ? 'bg-slate-900 text-emerald-400 border-emerald-500/30 hover:bg-slate-800'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
                title={s.desc}
              >
                {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <span>{s.step}</span>}
                <span className="hidden md:inline">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
