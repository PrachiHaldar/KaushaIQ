import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Sparkles,
  LogIn,
  UserPlus,
  GraduationCap,
  Building2,
  Landmark,
  User,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  KeyRound
} from 'lucide-react';

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register, demoLogin } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  // Keep state in sync with URL mode query parameter
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsRegister(true);
    } else if (mode === 'login') {
      setIsRegister(false);
    }
  }, [searchParams]);

  const handleModeSwitch = (registerMode) => {
    setIsRegister(registerMode);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('mode', registerMode ? 'register' : 'login');
      return next;
    });
  };

  const handleQuickFill = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setRole(demoRole);
    addToast({
      title: 'Credentials Loaded',
      message: `Filled credentials for ${demoRole} (${demoEmail}). Click Sign In to proceed.`,
      type: 'info'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const redirectUrl = searchParams.get('redirect');

    try {
      if (isRegister) {
        const res = await register({ name, email, password, role });
        addToast({ title: 'Welcome to KaushIQ!', message: 'Account registered successfully.', type: 'success' });
        const userRole = res?.user?.role || role;
        if (redirectUrl) navigate(redirectUrl);
        else if (userRole === 'FACULTY') navigate('/faculty/dashboard');
        else if (userRole === 'INDUSTRY') navigate('/industry/dashboard');
        else if (userRole === 'INSTITUTION') navigate('/institution/dashboard');
        else if (userRole === 'ADMIN') navigate('/admin/dashboard');
        else navigate('/dashboard');
      } else {
        const res = await login(email, password);
        addToast({ title: 'Welcome Back!', message: 'Logged in successfully.', type: 'success' });
        const userRole = res?.user?.role || 'STUDENT';
        if (redirectUrl) navigate(redirectUrl);
        else if (userRole === 'FACULTY') navigate('/faculty/dashboard');
        else if (userRole === 'INDUSTRY') navigate('/industry/dashboard');
        else if (userRole === 'INSTITUTION') navigate('/institution/dashboard');
        else if (userRole === 'ADMIN') navigate('/admin/dashboard');
        else navigate('/dashboard');
      }
    } catch (err) {
      addToast({ title: 'Authentication Error', message: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoClick = async (demoRole) => {
    setSubmitting(true);
    try {
      await demoLogin(demoRole);
      addToast({ title: 'Demo Mode Activated', message: `Logged in as ${demoRole}`, type: 'success' });
      if (demoRole === 'FACULTY') navigate('/faculty/dashboard');
      else if (demoRole === 'INDUSTRY') navigate('/industry/dashboard');
      else if (demoRole === 'INSTITUTION') navigate('/institution/dashboard');
      else if (demoRole === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      addToast({ title: 'Demo Login Failed', message: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 p-0.5 shadow-xl mx-auto flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-black font-display text-white">
          {isRegister ? 'Create Your KaushIQ Account' : 'Welcome to KaushIQ'}
        </h2>
        <p className="text-xs text-slate-400">
          {isRegister ? 'Join the academia-industry skill intelligence network' : 'Sign in to access your verified career and skill portal'}
        </p>
      </div>

      {/* 1-Click Demo Box */}
      <div className="glass-panel p-4 border-indigo-500/30 space-y-2.5">
        <span className="text-[11px] font-bold text-brand-300 uppercase tracking-wider block text-center">
          ⚡ 1-Click Instant Demo Login:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleDemoClick('STUDENT')}
            className="p-2 rounded-lg bg-slate-950/80 hover:bg-indigo-600/30 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-all text-center flex flex-col items-center gap-1"
          >
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoClick('FACULTY')}
            className="p-2 rounded-lg bg-slate-950/80 hover:bg-purple-600/30 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-all text-center flex flex-col items-center gap-1"
          >
            <User className="w-4 h-4 text-purple-400" />
            <span>Faculty</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoClick('INDUSTRY')}
            className="p-2 rounded-lg bg-slate-950/80 hover:bg-cyan-600/30 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-all text-center flex flex-col items-center gap-1"
          >
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Industry</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoClick('INSTITUTION')}
            className="p-2 rounded-lg bg-slate-950/80 hover:bg-amber-600/30 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-all text-center flex flex-col items-center gap-1"
          >
            <Landmark className="w-4 h-4 text-amber-400" />
            <span>Institution</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoClick('ADMIN')}
            className="p-2 rounded-lg bg-slate-950/80 hover:bg-rose-600/30 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-all text-center flex flex-col items-center gap-1 col-span-2 sm:col-span-2"
          >
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>KaushIQ Admin</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        {/* Toggle Mode */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => handleModeSwitch(false)}
            className={`w-1/2 py-2 rounded-lg font-bold transition-all ${
              !isRegister ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch(true)}
            className={`w-1/2 py-2 rounded-lg font-bold transition-all ${
              isRegister ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {!isRegister && (
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1.5 text-[11px]">
            <div className="flex items-center gap-1 text-slate-300 font-semibold">
              <KeyRound className="w-3.5 h-3.5 text-brand-400" />
              <span>Quick-Fill Seeded Demo Credentials (Password: <code className="text-cyan-300">demo123</code>):</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleQuickFill('rahul.student@kaushiq.edu', 'STUDENT')}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[10px]"
              >
                Student (Rahul)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('ananya.faculty@kaushiq.edu', 'FACULTY')}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[10px]"
              >
                Faculty (Dr. Ananya)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('technova.industry@kaushiq.com', 'INDUSTRY')}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[10px]"
              >
                Industry (TechNova)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@nit.demo.edu', 'INSTITUTION')}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[10px]"
              >
                Institution (NIT)
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name / Organization</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Kumar or TechNova Solutions"
                  className="glass-input w-full"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="glass-input w-full bg-slate-950"
                >
                  <option value="STUDENT">Student (Job Seeker / Scholar)</option>
                  <option value="FACULTY">Faculty / Academician</option>
                  <option value="INDUSTRY">Industry / Corporate Employer</option>
                  <option value="INSTITUTION">Institution / University Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul.student@kaushiq.edu"
              className="glass-input w-full"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="glass-button-primary w-full py-3 text-sm mt-2 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isRegister ? (
              <>
                <UserPlus className="w-4 h-4" /> Create Account
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

