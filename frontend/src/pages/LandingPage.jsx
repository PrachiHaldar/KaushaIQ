import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  Layers,
  GraduationCap,
  Building2,
  Landmark,
  UserCheck,
  CheckCircle2,
  Compass,
  Cpu,
  BarChart3,
  Bot,
  Play
} from 'lucide-react';

export default function LandingPage() {
  const [domains, setDomains] = useState([]);
  const { demoLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await api.get('/domains');
        if (res.success) setDomains(res.data.slice(0, 8));
      } catch (e) {
        console.error('Failed to load domains:', e);
      }
    };
    fetchDomains();
  }, []);

  const handleLaunchDemo = async (role = 'STUDENT') => {
    await demoLogin(role);
    if (role === 'STUDENT') navigate('/dashboard');
    else if (role === 'FACULTY') navigate('/faculty/dashboard');
    else if (role === 'INDUSTRY') navigate('/industry/dashboard');
    else if (role === 'INSTITUTION') navigate('/institution/dashboard');
    else navigate('/admin/dashboard');
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        {/* Glow circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-brand-500/15 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        {/* SIH Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-brand-500/30 text-xs text-slate-200 shadow-lg backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span className="font-bold text-white">Smart India Hackathon 2026</span>
          <span className="text-slate-500">•</span>
          <span className="text-brand-300">Where Skills Meet Opportunity</span>
        </div>

        {/* Hero Title & Taglines */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white leading-[1.1]">
            From Skill Gap to <span className="gradient-text-brand">Verified Career.</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            KaushIQ connects <span className="text-white font-semibold">Students ↔ Academia ↔ Industry ↔ Institutions</span> through intelligent skill mapping, personalized learning roadmaps, project-backed digital skill passports, and deterministic opportunity matching.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => handleLaunchDemo('STUDENT')}
            className="glass-button-primary text-sm px-7 py-3.5 shadow-xl"
          >
            Explore KaushIQ (Launch Demo)
            <ArrowRight className="w-4 h-4" />
          </button>
          <Link
            to="/domains"
            className="glass-button-secondary text-sm px-6 py-3.5"
          >
            See How It Works
          </Link>
        </div>

        {/* Ecosystem Lifecycle Flowchart */}
        <div className="pt-10 max-w-4xl mx-auto">
          <div className="glass-panel p-6 sm:p-8 border-indigo-500/30 shadow-2xl relative overflow-hidden bg-gradient-to-b from-slate-900/80 to-slate-950/90">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-300 mb-4 block">
              Continuous Intelligence Lifecycle:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold">
              <span className="px-3.5 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                1. ASSESS
              </span>
              <span className="text-slate-600">→</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                2. MAP GAPS
              </span>
              <span className="text-slate-600">→</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                3. LEARN
              </span>
              <span className="text-slate-600">→</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                4. PROVE (CHALLENGE)
              </span>
              <span className="text-slate-600">→</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                5. MATCH & HIRE
              </span>
            </div>

            {/* Ecosystem Quadrant */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <GraduationCap className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <span className="font-bold text-white text-xs block">Students</span>
                <span className="text-[10px] text-slate-400">Verified Portfolios</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <UserCheck className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <span className="font-bold text-white text-xs block">Academia</span>
                <span className="text-[10px] text-slate-400">Research & FDPs</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <Building2 className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <span className="font-bold text-white text-xs block">Industry</span>
                <span className="text-[10px] text-slate-400">Talent Intelligence</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <Landmark className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="font-bold text-white text-xs block">Institutions</span>
                <span className="text-[10px] text-slate-400">Skill Gap Heatmaps</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM & SOLUTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Problem */}
          <div className="glass-panel p-8 border-rose-500/20 bg-gradient-to-br from-slate-900/90 to-rose-950/20 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              ⚠️
            </div>
            <h3 className="text-2xl font-bold text-white font-display">The Critical Disconnect</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Traditional higher education produces degrees, yet industry experiences chronic talent shortages. Curriculum cycles lag by years, resulting in unverified resumes, invisible skill gaps, and inefficient hiring loops.
            </p>
            <div className="space-y-2 pt-2 text-xs text-rose-200">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <span>Student Skills ≠ Dynamic Industry Demands</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <span>No Unified Verification for Hands-on Project Mastery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <span>Institutions Lack Granular Cohort Skill Heatmaps</span>
              </div>
            </div>
          </div>

          {/* Solution */}
          <div className="glass-panel p-8 border-emerald-500/20 bg-gradient-to-br from-slate-900/90 to-emerald-950/20 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display">The KaushIQ AI Engine</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              KaushIQ introduces a deterministic, domain-agnostic skill intelligence network. By measuring real-time delta between student benchmarks and verified industry challenges, we turn skill gaps into targeted career offers.
            </p>
            <div className="space-y-2 pt-2 text-xs text-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>6-Factor Weighted Deterministic Matching Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Cryptographic QR-Verified Digital Skill Passports</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Institutional 4-Year Skill Gap Heatmap Intelligence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR STAKEHOLDER PORTALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl font-black font-display text-white">
            Built for Every Stakeholder in the Ecosystem
          </h2>
          <p className="text-sm text-slate-400">
            Dedicated portals delivering specialized intelligence, workflow automation, and verified outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Student */}
          <div className="glass-panel p-6 space-y-4 hover:border-blue-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-display">For Students</h4>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li>• Real-Time Employability Readiness Score (0-100)</li>
              <li>• Personalized 6-Week Remediation Roadmaps</li>
              <li>• AI Study Assistant & RAG Copilot</li>
              <li>• Industry Project Marketplace & Verified Passports</li>
            </ul>
            <button
              onClick={() => handleLaunchDemo('STUDENT')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 pt-2"
            >
              Launch Student Demo →
            </button>
          </div>

          {/* Faculty */}
          <div className="glass-panel p-6 space-y-4 hover:border-purple-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-display">For Academicians</h4>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li>• Research, Publications & Patents Portfolio</li>
              <li>• Faculty Development Programs (FDPs) & Consultancy</li>
              <li>• Course & Interactive Quiz Authoring Studio</li>
              <li>• Student Competency & Lab Verification Queue</li>
            </ul>
            <button
              onClick={() => handleLaunchDemo('FACULTY')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 pt-2"
            >
              Launch Faculty Demo →
            </button>
          </div>

          {/* Industry */}
          <div className="glass-panel p-6 space-y-4 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-display">For Industry</h4>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li>• Real-Time Talent Demand Trends (+42% AI/ML)</li>
              <li>• Multi-Filter Candidate Discovery Matrix</li>
              <li>• Post Internships, Jobs & Verified Challenges</li>
              <li>• Grade Submissions & Direct Skill Endorsements</li>
            </ul>
            <button
              onClick={() => handleLaunchDemo('INDUSTRY')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 pt-2"
            >
              Launch Industry Demo →
            </button>
          </div>

          {/* Institutions */}
          <div className="glass-panel p-6 space-y-4 hover:border-amber-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Landmark className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-display">For Institutions</h4>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li>• 4-Year Cohort Skill Gap Heatmap Matrix</li>
              <li>• Placement Analytics & Department Comparisons</li>
              <li>• Automated Intervention Engine (Bootcamps/Labs)</li>
              <li>• NIRF & NAAC Accreditation Compliance Reports</li>
            </ul>
            <button
              onClick={() => handleLaunchDemo('INSTITUTION')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 pt-2"
            >
              Launch Institution Demo →
            </button>
          </div>
        </div>
      </section>

      {/* 4. DOMAIN EXPLORER PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Universal Architecture</span>
            <h2 className="text-3xl font-black font-display text-white mt-1">Every Academic Domain. One Platform.</h2>
            <p className="text-xs text-slate-400 mt-1">Domain-agnostic relational configuration supporting 16+ disciplines without code modifications.</p>
          </div>
          <Link to="/domains" className="glass-button-secondary text-xs px-4 py-2 shrink-0">
            View All 16 Domains <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {domains.map((dom) => (
            <Link
              key={dom.id}
              to={`/domains/${dom.slug}`}
              className="glass-panel p-5 hover:border-brand-500/40 transition-all group block"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {dom.code}
                </span>
                <span className="text-[11px] text-slate-400">{dom._count?.skills || 6} Skills</span>
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-brand-300 transition-colors">
                {dom.name}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                {dom.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-10 text-center space-y-6 bg-gradient-to-r from-brand-950/60 via-indigo-950/60 to-purple-950/60 border-brand-500/40 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
            Experience the Complete SIH 2026 Journey
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Test Rahul’s leap from 61% → 87% readiness, explore explainable AI matching, and witness instant institutional intelligence updates.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleLaunchDemo('STUDENT')}
              className="glass-button-primary text-sm px-8 py-3.5 shadow-xl"
            >
              Start Guided Demo
            </button>
            <Link to="/auth?mode=register" className="glass-button-secondary text-sm px-6 py-3.5">
              Create New Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
