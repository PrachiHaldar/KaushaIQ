import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'brand', trend, badge }) {
  const colorMap = {
    brand: 'from-brand-600/20 to-indigo-600/10 border-brand-500/30 text-brand-400',
    cyan: 'from-cyan-600/20 to-teal-600/10 border-cyan-500/30 text-cyan-400',
    emerald: 'from-emerald-600/20 to-teal-600/10 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-600/20 to-orange-600/10 border-amber-500/30 text-amber-400',
    purple: 'from-purple-600/20 to-pink-600/10 border-purple-500/30 text-purple-400',
    rose: 'from-rose-600/20 to-red-600/10 border-rose-500/30 text-rose-400',
  };

  const selectedColor = colorMap[color] || colorMap.brand;

  return (
    <div className="glass-panel p-5 relative overflow-hidden transition-all duration-300 hover:border-slate-700 group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white font-display tracking-tight">{value}</h3>
            {badge && (
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-400 leading-relaxed mt-1">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${selectedColor} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs">
          <span className="font-semibold text-emerald-400">{trend}</span>
          <span className="text-slate-400">vs. last evaluation</span>
        </div>
      )}
    </div>
  );
}
