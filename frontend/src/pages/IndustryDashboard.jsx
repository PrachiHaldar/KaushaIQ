import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/dashboard/StatCard';
import {
  Building2,
  TrendingUp,
  Users,
  Briefcase,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function IndustryDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/industry/dashboard');
        if (res.success) setDashboardData(res.data);
      } catch (err) {
        console.error('Failed to load industry dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 animate-pulse">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs">Analyzing regional talent pools and skill demand telemetry...</p>
      </div>
    );
  }

  const analytics = dashboardData?.analytics || {};
  const metrics = analytics.metrics || {};
  const demandTrends = analytics.demandTrends || [];
  const opportunities = dashboardData?.opportunities || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 via-cyan-950/40 to-slate-900/90 border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
              Industry Talent Intelligence — {user?.industryProfile?.companyName || 'TechNova Solutions'}
            </h1>
            <span className="badge-verified-industry text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" /> Corporate Partner
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Enterprise Artificial Intelligence & Cloud Platforms • Bengaluru, Karnataka
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/industry/candidates"
            className="glass-button-primary text-xs px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600"
          >
            <Users className="w-3.5 h-3.5" />
            Candidate Discovery Matrix
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Openings"
          value={metrics.activeOpenings || 18}
          subtitle="Internships & Jobs"
          icon={Briefcase}
          color="cyan"
        />
        <StatCard
          title="Applications Received"
          value={metrics.totalApplicants || 142}
          subtitle="Pre-Screened Candidates"
          icon={Users}
          color="brand"
        />
        <StatCard
          title="Verified Talent Pool"
          value={metrics.verifiedTalentPool || 480}
          subtitle="Readiness Score ≥ 70"
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Avg Compatibility"
          value={`${metrics.avgCompatibilityScore || 84}%`}
          subtitle="Algorithmic Match Score"
          icon={Sparkles}
          color="purple"
        />
      </div>

      {/* Real-Time Skill Demand Trends */}
      <div className="glass-panel p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base font-display flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Regional Skill Demand Surges & Hiring Benchmarks
            </h3>
            <p className="text-xs text-slate-400">Quarterly growth across participating academic institutions.</p>
          </div>
          <span className="text-xs text-slate-400">Q1 2026 Telemetry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {demandTrends.map((trend, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{trend.skill}</span>
                <span className="font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {trend.growth}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1">
                <span>Domain: {trend.category}</span>
                <span>Demand Index: <strong>{trend.demandIndex}/100</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access to Candidate Discovery */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-cyan-500/30 bg-gradient-to-r from-slate-900/90 to-cyan-950/30">
        <div className="space-y-1">
          <h4 className="font-bold text-white text-base font-display">Discover Verified Candidates Like Rahul Kumar</h4>
          <p className="text-xs text-slate-300">Filter students by verified skills, completed industry challenges, and 90%+ compatibility match.</p>
        </div>
        <Link to="/industry/candidates" className="glass-button-primary text-xs px-6 py-2.5 shrink-0 bg-cyan-600 hover:bg-cyan-500">
          Open Candidate Discovery <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
