'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ProtectedLink } from '@/components/ProtectedLink';
import { useTheme } from '@/context/ThemeContext';
import { Sprout, Menu, X, CloudSun, Leaf, FlaskConical, Bot, User, ShieldAlert, Moon, Sun, CalendarDays, Stethoscope, Store } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { isLoggedIn, user, logout, openAuthModal } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();

  const navLinks = [
    { href: '/dashboard', label: t.nav.dashboard, icon: Sprout },
    { href: '/weather', label: t.nav.weather, icon: CloudSun },
    { href: '/mandi', label: t.nav.mandi, icon: Store },
    { href: '/crop-advisor', label: t.nav.cropAdvisor, icon: Leaf },
    { href: '/soil-health', label: t.nav.soilHealth, icon: FlaskConical },
    { href: '/fertilizer-guide', label: t.nav.fertilizerGuide, icon: Sprout },
    { href: '/ai-assistant', label: t.nav.aiAssistant, icon: Bot },
    { href: '/farm-plan', label: 'Farm plan', icon: CalendarDays },
    { href: '/crop-doctor', label: 'Crop check', icon: Stethoscope },
    { href: '/admin', label: t.nav.admin, icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-emerald-100 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo with Official AgriMatter Logo Image */}
          <Link href="/" className="flex items-center space-x-2 py-1">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-white border border-emerald-200 shadow-sm flex items-center justify-center p-0.5">
              <Image
                src="/agrimatter-logo.jpg"
                alt="AgriMatter Logo"
                width={40}
                height={40}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="text-xl font-black text-agri-green-900 tracking-tight leading-none">AgriMatter</span>
              <span className="block text-[9px] font-bold text-agri-brown-700 uppercase tracking-wider mt-0.5">SMARTER FARMING</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <ProtectedLink
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-agri-green-100 text-agri-green-900'
                      : 'text-gray-700 hover:bg-emerald-50 hover:text-agri-green-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </ProtectedLink>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="hidden sm:flex items-center space-x-3">
            <LanguageToggle />
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-emerald-200 dark:border-slate-700 text-agri-green-800 dark:text-amber-300 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
              aria-label={mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {mounted && theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-agri-green-50 text-agri-green-900 border border-agri-green-200 text-xs font-bold hover:bg-agri-green-100"
                >
                  <User className="w-4 h-4 text-agri-green-700" />
                  <span>{user?.full_name || 'Farmer Profile'}</span>
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="px-4 py-2 text-xs font-bold text-white bg-agri-green-700 hover:bg-agri-green-800 rounded-xl transition"
              >
                {t.nav.login}
              </button>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center space-x-2 lg:hidden">
            <LanguageToggle />
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-agri-green-800 dark:text-amber-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800 focus:outline-none"
              aria-label={mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <ProtectedLink
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-bold ${
                  isActive ? 'bg-agri-green-700 text-white' : 'text-gray-800 hover:bg-emerald-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </ProtectedLink>
            );
          })}
          
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-sm font-bold text-gray-700 py-2"
            >
              <User className="w-5 h-5 text-agri-green-700" />
              <span>{user?.full_name || t.nav.profile}</span>
            </Link>

            {isLoggedIn ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                {t.nav.logout}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="text-xs font-bold text-agri-green-800"
              >
                {t.nav.login}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
