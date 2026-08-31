import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ShieldCheck, CheckCircle2, Award, Building2, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';

export default function VerifyPassportPage() {
  const { code } = useParams();
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/passport/verify/${code}`);
        if (res.success) {
          setVerification(res.data);
        }
      } catch (err) {
        setError(err.message || 'Passport could not be verified.');
      } finally {
        setLoading(false);
      }
    };
    if (code) verify();
  }, [code]);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 space-y-8 text-center">
      {/* Brand Header */}
      <div className="space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-400" />
            </div>
          </div>
          <span className="text-xl font-bold font-display text-white">Kaush<span className="text-cyan-400">IQ</span></span>
        </Link>
        <h2 className="text-2xl font-black font-display text-white">Official Credential Verification</h2>
      </div>

      {loading ? (
        <div className="glass-panel p-10 animate-pulse text-slate-400 text-xs">
          Verifying cryptographic signature with KaushIQ Trust Engine...
        </div>
      ) : error ? (
        <div className="glass-panel p-8 border-rose-500/30 space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Invalid or Unverified Passport</h3>
          <p className="text-xs text-slate-400">{error}</p>
          <Link to="/" className="glass-button-secondary text-xs">Return Home</Link>
        </div>
      ) : verification ? (
        <div className="glass-panel p-8 border-emerald-500/40 shadow-2xl space-y-6 text-left">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="badge-verified-industry text-[11px] mb-1">
                ✓ Cryptographically Authenticated
              </span>
              <h3 className="text-xl font-bold text-white">{verification.studentName}</h3>
              <p className="text-xs text-slate-400">{verification.institution} • {verification.domain}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Employability Index:</span>
              <span className="text-2xl font-black text-emerald-400 font-display">
                {verification.employabilityScore} / 100
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Verified Credentials:</span>
              <span className="text-base font-bold text-white block mt-1">
                {verification.verifiedSkillsCount} Skills • {verification.completedProjectsCount} Projects
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
            Passport ID: <strong className="text-brand-300">{verification.passportCode}</strong><br/>
            Verified Timestamp: {new Date(verification.verifiedAt).toLocaleString()}
          </div>

          <div className="pt-2">
            <Link to="/" className="glass-button-primary text-xs w-full py-2.5">
              Explore KaushIQ Platform
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
