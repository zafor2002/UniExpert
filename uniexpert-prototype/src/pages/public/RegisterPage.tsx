import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Briefcase, LayoutDashboard, Shield, Eye,
  Lock, Mail, User, ChevronDown, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

type RoleKey = 'student' | 'faculty' | 'mentor' | 'coordinator' | 'admin' | 'auditor';

const ROLES: { key: RoleKey; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'student', label: 'Student', icon: <GraduationCap className="w-5 h-5" />, desc: 'B.Sc. / M.Sc. capstone researcher' },
  { key: 'faculty', label: 'Faculty Advisor', icon: <BookOpen className="w-5 h-5" />, desc: 'DIU academic supervisor' },
  { key: 'mentor', label: 'Industry Mentor', icon: <Briefcase className="w-5 h-5" />, desc: 'External industry expert' },
  { key: 'coordinator', label: 'Coordinator', icon: <LayoutDashboard className="w-5 h-5" />, desc: 'Department capstone coordinator' },
  { key: 'admin', label: 'Admin', icon: <Shield className="w-5 h-5" />, desc: 'Platform administrator' },
  { key: 'auditor', label: 'Auditor', icon: <Eye className="w-5 h-5" />, desc: 'Quality assurance & compliance' },
];

const DEPARTMENTS = [
  'Software Engineering',
  'Computer Science',
  'Electrical & Telecommunication Engineering',
  'Pharmacy',
  'Business Administration',
  'Textile Engineering',
  'Civil Engineering',
];

function getPasswordStrength(pwd: string): { level: number; label: string; color: string } {
  if (pwd.length === 0) return { level: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-[#FECACA]' };
  if (score === 2) return { level: 2, label: 'Fair', color: 'bg-[#FDE68A]' };
  if (score === 3) return { level: 3, label: 'Strong', color: 'bg-[#8AB4F8]' };
  return { level: 4, label: 'Very Strong', color: 'bg-[#A7E8D0]' };
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);

  function validateEmail(val: string) {
    setEmail(val);
    if (!val) {
      setEmailError('');
      return;
    }
    const isEdu = val.endsWith('.edu.bd') || val.endsWith('@techbridge.io') || val.endsWith('@diu.edu.bd');
    if (!isEdu) {
      setEmailError('Must be an institutional email ending in .edu.bd');
    } else {
      setEmailError('');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedRole) {
      toast.error('Please select your platform role.');
      return;
    }
    if (emailError) {
      toast.error('Registration failed: Email address already registered or invalid institutional domain.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (email === 'taken@diu.edu.bd') {
      toast.error('Registration failed: Email address already registered or invalid institutional domain.');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);

    toast.success('Account registered successfully. Please verify your institutional email.');
    navigate('/verify-email');
  }

  return (
    <div className="min-h-screen bg-[#F4F8FF] text-[#334155] flex flex-col items-center justify-center px-4 py-16">
      {/* Brand header */}
      <div className="text-center mb-8">
        <div 
          onClick={() => navigate('/')} 
          className="inline-flex items-center gap-2.5 cursor-pointer mb-2"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] border border-[#D5E5FD] flex items-center justify-center text-[#3B75DE] shadow-sm">
            <Sparkles size={20} />
          </div>
          <span className="text-2xl font-bold text-[#1E293B] tracking-tight">
            Uni<span className="text-[#3B75DE]">Expert</span>
          </span>
        </div>
        <p className="text-xs text-[#64748B]">Create your institutional academic research account</p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-card border border-[#E2E8F0] p-8 sm:p-10">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-[#1E293B]">Register New Account</h1>
          <p className="text-xs text-[#64748B] mt-1">Daffodil International University · Fall 2026 Term</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role selector */}
          <div>
            <label className="label">1. Select Institutional Role</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ROLES.map((r) => {
                const isSelected = selectedRole === r.key;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setSelectedRole(r.key)}
                    className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'border-[#8AB4F8] bg-[#EAF2FF] text-[#1E3A8A] font-semibold shadow-sm'
                        : 'border-[#E2E8F0] bg-[#F4F8FF]/60 hover:bg-[#F4F8FF] text-[#64748B]'
                    }`}
                  >
                    <span className={isSelected ? 'text-[#3B75DE]' : 'text-[#94A3B8]'}>{r.icon}</span>
                    <span className="text-xs font-semibold">{r.label}</span>
                    <span className="text-[10px] text-[#94A3B8] leading-tight">{r.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full name */}
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="e.g. Abu Zafor"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="label">Academic Department</label>
              <div className="relative">
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
                <select
                  className="input appearance-none pr-10"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  required
                >
                  <option value="">Select department…</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="label">Institutional Email (.edu.bd domain check)</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="email"
                className={`input pl-10 ${emailError ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="e.g. studentname@diu.edu.bd"
                value={email}
                onChange={e => validateEmail(e.target.value)}
                required
              />
            </div>
            {emailError && <p className="text-xs text-rose-600 mt-1 font-medium">{emailError}</p>}
          </div>

          {/* Password with strength meter */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-10 pr-10"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#334155]"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-10 pr-10"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Strength meter in pastel */}
            {password.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#64748B]">Password Strength:</span>
                  <span className="font-semibold text-[#1E293B]">{strength.label}</span>
                </div>
                <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4].map(idx => (
                    <div
                      key={idx}
                      className={`h-full flex-1 transition-all rounded-full ${
                        strength.level >= idx ? strength.color : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Privacy note */}
          <div className="p-3.5 rounded-2xl bg-[#F4F8FF] border border-[#E2E8F0] text-xs text-[#64748B] leading-relaxed">
            Proposals and institutional telemetry remain private until officially dispatched into the FSM queue.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-xs font-bold uppercase tracking-wider"
          >
            {loading ? 'Submitting Registration...' : 'Create Account & Verify Email'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#64748B]">
          Already have an institutional account?{' '}
          <Link to="/login" className="text-[#3B75DE] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
