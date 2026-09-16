'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { fetchWeatherForFarm } from '@/lib/weather-client';
import { getFertilizerAdvice, evaluateSoilHealth } from '@/lib/advisory-engine';
import { WeatherForecast } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DashboardInsights } from '@/components/DashboardInsights';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Sprout, 
  FlaskConical, 
  Leaf, 
  Bot, 
  ArrowRight,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const { user, farm, activeCrop } = useAuth();

  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const location = [user?.village, user?.district, user?.state].filter(Boolean).join(', ');
        const data = await fetchWeatherForFarm(farm?.latitude || 29.34, farm?.longitude || 79.56, location);
        setWeather(data);
      } catch (err) {
        console.error("Dashboard weather fetch error", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [farm, user]);

  const fertilizerAdvice = getFertilizerAdvice(
    activeCrop?.crop_name || 'Wheat',
    activeCrop?.crop_stage || 'Vegetative'
  );

  const soilAdvice = evaluateSoilHealth(6.8, 220, 22, 180);

  if (loading) {
    return <LoadingSpinner label={t.common.loading} />;
  }

  return (
    <div className="space-y-6 py-2">
      {/* Top Banner Greeting */}
      <div className="bg-gradient-to-r from-agri-green-800 to-agri-green-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-emerald-200 border border-white/10">
            <MapPin className="w-3.5 h-3.5" />
            <span>{user?.village || 'Samrala'}, {user?.district || 'Ludhiana'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {language === 'hi' ? `नमस्ते, ${user?.full_name || 'रमेश'} जी` : `Namaste, ${user?.full_name || 'Ramesh'} ji`}
          </h1>
          <p className="text-xs text-emerald-100/80 font-medium">
            {language === 'hi' ? 'आज का खेती बुलेटिन और मौसम रिपोर्ट' : 'Your daily personalized farm decision portal'}
          </p>
        </div>

        <Link href="/ai-assistant">
          <Button variant="amber" size="md" className="font-extrabold shadow">
            <Bot className="w-5 h-5 mr-2" />
            <span>{t.common.askQuestion}</span>
          </Button>
        </Link>
      </div>

      {/* Weather Alert Banner */}
      <Alert type="warning" title={t.dashboard.weatherAlertHeader}>
        <p className="font-bold text-sm text-amber-950">
          {weather?.farmingAdvice[language] || t.dashboard.sprayingAdvice}
        </p>
      </Alert>

      {weather && (
        <DashboardInsights
          weather={weather}
          activeCrop={activeCrop}
          language={language}
        />
      )}

      {/* Weather Overview Widget */}
      <Card className="bg-gradient-to-br from-sky-50 to-emerald-50/30 border-sky-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sky-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold shadow-md">
              <CloudSun className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-agri-green-900">{t.nav.weather}</h3>
              <p className="text-xs text-gray-500 font-semibold">{weather?.location}</p>
            </div>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-black text-agri-green-900">{weather?.current.temp}°C</span>
            <span className="text-xs font-bold text-gray-600">{weather?.current.condition}</span>
          </div>
        </div>

        {/* Weather Metrics */}
        <div className="grid grid-cols-3 gap-2 py-4 text-center">
          <div className="bg-white p-2.5 rounded-xl border border-sky-100">
            <Droplets className="w-4 h-4 text-sky-600 mx-auto mb-1" />
            <span className="text-[10px] text-gray-500 block font-semibold">{t.weatherPage.humidity}</span>
            <span className="text-xs font-extrabold text-agri-green-900">{weather?.current.humidity}%</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-sky-100">
            <Wind className="w-4 h-4 text-sky-600 mx-auto mb-1" />
            <span className="text-[10px] text-gray-500 block font-semibold">{t.weatherPage.wind}</span>
            <span className="text-xs font-extrabold text-agri-green-900">{weather?.current.windSpeed} km/h</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-sky-100">
            <CloudSun className="w-4 h-4 text-sky-600 mx-auto mb-1" />
            <span className="text-[10px] text-gray-500 block font-semibold">{t.weatherPage.rainProb}</span>
            <span className="text-xs font-extrabold text-agri-green-900">{weather?.current.precipitation}%</span>
          </div>
        </div>

        <Link href="/weather" className="inline-flex items-center text-xs font-black text-sky-700 hover:text-sky-900 pt-1">
          <span>{t.dashboard.forecast7Days} & Full Hourly Details</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </Card>

      {/* Grid of Advisories: Crop Status, Soil Health, Fertilizer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Active Crop Overview */}
        <Card className="space-y-4 border-emerald-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sprout className="w-5 h-5 text-agri-green-700" />
              <h3 className="text-base font-extrabold text-agri-green-900">{t.dashboard.cropStatus}</h3>
            </div>
            <Badge variant="green">{activeCrop?.crop_stage || 'Vegetative'}</Badge>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl space-y-1">
            <span className="text-xs text-gray-500 block font-semibold">{t.common.currentCrop}</span>
            <span className="text-lg font-black text-agri-green-900">{activeCrop?.crop_name || 'Wheat'}</span>
            <p className="text-[11px] text-gray-600">Sown date: {activeCrop?.sowing_date || 'Nov 15'}</p>
          </div>

          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span className="font-semibold">{t.common.landSize}:</span>
              <span className="font-extrabold text-agri-green-900">{farm?.land_size || 2.5} {t.common.acres}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">{t.common.irrigation}:</span>
              <span className="font-extrabold text-agri-green-900">{farm?.irrigation_type || 'Borewell'}</span>
            </div>
          </div>

          <Link href="/crop-advisor" className="block pt-2">
            <Button variant="outline" size="sm" fullWidth>
              {t.nav.cropAdvisor}
            </Button>
          </Link>
        </Card>

        {/* Fertilizer Quick Action */}
        <Card className="space-y-4 border-amber-200 bg-amber-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-agri-yellow-700" />
              <h3 className="text-base font-extrabold text-agri-green-900">{t.dashboard.fertilizerQuick}</h3>
            </div>
            <Badge variant="amber">{activeCrop?.crop_stage}</Badge>
          </div>

          <div className="p-3 bg-white rounded-xl border border-amber-200">
            <p className="text-xs text-gray-800 font-bold leading-relaxed">
              {fertilizerAdvice.generalAdvice[language]}
            </p>
          </div>

          <div className="text-[11px] text-amber-900 font-semibold bg-amber-100/60 p-2 rounded-lg italic">
            {t.common.fertilizerDisclaimer}
          </div>

          <Link href="/fertilizer-guide" className="block pt-1">
            <Button variant="amber" size="sm" fullWidth className="text-black font-extrabold">
              {t.nav.fertilizerGuide}
            </Button>
          </Link>
        </Card>

        {/* Soil Health Summary */}
        <Card className="space-y-4 border-emerald-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FlaskConical className="w-5 h-5 text-agri-brown-700" />
              <h3 className="text-base font-extrabold text-agri-green-900">{t.dashboard.soilHealthSummary}</h3>
            </div>
            <Badge variant="brown">{farm?.soil_type || 'Loam'}</Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 bg-emerald-50 rounded-lg flex justify-between items-center font-bold">
              <span>pH Status:</span>
              <span className="text-agri-green-900">{soilAdvice.phStatus[language]}</span>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg flex justify-between items-center font-bold">
              <span>Nitrogen (N):</span>
              <span className="text-amber-700">{soilAdvice.nutrientStatus.nitrogen.level}</span>
            </div>
          </div>

          <Link href="/soil-health" className="block pt-2">
            <Button variant="outline" size="sm" fullWidth>
              {t.nav.soilHealth}
            </Button>
          </Link>
        </Card>

      </div>

      {/* Quick Actions Grid */}
      <section className="space-y-3 pt-4">
        <h3 className="text-lg font-black text-agri-green-900">{t.common.quickActions}</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { href: '/weather', label: t.nav.weather, icon: CloudSun, color: 'bg-sky-500' },
            { href: '/crop-advisor', label: t.nav.cropAdvisor, icon: Leaf, color: 'bg-agri-green-700' },
            { href: '/soil-health', label: t.nav.soilHealth, icon: FlaskConical, color: 'bg-agri-brown-700' },
            { href: '/ai-assistant', label: t.nav.aiAssistant, icon: Bot, color: 'bg-agri-yellow-600' },
            { href: '/farm-plan', label: language === 'hi' ? 'आज की योजना' : 'Today’s plan', icon: Sparkles, color: 'bg-indigo-600' },
            { href: '/crop-doctor', label: language === 'hi' ? 'फसल जांच' : 'Crop check', icon: Leaf, color: 'bg-rose-600' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link key={idx} href={item.href}>
                <Card className="hover:scale-105 transition flex flex-col items-center justify-center text-center p-4 space-y-2 border-emerald-200">
                  <div className={`w-10 h-10 rounded-2xl ${item.color} text-white flex items-center justify-center font-bold shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold text-agri-green-900">{item.label}</span>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}
