'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { fetchWeatherForFarm } from '@/lib/weather-client';
import { WeatherForecast } from '@/types';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CloudSun, Droplets, Wind, Thermometer, Calendar, ShieldAlert } from 'lucide-react';

export default function WeatherPage() {
  const { t, language } = useLanguage();
  const { farm, user } = useAuth();
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const location = [user?.village, user?.district, user?.state].filter(Boolean).join(', ');
        const data = await fetchWeatherForFarm(farm?.latitude || 29.34, farm?.longitude || 79.56, location);
        setWeather(data);
      } catch (err) {
        console.error("Weather page error", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [farm, user]);

  if (loading) {
    return <LoadingSpinner label={t.common.loading} />;
  }

  return (
    <div className="space-y-6 py-2">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-agri-green-900">
          {t.weatherPage.title}
        </h1>
        <p className="text-xs font-semibold text-gray-600">
          {weather?.location} • Open-Meteo High Resolution Forecast
        </p>
      </div>

      {/* Primary Farming Advisory Alert */}
      <Alert type="warning" title={t.weatherPage.farmingActionTitle}>
        <p className="text-sm font-extrabold text-amber-950">
          {weather?.farmingAdvice[language]}
        </p>
      </Alert>

      {/* Current Conditions Card */}
      <Card className="bg-gradient-to-r from-sky-600 to-agri-green-800 text-white p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-white">
              <CloudSun className="w-10 h-10" />
            </div>
            <div>
              <span className="text-4xl font-black">{weather?.current.temp}°C</span>
              <p className="text-sm font-bold text-sky-100">{weather?.current.condition}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur p-3 rounded-2xl border border-white/20 text-center w-full sm:w-auto">
            <div>
              <Droplets className="w-4 h-4 text-sky-200 mx-auto" />
              <span className="text-[10px] text-sky-100 block">{t.weatherPage.humidity}</span>
              <span className="text-xs font-black">{weather?.current.humidity}%</span>
            </div>
            <div>
              <Wind className="w-4 h-4 text-sky-200 mx-auto" />
              <span className="text-[10px] text-sky-100 block">{t.weatherPage.wind}</span>
              <span className="text-xs font-black">{weather?.current.windSpeed} km/h</span>
            </div>
            <div>
              <CloudSun className="w-4 h-4 text-sky-200 mx-auto" />
              <span className="text-[10px] text-sky-100 block">{t.weatherPage.rainProb}</span>
              <span className="text-xs font-black">{weather?.current.precipitation}%</span>
            </div>
          </div>

        </div>
      </Card>

      {/* Field conditions from the live hourly forecast */}
      {weather?.hourly[0] && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-3 border-sky-100">
            <p className="text-[10px] font-bold uppercase text-gray-500">Rainfall</p>
            <p className="text-lg font-black text-sky-700">{weather.hourly[0].precipitation} mm</p>
            <p className="text-[10px] text-gray-500">next forecast hour</p>
          </Card>
          <Card className="p-3 border-emerald-100">
            <p className="text-[10px] font-bold uppercase text-gray-500">Soil moisture</p>
            <p className="text-lg font-black text-agri-green-800">{Math.round(weather.hourly[0].soilMoisture * 100)}%</p>
            <p className="text-[10px] text-gray-500">top 0-9 cm average</p>
          </Card>
          <Card className="p-3 border-amber-100">
            <p className="text-[10px] font-bold uppercase text-gray-500">Soil temperature</p>
            <p className="text-lg font-black text-amber-700">{weather.hourly[0].soilTemperature}°C</p>
            <p className="text-[10px] text-gray-500">surface soil</p>
          </Card>
          <Card className="p-3 border-orange-100">
            <p className="text-[10px] font-bold uppercase text-gray-500">Evapotranspiration</p>
            <p className="text-lg font-black text-orange-700">{weather.hourly[0].evapotranspiration} mm</p>
            <p className="text-[10px] text-gray-500">next forecast hour</p>
          </Card>
        </div>
      )}

      {/* Hourly Forecast */}
      <section className="space-y-3">
        <h3 className="text-base font-extrabold text-agri-green-900 flex items-center space-x-2">
          <Thermometer className="w-5 h-5 text-agri-green-700" />
          <span>{t.weatherPage.hourlyTitle}</span>
        </h3>

        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin">
          {weather?.hourly.map((h, i) => (
            <Card key={i} className="flex-shrink-0 w-24 text-center p-3 border-sky-100 space-y-1">
              <span className="text-xs font-bold text-gray-500 block">{h.time}</span>
              <CloudSun className="w-5 h-5 text-sky-500 mx-auto" />
              <span className="text-sm font-black text-agri-green-900 block">{h.temp}°C</span>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded-full inline-block">
                {h.precipitationProb}% rain
              </span>
            </Card>
          ))}
        </div>
      </section>

      {/* 7-Day Daily Forecast Table */}
      <section className="space-y-3">
        <h3 className="text-base font-extrabold text-agri-green-900 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-agri-green-700" />
          <span>{t.dashboard.forecast7Days}</span>
        </h3>

        <div className="space-y-2">
          {weather?.daily.map((d, idx) => (
            <Card key={idx} className="flex items-center justify-between p-3 border-emerald-100">
              <div className="w-24">
                <span className="text-sm font-black text-agri-green-900 block">{d.dayName}</span>
                <span className="text-[10px] text-gray-400 font-semibold">{d.date}</span>
              </div>

              <div className="flex items-center space-x-2">
                <CloudSun className="w-5 h-5 text-sky-600" />
                <span className="text-xs font-bold text-gray-700 hidden sm:inline">{d.condition}</span>
              </div>

              <div className="text-right">
                <span className="text-xs font-extrabold text-agri-green-900">
                  {d.tempMax}°C <span className="text-gray-400 font-medium">/ {d.tempMin}°C</span>
                </span>
                <p className="text-[10px] font-bold text-sky-700">Rain: {d.precipitationProb}%</p>
                <p className="text-[10px] text-gray-500">{d.precipitation} mm · {d.windSpeed} km/h</p>
              </div>
              <div className="hidden md:block text-right text-[10px] text-gray-500">
                <p>Sunrise {d.sunrise ? new Date(d.sunrise).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '--'}</p>
                <p>Sunset {d.sunset ? new Date(d.sunset).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '--'}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}
