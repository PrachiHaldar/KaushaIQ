import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, CheckCircle2, Clock, MapPin, Building2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const STAGES = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'];

export default function ApplicationTrackerPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get('/applications/my');
        if (res.success) setApplications(res.data);
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStageIndex = (status) => {
    if (status === 'REJECTED') return -1;
    return STAGES.indexOf(status);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            Active Application Telemetry
          </div>
          <h1 className="text-3xl font-black font-display text-white">My Application Tracker</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time status updates and end-to-end recruitment lifecycle progression.
          </p>
        </div>

        <Link to="/opportunities" className="glass-button-primary text-xs px-4 py-2 shrink-0">
          Find More Opportunities <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="glass-panel p-6 h-40 animate-pulse bg-slate-900/50"></div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Applications Yet</h3>
          <p className="text-xs text-slate-400">
            You haven't applied to any internships or roles yet. Explore your top matches on the Opportunity Hub!
          </p>
          <Link to="/opportunities" className="glass-button-primary text-xs inline-flex">
            Browse Matched Opportunities
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const stageIdx = getStageIndex(app.status);
            const isRejected = app.status === 'REJECTED';

            return (
              <div key={app.id} className="glass-panel p-6 sm:p-7 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      {app.opportunity?.organization?.companyName || 'TechNova Solutions'}
                    </span>
                    <h3 className="text-lg font-bold text-white">{app.opportunity?.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {app.opportunity?.location}
                      </span>
                      <span>•</span>
                      <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Match at Application:</span>
                    <span className="text-xl font-black text-emerald-400 font-display">
                      {app.matchScoreAtApplication || 92}%
                    </span>
                  </div>
                </div>

                {/* Timeline Visualizer */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                    Application Stage Pipeline:
                  </span>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    {STAGES.map((stg, idx) => {
                      const isPastOrCurrent = stageIdx >= idx;
                      const isCurrent = stageIdx === idx;

                      return (
                        <div key={stg} className="space-y-1.5 flex flex-col items-center">
                          <div
                            className={`w-full h-2 rounded-full transition-all ${
                              isPastOrCurrent
                                ? 'bg-gradient-to-r from-brand-500 to-emerald-400 shadow-sm'
                                : 'bg-slate-800'
                            }`}
                          />
                          <span
                            className={`text-[10px] font-bold uppercase tracking-tight ${
                              isCurrent
                                ? 'text-emerald-400'
                                : isPastOrCurrent
                                ? 'text-slate-200'
                                : 'text-slate-600'
                            }`}
                          >
                            {stg.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {app.coverNote && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 italic">
                    "{app.coverNote}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
