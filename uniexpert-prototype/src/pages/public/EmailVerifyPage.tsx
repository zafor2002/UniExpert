import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, Clock, AlertTriangle, ArrowLeft, Smartphone, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';

const MOCK_TOKEN = 'A7F3B2';
const EXPIRY_HOURS = 24;

function formatTimeLeft(ms: number) {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ─── Email Verify Page ───────────────────────────────────────────────────────

export function EmailVerifyPage() {
  const navigate = useNavigate();

  const [inputToken, setInputToken] = useState('');
  const [resending, setResending] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [expiryMs, setExpiryMs] = useState(EXPIRY_HOURS * 3600 * 1000);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isExpired) return;
    intervalRef.current = setInterval(() => {
      setExpiryMs(prev => {
        const next = prev - 1000;
        if (next <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsExpired(true);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isExpired]);

  async function handleResend() {
    setResending(true);
    await new Promise(r => setTimeout(r, 1200));
    setResending(false);
    setIsExpired(false);
    setExpiryMs(EXPIRY_HOURS * 3600 * 1000);
    toast.success('Verification email resent. Check your inbox.');
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (isExpired) { toast.error('Token has expired. Please request a new one.'); return; }
    if (inputToken.trim().toUpperCase() === MOCK_TOKEN) {
      toast.success('Email verified. You can now log in.');
      navigate('/login');
    } else {
      toast.error('Invalid verification token. Try again.');
    }
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
        <p className="text-xs text-[#64748B]">Institutional Security & Verification</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-card border border-[#E2E8F0] p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#EAF2FF] text-[#3B75DE] border border-[#D5E5FD] mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#1E293B]">Verify Your Email</h1>
          <p className="text-xs text-[#64748B] mt-1">
            A 6-character token has been dispatched to your institutional address.
          </p>
        </div>

        {/* Expiry status */}
        {isExpired ? (
          <div className="mb-6 p-4 rounded-2xl border border-[#FECACA] bg-[#FEE2E2] text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#991B1B] text-xs font-semibold mb-2">
              <AlertTriangle className="w-3.5 h-3.5" /> EXPIRED
            </span>
            <p className="text-xs text-[#991B1B] font-medium">Your 24-hour verification token has expired.</p>
            <p className="text-[11px] text-[#991B1B] mt-0.5">Please generate a fresh token to complete registration.</p>
          </div>
        ) : (
          <div className="mb-6 p-4 rounded-2xl border border-[#D5E5FD] bg-[#EAF2FF]">
            <p className="text-[10px] text-[#1E3A8A] text-center mb-2.5 font-bold uppercase tracking-wider">
              24-Hour Active Security Token
            </p>
            <div className="flex justify-center gap-2 mb-3">
              {MOCK_TOKEN.split('').map((ch, i) => (
                <div key={i} className="w-9 h-11 rounded-xl bg-white border border-[#B0CFFB] flex items-center justify-center text-lg font-mono font-bold text-[#1E3A8A] shadow-sm">
                  {ch}
                </div>
              ))}
            </div>
            {/* Countdown */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748B]">
              <Clock className="w-3.5 h-3.5" />
              <span>Token valid for: <span className="font-mono font-bold text-[#1E293B]">{formatTimeLeft(expiryMs)}</span></span>
            </div>
          </div>
        )}

        {/* Form */}
        {!isExpired ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="label">Enter Token to Confirm</label>
              <input
                type="text"
                className="input text-center tracking-widest uppercase font-mono text-base font-bold"
                placeholder="A7F3B2"
                value={inputToken}
                onChange={e => setInputToken(e.target.value.toUpperCase())}
                maxLength={6}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full py-3 text-xs font-bold uppercase tracking-wider">
              <CheckCircle className="w-4 h-4" /> Verify Email Address
            </button>
          </form>
        ) : (
          <button onClick={handleResend} className="btn-primary w-full py-3 text-xs font-bold uppercase tracking-wider" disabled={resending}>
            {resending ? 'Requesting...' : 'Request New Token'}
          </button>
        )}

        {/* Resend actions */}
        {!isExpired && (
          <div className="mt-4 flex flex-col gap-2.5 items-center">
            <button
              onClick={handleResend}
              disabled={resending}
              className="btn-secondary text-xs w-full justify-center"
            >
              {resending ? 'Sending...' : 'Resend Token'}
            </button>
            <button
              type="button"
              onClick={() => { setIsExpired(true); setExpiryMs(0); }}
              className="text-[11px] text-[#64748B] hover:text-[#334155] underline"
            >
              Simulate Token Expiry
            </button>
          </div>
        )}

        <div className="mt-6 text-center border-t border-[#E2E8F0] pt-4">
          <Link to="/login" className="text-xs text-[#3B75DE] font-semibold hover:underline inline-flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── MFA Page ────────────────────────────────────────────────────────────────

export function MfaPage() {
  const navigate = useNavigate();
  const { submitMfa } = useApp();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = submitMfa(code);
    setLoading(false);

    if (result.success) {
      toast.success('MFA verified. Authentication complete.');
      navigate('/coordinator/dashboard');
    } else {
      toast.error('Invalid MFA code. Try 123456 for demo.');
    }
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
        <p className="text-xs text-[#64748B]">Privileged Access Multi-Factor Authentication</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-card border border-[#E2E8F0] p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] mb-3">
            <Smartphone className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#1E293B]">TOTP Verification</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Required for Administrative & Coordinator accounts.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="label text-center">6-Digit Authenticator Code</label>
            <input
              type="text"
              className="input text-center tracking-widest font-mono text-xl py-3 font-bold"
              placeholder="123456"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 text-xs font-bold uppercase tracking-wider"
            disabled={loading || code.length < 6}
          >
            {loading ? 'Validating...' : 'Verify & Continue'}
          </button>
        </form>

        <div className="mt-5 p-3 rounded-2xl bg-[#EAF2FF] border border-[#D5E5FD] text-center">
          <p className="text-xs text-[#1E3A8A]">
            🧪 Demo code: <code className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-[#B0CFFB]">123456</code>
          </p>
        </div>

        <div className="mt-6 text-center border-t border-[#E2E8F0] pt-4">
          <Link to="/login" className="text-xs text-[#3B75DE] font-semibold hover:underline inline-flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EmailVerifyPage;
