import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export default function SkillRadarChart({ data = [] }) {
  // Default fallback radar data if not provided
  const chartData = data.length > 0 ? data : [
    { subject: 'Python & Algorithms', current: 82, target: 80, fullMark: 100 },
    { subject: 'Machine Learning', current: 42, target: 80, fullMark: 100 },
    { subject: 'SQL & Data Architecture', current: 54, target: 70, fullMark: 100 },
    { subject: 'Statistics & Math', current: 48, target: 70, fullMark: 100 },
    { subject: 'Soft Skills & Leadership', current: 86, target: 60, fullMark: 100 },
    { subject: 'Verified Projects', current: 55, target: 80, fullMark: 100 }
  ];

  return (
    <div className="glass-panel p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Skill Radar & Target Alignment</h4>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-brand-400">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span> Current
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Target Benchmark
          </span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 10 }} />
            <Radar
              name="Current Skill Score"
              dataKey="current"
              stroke="#6366F1"
              fill="#6366F1"
              fillOpacity={0.45}
            />
            <Radar
              name="Target Benchmark"
              dataKey="target"
              stroke="#06B6D4"
              fill="#06B6D4"
              fillOpacity={0.15}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
