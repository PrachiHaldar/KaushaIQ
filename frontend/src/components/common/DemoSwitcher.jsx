import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Sparkles, User, GraduationCap, Building2, Landmark, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEMO_PERSONAS = [
  {
    role: 'STUDENT',
    name: 'Rahul Kumar',
    tag: 'CS • AI/ML Goal',
    icon: GraduationCap,
    color: 'from-blue-500/20 to-indigo-500/20 border-indigo-500/40 text-indigo-300',
    activeBg: 'bg-indigo-600 text-white border-indigo-400',
    path: '/dashboard'
  },
  {
    role: 'FACULTY',
    name: 'Dr. Ananya Sharma',
    tag: 'Professor • AI Lead',
    icon: User,
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300',
    activeBg: 'bg-purple-600 text-white border-purple-400',
    path: '/faculty/dashboard'
  },
  {
    role: 'INDUSTRY',
    name: 'TechNova Solutions',
    tag: 'Enterprise AI & Cloud',
    icon: Building2,
    color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/40 text-cyan-300',
    activeBg: 'bg-cyan-600 text-white border-cyan-400',
    path: '/industry/dashboard'
  },
  {
    role: 'INSTITUTION',
    name: 'NIT Surathkal Demo',
    tag: 'Dean & Placement Cell',
    icon: Landmark,
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300',
    activeBg: 'bg-amber-600 text-white border-amber-400',
    path: '/institution/dashboard'
  },
  {
    role: 'ADMIN',
    name: 'KaushIQ Admin',
    tag: 'Platform & Domains',
    icon: ShieldCheck,
    color: 'from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-300',
    activeBg: 'bg-rose-600 text-white border-rose-400',
    path: '/admin/dashboard'
  }
];

export default function DemoSwitcher() {
  const { user, demoLogin, loading } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSwitch = async (persona) => {
    if (loading) return;
    try {
      await demoLogin(persona.role);
      addToast({
        title: `Switched Persona: ${persona.name}`,
        message: `Logged in as ${persona.role} mode with seeded real-time database state.`,
        type: 'success'
      });
      navigate(persona.path);
    } catch (err) {
      addToast({
        title: 'Demo Switch Failed',
        message: err.message,
        type: 'error'
      });
    }
  };

  return (
    <div className="bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md px-4 py-2 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            1-Click Demo Personas:
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {DEMO_PERSONAS.map((p) => {
            const Icon = p.icon;
            const isActive = user?.role === p.role;

            return (
              <button
                key={p.role}
                onClick={() => handleSwitch(p)}
                disabled={loading}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 flex items-center gap-1.5 shrink-0 font-medium ${
                  isActive
                    ? p.activeBg
                    : `bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white`
                }`}
                title={`Switch to ${p.name}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="font-semibold">{p.name}</span>
                <span className="opacity-60 hidden lg:inline">({p.role.toLowerCase()})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
