import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Users,
  Search,
  Filter,
  Sparkles,
  Award,
  ShieldCheck,
  Building2,
  ExternalLink,
  GraduationCap,
  Mail,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CandidateDiscoveryPage() {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [candidates, setCandidates] = useState([]);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [minReadiness, setMinReadiness] = useState('60');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedDomain) params.append('domainId', selectedDomain);
      if (minReadiness) params.append('minReadiness', minReadiness);
      if (verifiedOnly) params.append('verifiedOnly', 'true');
      if (search) params.append('search', search);

      const [candRes, domRes] = await Promise.all([
        api.get(`/industry/candidates?${params.toString()}`),
        api.get('/domains')
      ]);

      if (candRes.success) setCandidates(candRes.data);
      if (domRes.success) setDomains(domRes.data);
    } catch (err) {
      console.error('Failed to load candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [selectedDomain, minReadiness, verifiedOnly, search]);

  const handleInvite = (candidateName) => {
    addToast({
      title: '✉️ Interview Invitation Sent!',
      message: `Direct interview invite dispatched to ${candidateName}.`,
      type: 'success'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 mb-2">
            <Users className="w-3.5 h-3.5" />
            Verified Candidate Discovery Matrix
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">Discover Pre-Vetted Talent</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Search students across universities filtered by verified code challenges, multi-tier skill endorsements, and deterministic compatibility benchmarks.
          </p>
        </div>

        <Link to="/industry/dashboard" className="glass-button-secondary text-xs px-4 py-2 shrink-0">
          ← Back to Industry Dashboard
        </Link>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="block text-slate-400 font-semibold mb-1">Academic Domain</label>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="glass-input w-full bg-slate-950"
          >
            <option value="">All Domains</option>
            {domains.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">Min Readiness Score: {minReadiness}%</label>
          <input
            type="range"
            min="40"
            max="90"
            step="5"
            value={minReadiness}
            onChange={(e) => setMinReadiness(e.target.value)}
            className="w-full accent-cyan-400 mt-2"
          />
        </div>

        <div className="flex items-center pt-5">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded accent-cyan-400 w-4 h-4"
            />
            <span>Industry Verified Only</span>
          </label>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">Search Candidates</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Rahul, AI/ML, NIT..."
              className="glass-input w-full pl-9 py-2"
            />
          </div>
        </div>
      </div>

      {/* Candidates List Grid (CRITICAL STEP 9) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel p-6 h-72 animate-pulse bg-slate-900/50"></div>
          ))}
        </div>
      ) : candidates.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-400 text-xs">
          No candidates match the specified filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className="glass-panel p-6 hover:border-cyan-500/40 hover:shadow-cyan-500/10 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-4">
                {/* Profile Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-white text-base shrink-0">
                      {cand.avatar ? (
                        <img src={cand.avatar} alt={cand.name} className="w-full h-full object-cover" />
                      ) : (
                        cand.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                        {cand.name}
                      </h3>
                      <p className="text-xs text-slate-400">{cand.institution}</p>
                      <p className="text-[11px] text-cyan-400 font-medium">{cand.targetCareer}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Compatibility</span>
                    <span className="text-xl font-black text-emerald-400 font-display">
                      {cand.compatibilityScore}%
                    </span>
                  </div>
                </div>

                {/* Metrics Badges */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Readiness</span>
                    <span className="font-bold text-white text-xs">{cand.readinessScore}%</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Verified Skills</span>
                    <span className="font-bold text-cyan-400 text-xs">{cand.verifiedSkillsCount}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Challenges</span>
                    <span className="font-bold text-emerald-400 text-xs">{cand.completedProjectsCount}</span>
                  </div>
                </div>

                {/* Skill Chips */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Top Verified Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {cand.skills?.slice(0, 4).map((sk, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {sk.name} ({sk.score}%)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <Link
                  to={`/verify-passport/${cand.passportCode}`}
                  target="_blank"
                  className="glass-button-secondary text-xs px-3 py-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-brand-400" />
                  View Passport
                </Link>

                <button
                  onClick={() => handleInvite(cand.name)}
                  className="glass-button-primary text-xs px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-teal-600"
                >
                  <Mail className="w-3.5 h-3.5" /> Invite
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
