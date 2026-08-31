import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import StatCard from '../components/dashboard/StatCard';
import {
  UserCheck,
  BookOpen,
  Award,
  FileText,
  Sparkles,
  CheckCircle2,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/faculty/dashboard');
      if (res.success) setDashboardData(res.data);
    } catch (err) {
      console.error('Failed to load faculty dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleVerifyStudentSkill = async (studentId, skillId, studentName, skillName) => {
    try {
      const res = await api.post('/faculty/verify-skill', {
        studentId,
        skillId,
        remarks: 'Lab assessment and academic evaluation verified.'
      });

      if (res.success) {
        addToast({
          title: '✓ Skill Verified by Faculty',
          message: `Endorsed ${skillName} for ${studentName}.`,
          type: 'success'
        });
        await fetchDashboard();
      }
    } catch (err) {
      addToast({ title: 'Verification Failed', message: err.message, type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 animate-pulse">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs">Loading academic research portfolio, created modules, and student verifications...</p>
      </div>
    );
  }

  const profile = dashboardData?.profile || {};
  const modules = dashboardData?.modules || [];
  const pending = dashboardData?.pendingVerifications || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 via-purple-950/40 to-slate-900/90 border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
              Academician Portal — {profile.user?.name || 'Dr. Ananya Sharma'}
            </h1>
            <span className="badge-verified-faculty text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Faculty Lead
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            {profile.designation} • {profile.institution?.institutionName || 'NIT Karnataka'}
          </p>
          <p className="text-xs text-purple-300 pt-1">
            Research Specialization: <strong>{profile.researchInterests}</strong>
          </p>
        </div>

        <Link to="/learning" className="glass-button-primary text-xs px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600">
          <Plus className="w-3.5 h-3.5" /> Author New Course Module
        </Link>
      </div>

      {/* Academic Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Research Publications"
          value={profile.publicationsCount || 24}
          subtitle="Peer-Reviewed IEEE / Scopus"
          icon={FileText}
          color="purple"
          badge="High Impact"
        />
        <StatCard
          title="Filed & Granted Patents"
          value={profile.patentsCount || 5}
          subtitle="AI & Healthcare Diagnostics"
          icon={Award}
          color="cyan"
          badge="IPR Verified"
        />
        <StatCard
          title="FDPs & Industrial Training"
          value={profile.fdpCount || 12}
          subtitle="Faculty Development Programs"
          icon={GraduationCap}
          color="emerald"
        />
        <StatCard
          title="Consultancy Projects"
          value={profile.consultancyCount || 7}
          subtitle="Active Corporate Partners"
          icon={Building2}
          color="amber"
        />
      </div>

      {/* Student Skill Verification Queue */}
      <div className="glass-panel p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base font-display flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-purple-400" />
              Pending Student Competency Verification Queue
            </h3>
            <p className="text-xs text-slate-400">Review lab assessments and verify skills on students' Digital Skill Passports.</p>
          </div>
          <span className="badge-assessed text-xs">{pending.length} Pending Endorsements</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {pending.map((item) => (
            <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs">
                  {item.student?.user?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <span className="font-bold text-white block">{item.student?.user?.name}</span>
                  <span className="text-[11px] text-slate-400">{item.student?.department?.name || 'Computer Science'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="font-bold text-brand-300 block">{item.skill?.name}</span>
                  <span className="text-[10px] text-slate-400">Current Score: {item.currentScore}%</span>
                </div>

                <button
                  onClick={() => handleVerifyStudentSkill(item.studentId, item.skillId, item.student?.user?.name, item.skill?.name)}
                  className="glass-button-primary text-xs px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Endorse Skill
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Created Modules */}
      <div className="glass-panel p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-white text-base font-display flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-brand-400" />
            Authored Learning Modules & Labs ({modules.length}):
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {modules.map((mod) => (
            <div key={mod.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{mod.title}</span>
                <span className="badge-verified-industry text-[10px]">{mod.level}</span>
              </div>
              <p className="text-slate-400 line-clamp-2">{mod.overview}</p>
              <div className="pt-2 flex justify-end">
                <Link to={`/learning/${mod.slug}`} className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
                  Manage Course <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
