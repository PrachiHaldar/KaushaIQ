import React from 'react';
import Modal from '../common/Modal';
import { CheckCircle2, AlertCircle, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';

export default function ExplainableMatchModal({ isOpen, onClose, matchData }) {
  if (!matchData) return null;

  const {
    opportunityTitle = 'Opportunity',
    organizationName = 'Organization',
    matchScore = 92,
    breakdown = {},
    matchedSkills = [],
    missingSkills = [],
    strengths = [],
    improvementSuggestions = []
  } = matchData;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Explainable Match Intelligence" maxWidth="max-w-2xl">
      <div className="space-y-6 text-slate-100">
        {/* Header Summary */}
        <div className="bg-gradient-to-r from-brand-950/60 to-indigo-950/60 p-4 rounded-xl border border-brand-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-brand-300 font-semibold uppercase tracking-wider">Opportunity Compatibility</span>
            <h4 className="text-base font-bold text-white mt-0.5">{opportunityTitle}</h4>
            <span className="text-xs text-slate-400">{organizationName}</span>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-emerald-400 font-display">{matchScore}%</span>
            <span className="block text-[11px] text-slate-400 font-medium">Deterministic Score</span>
          </div>
        </div>

        {/* 6-Factor Weighted Breakdown */}
        <div className="space-y-2.5">
          <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            6-Factor Deterministic Weight Breakdown:
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Skills (40%)</span>
              <p className="font-bold text-white text-sm mt-0.5">{breakdown.skillMatch || 85}%</p>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Domain Match (20%)</span>
              <p className="font-bold text-white text-sm mt-0.5">{breakdown.domainMatch || 100}%</p>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Career Goal (15%)</span>
              <p className="font-bold text-white text-sm mt-0.5">{breakdown.careerMatch || 95}%</p>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Eligibility (10%)</span>
              <p className="font-bold text-white text-sm mt-0.5">{breakdown.eligibility || 100}%</p>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Projects (10%)</span>
              <p className="font-bold text-white text-sm mt-0.5">{breakdown.projects || 90}%</p>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Soft Skills (5%)</span>
              <p className="font-bold text-white text-sm mt-0.5">{breakdown.softSkills || 85}%</p>
            </div>
          </div>
        </div>

        {/* Skill-by-Skill Audit */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Skill-by-Skill Alignment:</h5>
          <div className="space-y-1.5">
            {matchedSkills.map((sk, idx) => (
              <div key={idx} className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {sk.status === 'STRONG' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className="font-medium text-white">{sk.name}</span>
                  {sk.verified && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <div className="text-right text-slate-300">
                  <span>Score: <strong>{sk.studentScore}</strong> / Req: {sk.requiredScore}</span>
                </div>
              </div>
            ))}

            {missingSkills.map((sk, idx) => (
              <div key={idx} className="bg-rose-950/20 p-2.5 rounded-lg border border-rose-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-medium text-rose-200">{sk.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">Missing Skill</span>
                </div>
                <span className="text-rose-300">Target: {sk.requiredScore}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Score Boost Tips */}
        {improvementSuggestions.length > 0 && (
          <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-2">
            <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              How to Increase Your Match Score to 95%+:
            </h5>
            <ul className="space-y-1 text-xs text-slate-300">
              {improvementSuggestions.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-brand-400 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button onClick={onClose} className="glass-button-primary text-xs px-6 py-2">
            Got It
          </button>
        </div>
      </div>
    </Modal>
  );
}
