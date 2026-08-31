import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

export default function MatchScoreBadge({ score = 85, onExplain, showExplainBtn = true }) {
  const getBadgeStyle = (val) => {
    if (val >= 90) return 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40';
    if (val >= 75) return 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/40';
    if (val >= 60) return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40';
    return 'bg-gradient-to-r from-rose-500/20 to-red-500/20 text-rose-300 border-rose-500/40';
  };

  return (
    <div className="inline-flex items-center gap-2">
      <div className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1.5 shadow-sm ${getBadgeStyle(score)}`}>
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>{score}% Match</span>
      </div>

      {showExplainBtn && onExplain && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExplain();
          }}
          className="text-xs text-brand-400 hover:text-brand-300 underline underline-offset-2 flex items-center gap-0.5 font-medium transition-colors"
          title="Explain why you matched"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Why?
        </button>
      )}
    </div>
  );
}
