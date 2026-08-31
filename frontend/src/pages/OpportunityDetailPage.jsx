import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import MatchScoreBadge from '../components/matching/MatchScoreBadge';
import ExplainableMatchModal from '../components/matching/ExplainableMatchModal';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [coverNote, setCoverNote] = useState('Enthusiastic candidate with verified technical skills and strong project background eager to contribute to core engineering workflows.');
  const [explainModalOpen, setExplainModalOpen] = useState(false);

  const fetchOpportunity = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/opportunities/${id}`);
      if (res.success) {
        setOpportunity(res.data);
        setHasApplied(res.data.hasApplied);
      }
    } catch (err) {
      console.error('Failed to load opportunity:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (user?.role !== 'STUDENT') {
      addToast({ title: 'Student Role Required', message: 'Switch to Student Demo to apply for opportunities.', type: 'warning' });
      return;
    }

    setApplying(true);
    try {
      const res = await api.post('/applications/apply', {
        opportunityId: opportunity.id,
        coverNote
      });

      if (res.success) {
        setHasApplied(true);
        addToast({
          title: '🎉 Application Submitted!',
          message: `Your application is now recorded as APPLIED.`,
          type: 'success'
        });
        await fetchOpportunity();
      }
    } catch (err) {
      addToast({ title: 'Application Error', message: err.message, type: 'error' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400 animate-pulse">
        <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs">Loading opening details, skill match breakdown, and eligibility criteria...</p>
      </div>
    );
  }

  if (!opportunity) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link to="/opportunities" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Opportunities
        </Link>
      </div>

      {/* Header Card */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border-brand-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              {opportunity.organization?.companyName || 'TechNova Solutions'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
              {opportunity.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <DollarSign className="w-4 h-4" />
                {opportunity.stipendOrSalary}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                {opportunity.location} ({opportunity.locationType})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-purple-400" />
                {opportunity.duration}
              </span>
            </div>
          </div>

          {opportunity.matchScore && (
            <div className="shrink-0">
              <MatchScoreBadge
                score={opportunity.matchScore}
                onExplain={() => setExplainModalOpen(true)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6 text-xs text-slate-300">
          <div className="glass-panel p-6 space-y-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">About the Role</h3>
            <p className="leading-relaxed whitespace-pre-line">{opportunity.description}</p>
          </div>

          <div className="glass-panel p-6 space-y-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Responsibilities</h3>
            <p className="leading-relaxed whitespace-pre-line">{opportunity.responsibilities}</p>
          </div>

          <div className="glass-panel p-6 space-y-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Requirements & Prerequisites</h3>
            <p className="leading-relaxed whitespace-pre-line">{opportunity.requirements}</p>
          </div>
        </div>

        {/* Sidebar Apply Form */}
        <div className="space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Application Status</h3>

            {hasApplied ? (
              <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Application Submitted!</span>
                </div>
                <p>Status: <strong>APPLIED & UNDER REVIEW</strong></p>
                <Link to="/applications" className="underline block pt-1 font-semibold">
                  Track in My Applications →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cover Note for Recruiter</label>
                  <textarea
                    rows={4}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="glass-input w-full"
                  />
                </div>

                <button
                  type="submit"
                  disabled={applying}
                  className="glass-button-primary text-xs w-full py-3"
                >
                  {applying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Application
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <ExplainableMatchModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        matchData={opportunity.matchDetails}
      />
    </div>
  );
}
