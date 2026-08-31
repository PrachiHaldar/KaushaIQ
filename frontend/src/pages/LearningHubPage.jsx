import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BookOpen, Search, Filter, Clock, Award, ArrowRight, Sparkles, UserCheck, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LearningHubPage() {
  const [modules, setModules] = useState([]);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [modRes, domRes] = await Promise.all([
          api.get(`/learning${selectedDomain ? `?domainId=${selectedDomain}` : ''}`),
          api.get('/domains')
        ]);
        if (modRes.success) setModules(modRes.data);
        if (domRes.success) setDomains(domRes.data);
      } catch (err) {
        console.error('Failed to load learning modules:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDomain]);

  const filteredModules = modules.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.overview.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Adaptive Learning Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">Your Personalized Learning Path</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Industry-aligned curriculum curated by leading faculty and corporate partners to bridge critical skill gaps with verified proof of competency.
          </p>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="glass-input text-xs bg-slate-900"
          >
            <option value="">All Domains</option>
            {domains.map((d) => (
              <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
            ))}
          </select>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search modules..."
              className="glass-input text-xs w-full pl-10 py-2.5"
            />
          </div>
        </div>
      </div>

      {/* Module Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-panel p-6 h-64 animate-pulse bg-slate-900/50"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((mod) => (
            <div
              key={mod.id}
              className="glass-panel p-6 hover:border-brand-500/50 hover:shadow-brand-500/10 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/30">
                    {mod.domain?.code || 'DOMAIN'}
                  </span>
                  <span className="badge-assessed text-[10px]">
                    {mod.level}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-brand-300 transition-colors line-clamp-2">
                  {mod.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {mod.overview}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {mod.durationHours} Hours
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                    Notes & Quizzes
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {mod.facultyAuthor?.user?.avatar && (
                    <img
                      src={mod.facultyAuthor.user.avatar}
                      alt="Author"
                      className="w-6 h-6 rounded-full object-cover border border-slate-700"
                    />
                  )}
                  <span className="text-[11px] text-slate-400">
                    {mod.facultyAuthor?.user?.name || 'Dr. Ananya Sharma'}
                  </span>
                </div>

                <Link
                  to={`/learning/${mod.slug}`}
                  className="glass-button-primary text-xs px-3.5 py-1.5"
                >
                  Open Module <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
