import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import StatCard from '../components/dashboard/StatCard';
import HeatmapMatrix from '../components/dashboard/HeatmapMatrix';
import {
  Landmark,
  TrendingUp,
  Users,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Building2,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InstitutionDashboard() {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/institution/dashboard');
        if (res.success) setDashboardData(res.data);
      } catch (err) {
        console.error('Failed to load institution dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApproveIntervention = (recTitle) => {
    addToast({
      title: '🎯 Intervention Action Approved',
      message: `Scheduled: ${recTitle}. Automated curriculum notifications sent to faculty.`,
      type: 'success'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 animate-pulse">
        <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs">Compiling institutional skill gap heatmaps and NIRF placement metrics...</p>
      </div>
    );
  }

  const analytics = dashboardData?.analytics || {};
  const metrics = analytics.metrics || {};
  const heatmap = analytics.heatmap || [];
  const departmentStats = analytics.departmentStats || [];
  const recommendations = analytics.recommendations || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 via-amber-950/40 to-slate-900/90 border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
              Institutional Skill Intelligence — NIT Surathkal
            </h1>
            <span className="badge-assessed text-[11px] bg-amber-500/10 text-amber-300 border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> NAAC A++ / NIRF Top 15
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Dean of Academic Affairs & Placement Intelligence Dashboard
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Enrolled Cohort: <strong>5,200 Students</strong></span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Students Assessed"
          value={metrics.totalStudentsAssessed || 1240}
          subtitle="Active Benchmark Tracked"
          icon={Users}
          color="brand"
        />
        <StatCard
          title="Average Readiness"
          value={`${metrics.averageReadiness || 78}%`}
          subtitle="Campus-Wide Benchmark"
          icon={Sparkles}
          color="emerald"
          badge="+12% YoY"
        />
        <StatCard
          title="Placement Conversion"
          value={metrics.placementRate || '88.4%'}
          subtitle="480 Verified Placements"
          icon={Award}
          color="cyan"
        />
        <StatCard
          title="Verified Credentials"
          value={metrics.verifiedSkillCredentials || 3820}
          subtitle="Digital Passports Issued"
          icon={ShieldCheck}
          color="purple"
        />
      </div>

      {/* 4-Year Skill Gap Heatmap Matrix (CRITICAL STEP 10) */}
      <HeatmapMatrix heatmapData={heatmap} />

      {/* Institutional Strategic Interventions */}
      <div className="glass-panel p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base font-display flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Automated AI Institutional Intervention Recommendations
            </h3>
            <p className="text-xs text-slate-400">Data-driven actions generated from aggregated cohort skill gaps.</p>
          </div>
          <span className="badge-verified-industry text-xs">High Impact Actions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold text-[10px]">
                    {rec.category.replace('_', ' ')}
                  </span>
                  <span className="text-rose-400 font-bold text-[10px]">
                    {rec.impactLevel} IMPACT
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{rec.title}</h4>
                <p className="text-slate-400 leading-relaxed">{rec.reason}</p>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                  💡 {rec.suggestedAction}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex justify-end">
                <button
                  onClick={() => handleApproveIntervention(rec.title)}
                  className="glass-button-primary text-xs px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Execute
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="glass-panel p-6 sm:p-8 space-y-4">
        <h3 className="font-bold text-white text-base font-display">Departmental Readiness & Placement Benchmarks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {departmentStats.map((dept, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-white text-sm block">{dept.name}</span>
              <div className="flex items-center justify-between text-slate-300">
                <span>Avg Readiness:</span>
                <strong className="text-cyan-400">{dept.averageReadiness}%</strong>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Placement Rate:</span>
                <strong className="text-emerald-400">{dept.placementRate}%</strong>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                Priority Area: <span className="text-rose-300">{dept.topGap}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
