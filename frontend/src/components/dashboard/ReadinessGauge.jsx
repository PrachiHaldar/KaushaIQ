import React from 'react';
import { Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function ReadinessGauge({ score = 61, breakdown = [] }) {
  const normalizedScore = Math.min(100, Math.max(0, score));
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const getScoreStatus = (val) => {
    if (val >= 85) return { text: 'Industry Ready 🌟', color: 'text-emerald-400', stroke: '#10B981', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' };
    if (val >= 70) return { text: 'Competitive Match 🎯', color: 'text-cyan-400', stroke: '#06B6D4', badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' };
    if (val >= 55) return { text: 'Developing Competency 📈', color: 'text-amber-400', stroke: '#F59E0B', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
    return { text: 'Foundational Baseline 🧭', color: 'text-rose-400', stroke: '#F43F5E', badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30' };
  };

  const status = getScoreStatus(normalizedScore);

  return (
    <div className="glass-panel p-6 flex flex-col md:flex-row items-center gap-8 justify-between">
      {/* Gauge Circle */}
      <div className="flex flex-col items-center text-center shrink-0">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-800"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={status.stroke}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-white font-display tracking-tight">{normalizedScore}</span>
            <span className="text-xs font-semibold text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="mt-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${status.badge}`}>
            {status.text}
          </span>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="flex-1 w-full space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            Employability Readiness Breakdown
          </h4>
          <span className="text-xs text-slate-400">Dynamic AI Weighted Score</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {breakdown.map((item, idx) => (
            <div key={idx} className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{item.label}</span>
                <span className="font-bold text-white">{item.score}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, item.score)}%`,
                    backgroundColor: item.color || '#6366F1'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
