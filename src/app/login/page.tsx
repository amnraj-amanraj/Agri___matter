'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Phone, Mail, Lock, KeyRound, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function LoginPage() {
  const { t, language } = useLanguage();
  const { sendOtp, verifyOtp, loginWithEmail } = useAuth();
  const router = useRouter();

  const [authTab, setAuthTab] = useState<'phone' | 'email'>('phone');

  // Phone OTP state
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Email / Pass state
  const [email, setEmail] = useState('farmer@agrimatter.in');
  const [password, setPassword] = useState('123456');

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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setStatusMsg({ type: 'error', text: language === 'hi' ? 'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number' });
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
      setOtp('123456');
      setStatusMsg({ type: 'success', text: res.message });
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setStatusMsg({ type: 'error', text: language === 'hi' ? 'कृपया 6 अंकों का ओटीपी दर्ज करें' : 'Please enter 6-digit OTP' });
      return;
    }

    setLoading(true);
    setStatusMsg(null);

    const res = await verifyOtp(phone, otp);
    setLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    const res = await loginWithEmail(email, password);
    setLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 space-y-6">
      
      {/* Header with Official Logo */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-white p-1 border border-emerald-300 mx-auto shadow-md flex items-center justify-center overflow-hidden">
          <Image
            src="/agrimatter-logo.jpg"
            alt="AgriMatter Logo"
            width={64}
            height={64}
            className="h-full w-full object-contain"
          />
        </div>
        <h1 className="text-2xl font-black text-agri-green-900">
          {language === 'hi' ? 'किसान खाता लॉग इन' : 'Farmer Auth Login'}
        </h1>
        <p className="text-xs text-gray-600 font-semibold">
          {language === 'hi' ? 'मोबाइल नंबर ओटीपी या ईमेल द्वारा लॉग इन करें' : 'Authenticate via Mobile Phone OTP or Email & Password'}
        </p>
      </div>

      <Card className="shadow-lg border-emerald-200">

        {/* Auth Method Switcher */}
        <div className="flex bg-emerald-50 p-1 rounded-xl mb-6 border border-emerald-100">
          <button
            type="button"
            onClick={() => { setAuthTab('phone'); setStatusMsg(null); }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition ${
              authTab === 'phone' ? 'bg-white text-agri-green-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Phone OTP</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthTab('email'); setStatusMsg(null); }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition ${
              authTab === 'email' ? 'bg-white text-agri-green-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </button>
        </div>
        
        {statusMsg && (
          <Alert type={statusMsg.type === 'success' ? 'info' : 'error'} className="mb-4">
            <span>{statusMsg.text}</span>
          </Alert>
        )}

        {authTab === 'phone' && (
          step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-agri-green-900 mb-1">
                  {language === 'hi' ? 'मोबाइल नंबर (+91)' : 'Mobile Phone Number (+91)'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-agri-green-800 font-bold text-xs">
                    +91
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-agri-green-600 text-sm font-bold tracking-wider"
                  />
                </div>
              </div>

              <Button type="submit" size="lg" fullWidth disabled={loading}>
                <span>{loading ? (language === 'hi' ? 'भेजा जा रहा है...' : 'Sending OTP...') : (language === 'hi' ? 'ओटीपी भेजें (Send OTP)' : 'Send Phone OTP')}</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                <span className="text-gray-600 font-semibold">Sent to: <strong className="text-agri-green-900">+91 {phone}</strong></span>
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setStatusMsg(null); }}
                  className="text-xs font-bold text-agri-green-800 hover:underline"
                >
                  Edit Number
                </button>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-agri-green-900 mb-1">
                  {language === 'hi' ? '6 अंकों का ओटीपी कोड' : 'Enter 6-Digit OTP Code'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-agri-green-600 text-base font-black tracking-widest text-center"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1 italic">
                  💡 Demo Testing OTP: <strong className="text-agri-green-800">123456</strong>
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-gray-500 font-semibold">
                  {canResend ? (language === 'hi' ? 'ओटीपी नहीं मिला?' : "Didn't receive code?") : `Resend in ${timer}s`}
                </span>
                <button
                  type="button"
                  disabled={!canResend}
                  onClick={handleSendOtp}
                  className={`font-bold flex items-center space-x-1 ${
                    canResend ? 'text-agri-green-800 hover:underline' : 'text-gray-400 pointer-events-none'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend OTP</span>
                </button>
              </div>

              <Button type="submit" size="lg" fullWidth disabled={loading}>
                <ShieldCheck className="w-5 h-5 mr-2" />
                <span>{loading ? (language === 'hi' ? 'जाँच हो रही है...' : 'Verifying...') : (language === 'hi' ? 'ओटीपी सत्यापित करें' : 'Verify OTP & Log In')}</span>
              </Button>
            </form>
          )
        )}

        {authTab === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-agri-green-900 mb-1">
                  {language === 'hi' ? 'ईमेल पता' : 'Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@agrimatter.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-agri-green-600 text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-agri-green-900 mb-1">
                {language === 'hi' ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-agri-green-600 text-sm font-bold"
                />
              </div>
            </div>

            <Button type="submit" size="lg" fullWidth disabled={loading}>
              <ShieldCheck className="w-5 h-5 mr-2" />
              <span>{loading ? 'Authenticating...' : 'Sign In with Email'}</span>
            </Button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-600">
            {language === 'hi' ? 'नया खाता बनाना चाहते हैं?' : "Don't have a farm account?"}{' '}
            <Link href="/signup" className="font-extrabold text-agri-green-800 hover:underline">
              {t.nav.signup}
            </Link>
          </p>
        </div>

      </Card>

    </div>
  );
}
