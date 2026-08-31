import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Layers,
  BookOpen,
  Briefcase,
  Award,
  BarChart3,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Bell,
  CheckCircle,
  TrendingUp,
  GraduationCap,
  Shield,
  Building,
  Target,
  Bot
} from 'lucide-react';

export default function Navbar({ onOpenCopilot }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Domains', path: '/domains', icon: Layers },
    { name: 'Learning Hub', path: '/learning', icon: BookOpen },
    { name: 'Opportunities', path: '/opportunities', icon: Briefcase },
    { name: 'Industry Challenges', path: '/projects', icon: Target },
    { name: 'Skill Passport', path: '/passport', icon: Award },
    { name: 'Skill Intelligence', path: '/intelligence', icon: BarChart3 },
  ];

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    if (user.role === 'FACULTY') return '/faculty/dashboard';
    if (user.role === 'INDUSTRY') return '/industry/dashboard';
    if (user.role === 'INSTITUTION') return '/institution/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/dashboard';
  };

  return (
    <nav className="bg-[#0B0F19]/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-all">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold font-display tracking-tight text-white group-hover:text-brand-300 transition-colors">
                    Kaush<span className="text-cyan-400">IQ</span>
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    SIH '26
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">Where Skills Meet Opportunity</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-3">
            {/* AI Career Copilot Button */}
            {onOpenCopilot && (
              <button
                onClick={onOpenCopilot}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/20 to-brand-600/20 border border-purple-500/40 text-purple-300 hover:text-white hover:border-purple-400 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm group"
              >
                <Bot className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span>AI Copilot</span>
              </button>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Active Role Dashboard Link */}
                <Link
                  to={getDashboardPath()}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-all"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>My Portal ({user.role})</span>
                </Link>

                {/* User Info & Avatar */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-xs font-bold text-white">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-200 leading-none">{user.name}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{user.role.toLowerCase()}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors ml-1"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth?mode=login"
                  className="glass-button-secondary text-xs px-3.5 py-2"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Log In
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="glass-button-primary text-xs px-3.5 py-2"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                <Icon className="w-4 h-4 text-brand-400" />
                {link.name}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="glass-button-primary text-sm w-full"
                >
                  My Portal ({user.role})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="glass-button-secondary text-sm w-full text-rose-400"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth?mode=login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="glass-button-secondary text-sm w-full"
                >
                  Log In
                </Link>
                <Link
                  to="/auth?mode=register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="glass-button-primary text-sm w-full"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
