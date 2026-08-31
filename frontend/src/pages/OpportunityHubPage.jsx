import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MatchScoreBadge from '../components/matching/MatchScoreBadge';
import ExplainableMatchModal from '../components/matching/ExplainableMatchModal';

export default function OpportunityHubPage() {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [opportunities, setOpportunities] = useState([]);
  const [domains, setDomains] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, INTERNSHIP, JOB, APPRENTICESHIP, TRAINING, MENTORSHIP
  const [selectedDomain, setSelectedDomain] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Explain Match Modal
  const [activeExplainData, setActiveExplainData] = useState(null);
  const [explainModalOpen, setExplainModalOpen] = useState(false);

  // Applying state
  const [applyingId, setApplyingId] = useState(null);
  const [appliedIds, setAppliedIds] = useState(new Set());

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const [oppRes, domRes, myAppsRes] = await Promise.all([
        api.get('/opportunities'),
        api.get('/domains'),
        user?.role === 'STUDENT' ? api.get('/applications/my').catch(() => ({ data: [] })) : { data: [] }
      ]);

      if (oppRes.success) setOpportunities(oppRes.data);
      if (domRes.success) setDomains(domRes.data);

      if (myAppsRes?.data) {
        const ids = new Set(myAppsRes.data.map((a) => a.opportunityId));
        setAppliedIds(ids);
      }
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [user]);

  const handleApply = async (opp) => {
    if (user?.role !== 'STUDENT') {
      addToast({ title: 'Student Role Required', message: 'Please switch to Student Demo to apply for opportunities.', type: 'warning' });
      return;
    }

    setApplyingId(opp.id);
    try {
      const res = await api.post('/applications/apply', {
        opportunityId: opp.id,
        coverNote: 'Verified candidate eager to apply machine learning and software engineering competencies.'
      });

      if (res.success) {
        addToast({
          title: '🎉 Application Submitted!',
          message: `Your application for ${opp.title} is now recorded as APPLIED.`,
          type: 'success'
        });
        setAppliedIds((prev) => new Set([...prev, opp.id]));
      }
    } catch (err) {
      addToast({ title: 'Application Error', message: err.message, type: 'error' });
    } finally {
      setApplyingId(null);
    }
  };

  const handleExplain = async (oppId) => {
    try {
      const res = await api.get(`/matching/explain/${oppId}`);
      if (res.success) {
        setActiveExplainData(res.data);
        setExplainModalOpen(true);
      }
    } catch (e) {
      console.error('Failed to explain match:', e);
    }
  };

  const filtered = opportunities.filter((opp) => {
    const matchesTab = activeTab === 'ALL' || opp.type === activeTab;
    const matchesDomain = !selectedDomain || opp.domainId === selectedDomain;
    const matchesSearch =
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.description.toLowerCase().includes(search.toLowerCase()) ||
      opp.organization?.companyName?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesDomain && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            Deterministic Opportunity Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">Verified Career & Opportunity Hub</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Deterministic weighted matching connecting verified skill passports with pre-placement internships, apprenticeships, and full-time roles.
          </p>
        </div>

        {user?.role === 'STUDENT' && (
          <Link to="/applications" className="glass-button-secondary text-xs px-4 py-2 shrink-0">
            View My Application Tracker <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Tabs & Filter Bar */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto scrollbar-none text-xs font-bold">
          {[
            { id: 'ALL', label: 'All Opportunities' },
            { id: 'INTERNSHIP', label: 'Internships' },
            { id: 'JOB', label: 'Jobs' },
            { id: 'APPRENTICESHIP', label: 'Apprenticeships' },
            { id: 'TRAINING', label: 'Industrial Training' },
            { id: 'MENTORSHIP', label: 'Mentorships' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`py-2.5 px-4 rounded-t-xl transition-all border-b-2 shrink-0 ${
                activeTab === t.id
                  ? 'bg-slate-900 text-brand-300 border-brand-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="glass-input text-xs bg-slate-900"
            >
              <option value="">All Domains</option>
              {domains.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, role or company..."
              className="glass-input text-xs w-full pl-10 py-2.5"
            />
          </div>
        </div>
      </div>

      {/* Opportunities List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-panel p-6 h-64 animate-pulse bg-slate-900/50"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((opp) => {
            const isApplied = appliedIds.has(opp.id);
            const isApplying = applyingId === opp.id;
            const matchScore = opp.matchScore || 88;

            return (
              <div
                key={opp.id}
                className="glass-panel p-6 sm:p-7 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Organization & Match Score */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                        {opp.organization?.companyName || 'Corporate Partner'}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors mt-0.5">
                        {opp.title}
                      </h3>
                    </div>

                    <MatchScoreBadge
                      score={matchScore}
                      onExplain={() => handleExplain(opp.id)}
                    />
                  </div>

                  {/* Badges Bar */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {opp.location}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <DollarSign className="w-3.5 h-3.5" />
                      {opp.stipendOrSalary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      {opp.duration}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Skills Alignment Tags */}
                  {opp.skillRequirements && opp.skillRequirements.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Required Skills:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {opp.skillRequirements.map((req) => (
                          <span
                            key={req.id}
                            className="text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            {req.skill?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action Area */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <Link
                    to={`/opportunities/${opp.id}`}
                    className="text-xs text-slate-400 hover:text-white font-medium flex items-center gap-1"
                  >
                    View Details
                  </Link>

                  {isApplied ? (
                    <span className="badge-verified-industry text-xs py-1.5 px-4">
                      ✓ Applied & Under Review
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(opp)}
                      disabled={isApplying}
                      className="glass-button-primary text-xs px-5 py-2"
                    >
                      {isApplying ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>1-Click Apply <ArrowRight className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Explainable Match Modal */}
      <ExplainableMatchModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        matchData={activeExplainData}
      />
    </div>
  );
}
