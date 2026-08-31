import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import StatCard from '../components/dashboard/StatCard';
import {
  ShieldCheck,
  Plus,
  Layers,
  Sparkles,
  Users,
  Briefcase,
  Target,
  CheckCircle2,
  Loader2,
  BookOpen
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Domain Form
  const [domainName, setDomainName] = useState('');
  const [domainCode, setDomainCode] = useState('');
  const [domainDesc, setDomainDesc] = useState('');
  const [creatingDomain, setCreatingDomain] = useState(false);

  // New Skill Form
  const [skillName, setSkillName] = useState('');
  const [skillDomainId, setSkillDomainId] = useState('');
  const [skillCategoryId, setSkillCategoryId] = useState('');
  const [creatingSkill, setCreatingSkill] = useState(false);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/overview');
      if (res.success) setOverview(res.data);
    } catch (err) {
      console.error('Failed to load admin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleCreateDomain = async (e) => {
    e.preventDefault();
    setCreatingDomain(true);
    try {
      const res = await api.post('/admin/domains', {
        name: domainName,
        code: domainCode,
        description: domainDesc
      });
      if (res.success) {
        addToast({
          title: '🎉 Domain Created Successfully!',
          message: `Added '${domainName}' to taxonomy without code changes.`,
          type: 'success'
        });
        setDomainName('');
        setDomainCode('');
        setDomainDesc('');
        await fetchOverview();
      }
    } catch (err) {
      addToast({ title: 'Creation Error', message: err.message, type: 'error' });
    } finally {
      setCreatingDomain(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 animate-pulse">
        <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs">Loading platform telemetry, security logs, and database models...</p>
      </div>
    );
  }

  const counts = overview?.counts || {};
  const recentUsers = overview?.recentUsers || [];
  const domains = overview?.domains || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 via-rose-950/40 to-slate-900/90 border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
              Platform Administration & Governance
            </h1>
            <span className="badge-verified-industry text-[11px] bg-rose-500/10 text-rose-300 border-rose-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Super Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            System configuration, dynamic domain expansion, and cross-stakeholder governance.
          </p>
        </div>
      </div>

      {/* Platform Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="Total Users" value={counts.totalUsers || 15} color="brand" />
        <StatCard title="Domains" value={counts.domainsCount || 16} color="cyan" />
        <StatCard title="Skills" value={counts.skillsCount || 32} color="purple" />
        <StatCard title="Careers" value={counts.careersCount || 25} color="emerald" />
        <StatCard title="Openings" value={counts.opportunitiesCount || 20} color="amber" />
        <StatCard title="Challenges" value={counts.projectsCount || 12} color="rose" />
      </div>

      {/* Dynamic Domain Creator (DOMAIN-AGNOSTIC EXPANSION REQUIREMENT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Layers className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-white text-base font-display">Add New Academic Domain</h3>
              <p className="text-xs text-slate-400">Database-driven configuration without altering codebase.</p>
            </div>
          </div>

          <form onSubmit={handleCreateDomain} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Domain Name</label>
                <input
                  type="text"
                  required
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  placeholder="e.g. Quantum Computing & AI"
                  className="glass-input w-full"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Domain Code</label>
                <input
                  type="text"
                  required
                  value={domainCode}
                  onChange={(e) => setDomainCode(e.target.value)}
                  placeholder="e.g. QCOMP"
                  className="glass-input w-full uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Description</label>
              <textarea
                rows={2}
                required
                value={domainDesc}
                onChange={(e) => setDomainDesc(e.target.value)}
                placeholder="Curriculum mapping and industry standards..."
                className="glass-input w-full"
              />
            </div>

            <button
              type="submit"
              disabled={creatingDomain}
              className="glass-button-primary text-xs w-full py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600"
            >
              {creatingDomain ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Add Domain to Live Taxonomy
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recent Registered Users */}
        <div className="glass-panel p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base font-display flex items-center gap-1.5">
              <Users className="w-4 h-4 text-brand-400" />
              Recent Registered Accounts
            </h3>
            <span className="text-xs text-slate-400">{recentUsers.length} Users</span>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs">
            {recentUsers.map((u) => (
              <div key={u.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">{u.name}</span>
                  <span className="text-slate-400 text-[11px]">{u.email}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-brand-300 block">{u.role}</span>
                  <span className="text-[10px] text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
