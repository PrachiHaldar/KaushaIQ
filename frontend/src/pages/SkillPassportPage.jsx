import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SkillPassportCard from '../components/passport/SkillPassportCard';
import { Award, ShieldCheck, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SkillPassportPage() {
  const { user } = useAuth();
  const [passportData, setPassportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPassport = async () => {
    try {
      setLoading(true);
      const res = await api.get('/passport/my');
      if (res.success) setPassportData(res.data);
    } catch (err) {
      console.error('Failed to load passport:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassport();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400 animate-pulse">
        <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs">Generating cryptographically verified Digital Skill Passport...</p>
      </div>
    );
  }

  if (!passportData) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h3 className="text-xl font-bold">Skill Passport Unavailable</h3>
        <p className="text-xs text-slate-400">Please switch to Student Demo mode to view your personal Skill Passport.</p>
        <Link to="/dashboard" className="glass-button-primary text-xs">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            KaushIQ Verified Credential
          </div>
          <h1 className="text-3xl font-black font-display text-white">Digital Skill Passport</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dynamic, tamper-evident credential carrying verified project evaluations, multi-tier skill endorsements, and employability index.
          </p>
        </div>

        <button
          onClick={fetchPassport}
          className="glass-button-secondary text-xs px-4 py-2 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Sync Latest DB Badges
        </button>
      </div>

      {/* Main Passport Component */}
      <SkillPassportCard passportData={passportData} />
    </div>
  );
}
