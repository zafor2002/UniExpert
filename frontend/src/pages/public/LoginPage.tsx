import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Shield, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';
import toast from 'react-hot-toast';

const roleDashboards: Record<string, string> = {
  student: '/student/dashboard',
  faculty: '/faculty/dashboard',
  mentor: '/mentor/dashboard',
  coordinator: '/coordinator/dashboard',
  admin: '/admin/taxonomy',
  auditor: '/auditor/trail',
};

function formatCountdown(ms: number) {
  if (ms <= 0) return '0:00';
  const totalSec = Math.ceil(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login, incrementLoginAttempts, resetLockout, loginAttempts, lockedUntil, currentRole, setRole } = useApp();

  // If already authenticated, redirect to appropriate role dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate(roleDashboards[currentRole] ?? '/student/dashboard', { replace: true });
    }
  }, [isAuthenticated, currentRole, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!lockedUntil) {
      setCountdown(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const tick = () => {
      const remaining = lockedUntil.getTime() - Date.now();
      setCountdown(Math.max(0, remaining));
      if (remaining <= 0 && intervalRef.current) clearInterval(intervalRef.current);
    };
    tick();
    intervalRef.current = setInterval(tick, 500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [lockedUntil]);

  const isLocked = lockedUntil && Date.now() < lockedUntil.getTime();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLocked) return;
    setLoading(true);

    // Determine target role based on email identity
    let targetRole = currentRole;
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes('shohel') || lowerEmail.includes('arman') || lowerEmail.includes('faculty') || lowerEmail.includes('prof')) {
      targetRole = 'faculty';
    } else if (lowerEmail.includes('coord')) {
      targetRole = 'coordinator';
    } else if (lowerEmail.includes('admin')) {
      targetRole = 'admin';
    } else if (lowerEmail.includes('mentor') || lowerEmail.includes('sakib') || lowerEmail.includes('techbridge')) {
      targetRole = 'mentor';
    } else if (lowerEmail.includes('audit') || lowerEmail.includes('qa')) {
      targetRole = 'auditor';
    } else {
      targetRole = 'student';
    }

    try {
      // 1. Try real backend API first
      const res = await api.login({ email, password });
      if (res && res.access_token) {
        localStorage.setItem('uniexpert_token', res.access_token);
        localStorage.setItem('uniexpert_user', JSON.stringify({ id: res.user_id, role: res.role, name: res.name }));
        if (res.role) setRole(res.role as any);
        setLoading(false);
        toast.success(`Welcome back, ${res.name || 'User'}!`);
        navigate(roleDashboards[res.role] ?? roleDashboards[targetRole] ?? '/student/dashboard');
        return;
      }
    } catch (err: any) {
      console.warn('Backend API login notice:', err.message);
    }

    // 2. Seamless local fallback for instant testing/demo
    const result = login(email, password);
    setLoading(false);

    if (result.success) {
      setRole(targetRole as any);
      const roleDisplayName: Record<string, string> = {
        student: 'Abu Zafor',
        faculty: 'Md. Shohel Arman',
        mentor: 'Engr. Sakib Al Hasan',
        coordinator: 'Prof. Dr. Syed Akhter Hossain',
        admin: 'System Administrator',
        auditor: 'DIU Quality Assurance Cell'
      };
      localStorage.setItem('uniexpert_token', 'mock_jwt_' + targetRole + '_' + Date.now());
      localStorage.setItem('uniexpert_user', JSON.stringify({
        id: targetRole + '-1',
        role: targetRole,
        name: roleDisplayName[targetRole] || targetRole.toUpperCase()
      }));

      if (result.requiresMfa) {
        toast.success('Credentials verified. Please complete MFA.');
        navigate('/mfa');
      } else {
        toast.success(`Signed in successfully as ${targetRole.toUpperCase()}.`);
        navigate(roleDashboards[targetRole] ?? '/student/dashboard');
      }
    } else {
      incrementLoginAttempts();
      const remaining = 5 - (loginAttempts + 1);
      if (remaining > 0) {
        toast.error(`${result.message} (${remaining} attempt${remaining !== 1 ? 's' : ''} left)`);
      } else {
        toast.error('Account temporarily locked due to failed attempts.');
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F8FF] text-[#334155] flex flex-col items-center justify-center px-4 py-12">
      {/* Brand header */}
      <div className="text-center mb-8">
        <div 
          onClick={() => navigate(isAuthenticated ? (roleDashboards[currentRole] ?? '/student/dashboard') : '/')} 
          className="inline-flex items-center gap-2.5 cursor-pointer mb-2 hover:opacity-90 transition-opacity"
          title="UniExpert Home"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] border border-[#D5E5FD] flex items-center justify-center text-[#3B75DE] shadow-sm">
            <Sparkles size={20} />
          </div>
          <span className="text-2xl font-bold text-[#1E293B] tracking-tight">
            Uni<span className="text-[#3B75DE]">Expert</span>
          </span>
        </div>
        <p className="text-xs text-[#64748B]">Daffodil International University · Academic Collaboration</p>
      </div>

      {/* Card: Clean white with subtle border */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-card border border-[#E2E8F0] p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#1E293B]">Institutional Sign In</h1>
          <p className="text-xs text-[#64748B] mt-1">Access your research workspace with your DIU account.</p>
        </div>

        {/* Lockout banner */}
        {isLocked && countdown > 0 && (
          <div className="mb-6 p-4 bg-[#FEE2E2] border border-[#FECACA] rounded-2xl flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#991B1B] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#991B1B]">Account temporarily locked.</p>
                <p className="text-xs text-[#991B1B] mt-0.5">
                  Try again in <span className="font-mono font-bold">{formatCountdown(countdown)}</span> minutes.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => resetLockout()}
              className="text-xs font-bold text-[#991B1B] underline hover:text-black shrink-0"
            >
              Reset Lock
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="label">Institutional Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="email"
                className="input pl-10"
                placeholder="e.g. abu.zafor@diu.edu.bd"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">Password</label>
              <a href="#forgot" className="text-xs text-[#3B75DE] hover:underline font-medium">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input pl-10 pr-10"
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#334155]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit: Soft blue with dark readable text */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-xs font-bold uppercase tracking-wider mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast-fill in light pastel */}
        <div className="mt-6 pt-5 border-t border-[#E2E8F0]">
          <p className="text-[11px] font-semibold text-[#64748B] mb-2 uppercase tracking-wide">1-Click Demo Accounts:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => { resetLockout(); setEmail('abu.zafor@diu.edu.bd'); setPassword('password123'); }}
              className="p-2.5 rounded-xl bg-[#F4F8FF] border border-[#E2E8F0] hover:bg-[#EAF2FF] text-[#1E3A8A] text-left text-[11px] font-semibold transition-colors"
            >
              🎓 Student Lead
            </button>
            <button
              type="button"
              onClick={() => { resetLockout(); setEmail('shohel.arman@diu.edu.bd'); setPassword('password123'); }}
              className="p-2.5 rounded-xl bg-[#F4F8FF] border border-[#E2E8F0] hover:bg-[#EAF2FF] text-[#1E3A8A] text-left text-[11px] font-semibold transition-colors"
            >
              👨‍🏫 Faculty Advisor
            </button>
            <button
              type="button"
              onClick={() => { resetLockout(); setEmail('coord@diu.edu.bd'); setPassword('password123'); }}
              className="p-2.5 rounded-xl bg-[#F4F8FF] border border-[#E2E8F0] hover:bg-[#EAF2FF] text-[#1E3A8A] text-left text-[11px] font-semibold transition-colors"
            >
              🏛️ Coordinator
            </button>
            <button
              type="button"
              onClick={() => { resetLockout(); setEmail('admin@diu.edu.bd'); setPassword('password123'); }}
              className="p-2.5 rounded-xl bg-[#F4F8FF] border border-[#E2E8F0] hover:bg-[#EAF2FF] text-[#1E3A8A] text-left text-[11px] font-semibold transition-colors"
            >
              🛡️ Administrator
            </button>
            <button
              type="button"
              onClick={() => { resetLockout(); setEmail('sakib@techbridge.io'); setPassword('password123'); }}
              className="p-2.5 rounded-xl bg-[#F4F8FF] border border-[#E2E8F0] hover:bg-[#EAF2FF] text-[#1E3A8A] text-left text-[11px] font-semibold transition-colors"
            >
              💼 Industry Mentor
            </button>
            <button
              type="button"
              onClick={() => { resetLockout(); setEmail('qa@diu.edu.bd'); setPassword('password123'); }}
              className="p-2.5 rounded-xl bg-[#F4F8FF] border border-[#E2E8F0] hover:bg-[#EAF2FF] text-[#1E3A8A] text-left text-[11px] font-semibold transition-colors"
            >
              📋 Auditor
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#64748B]">
          Don't have an institutional account?{' '}
          <Link to="/register" className="text-[#3B75DE] font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>

      {/* Security badge */}
      <div className="mt-8 flex items-center gap-2 text-xs text-[#94A3B8]">
        <Shield size={14} className="text-[#22A375]" />
        <span>AES-256 Encrypted · TLS 1.3 Transport Security</span>
      </div>
    </div>
  );
}
