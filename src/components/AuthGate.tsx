'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Phone, Mail, Lock, KeyRound, ArrowRight, ShieldCheck, RefreshCw, UserCheck, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export function AuthGate() {
  const { authModalOpen, closeAuthModal, sendOtp, verifyOtp, loginWithEmail, signUpWithEmail, isLoggedIn } = useAuth();
  const { language } = useLanguage();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [authTab, setAuthTab] = useState<'phone' | 'email'>('phone');

  // Phone OTP state
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!authModalOpen || isLoggedIn) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setStatusMsg({
        type: 'error',
        text: language === 'hi' ? 'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number'
      });
      return;
    }

    setLoading(true);
    setStatusMsg(null);

    const res = await sendOtp(phone);
    setLoading(false);

    if (res.success) {
      setStep('otp');
      setTimer(30);
      setCanResend(false);
      setStatusMsg({ type: 'success', text: res.message });
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setStatusMsg({
        type: 'error',
        text: language === 'hi' ? 'कृपया 6 अंकों का ओटीपी दर्ज करें' : 'Please enter 6-digit OTP'
      });
      return;
    }

    setLoading(true);
    setStatusMsg(null);

    const res = await verifyOtp(phone, otp, fullName || undefined);
    setLoading(false);

    if (res.success) {
      closeAuthModal();
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    if (mode === 'signup') {
      if (!fullName) {
        setStatusMsg({
          type: 'error',
          text: language === 'hi' ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your full name'
        });
        setLoading(false);
        return;
      }
      const res = await signUpWithEmail(email, password, fullName);
      setLoading(false);
      if (res.success) {
        closeAuthModal();
      } else {
        setStatusMsg({ type: 'error', text: res.message });
      }
    } else {
      const res = await loginWithEmail(email, password);
      setLoading(false);
      if (res.success) {
        closeAuthModal();
      } else {
        setStatusMsg({ type: 'error', text: res.message });
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-gate-title"
    >
      <div className="w-full max-w-md rounded-3xl border border-emerald-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-white border border-emerald-300 shadow-sm flex items-center justify-center p-0.5">
              <Image src="/agrimatter-logo.jpg" alt="AgriMatter" width={40} height={40} className="h-full w-full object-contain" />
            </div>
            <div>
              <h2 id="auth-gate-title" className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                {mode === 'login' 
                  ? (language === 'hi' ? 'किसान खाता लॉग इन' : 'Farmer Login') 
                  : (language === 'hi' ? 'नया खाता बनाएं' : 'Create Account')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'hi' ? 'AgriMatter में आपका स्वागत है' : 'Welcome to AgriMatter'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            aria-label="Close login prompt"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Switcher: Login vs Sign Up */}
        <div className="mt-5 flex rounded-2xl bg-emerald-50 p-1 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700">
          <button
            type="button"
            onClick={() => { setMode('login'); setStatusMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 ${
              mode === 'login'
                ? 'bg-white text-agri-green-900 shadow dark:bg-slate-900 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'लॉग इन' : 'Log In'}</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setStatusMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 ${
              mode === 'signup'
                ? 'bg-white text-agri-green-900 shadow dark:bg-slate-900 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'साइन अप (रजिस्टर)' : 'Sign Up'}</span>
          </button>
        </div>

        {/* Auth Method Switcher: Phone vs Email */}
        <div className="mt-3 flex space-x-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => { setAuthTab('phone'); setStatusMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 ${
              authTab === 'phone'
                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone OTP</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthTab('email'); setStatusMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 ${
              authTab === 'email'
                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
        </div>

        {/* Alerts */}
        {statusMsg && (
          <Alert type={statusMsg.type === 'success' ? 'info' : 'error'} className="mt-3 text-xs">
            <span>{statusMsg.text}</span>
          </Alert>
        )}

        {/* Phone OTP Auth */}
        {authTab === 'phone' && (
          step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="mt-4 space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'hi' ? 'जैसे: रमेश कुमार' : 'e.g. Ramesh Kumar'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'मोबाइल नंबर (+91)' : 'Mobile Phone (+91)'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-700 dark:text-slate-300 font-bold text-xs">
                    +91
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold tracking-wider text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <Button type="submit" size="lg" fullWidth disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black">
                <span>{loading ? (language === 'hi' ? 'भेजा जा रहा है...' : 'Sending OTP...') : (language === 'hi' ? 'ओटीपी भेजें' : 'Send Phone OTP')}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="mt-4 space-y-4">
              <div className="p-2.5 bg-emerald-50 dark:bg-slate-800 rounded-xl border border-emerald-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Sent to: <strong className="text-emerald-700 dark:text-emerald-400">+91 {phone}</strong></span>
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setStatusMsg(null); }}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  Edit Number
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? '6 अंकों का ओटीपी कोड' : 'Enter 6-Digit OTP Code'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-black tracking-widest text-center text-slate-900 dark:text-white"
                  />
                </div>
                {!process.env.NEXT_PUBLIC_SUPABASE_URL && (
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    Demo mode: enter any six-digit code. Configure Supabase SMS before production.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 font-medium">
                  {canResend ? (language === 'hi' ? 'ओटीपी नहीं मिला?' : "Didn't receive code?") : `Resend in ${timer}s`}
                </span>
                <button
                  type="button"
                  disabled={!canResend}
                  onClick={handleSendOtp}
                  className={`font-bold flex items-center space-x-1 ${
                    canResend ? 'text-emerald-600 hover:underline' : 'text-slate-400 pointer-events-none'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend OTP</span>
                </button>
              </div>

              <Button type="submit" size="lg" fullWidth disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black">
                <ShieldCheck className="w-4 h-4 mr-2" />
                <span>{loading ? (language === 'hi' ? 'जाँच हो रही है...' : 'Verifying...') : (language === 'hi' ? 'ओटीपी सत्यापित करें' : 'Verify OTP & Log In')}</span>
              </Button>
            </form>
          )
        )}

        {/* Email Auth */}
        {authTab === 'email' && (
          <form onSubmit={handleEmailAuth} className="mt-4 space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={language === 'hi' ? 'जैसे: रमेश कुमार' : 'e.g. Ramesh Kumar'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'hi' ? 'ईमेल पता' : 'Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@agrimatter.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'hi' ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <Button type="submit" size="lg" fullWidth disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black">
              <ShieldCheck className="w-4 h-4 mr-2" />
              <span>
                {loading
                  ? (language === 'hi' ? 'प्रक्रिया चालू है...' : 'Processing...')
                  : mode === 'signup'
                  ? (language === 'hi' ? 'खाता बनाएं' : 'Create Account')
                  : (language === 'hi' ? 'लॉग इन करें' : 'Log In')}
              </span>
            </Button>
          </form>
        )}

        {/* Footer options */}
        <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={closeAuthModal}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-bold transition"
          >
            {language === 'hi' ? 'वेबसाइट देखें (Guest Mode)' : 'Continue as Guest'}
          </button>
        </div>

      </div>
    </div>
  );
}
