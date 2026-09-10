'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { recommendCrops } from '@/lib/advisory-engine';
import { CropRecommendationResult } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CropDataGuide } from '@/components/CropDataGuide';
import { Leaf, CheckCircle2, Sparkles, BookOpen, Sliders } from 'lucide-react';

export default function CropAdvisorPage() {
  const { t, language } = useLanguage();
  const { farm } = useAuth();
  const isHi = language === 'hi';

  const [activeSection, setActiveSection] = useState<'guide' | 'advisor'>('guide');

  const [soilType, setSoilType] = useState(farm?.soil_type || 'Loam');
  const [irrigation, setIrrigation] = useState(farm?.irrigation_type || 'Borewell');
  const [season, setSeason] = useState<'Kharif' | 'Rabi' | 'Zaid'>('Rabi');

  const [results, setResults] = useState<CropRecommendationResult[]>(() => 
    recommendCrops(soilType, irrigation, season)
  );

  const handleCalculate = () => {
    const res = recommendCrops(soilType, irrigation, season);
    setResults(res);
  };

  return (
    <div className="space-y-6 py-2">
      <section className="relative overflow-hidden rounded-[30px] border border-emerald-200 bg-gradient-to-br from-emerald-900 via-emerald-800 to-agri-brown-900 p-6 text-white shadow-xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.2),transparent_20%),radial-gradient(circle_at_bottom_left,_rgba(110,231,183,0.22),transparent_25%)]" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-700/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">
              <Leaf className="h-3.5 w-3.5 text-amber-300" />
              Smart Crop Planning
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                {t.cropAdvisorPage.title}
              </h1>
              <p className="mt-2 max-w-xl text-xs font-medium text-emerald-100/90 sm:text-sm">
                {isHi 
                  ? 'फसल चयन सलाहकार, NPK पोषण कैलकुलेटर एवं कृषि ज्ञानकोश'
                  : 'Crop suitability calculator, agronomic reference guide, and fertilizer dosage advisor'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:min-w-[280px]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <div className="text-xl font-black">{season}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-100/80">Season</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <div className="text-xl font-black">{soilType}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-100/80">Soil</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <div className="text-xl font-black">{irrigation}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-100/80">Water</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Header & Section Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-green-500" />

        <div className="flex self-start rounded-2xl border border-emerald-200 bg-emerald-100/70 p-1 shadow-sm sm:self-auto dark:bg-slate-800">
          <button
            onClick={() => setActiveSection('guide')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
              activeSection === 'guide'
                ? 'bg-agri-green-800 text-white shadow-sm'
                : 'text-gray-700 hover:text-agri-green-900 dark:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isHi ? 'फसल गाइड' : 'Crop Data Guide'}</span>
          </button>

          <button
            onClick={() => setActiveSection('advisor')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
              activeSection === 'advisor'
                ? 'bg-agri-green-800 text-white shadow-sm'
                : 'text-gray-700 hover:text-agri-green-900 dark:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{isHi ? 'फसल सलाहकार' : 'Crop Match Calculator'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Sections */}
      {activeSection === 'guide' ? (
        <CropDataGuide />
      ) : (
        <div className="space-y-6">
          
          {/* Input Selector Card */}
          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/60 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Field Settings</p>
                <h3 className="mt-1 text-lg font-black text-agri-green-900">Match your crop profile</h3>
              </div>
              <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                Live analysis
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-extrabold text-agri-green-900">{t.common.soilType}</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs font-bold text-gray-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="Loam">Loam (दोमट)</option>
                  <option value="Clay">Clay (चिकनी)</option>
                  <option value="Sandy">Sandy (बलुई)</option>
                  <option value="Black">Black Soil (काली)</option>
                  <option value="Red">Red Soil (लाल)</option>
                  <option value="Alluvial">Alluvial (जलोढ़)</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-extrabold text-agri-green-900">{t.common.irrigation}</label>
                <select
                  value={irrigation}
                  onChange={(e) => setIrrigation(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs font-bold text-gray-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="Borewell">Borewell (ट्यूबवेल)</option>
                  <option value="Rainfed">Rainfed (वर्षा आधारित)</option>
                  <option value="Canal">Canal (नहर)</option>
                  <option value="Drip">Drip (ड्रिप)</option>
                  <option value="Sprinkler">Sprinkler (फव्वारा)</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-extrabold text-agri-green-900">{t.cropAdvisorPage.seasonLabel}</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs font-bold text-gray-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="Rabi">Rabi (रबी - Winter)</option>
                  <option value="Kharif">Kharif (खरीफ - Monsoon)</option>
                  <option value="Zaid">Zaid (जायद - Summer)</option>
                </select>
              </div>
            </div>

            <Button onClick={handleCalculate} fullWidth size="md" className="mt-4">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>{t.cropAdvisorPage.recommendBtn}</span>
            </Button>
          </Card>

          {/* Results List */}
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-agri-green-900">
                {language === 'hi' ? 'सिफारिश किए गए परिणाम' : 'Suitability Results'}
              </h3>
              <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800">
                {results.length} options
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {results.map((res, idx) => {
                const isTop = idx === 0;
                return (
                  <Card
                    key={res.crop.id}
                    className={`space-y-3 transition-all duration-200 ${isTop ? 'border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 via-white to-amber-50 shadow-lg shadow-emerald-100/60' : 'border-gray-200 bg-white/90'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white shadow-sm ${
                          res.matchScore >= 75 ? 'bg-gradient-to-br from-agri-green-700 to-emerald-600' : 'bg-gradient-to-br from-amber-500 to-yellow-600'
                        }`}>
                          <Leaf className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-agri-green-900">{res.crop.name}</h4>
                          <span className="text-[10px] font-bold text-gray-500">{res.crop.season} Season</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-sm font-black ${res.matchScore >= 75 ? 'text-agri-green-800' : 'text-amber-800'}`}>
                          {res.matchScore}% {t.cropAdvisorPage.matchPercent}
                        </span>
                        <Badge variant={res.matchScore >= 75 ? 'green' : 'amber'} className="mt-1 block">
                          {res.suitability} Fit
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-gray-600">{res.crop.description}</p>

                    <div className="rounded-2xl border border-emerald-100 bg-white p-3 shadow-inner shadow-emerald-50">
                      <span className="mb-2 block text-[11px] font-extrabold text-agri-green-900">Why this crop?</span>
                      <div className="space-y-2">
                        {res.reasons[language].map((r, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-2 text-xs text-gray-700">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-agri-green-700" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {isTop && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-900">
                        Top recommendation
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>

        </div>
      )}

    </div>
  );
}
