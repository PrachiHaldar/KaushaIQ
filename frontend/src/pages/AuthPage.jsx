import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Sparkles, LogIn, UserPlus, GraduationCap, Building2, Landmark, User, ShieldCheck, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [role, setRole] = useState('STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register, demoLogin } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isRegister) {
        await register({ name, email, password, role });
        addToast({ title: 'Welcome to KaushIQ!', message: 'Account registered successfully.', type: 'success' });
      } else {
        await login(email, password);
        addToast({ title: 'Welcome Back!', message: 'Logged in successfully.', type: 'success' });
      }
      navigate('/dashboard');
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
            onClick={() => setIsRegister(false)}
            className={`w-1/2 py-2 rounded-lg font-bold transition-all ${
              !isRegister ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`w-1/2 py-2 rounded-lg font-bold transition-all ${
              isRegister ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

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
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="glass-input w-full"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="glass-button-primary w-full py-3 text-sm mt-2"
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
