import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart3, TrendingUp, Sparkles, Filter, Layers, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SkillIntelligencePage() {
  const [intelligence, setIntelligence] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [intelRes, skillRes] = await Promise.all([
          api.get('/analytics/skill-intelligence'),
          api.get('/skills?trending=true')
        ]);
        if (intelRes.success) setIntelligence(intelRes.data);
        if (skillRes.success) setSkills(skillRes.data.skills);
      } catch (err) {
        console.error('Failed to load intelligence data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30 mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Macro Skill Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">Cross-Domain Skill Intelligence Hub</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time analytics mapping emerging competencies, market demand surges, and interdisciplinary career crossovers across all 16 academic disciplines.
          </p>
        </div>
      </div>

      {/* Top Trending Skills Grid */}
      <div className="glass-panel p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-white text-base font-display flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Top Trending & High-Growth Skills (2026 Telemetry):
          </h3>
          <span className="text-xs text-slate-400">Aggregated from 25+ Corporate Recruiters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {skills.map((sk) => (
            <div key={sk.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{sk.name}</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {sk.demandGrowth}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Domain: {sk.domain?.name}</span>
                <span>Req: {sk.requiredLevel}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Domain Matrix */}
      <div className="glass-panel p-6 sm:p-8 space-y-4">
        <h3 className="font-bold text-white text-base font-display flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-cyan-400" />
          Multi-Domain Skill Ecosystem Overview:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {intelligence.map((item) => (
            <div key={item.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-300">{item.code}</span>
                <span className="text-[11px] text-emerald-400 font-bold">{item.avgGrowth} YoY</span>
              </div>
              <h4 className="font-bold text-white text-sm">{item.name}</h4>
              <div className="pt-1 text-slate-400 text-[11px] space-y-0.5">
                <div>Mapped Skills: <strong className="text-white">{item.skillsCount}</strong></div>
                <div>Career Pathways: <strong className="text-white">{item.careersCount}</strong></div>
                <div>Live Openings: <strong className="text-cyan-300">{item.opportunitiesCount}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
