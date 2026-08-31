import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Target, Search, Clock, Award, Building2, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProjectsMarketplacePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await api.get('/projects');
        if (res.success) setProjects(res.data);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.problemStatement.toLowerCase().includes(search.toLowerCase()) ||
    p.domain?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30 mb-2">
            <Target className="w-3.5 h-3.5" />
            Verified Project Marketplace
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">Verified Industry Challenges</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Real corporate engineering challenges provided by industry leaders. Verified completion directly endorses skills on your Digital Skill Passport.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search challenges..."
            className="glass-input text-xs w-full pl-10 py-2.5"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel p-6 h-64 animate-pulse bg-slate-900/50"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="glass-panel p-6 sm:p-7 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    {proj.domain?.name || 'Cross-Domain'}
                  </span>
                  <span className="badge-verified-industry text-[10px]">
                    <ShieldCheck className="w-3 h-3" /> Verified Challenge
                  </span>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-brand-300 transition-colors line-clamp-2">
                  {proj.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <DollarSign className="w-3.5 h-3.5" />
                    {proj.stipend || 'Completion Reward'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    {proj.durationWeeks} Weeks
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {proj.problemStatement}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Building2 className="w-3.5 h-3.5 text-brand-400" />
                  <span>{proj.industry?.companyName || 'Industry Partner'}</span>
                </div>

                <Link
                  to={`/projects/${proj.slug}`}
                  className="glass-button-primary text-xs px-4 py-2"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
