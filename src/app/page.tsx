'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';

import { ProtectedLink } from '@/components/ProtectedLink';
import { FAQSection } from '@/components/FAQSection';
import { StateFarmExplorer } from '@/components/StateFarmExplorer';
import { VoiceFeatureGuide } from '@/components/VoiceFeatureGuide';
import { 
  Sprout, 
  CloudSun, 
  Leaf, 
  FlaskConical, 
  Bot, 
  ArrowRight, 
  Award,
  Store
} from 'lucide-react';

export default function LandingPage() {
  const { t, language } = useLanguage();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    let animationContext: any;
    import('gsap').then(({ default: gsap }) => {
      animationContext = gsap.context(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const hero = page.querySelector('[data-gsap="hero"]');
        const alert = page.querySelector('[data-gsap="alert"]');
        const heroItems = gsap.utils.toArray<HTMLElement>('[data-gsap="hero-item"]');
        const heroSweep = page.querySelector('[data-gsap="hero-sweep"]');
        const cards = gsap.utils.toArray<HTMLElement>('[data-gsap="feature-card"]');
        const icons = gsap.utils.toArray<HTMLElement>('[data-gsap="feature-icon"]');

        if (reduceMotion) {
          gsap.set([hero, alert, ...heroItems, heroSweep, ...cards, ...icons], { clearProps: 'all' });
          return;
        }

        const introTimeline = gsap.timeline();
        introTimeline
          .fromTo(hero, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' })
          .fromTo(heroItems, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' }, '-=0.35')
          .fromTo(alert, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.12')
          .fromTo(cards, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out' }, '-=0.18');

        gsap.to(heroSweep, {
          xPercent: 180,
          duration: 3.8,
          repeat: -1,
          repeatDelay: 2.8,
          ease: 'power1.inOut',
        });

        const handleEnter = (event: Event) => {
          gsap.to(event.currentTarget, { y: -6, duration: 0.22, ease: 'power2.out' });
        };
        const handleLeave = (event: Event) => {
          gsap.to(event.currentTarget, { y: 0, duration: 0.28, ease: 'power2.out' });
        };
        const handleIconEnter = (event: Event) => {
          gsap.to(event.currentTarget, { rotate: 8, scale: 1.12, duration: 0.25, ease: 'back.out(2)' });
        };
        const handleIconLeave = (event: Event) => {
          gsap.to(event.currentTarget, { rotate: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
        };

        cards.forEach((card) => {
          card.addEventListener('mouseenter', handleEnter);
          card.addEventListener('mouseleave', handleLeave);
        });
        icons.forEach((icon) => {
          icon.addEventListener('mouseenter', handleIconEnter);
          icon.addEventListener('mouseleave', handleIconLeave);
        });

        return () => {
          introTimeline.kill();
          gsap.killTweensOf(heroSweep);
          cards.forEach((card) => {
            card.removeEventListener('mouseenter', handleEnter);
            card.removeEventListener('mouseleave', handleLeave);
          });
          icons.forEach((icon) => {
            icon.removeEventListener('mouseenter', handleIconEnter);
            icon.removeEventListener('mouseleave', handleIconLeave);
          });
        };
      }, page);
    });

    return () => animationContext?.revert();
  }, []);

  const features = [
    {
      icon: CloudSun,
      title: t.features.weatherTitle,
      desc: t.features.weatherDesc,
      href: "/weather",
      badge: "Open-Meteo API"
    },
    {
      icon: Store,
      title: t.nav.mandi,
      desc: language === 'hi' ? 'राज्य, जिला और फसल चुनकर आधिकारिक मंडी भाव देखें।' : 'Check official market prices by state, district, and crop.',
      href: "/mandi",
      badge: "Agmarknet API"
    },
    {
      icon: Leaf,
      title: t.features.cropTitle,
      desc: t.features.cropDesc,
      href: "/crop-advisor",
      badge: "Kharif / Rabi / Zaid"
    },
    {
      icon: FlaskConical,
      title: t.features.soilTitle,
      desc: t.features.soilDesc,
      href: "/soil-health",
      badge: "pH & NPK Rules"
    },
    {
      icon: Sprout,
      title: t.features.fertilizerTitle,
      desc: t.features.fertilizerDesc,
      href: "/fertilizer-guide",
      badge: "Stage-Wise"
    },
    {
      icon: Bot,
      title: t.features.aiTitle,
      desc: t.features.aiDesc,
      href: "/ai-assistant",
      badge: "Voice & Text"
    }
  ];

  return (
    <div ref={pageRef} className="space-y-16 py-4">
      {/* Hero Section */}
      <section data-gsap="hero" className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-agri-green-900 via-agri-green-800 to-agri-brown-900 text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-emerald-700/80">
        <div data-gsap="hero-sweep" className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/4 -skew-x-12 bg-white/10 blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),transparent_20%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.22),transparent_28%)]" />
        <div className="relative z-10 max-w-4xl space-y-6">
          <div data-gsap="hero-item" className="inline-flex items-center space-x-2 bg-emerald-800/80 px-3.5 py-1.5 rounded-full border border-emerald-500/30 text-xs font-bold text-emerald-200 shadow-inner shadow-emerald-950/20">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Kisan Support System for Indian Farmers</span>
          </div>

          <div className="space-y-4">
            <h1 data-gsap="hero-item" className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-2xl">
              {t.hero.title}
            </h1>

            <p data-gsap="hero-item" className="max-w-2xl text-base sm:text-xl text-emerald-100/90 font-medium leading-relaxed">
              {t.hero.subtitle}
            </p>
          </div>

          <div data-gsap="hero-item" className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-lg shadow-emerald-950/20">
            <p className="text-sm font-bold text-amber-300">
              {t.hero.farmerGreeting} - {language === 'hi' ? 'आज का अलर्ट: कल बारिश की संभावना है। आज छिड़काव (spraying) से बचें।' : 'Today Alert: Rain expected tomorrow. Avoid spraying today.'}
            </p>
          </div>

          <div data-gsap="hero-item" className="flex flex-col sm:flex-row gap-3 pt-2">
            <ProtectedLink href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-black font-extrabold shadow-lg">
                {t.hero.getStarted}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </ProtectedLink>
            <Link href="/onboarding">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                {t.nav.onboarding}
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
            <div className="text-2xl font-black text-white">24/7</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">Advisory</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
            <div className="text-2xl font-black text-white">18+</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">Crops</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
            <div className="text-2xl font-black text-white">AI</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">Assistant</div>
          </div>
        </div>
      </section>

      <VoiceFeatureGuide language={language} />

      {/* Mandatory Safety Alert Box */}
      <div data-gsap="alert">
        <Alert type="warning" title={t.common.disclaimerTitle}>
          {t.common.fertilizerDisclaimer}
        </Alert>
      </div>

      {/* Feature Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-agri-green-900 tracking-tight">
            {language === 'hi' ? 'किसानों के लिए आवश्यक सुविधाएं' : 'Key Farming Features'}
          </h2>
          <p className="text-sm font-semibold text-gray-600">
            {language === 'hi' ? 'आपकी फसल, मौसम और मिट्टी के अनुसार त्वरित मार्गदर्शन' : 'Instant guidance tailored to your crop, weather, and soil conditions'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} data-gsap="feature-card">
                <Card className="group relative flex h-full flex-col justify-between overflow-hidden border-emerald-100 bg-gradient-to-br from-white to-emerald-50/60 transition-all duration-200 hover:border-emerald-300 hover:shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div data-gsap="feature-icon" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-agri-green-100 to-emerald-200 text-agri-green-800 shadow-inner shadow-emerald-200/60">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em] text-amber-900">
                        {f.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-black text-agri-green-900">{f.title}</h3>
                      <p className="text-xs leading-relaxed text-gray-600">{f.desc}</p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <ProtectedLink href={f.href} className="inline-flex items-center text-xs font-extrabold text-agri-green-700 transition hover:text-agri-green-900">
                      <span>{t.common.viewDetails}</span>
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </ProtectedLink>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-sm space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-agri-green-900">
            {t.howItWorks.title}
          </h2>
          <p className="text-xs text-gray-500 font-semibold">
            {language === 'hi' ? '4 आसान चरणों में बेहतर पैदावार हासिल करें' : 'Achieve better yield in 4 simple steps'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: t.howItWorks.step1, desc: t.howItWorks.step1Desc },
            { step: t.howItWorks.step2, desc: t.howItWorks.step2Desc },
            { step: t.howItWorks.step3, desc: t.howItWorks.step3Desc },
            { step: t.howItWorks.step4, desc: t.howItWorks.step4Desc }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
              <span className="text-xs font-black text-agri-green-700 block uppercase">Step {idx + 1}</span>
              <h4 className="text-base font-extrabold text-agri-green-900">{item.step}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <StateFarmExplorer language={language} />

      <FAQSection initialLanguage={language} />

    </div>
  );
}
