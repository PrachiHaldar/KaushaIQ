import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Compass,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  BookOpen,
  Target,
  Award,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SkillGapBar from '../components/dashboard/SkillGapBar';

export default function SkillGapPage() {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [dashboardData, setDashboardData] = useState(null);
  const [careers, setCareers] = useState([]);
  const [selectedCareerId, setSelectedCareerId] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchGaps = async () => {
    try {
      setLoading(true);
      const [dashRes, domRes] = await Promise.all([
        api.get('/students/dashboard'),
        api.get('/domains')
      ]);

      if (dashRes.success) {
        setDashboardData(dashRes.data);
        if (dashRes.data.targetCareer) {
          setSelectedCareerId(dashRes.data.targetCareer.id);
        }
      }

      // Collect careers from all domains
      const allCareers = [];
      if (domRes.success) {
        for (const d of domRes.data) {
          const domDetails = await api.get(`/domains/${d.slug}`);
          if (domDetails.success && domDetails.data.careerPaths) {
            allCareers.push(...domDetails.data.careerPaths);
          }
        }
      }
      setCareers(allCareers);
    } catch (err) {
      console.error('Failed to load gaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGaps();
  }, []);

  const handleCareerChange = async (e) => {
    const newCareerId = e.target.value;
    setSelectedCareerId(newCareerId);
    setUpdating(true);
    try {
      const res = await api.post('/students/target-career', { careerPathId: newCareerId });
      if (res.success) {
        addToast({
          title: 'Career Target Updated',
          message: 'Skill gaps and readiness recalculated.',
          type: 'success'
        });
        await fetchGaps();
      }
    } catch (err) {
      addToast({ title: 'Update Failed', message: err.message, type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const skillGaps = dashboardData?.skillGaps || [];
  const targetCareer = dashboardData?.targetCareer;
  const readiness = dashboardData?.readiness?.score || 61;

  const criticalGaps = skillGaps.filter((g) => g.severity === 'CRITICAL');
  const moderateGaps = skillGaps.filter((g) => g.severity === 'MODERATE');
  const strongSkills = skillGaps.filter((g) => g.severity === 'STRONG');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Career Target Selector */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border-brand-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30 mb-1">
            <Compass className="w-3.5 h-3.5" />
            AI Skill Gap Analyzer
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            Skill Gap & Remediation Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Comparing your verified competencies against industry target benchmarks.
          </p>
        </div>

        {/* Target Career Dropdown */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1.5 w-full md:w-80">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Target Career Objective:
          </label>
          <select
            value={selectedCareerId}
            onChange={handleCareerChange}
            disabled={updating}
            className="glass-input text-xs w-full bg-slate-900 text-white font-semibold"
          >
            {careers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.demandLevel} Demand)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Score Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 border-rose-500/30 bg-gradient-to-br from-slate-900 to-rose-950/20 space-y-1">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">🔴 Critical Gaps</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-white">{criticalGaps.length} Skills</h3>
            <span className="text-xs text-rose-300">Gap &gt; 20 pts</span>
          </div>
          <p className="text-xs text-slate-400">Requires mandatory course completion & lab validation.</p>
        </div>

        <div className="glass-panel p-5 border-amber-500/30 bg-gradient-to-br from-slate-900 to-amber-950/20 space-y-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">🟠 Moderate Gaps</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-white">{moderateGaps.length} Skills</h3>
            <span className="text-xs text-amber-300">Gap 1-20 pts</span>
          </div>
          <p className="text-xs text-slate-400">Requires quick practice assessments & revision.</p>
        </div>

        <div className="glass-panel p-5 border-emerald-500/30 bg-gradient-to-br from-slate-900 to-emerald-950/20 space-y-1">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">🟢 Strong Skills</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-white">{strongSkills.length} Skills</h3>
            <span className="text-xs text-emerald-300">Target Met</span>
          </div>
          <p className="text-xs text-slate-400">Meets or exceeds industry benchmark standards.</p>
        </div>
      </div>

      {/* Detailed Skill Gap List */}
      <div className="glass-panel p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="font-bold text-white text-base font-display">Skill-by-Skill Target Delta</h3>
          <span className="text-xs text-slate-400">Current Score vs. Required Score</span>
        </div>

        <div className="space-y-3">
          {skillGaps.map((gap, idx) => (
            <SkillGapBar key={idx} gap={gap} />
          ))}
        </div>
      </div>

      {/* 6-Week Personalized Remediation Roadmap (CRITICAL DEMO STEP 3) */}
      <div className="glass-panel p-6 sm:p-8 space-y-6 border-indigo-500/30">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="font-bold text-white text-base font-display">Personalized 6-Week Remediation Roadmap</h3>
              <p className="text-xs text-slate-400">Algorithmic step-by-step pathway to increase Readiness from {readiness}% → 87%+</p>
            </div>
          </div>
          <span className="badge-verified-project text-xs">AI Optimized Plan</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Phase 1 */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px]">WEEKS 1 - 2</span>
                <span className="text-slate-400 text-[10px]">Foundations</span>
              </div>
              <h4 className="font-bold text-white text-sm">SQL & Advanced Statistics</h4>
              <p className="text-slate-300 leading-relaxed">
                Review indexing, query optimization, and probability distributions to bridge the database gap from 54 → 70.
              </p>
            </div>
            <Link
              to="/learning"
              className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 pt-2 border-t border-slate-800/80"
            >
              Start Module <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Phase 2 */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-brand-500/40 space-y-3 flex flex-col justify-between shadow-lg shadow-brand-500/10">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold text-[10px]">WEEKS 3 - 4</span>
                <span className="text-cyan-400 text-[10px] font-bold">★ Highest Impact</span>
              </div>
              <h4 className="font-bold text-white text-sm">Machine Learning Mastery</h4>
              <p className="text-slate-300 leading-relaxed">
                Complete Machine Learning Fundamentals module, take the interactive quiz, and pass the model deployment lab.
              </p>
            </div>
            <Link
              to="/learning/machine-learning-fundamentals"
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 pt-2 border-t border-slate-800/80"
            >
              Open ML Module <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Phase 3 */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/40 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">WEEKS 5 - 6</span>
                <span className="text-emerald-400 text-[10px] font-bold">+26 Score Leap</span>
              </div>
              <h4 className="font-bold text-white text-sm">Industry Capstone Challenge</h4>
              <p className="text-slate-300 leading-relaxed">
                Submit AI-Based Healthcare Disease Risk Prediction Engine to TechNova Solutions and receive industry verified badge.
              </p>
            </div>
            <Link
              to="/projects/ai-healthcare-prediction"
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 pt-2 border-t border-slate-800/80"
            >
              Solve Challenge <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
