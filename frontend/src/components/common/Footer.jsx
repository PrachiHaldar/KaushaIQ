import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Heart, Github, Linkedin, Twitter, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const domains = [
    'Computer Science', 'AI & Data Science', 'Biotechnology', 'Mechanical',
    'Civil Engineering', 'Electrical & IoT', 'Medicine', 'AYUSH',
    'Commerce', 'Finance & FinTech', 'Law & IPR', 'Agriculture',
    'Design & HCI', 'Pure Sciences', 'Education', 'Arts & Humanities'
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                </div>
              </div>
              <span className="text-xl font-bold font-display text-white">
                Kaush<span className="text-cyan-400">IQ</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An AI-Powered Academia–Industry Collaboration & Skill Intelligence Platform connecting Students, Academicians, Institutions, and Industries across every academic domain.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              Smart India Hackathon 2026 Innovation
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/domains" className="hover:text-brand-300 transition-colors">Domain Explorer</Link></li>
              <li><Link to="/learning" className="hover:text-brand-300 transition-colors">Personalized Learning</Link></li>
              <li><Link to="/opportunities" className="hover:text-brand-300 transition-colors">Opportunity Hub</Link></li>
              <li><Link to="/projects" className="hover:text-brand-300 transition-colors">Industry Challenges</Link></li>
              <li><Link to="/passport" className="hover:text-brand-300 transition-colors">Digital Skill Passport</Link></li>
              <li><Link to="/intelligence" className="hover:text-brand-300 transition-colors">Skill Intelligence</Link></li>
            </ul>
          </div>

          {/* Stakeholders */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Stakeholders</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/dashboard" className="hover:text-brand-300 transition-colors">For Students</Link></li>
              <li><Link to="/faculty/dashboard" className="hover:text-brand-300 transition-colors">For Academicians</Link></li>
              <li><Link to="/industry/dashboard" className="hover:text-brand-300 transition-colors">For Industry Partners</Link></li>
              <li><Link to="/institution/dashboard" className="hover:text-brand-300 transition-colors">For Institutions</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-brand-300 transition-colors">Admin Governance</Link></li>
            </ul>
          </div>

          {/* Universal Domains */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Academic Domains</h4>
            <div className="flex flex-wrap gap-1.5">
              {domains.slice(0, 8).map((d) => (
                <span key={d} className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  {d}
                </span>
              ))}
              <Link to="/domains" className="text-[11px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 hover:bg-brand-500/30 flex items-center gap-0.5">
                +8 More <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 KaushIQ Platform. Built for Smart India Hackathon 2026.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              100% Deterministic Matching & Verification
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
