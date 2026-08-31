import React from 'react';

export default function HeatmapMatrix({ heatmapData = [] }) {
  // Color scale helper based on score percentage
  const getCellColor = (score) => {
    if (score >= 80) return 'bg-emerald-500/30 text-emerald-300 border-emerald-500/40';
    if (score >= 65) return 'bg-cyan-500/25 text-cyan-300 border-cyan-500/40';
    if (score >= 50) return 'bg-amber-500/25 text-amber-300 border-amber-500/40';
    return 'bg-rose-500/25 text-rose-300 border-rose-500/40';
  };

  return (
    <div className="glass-panel p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h4 className="text-base font-bold text-white font-display">Institutional 4-Year Skill Gap Heatmap</h4>
          <p className="text-xs text-slate-400 mt-0.5">Cohort proficiency progression across academic years (Red: Gap &lt;50% → Green: Benchmark &gt;80%)</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500/60"></span> &lt;50%</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500/60"></span> 50-65%</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-cyan-500/60"></span> 65-80%</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/60"></span> 80%+</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Skill Domain Area</th>
              <th className="py-3 px-4 font-semibold text-center">1st Year Cohort</th>
              <th className="py-3 px-4 font-semibold text-center">2nd Year Cohort</th>
              <th className="py-3 px-4 font-semibold text-center">3rd Year Cohort</th>
              <th className="py-3 px-4 font-semibold text-center">4th Year Cohort</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {heatmapData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-white">{row.skill}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block w-16 py-1.5 rounded-lg font-bold border ${getCellColor(row.year1)}`}>
                    {row.year1}%
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block w-16 py-1.5 rounded-lg font-bold border ${getCellColor(row.year2)}`}>
                    {row.year2}%
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block w-16 py-1.5 rounded-lg font-bold border ${getCellColor(row.year3)}`}>
                    {row.year3}%
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block w-16 py-1.5 rounded-lg font-bold border ${getCellColor(row.year4)}`}>
                    {row.year4}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
