'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { PhoneCall, Shield, HelpCircle, Users, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const teamMembers = [
    { name: 'Biswas Bhatt', role: 'Team Leader', initials: 'BB', tone: 'from-amber-400 to-orange-500' },
    { name: 'Aman Raj', role: 'Lead Programmer', initials: 'AR', tone: 'from-sky-400 to-blue-600' },
    { name: 'Vanshika Kaushik', role: 'Second Lead Programmer', initials: 'VK', tone: 'from-emerald-400 to-teal-600' },
    { name: 'Aaditya Pachauli', role: 'Researcher', initials: 'AP', tone: 'from-violet-400 to-indigo-600' },
    { name: 'Anshika', role: 'Presentation & Documentation', initials: 'A', tone: 'from-rose-400 to-pink-600' },
    { name: 'Bhavya', role: 'Presentation & Documentation', initials: 'B', tone: 'from-lime-400 to-green-600' },
  ];

  return (
    <footer className="bg-agri-brown-900 text-white border-t-4 border-agri-green-600 pt-10 pb-20 lg:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1 - Logo & Tagline */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-white p-0.5 border border-emerald-400 overflow-hidden flex items-center justify-center">
                <Image
                  src="/agrimatter-logo.jpg"
                  alt="AgriMatter Logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-xl font-black text-white tracking-tight">AgriMatter</span>
            </div>
            <p className="text-xs text-amber-100/80 leading-relaxed">
              {t.tagline}
            </p>
            <p className="text-[11px] text-emerald-300 font-medium">
              Smarter Farming. Brighter Tomorrow. Empowering Small & Marginal Farmers in India.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-3">Quick Services</h4>
            <ul className="space-y-2 text-xs text-amber-100">
              <li><Link href="/weather" className="hover:text-white transition">Weather & Irrigation Advisories</Link></li>
              <li><Link href="/mandi" className="hover:text-white transition">Official Mandi Prices</Link></li>
              <li><Link href="/crop-advisor" className="hover:text-white transition">Crop Suitability Calculator</Link></li>
              <li><Link href="/soil-health" className="hover:text-white transition">Soil pH & NPK Analysis</Link></li>
              <li><Link href="/fertilizer-guide" className="hover:text-white transition">Stage-Wise Fertilizer Guide</Link></li>
              <li><Link href="/ai-assistant" className="hover:text-white transition">Kisan AI Assistant</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-3">Kisan Helpline</h4>
            <div className="space-y-2 text-xs text-amber-100">
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Kisan Call Center: 1800-180-1551</span>
              </div>
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Support: support@agrimatter.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Soil Testing Labs Nearby</span>
              </div>
            </div>
          </div>

          {/* Col 4 - Safety Disclaimer */}
          <div className="bg-agri-brown-800/80 p-4 rounded-xl border border-amber-500/20">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Safety Disclaimer</h4>
            <p className="text-[11px] text-amber-100/90 leading-relaxed italic">
              {t.common.fertilizerDisclaimer}
            </p>
          </div>

        </div>

        {/* Team Credits */}
        <section className="team-showcase mb-8 rounded-2xl border border-emerald-400/20 bg-black/10 p-5 sm:p-6 overflow-hidden relative">
          <div className="absolute -right-16 -top-20 w-48 h-48 rounded-full border border-amber-300/10 team-orbit" />
          <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300 mb-2">
                <span className="team-signal-dot" />
                <Sparkles className="w-3.5 h-3.5" />
                Built with purpose
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Meet the AgriMatter Team</h3>
              <p className="text-xs text-amber-100/70 mt-1">The people bringing smarter farming support to life.</p>
            </div>
            <Users className="hidden sm:block w-8 h-8 text-emerald-300/60" />
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {teamMembers.map((member, index) => (
              <div
                key={member.name}
                className="team-credit-card group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3 hover:bg-white/[0.12] transition-colors"
                style={{ '--team-delay': `${index * 120}ms` } as React.CSSProperties}
              >
                <div className={`team-avatar flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${member.tone} text-xs font-black text-white shadow-lg`}>
                  {member.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">{member.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-300">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-amber-900/60 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-amber-200/60">
          <p>© {new Date().getFullYear()} AgriMatter Decision Support System. Smarter Farming. Brighter Tomorrow.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/admin" className="hover:underline">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
