import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ReadinessGauge from '../components/dashboard/ReadinessGauge';
import SkillRadarChart from '../components/dashboard/SkillRadarChart';
import SkillGapBar from '../components/dashboard/SkillGapBar';
import MatchScoreBadge from '../components/matching/MatchScoreBadge';
import ExplainableMatchModal from '../components/matching/ExplainableMatchModal';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Target,
  BookOpen,
  Briefcase,
  Award,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Bot
} from 'lucide-react';

export default function StudentDashboard({ onOpenCopilot }) {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeExplainMatch, setActiveExplainMatch] = useState(null);
  const [explainModalOpen, setExplainModalOpen] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/students/dashboard');
      if (res.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleExplainMatch = async (oppId) => {
    try {
      const res = await api.get(`/matching/explain/${oppId}`);
      if (res.success) {
        setActiveExplainMatch(res.data);
        setExplainModalOpen(true);
      }
    } catch (e) {
      console.error('Explain match error:', e);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400 animate-pulse space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500/30 border-t-brand-500 animate-spin mx-auto"></div>
        <p className="text-xs">Loading your intelligent skill profile & real-time readiness analytics...</p>
      </div>
    );
  }

  const profile = dashboardData?.profile || {};
  const readiness = dashboardData?.readiness || { score: 61, breakdown: [] };
  const targetCareer = dashboardData?.targetCareer || { name: 'AI / Machine Learning Engineer' };
  const skills = dashboardData?.skills || [];
  const skillGaps = dashboardData?.skillGaps || [];
  const projects = dashboardData?.projects || [];
  const applications = dashboardData?.applications || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Welcome Header Banner */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border-brand-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
              Good morning, {user?.name || 'Rahul'} 👋
            </h1>
            <span className="badge-verified-industry text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Scholar
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            {profile.degree} • <strong className="text-cyan-400">{profile.institution?.institutionName || 'NIT Karnataka'}</strong>
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <span>Target Career: <strong className="text-brand-300">{targetCareer.name}</strong></span>
            <span>•</span>
            <Link to="/skill-gaps" className="text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-2">
              Change Career Target
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchDashboard}
            className="glass-button-secondary text-xs px-3.5 py-2"
            title="Refresh analytics from DB"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync DB
          </button>
          <Link
            to="/passport"
            className="glass-button-primary text-xs px-4 py-2"
          >
            <Award className="w-3.5 h-3.5" />
            View Digital Passport
          </Link>
        </div>
      </div>

      {/* 2. Readiness Gauge & Skill Radar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReadinessGauge score={readiness.score} breakdown={readiness.breakdown} />
        </div>
        <div>
          <SkillRadarChart />
        </div>
      </div>

      {/* 3. Skill Profile & Verification Badges */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <h3 className="font-bold text-white text-base font-display">Student Skill Profile</h3>
          </div>
          <span className="text-xs text-slate-400">Multi-Tier Verification</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((sk) => {
            const verificationClasses = {
              INDUSTRY_VERIFIED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
              PROJECT_VERIFIED: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
              FACULTY_VERIFIED: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
              ASSESSED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
              SELF_DECLARED: 'bg-slate-500/10 text-slate-400 border-slate-600/30'
            };

            return (
              <div key={sk.id} className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{sk.skill?.name || 'Skill'}</span>
                  <span className="text-[10px] text-slate-400 capitalize">{sk.skill?.category?.name || 'Technical'}</span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="font-black text-brand-300 text-sm">{sk.currentScore}%</span>
                  <span className={`block text-[9px] font-bold px-1.5 py-0.2 rounded border ${verificationClasses[sk.verificationLevel] || verificationClasses.SELF_DECLARED}`}>
                    {sk.verificationLevel.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Skill Gap Remediations & Active Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base font-display">Target Career Skill Gap Remediation</h3>
              <p className="text-xs text-slate-400">Required vs. Current Benchmark for {targetCareer.name}</p>
            </div>
            <Link to="/skill-gaps" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
              Full Gap Audit <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {skillGaps.slice(0, 4).map((gap, idx) => (
              <SkillGapBar key={idx} gap={gap} />
            ))}
          </div>
        </div>

        {/* Quick Career Copilot Prompt Card */}
        <div className="glass-panel p-6 flex flex-col justify-between border-purple-500/30 bg-gradient-to-b from-slate-900/90 to-purple-950/20 space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base font-display">KaushIQ Career Copilot</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Your current readiness is <strong>{readiness.score}%</strong>. Bridging your Machine Learning score from 42 → 85 will leap your profile to <strong>87+</strong> and unlock top AI/ML internship roles."
            </p>
          </div>

          <button
            onClick={onOpenCopilot}
            className="glass-button-primary text-xs w-full py-2.5 bg-gradient-to-r from-purple-600 to-brand-600"
          >
            Chat with AI Copilot
          </button>
        </div>
      </div>

      {/* 5. Recommended Opportunities & Industry Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Challenges */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="font-bold text-white text-sm font-display flex items-center gap-1.5">
              <Target className="w-4 h-4 text-cyan-400" />
              Verified Industry Challenges:
            </h4>
            <Link to="/projects" className="text-xs text-brand-400 hover:text-brand-300 font-semibold">
              Browse All
            </Link>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">AI-Based Healthcare Disease Risk Prediction Engine</span>
                <span className="badge-verified-industry text-[10px]">TechNova Solutions</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">
                Develop a high-precision multi-class predictive engine analyzing patient vitals to detect cardiovascular risks.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-bold text-emerald-400">Reward: +26 Readiness Boost</span>
                <Link
                  to="/projects/ai-healthcare-prediction"
                  className="glass-button-secondary text-xs px-3 py-1.5"
                >
                  Solve Challenge <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Top Matched Opportunities */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="font-bold text-white text-sm font-display flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-brand-400" />
              Top Matched Opportunities:
            </h4>
            <Link to="/opportunities" className="text-xs text-brand-400 hover:text-brand-300 font-semibold">
              Explore 18+ Openings
            </Link>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs block">AI / Machine Learning Engineering Intern</span>
                  <span className="text-[11px] text-slate-400">TechNova Solutions • Bengaluru (Hybrid)</span>
                </div>
                <MatchScoreBadge score={92} onExplain={() => handleExplainMatch('ai-ml-intern-technova')} />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                <span className="font-semibold text-emerald-400">₹40,000 / mo + PPO</span>
                <Link
                  to="/opportunities"
                  className="glass-button-primary text-xs px-3.5 py-1.5"
                >
                  View & Apply
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explainable Match Modal */}
      <ExplainableMatchModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        matchData={activeExplainMatch}
      />
    </div>
  );
}
