import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SkillGapBar({ gap }) {
  const current = gap.currentScore || 0;
  const required = gap.requiredScore || 75;
  const delta = required - current;

  const severityConfig = {
    CRITICAL: {
      tag: 'Critical Gap',
      badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      barColor: 'bg-rose-500',
      icon: AlertCircle
    },
    MODERATE: {
      tag: 'Moderate Gap',
      badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      barColor: 'bg-amber-500',
      icon: AlertCircle
    },
    STRONG: {
      tag: 'Strong / Proficient',
      badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      barColor: 'bg-emerald-500',
      icon: CheckCircle2
    }
  };

  const config = severityConfig[gap.severity] || severityConfig.MODERATE;
  const Icon = config.icon;

  return (
    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/90 hover:border-slate-700 transition-all space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 shrink-0 text-slate-300" />
          <h4 className="font-bold text-white text-sm">{gap.skillName || gap.skill?.name}</h4>
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${config.badgeClass}`}>
            {config.tag}
          </span>
        </div>

        <div className="text-xs text-slate-300 flex items-center gap-2">
          <span>Current: <strong className="text-white">{current}</strong>/100</span>
          <span className="text-slate-600">•</span>
          <span>Target: <strong className="text-brand-300">{required}</strong>/100</span>
          {delta > 0 ? (
            <span className="font-bold text-rose-400 ml-1">(-{delta})</span>
          ) : (
            <span className="font-bold text-emerald-400 ml-1">(+{Math.abs(delta)})</span>
          )}
        </div>
      </div>

      {/* Dual Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden relative border border-slate-800">
          {/* Target marker line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 z-10"
            style={{ left: `${Math.min(100, required)}%` }}
            title={`Target: ${required}%`}
          />
          {/* Current progress */}
          <div
            className={`h-full rounded-full transition-all duration-700 ${config.barColor}`}
            style={{ width: `${Math.min(100, current)}%` }}
          />
        </div>
      </div>

      {/* Recommendation Action */}
      {gap.recommendedAction && (
        <div className="flex items-center justify-between gap-3 pt-1 text-xs">
          <p className="text-slate-400 leading-relaxed italic">{gap.recommendedAction}</p>
          <Link
            to="/learning"
            className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 shrink-0"
          >
            Remediate <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
